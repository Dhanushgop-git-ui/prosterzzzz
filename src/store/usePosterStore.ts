
import { create } from 'zustand';
import { Poster, PosterCategory } from '@/types';

// Demo data
const demoPosters: Poster[] = [
  {
    id: '1',
    title: 'Abstract Waves',
    image: '/posters/abstract-waves.jpg',
    category: 'Abstract',
    priceA3: 599,
    priceA4: 399,
  },
  {
    id: '2',
    title: 'Think Different',
    image: '/posters/think-different.jpg',
    category: 'Motivational',
    priceA3: 549,
    priceA4: 349,
  },
  {
    id: '3',
    title: 'Mountain Serenity',
    image: '/posters/mountain.jpg',
    category: 'Nature',
    priceA3: 649,
    priceA4: 449,
  },
  {
    id: '4',
    title: 'Geometric Shapes',
    image: '/posters/geometric.jpg',
    category: 'Minimalist',
    priceA3: 499,
    priceA4: 299,
  },
  {
    id: '5',
    title: 'Never Give Up',
    image: '/posters/never-give-up.jpg',
    category: 'Motivational',
    priceA3: 549,
    priceA4: 349,
  },
  {
    id: '6',
    title: 'Ocean Sunrise',
    image: '/posters/ocean.jpg',
    category: 'Nature',
    priceA3: 649,
    priceA4: 449,
  },
];

interface PosterStore {
  posters: Poster[];
  categories: PosterCategory[];
  addPoster: (poster: Omit<Poster, 'id'>) => void;
  updatePoster: (id: string, posterData: Partial<Poster>) => void;
  deletePoster: (id: string) => void;
  getPostersByCategory: (category: string) => Poster[];
  getFeaturedPosters: () => Poster[];
}

export const usePosterStore = create<PosterStore>()((set, get) => ({
  posters: demoPosters,
  categories: ['Abstract', 'Motivational', 'Nature', 'Minimalist', 'Educational', 'Art', 'Typography'],
  
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
  
  getFeaturedPosters: () => {
    const { posters } = get();
    // In a real app, you might have a "featured" flag on posters
    // For now, just return the first 4 posters
    return posters.slice(0, 4);
  },
}));
