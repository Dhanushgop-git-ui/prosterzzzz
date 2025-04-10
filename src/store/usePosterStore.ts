import { create } from 'zustand';
import { Poster, PosterCategory } from '@/types';

// Empty posters array (removed all demo posters)
const demoPosters: Poster[] = [];

// Keep only the Cars category
const initialCategories: PosterCategory[] = ['Cars'];

// Empty featured posters array
const featuredPosters: Poster[] = [];

interface PosterStore {
  posters: Poster[];
  categories: PosterCategory[];
  addPoster: (poster: Omit<Poster, 'id'>) => void;
  updatePoster: (id: string, posterData: Partial<Poster>) => void;
  deletePoster: (id: string) => void;
  getPostersByCategory: (category: string) => Poster[];
  getFeaturedPosters: () => Poster[];
  addCategory: (category: PosterCategory) => void;
}

export const usePosterStore = create<PosterStore>()((set, get) => ({
  posters: demoPosters,
  categories: initialCategories,
  
  addPoster: (poster) => {
    const newPoster = {
      ...poster,
      id: Date.now().toString(),
    };
    set((state) => ({ posters: [...state.posters, newPoster] }));
  },
  
  updatePoster: (id, posterData) => {
    set((state) => ({
      posters: state.posters.map((poster) =>
        poster.id === id ? { ...poster, ...posterData } : poster
      ),
    }));
  },
  
  deletePoster: (id) => {
    set((state) => ({
      posters: state.posters.filter((poster) => poster.id !== id),
    }));
  },
  
  getPostersByCategory: (category) => {
    const { posters } = get();
    if (category === 'All') return posters;
    return posters.filter((poster) => poster.category === category);
  },
  
  // Return empty featured posters array
  getFeaturedPosters: () => featuredPosters,
  
  // Add a new category to the store
  addCategory: (category) => {
    // Make sure we don't add duplicate categories
    set((state) => {
      if (state.categories.includes(category)) {
        return state; // No change if category already exists
      }
      return { categories: [...state.categories, category] };
    });
  },
}));
