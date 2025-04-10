
import { create } from 'zustand';
import { Poster, PosterCategory } from '@/types';

// Demo data with car-related posters
const demoPosters: Poster[] = [
  {
    id: '1',
    title: 'Ferrari F40',
    image: '/posters/abstract-waves.jpg',
    category: 'Cars',
    priceA3: 599,
    priceA4: 399,
  },
  {
    id: '2',
    title: 'Lamborghini Aventador',
    image: '/posters/think-different.jpg',
    category: 'Cars',
    priceA3: 549,
    priceA4: 349,
  },
  {
    id: '3',
    title: 'Porsche 911',
    image: '/posters/mountain.jpg',
    category: 'Cars',
    priceA3: 649,
    priceA4: 449,
  },
  {
    id: '4',
    title: 'Bugatti Chiron',
    image: '/posters/geometric.jpg',
    category: 'Cars',
    priceA3: 499,
    priceA4: 299,
  },
  {
    id: '5',
    title: 'McLaren P1',
    image: '/posters/never-give-up.jpg',
    category: 'Cars',
    priceA3: 549,
    priceA4: 349,
  },
  {
    id: '6',
    title: 'Aston Martin DB5',
    image: '/posters/ocean.jpg',
    category: 'Cars',
    priceA3: 649,
    priceA4: 449,
  },
  {
    id: '7',
    title: 'Tesla Roadster',
    image: '/posters/geometric.jpg',
    category: 'Cars',
    priceA3: 699,
    priceA4: 499,
  },
];

// Pre-memoize the categories to avoid recalculation
const initialCategories: PosterCategory[] = ['Cars'];

// Pre-memoize the featured posters to avoid recalculation on each render
const featuredPosters = demoPosters.slice(0, 4);

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
  
  // Return the pre-memoized featured posters to avoid recalculations
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
