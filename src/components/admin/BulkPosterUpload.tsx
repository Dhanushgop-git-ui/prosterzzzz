
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePosterStore } from '@/store/usePosterStore';
import { useToast } from '@/hooks/use-toast';
import { Loader, AlertCircle } from 'lucide-react';
import { carPosters } from '@/data/carPosters';
import { uploadPosterImage } from '@/utils/posterUploader';
import UploadProgress from './UploadProgress';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BulkPosterUpload = () => {
  const { toast } = useToast();
  const { addPoster } = usePosterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedPosters, setCompletedPosters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBulkUpload = async () => {
    setIsLoading(true);
    setProgress(0);
    setCompletedPosters([]);
    setError(null);
    
    try {
      // Process each poster one by one
      for (let i = 0; i < carPosters.length; i++) {
        const poster = carPosters[i];
        
        try {
          // Upload the image to Supabase and get permanent URL
          console.log(`Processing poster: ${poster.title}`);
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
        } catch (posterError) {
          console.error(`Error processing poster ${poster.title}:`, posterError);
          // Continue with next poster instead of failing the entire batch
        }
        
        // Update overall progress even if individual poster failed
        setProgress(Math.round(((i + 1) / carPosters.length) * 100));
      }
      
      toast({
        title: 'Success!',
        description: `Added ${completedPosters.length} car posters to your collection.`,
      });
    } catch (error) {
      console.error('Error in bulk upload:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(errorMessage);
      
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
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.includes("bucket") 
              ? "Storage bucket issue. Check if Supabase storage is properly configured."
              : error}
          </AlertDescription>
        </Alert>
      )}
      
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
      
      {completedPosters.length > 0 && (
        <p className="text-sm text-green-600">
          Successfully uploaded {completedPosters.length} of {carPosters.length} posters.
          {completedPosters.length < carPosters.length && ' Refresh the page to see your posters.'}
        </p>
      )}
    </div>
  );
};

export default BulkPosterUpload;
