
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePosterStore } from '@/store/usePosterStore';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { carPosters } from '@/data/carPosters';
import { uploadPosterImage } from '@/utils/posterUploader';
import UploadProgress from './UploadProgress';

// Constants
const BUCKET_NAME = 'proterz';

const BulkPosterUpload = () => {
  const { toast } = useToast();
  const { addPoster } = usePosterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedPosters, setCompletedPosters] = useState<string[]>([]);

  const handleBulkUpload = async () => {
    setIsLoading(true);
    setProgress(0);
    setCompletedPosters([]);
    
    try {
      // Create posters bucket if it doesn't exist
      try {
        const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
        if (error && error.message.includes('does not exist')) {
          await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
          console.log(`Created ${BUCKET_NAME} bucket`);
        }
      } catch (err) {
        console.error('Error checking/creating bucket:', err);
      }
      
      // Process each poster one by one
      for (let i = 0; i < carPosters.length; i++) {
        const poster = carPosters[i];
        
        // Upload the image to Supabase and get permanent URL
        const permanentImageUrl = await uploadPosterImage(poster.image);
        
        // Add the poster to the database
        await addPoster({
          title: poster.title,
          category: poster.category,
          image: permanentImageUrl,
          priceA3: poster.priceA3,
          priceA4: poster.priceA4
        });
        
        // Update progress
        setCompletedPosters(prev => [...prev, poster.title]);
        setProgress(Math.round(((i + 1) / carPosters.length) * 100));
      }
      
      toast({
        title: 'Success!',
        description: `Added ${carPosters.length} car posters to your collection.`,
      });
    } catch (error) {
      console.error('Error in bulk upload:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete bulk upload. See console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">Bulk Upload Car Posters</h2>
      <p className="text-sm text-prosterz-600">
        This will add {carPosters.length} car posters to your database using the images you provided.
      </p>
      
      <UploadProgress progress={progress} completedPosters={completedPosters} />
      
      <Button
        onClick={handleBulkUpload}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader size={16} className="mr-2 animate-spin" />
            Uploading Posters...
          </>
        ) : (
          'Upload All Car Posters'
        )}
      </Button>
    </div>
  );
};

export default BulkPosterUpload;
