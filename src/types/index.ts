
export interface Poster {
  id: string;
  title: string;
  image: string;
  category: string;
  priceA3: number;
  priceA4: number;
}

export interface CartItem {
  poster: Poster;
  size: 'A3' | 'A4';
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export type PosterCategory = string;
