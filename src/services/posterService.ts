import { Poster } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { ensureStorageBucketExists } from '@/utils/imageUploader';

// Constants
const BUCKET_NAME = 'proterz';

export class PosterService {
  private static bucketInitialized = false;
  private static bucketCheckInProgress = false;
  
  // Non-blocking bucket initialization that won't fail the app
  static async init() {
    if (this.bucketInitialized || this.bucketCheckInProgress) return;
    
    this.bucketCheckInProgress = true;
    try {
      // First check if the bucket exists using listBuckets
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.warn('Failed to list storage buckets:', listError);
        this.bucketCheckInProgress = false;
        return;
      }
      
      // Check if our bucket exists in the list
      const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
      
      if (bucketExists) {
        console.log(`Bucket ${BUCKET_NAME} exists`);
        this.bucketInitialized = true;
        this.bucketCheckInProgress = false;
        return;
      }
      
      // Only mark as initialized if successful
      const success = await ensureStorageBucketExists();
      this.bucketInitialized = success;
      
      if (success) {
        console.log('PosterService initialized, bucket is ready');
      } else {
        console.warn(`PosterService initialized but ${BUCKET_NAME} bucket may not be available`);
      }
    } catch (err) {
      console.error('Failed to initialize PosterService storage:', err);
      // Even if this fails, we'll let some operations continue
    } finally {
      this.bucketCheckInProgress = false;
    }
  }
  
  // Get all posters from Supabase
  static async getAllPosters(): Promise<Poster[]> {
    try {
      console.log('Fetching posters from database...');
      
      // Try to initialize storage only as a best effort
      if (!this.bucketInitialized) {
        try {
          await this.init();
        } catch (bucketErr) {
          console.warn('Note: Storage initialization failed, but proceeding with poster fetch');
        }
      }
      
      const { data, error } = await supabase
        .from('posters')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching posters:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!data || data.length === 0) {
        console.log('No posters found in database');
        return [];
      }
      
      console.log('Posters fetched:', data.length);
      
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
  
  // Add a poster to Supabase - this will still attempt upload even if bucket isn't ready
  static async addPoster(poster: Omit<Poster, 'id'>): Promise<Poster> {
    try {
      console.log('Adding poster to database:', poster);
      
      // Try to initialize, but don't block if it fails
      if (!this.bucketInitialized) {
        try {
          await this.init();
        } catch (err) {
          console.warn('Storage initialization failed during addPoster, but proceeding anyway');
        }
      }
      
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
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No data returned after adding poster');
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
      
      // If poster has an image, try to delete it from storage but don't fail if we can't
      if (poster && poster.image) {
        try {
          // Extract the file path from the public URL
          const url = new URL(poster.image);
          const pathSegments = url.pathname.split('/');
          const fileName = pathSegments[pathSegments.length - 1];
          
          if (fileName) {
            const { error: storageError } = await supabase.storage
              .from(BUCKET_NAME)
              .remove([fileName]);
              
            if (storageError) {
              console.warn('Could not delete image file, but poster was deleted:', storageError);
            }
          }
        } catch (storageError) {
          console.warn('Error parsing image URL or deleting from storage, but poster was deleted:', storageError);
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

// Initialize in background, but don't block app startup if it fails
PosterService.init().catch(err => {
  console.warn('PosterService initialization encountered an issue, will retry later:', err);
});
