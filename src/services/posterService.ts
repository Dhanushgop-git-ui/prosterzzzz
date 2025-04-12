
import { Poster, PosterCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { ensureStorageBucketExists } from '@/utils/imageUploader';

export class PosterService {
  // Ensure bucket exists on initialization
  static async init() {
    await ensureStorageBucketExists();
  }
  
  // Get all posters from Supabase
  static async getAllPosters(): Promise<Poster[]> {
    try {
      console.log('Fetching posters from database...');
      
      // Ensure the storage bucket exists
      await ensureStorageBucketExists();
      
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posters:', error);
        throw error;
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
      throw error;
    }
  }
  
  // Add a poster to Supabase
  static async addPoster(poster: Omit<Poster, 'id'>): Promise<Poster> {
    try {
      console.log('Adding poster to database:', poster);
      
      // Validate required fields
      if (!poster.title) throw new Error('Poster title is required');
      if (!poster.image) throw new Error('Poster image is required');
      if (!poster.category) throw new Error('Poster category is required');
      if (!poster.priceA3 || poster.priceA3 <= 0) throw new Error('Valid A3 price is required');
      if (!poster.priceA4 || poster.priceA4 <= 0) throw new Error('Valid A4 price is required');
      
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
      // First get the poster to get the image URL
      const { data: poster } = await supabase
        .from('posters')
        .select('image')
        .eq('id', id)
        .single();
      
      // Delete the poster from the database
      const { error } = await supabase
        .from('posters')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting poster:', error);
        return false;
      }
      
      // If poster has an image, try to delete it from storage
      if (poster && poster.image) {
        try {
          // Extract the file path from the public URL
          const url = new URL(poster.image);
          const pathSegments = url.pathname.split('/');
          const fileName = pathSegments[pathSegments.length - 1];
          
          if (fileName) {
            const { error: storageError } = await supabase.storage
              .from('posters')
              .remove([fileName]);
              
            if (storageError) {
              console.error('Error deleting image from storage:', storageError);
              // We still consider the delete successful even if image deletion fails
            }
          }
        } catch (storageError) {
          console.error('Error parsing image URL or deleting from storage:', storageError);
          // Continue with deletion even if image deletion fails
        }
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

// Initialize the storage bucket when the service is loaded
PosterService.init().catch(err => {
  console.error('Failed to initialize PosterService:', err);
});
