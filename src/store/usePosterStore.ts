
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
  {
    id: '7',
    title: 'Digital Dreams',
    image: '/posters/geometric.jpg',
    category: 'Digital Art',
    priceA3: 699,
    priceA4: 499,
  },
];

// Pre-memoize the categories to avoid recalculation
const categories: PosterCategory[] = ['Abstract', 'Motivational', 'Nature', 'Minimalist', 'Educational', 'Art', 'Typography', 'Digital Art'];

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
}

export const usePosterStore = create<PosterStore>()((set, get) => ({
  posters: demoPosters,
  categories: categories,
  
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
}));
