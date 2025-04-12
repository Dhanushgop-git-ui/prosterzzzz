
import { supabase } from '@/integrations/supabase/client';

export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    // First, ensure the bucket exists
    await ensureStorageBucketExists();
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log('Uploading file to Supabase:', fileName);
    
    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('posters')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwrites if needed
      });
      
    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      throw new Error(`Upload error: ${uploadError.message}`);
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
    console.log('Checking if posters bucket exists...');
    
    // Try to create the bucket - if it exists, this will fail but we can catch that error
    const { data: createData, error: createError } = await supabase.storage.createBucket('posters', {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (createError) {
      // If the error is not "Bucket already exists", it's a real error
      if (!createError.message.includes('already exists')) {
        console.error('Error creating bucket:', createError);
        // Try to update the bucket anyway
      } else {
        console.log('Bucket already exists, updating settings');
      }
    } else {
      console.log('Created posters bucket successfully');
    }
    
    // Update bucket settings regardless of create outcome
    const { error: updateError } = await supabase.storage.updateBucket('posters', {
      public: true,
      fileSizeLimit: 10485760 // 10MB
    });
    
    if (updateError) {
      console.error('Error updating bucket to public:', updateError);
      throw new Error(`Failed to update bucket: ${updateError.message}`);
    }
    
    console.log('Bucket settings updated successfully');
    
  } catch (err) {
    console.error('Error in ensureStorageBucketExists:', err);
    throw err;
  }
};

// Helper function to check if a file exists in the bucket
export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from('posters')
      .list('', {
        search: filePath
      });
    
    if (error) {
      console.error('Error checking if file exists:', error);
      return false;
    }
    
    return data && data.length > 0;
  } catch (error) {
    console.error('Error in checkFileExists:', error);
    return false;
  }
};
