
import { supabase } from '@/integrations/supabase/client';

export const uploadPosterImage = async (imageUrl: string): Promise<string> => {
  try {
    // Fetch the image file from the lovable uploads
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Create a file object with the blob
    const fileName = imageUrl.split('/').pop() || 'poster.png';
    const file = new File([blob], fileName, { type: blob.type });
    
    // Generate a unique file name for Supabase storage
    const fileExt = fileName.split('.').pop();
    const supabaseFileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    // Upload to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('posters')
      .upload(supabaseFileName, file, {
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
      .getPublicUrl(supabaseFileName);
      
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

