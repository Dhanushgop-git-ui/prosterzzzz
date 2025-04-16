
import { supabase } from '@/integrations/supabase/client';

// Constants
const BUCKET_NAME = 'proterz';

// Helper function to ensure the storage bucket exists
const ensureBucketExists = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    // Check if our bucket exists in the list
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (bucketExists) {
      console.log(`Bucket ${BUCKET_NAME} exists`);
      return true;
    }
    
    // Create bucket if it doesn't exist
    console.log(`Creating ${BUCKET_NAME} bucket...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true, // Make bucket public so images are viewable
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      console.error(`Error creating ${BUCKET_NAME} bucket:`, createError);
      return false;
    }
    
    console.log(`Successfully created ${BUCKET_NAME} bucket`);
    return true;
  } catch (error) {
    console.error('Error in ensureBucketExists:', error);
    return false;
  }
};

export const uploadPosterImage = async (imageUrl: string): Promise<string> => {
  try {
    // Ensure bucket exists before upload
    const bucketExists = await ensureBucketExists();
    if (!bucketExists) {
      console.warn(`Upload will proceed but ${BUCKET_NAME} bucket might not be properly configured`);
    }
    
    // Fetch the image file from the lovable uploads
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a file object with the blob
    const fileName = imageUrl.split('/').pop() || 'poster.png';
    const file = new File([blob], fileName, { type: blob.type });
    
    // Generate a unique file name for Supabase storage
    const fileExt = fileName.split('.').pop();
    const supabaseFileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    console.log(`Uploading ${fileName} to Supabase as ${supabaseFileName}...`);
    
    // Upload to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(supabaseFileName, file, {
        cacheControl: '3600',
        upsert: true // Changed to true to allow overwrites if needed
      });
      
    if (uploadError) {
      console.error('Error uploading to Supabase:', uploadError);
      throw new Error(uploadError.message);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(supabaseFileName);
      
    console.log('Upload successful, public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
