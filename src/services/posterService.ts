import { Poster, PosterCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export class PosterService {
  // Get all posters from Supabase
  static async getAllPosters(): Promise<Poster[]> {
    try {
      console.log('Fetching posters from database...');
      const { data, error } = await supabase
        .from('posters')
        .select('*');
      
      if (error) {
        console.error('Error fetching posters:', error);
        return [];
      }
      
      console.log('Posters fetched:', data?.length || 0);
      
      // Map the database fields to our Poster type
      return data.map(poster => ({
        id: poster.id,
        title: poster.title,
        image: poster.image,
        category: poster.category,
        priceA3: poster.price_a3,
        priceA4: poster.price_a4
      }));
    } catch (error) {
      console.error('Error fetching posters:', error);
      return [];
    }
  }
  
  // Add a poster to Supabase
  static async addPoster(poster: Omit<Poster, 'id'>): Promise<Poster> {
    try {
      console.log('Adding poster to database:', poster);
      const { data, error } = await supabase
        .from('posters')
        .insert([{
          title: poster.title,
          image: poster.image,
          category: poster.category,
          price_a3: poster.priceA3,
          price_a4: poster.priceA4
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding poster:', error);
        throw error;
      }
      
      console.log('Poster added successfully:', data);
      
      return {
        id: data.id,
        title: data.title,
        image: data.image,
        category: data.category,
        priceA3: data.price_a3,
        priceA4: data.price_a4
      };
    } catch (error) {
      console.error('Error adding poster:', error);
      throw error;
    }
  }
  
  // Delete a poster from Supabase
  static async deletePoster(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('posters')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting poster:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting poster:', error);
      return false;
    }
  }
  
  // Update a poster in Supabase
  static async updatePoster(id: string, posterData: Partial<Poster>): Promise<Poster | null> {
    try {
      // Convert from our frontend model to the database model
      const dbPosterData: any = {};
      if (posterData.title) dbPosterData.title = posterData.title;
      if (posterData.image) dbPosterData.image = posterData.image;
      if (posterData.category) dbPosterData.category = posterData.category;
      if (posterData.priceA3) dbPosterData.price_a3 = posterData.priceA3;
      if (posterData.priceA4) dbPosterData.price_a4 = posterData.priceA4;
      
      const { data, error } = await supabase
        .from('posters')
        .update(dbPosterData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating poster:', error);
        return null;
      }
      
      return {
        id: data.id,
        title: data.title,
        image: data.image,
        category: data.category,
        priceA3: data.price_a3,
        priceA4: data.price_a4
      };
    } catch (error) {
      console.error('Error updating poster:', error);
      return null;
    }
  }
}
