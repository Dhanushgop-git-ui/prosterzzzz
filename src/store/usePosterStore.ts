
import { create } from 'zustand';
import { Poster, PosterCategory } from '@/types';
import { PosterService } from '@/services/posterService';

// Constants
const BUCKET_NAME = 'proterz';

interface PosterStore {
  posters: Poster[];
  categories: PosterCategory[];
  isLoading: boolean;
  error: string | null;
  retryCount: number;
  fetchPosters: (forceRetry?: boolean) => Promise<void>;
  addPoster: (poster: Omit<Poster, 'id'>) => Promise<void>;
  updatePoster: (id: string, posterData: Partial<Poster>) => Promise<void>;
  deletePoster: (id: string) => Promise<void>;
  getPostersByCategory: (category: string) => Poster[];
  getFeaturedPosters: () => Poster[];
  addCategory: (category: PosterCategory) => void;
  setError: (error: string | null) => void;
}

// Create the store with Supabase integration
export const usePosterStore = create<PosterStore>((set, get) => ({
  posters: [],
  categories: ['Cars'],
  isLoading: false,
  error: null,
  retryCount: 0,
  
  fetchPosters: async (forceRetry = false) => {
    const currentState = get();
    
    // Only reset error if we're doing a forced retry
    if (forceRetry) {
      set({ error: null });
    }
    
    set({ isLoading: true });
    try {
      console.log('Fetching posters from database...');
      const posters = await PosterService.getAllPosters();
      console.log('Fetched posters:', posters);
      
      // Extract unique categories from posters
      const categories = Array.from(
        new Set(posters.map(poster => poster.category))
      ) as PosterCategory[];
      
      set({ 
        posters,
        categories: categories.length > 0 ? categories : ['Cars'],
        isLoading: false,
        retryCount: 0, // Reset retry count on success
      });
    } catch (error) {
      console.error('Error fetching posters:', error);
      
      // Increment retry count
      const newRetryCount = currentState.retryCount + 1;
      
      // Set error message based on retry count and specific error details
      let errorMsg = 'Failed to fetch posters. Please try again.';
      
      // Check for specific error messages
      const errorStr = error instanceof Error ? error.message : String(error);
      
      if (errorStr.includes('Bucket not found') || errorStr.includes('violates row-level security policy')) {
        errorMsg = `Storage configuration issue detected. Please contact your administrator to set up the Supabase storage bucket '${BUCKET_NAME}'.`;
      } else if (newRetryCount > 3) {
        errorMsg = 'Multiple attempts to load posters failed. Please check your network connection or try again later.';
      }
      
      set({ 
        error: errorMsg,
        isLoading: false,
        retryCount: newRetryCount,
      });
    }
  },
  
  addPoster: async (poster) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Adding poster:', poster);
      
      // Validate that we have all required data
      if (!poster.title || !poster.category || !poster.image) {
        throw new Error('Missing required poster information');
      }
      
      const newPoster = await PosterService.addPoster(poster);
      
      // Update the store with the new poster
      set(state => ({ 
        posters: [newPoster, ...state.posters],
        isLoading: false,
        error: null,
      }));
      
      // Add category if it's new
      if (poster.category && !get().categories.includes(poster.category as PosterCategory)) {
        get().addCategory(poster.category as PosterCategory);
      }
    } catch (error) {
      console.error('Error adding poster:', error);
      
      let errorMessage = 'Failed to add poster. Please try again.';
      
      // Provide more specific error messages for common issues
      if (error instanceof Error) {
        if (error.message.includes('Bucket not found') || error.message.includes('violates row-level security policy')) {
          errorMessage = `Storage configuration issue. Please contact your administrator to set up the Supabase storage bucket '${BUCKET_NAME}'.`;
        } else {
          errorMessage = error.message;
        }
      }
      
      set({ 
        error: errorMessage,
        isLoading: false 
      });
    }
  },
  
  updatePoster: async (id, posterData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPoster = await PosterService.updatePoster(id, posterData);
      if (updatedPoster) {
        set(state => ({
          posters: state.posters.map(poster =>
            poster.id === id ? updatedPoster : poster
          ),
          isLoading: false
        }));
        
        // Add category if it's new
        if (posterData.category && !get().categories.includes(posterData.category as PosterCategory)) {
          get().addCategory(posterData.category as PosterCategory);
        }
      } else {
        throw new Error('Failed to update poster');
      }
    } catch (error) {
      console.error('Error updating poster:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update poster. Please try again.',
        isLoading: false 
      });
    }
  },
  
  deletePoster: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const success = await PosterService.deletePoster(id);
      if (success) {
        set(state => ({
          posters: state.posters.filter(poster => poster.id !== id),
          isLoading: false
        }));
      } else {
        throw new Error('Failed to delete poster');
      }
    } catch (error) {
      console.error('Error deleting poster:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to delete poster. Please try again.',
        isLoading: false 
      });
    }
  },
  
  getPostersByCategory: (category) => {
    const { posters } = get();
    if (category === 'All') return posters;
    return posters.filter((poster) => poster.category === category);
  },
  
  getFeaturedPosters: () => {
    const { posters } = get();
    return posters.slice(0, 1);
  },
  
  addCategory: (category) => {
    set(state => {
      if (state.categories.includes(category)) {
        return state; // No change if category already exists
      }
      return { categories: [...state.categories, category] };
    });
  },
  
  setError: (error) => {
    set({ error });
  }
}));
