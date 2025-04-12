
import { supabase } from '@/integrations/supabase/client';

export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('posters')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      throw new Error(uploadError.message);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('posters')
      .getPublicUrl(filePath);
      
    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const ensureStorageBucketExists = async (): Promise<void> => {
  try {
    // Check if the posters bucket exists
    const { data, error } = await supabase.storage.getBucket('posters');
    
    // If bucket doesn't exist, create it
    if (error && error.message.includes('does not exist')) {
      await supabase.storage.createBucket('posters', {
        public: true,
        fileSizeLimit: 5242880 // 5MB
      });
      console.log('Created posters bucket');
    }
  } catch (err) {
    console.error('Error checking/creating bucket:', err);
  }
};
