import { create } from 'zustand';
import { Poster, PosterCategory } from '@/types';

// Define some demo posters to populate the store
const demoPosters: Poster[] = [
  {
    id: '1',
    title: 'Classic Ferrari F40',
    image: '/lovable-uploads/fd7edbe1-67ec-4bf6-b8db-370b59439602.png',
    category: 'Cars',
    priceA3: 599,
    priceA4: 399,
  },
  {
    id: '2',
    title: 'Lamborghini Aventador',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=774&auto=format&fit=crop',
    category: 'Cars',
    priceA3: 699,
    priceA4: 499,
  },
  {
    id: '3',
    title: 'Vintage Porsche 911',
    image: 'https://images.unsplash.com/photo-1621365299478-76c394603dfb?q=80&w=1170&auto=format&fit=crop',
    category: 'Cars',
    priceA3: 649,
    priceA4: 449,
  }
];

// Set the Ferrari as a featured poster
const featuredPosters: Poster[] = [demoPosters[0]];

// Keep only the Cars category
const initialCategories: PosterCategory[] = ['Cars'];

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
  
  getFeaturedPosters: () => featuredPosters,
  
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
