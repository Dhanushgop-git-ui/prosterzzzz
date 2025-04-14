
import { supabase } from '@/integrations/supabase/client';

// Constants
const BUCKET_NAME = 'proterz';

// Try to upload image even if bucket creation fails
export const uploadImageToSupabase = async (file: File): Promise<string> => {
  try {
    // Try to ensure the bucket exists, but don't throw if it fails
    try {
      await ensureStorageBucketExists();
    } catch (err) {
      console.warn('Warning: Could not verify storage bucket, but will attempt upload anyway:', err);
    }
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    console.log(`Uploading file to Supabase ${BUCKET_NAME} bucket:`, fileName);
    
    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwrites if needed
      });
      
    if (uploadError) {
      // Special case: If the bucket doesn't exist but we try to upload anyway
      if (uploadError.message.includes('Bucket not found')) {
        throw new Error(`Storage bucket "${BUCKET_NAME}" not found. Please check Supabase to ensure the '${BUCKET_NAME}' bucket exists and is public.`);
      }
      
      console.error('Error uploading to Supabase:', uploadError);
      throw new Error(`Upload error: ${uploadError.message}`);
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
      
    console.log('Image uploaded successfully:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Modified to first check if bucket exists before trying to create it
export const ensureStorageBucketExists = async (): Promise<boolean> => {
  try {
    console.log(`Checking if ${BUCKET_NAME} bucket exists...`);
    
    // Try to get bucket information first
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    // Check if our bucket exists in the list
    const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
    
    if (bucketExists) {
      console.log(`Bucket ${BUCKET_NAME} exists`);
      
      // Attempt to update the bucket to ensure it's public
      try {
        await supabase.storage.updateBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        console.log('Bucket settings updated to public');
        return true;
      } catch (updateErr) {
        console.warn('Could not update bucket settings, but proceeding anyway:', updateErr);
        return true; // Return true since bucket exists even if we couldn't update it
      }
    }
    
    // If we get here, bucket doesn't exist, so try to create it
    console.log(`Bucket ${BUCKET_NAME} does not exist, attempting to create...`);
    
    try {
      const { data: createData, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        // If it's an RLS policy error, we log it but don't throw
        if (createError.message.includes('violates row-level security policy')) {
          console.warn(`Could not create bucket due to RLS policy. An administrator needs to create the '${BUCKET_NAME}' bucket manually:`, createError);
          return false;
        }
        
        // If "already exists", that's fine
        if (createError.message.includes('already exists')) {
          console.log('Bucket already exists');
          return true;
        }
        
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      console.log(`Created ${BUCKET_NAME} bucket successfully`);
      return true;
    } catch (err) {
      console.error('Exception during bucket creation:', err);
      return false;
    }
  } catch (err) {
    console.error('Error in ensureStorageBucketExists:', err);
    return false;
  }
};

// Helper function to check if a file exists in the bucket
export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
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
