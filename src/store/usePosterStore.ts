
import { create } from 'zustand';
import { Poster, PosterCategory } from '@/types';
import { PosterService } from '@/services/posterService';

interface PosterStore {
  posters: Poster[];
  categories: PosterCategory[];
  isLoading: boolean;
  error: string | null;
  fetchPosters: () => Promise<void>;
  addPoster: (poster: Omit<Poster, 'id'>) => Promise<void>;
  updatePoster: (id: string, posterData: Partial<Poster>) => Promise<void>;
  deletePoster: (id: string) => Promise<void>;
  getPostersByCategory: (category: string) => Poster[];
  getFeaturedPosters: () => Poster[];
  addCategory: (category: PosterCategory) => void;
}

// Create the store with Supabase integration
export const usePosterStore = create<PosterStore>((set, get) => ({
  posters: [],
  categories: ['Cars'],
  isLoading: false,
  error: null,
  
  fetchPosters: async () => {
    set({ isLoading: true, error: null });
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
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching posters:', error);
      set({ 
        error: 'Failed to fetch posters. Please try again.',
        isLoading: false 
      });
    }
  },
  
  addPoster: async (poster) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Adding poster:', poster);
      const newPoster = await PosterService.addPoster(poster);
      
      // Update the store with the new poster
      set(state => ({ 
        posters: [newPoster, ...state.posters],
        isLoading: false 
      }));
      
      // Add category if it's new
      if (poster.category && !get().categories.includes(poster.category as PosterCategory)) {
        get().addCategory(poster.category as PosterCategory);
      }
    } catch (error) {
      console.error('Error adding poster:', error);
      set({ 
        error: 'Failed to add poster. Please try again.',
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
      }
    } catch (error) {
      console.error('Error updating poster:', error);
      set({ 
        error: 'Failed to update poster. Please try again.',
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
      }
    } catch (error) {
      console.error('Error deleting poster:', error);
      set({ 
        error: 'Failed to delete poster. Please try again.',
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
}));
