
import { supabase } from '@/integrations/supabase/client';

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
    
    console.log('Uploading file to Supabase:', fileName);
    
    // Upload to Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from('posters')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true // Allow overwrites if needed
      });
      
    if (uploadError) {
      // Special case: If the bucket doesn't exist but we try to upload anyway
      if (uploadError.message.includes('Bucket not found')) {
        throw new Error('Storage bucket not found. Please contact your administrator to set up the Supabase storage bucket.');
      }
      
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

// Modified to not throw errors in case of RLS policy issues
export const ensureStorageBucketExists = async (): Promise<boolean> => {
  try {
    console.log('Checking if posters bucket exists...');
    
    // Try to get bucket information first
    const { data: getBucketData, error: getBucketError } = await supabase.storage.getBucket('posters');
    
    // If bucket exists, we're good to go
    if (!getBucketError && getBucketData) {
      console.log('Bucket exists:', getBucketData);
      
      // Update bucket to ensure it's public
      try {
        await supabase.storage.updateBucket('posters', {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
        console.log('Bucket settings updated successfully');
      } catch (updateErr) {
        console.warn('Could not update bucket settings, but proceeding:', updateErr);
      }
      
      return true;
    }
    
    // Try to create the bucket
    try {
      const { data: createData, error: createError } = await supabase.storage.createBucket('posters', {
        public: true,
        fileSizeLimit: 10485760 // 10MB
      });
      
      if (createError) {
        // If it's an RLS policy error, we log it but don't throw
        if (createError.message.includes('violates row-level security policy')) {
          console.warn('Could not create bucket due to RLS policy. User may not have permission:', createError);
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
      
      console.log('Created posters bucket successfully');
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
