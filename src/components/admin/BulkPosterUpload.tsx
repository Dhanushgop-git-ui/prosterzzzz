
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePosterStore } from '@/store/usePosterStore';
import { useToast } from '@/hooks/use-toast';
import { Loader, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PosterData {
  title: string;
  category: string;
  image: string;
  priceA3: number;
  priceA4: number;
}

const BulkPosterUpload = () => {
  const { toast } = useToast();
  const { addPoster } = usePosterStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedPosters, setCompletedPosters] = useState<string[]>([]);

  // Car poster data with the image paths
  const carPosters: PosterData[] = [
    {
      title: "Green Lamborghini Aventador",
      category: "Cars",
      image: "public/lovable-uploads/e255e9e0-1ffe-481c-958d-1fdbcd4204f4.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "BMW M Power",
      category: "Cars",
      image: "public/lovable-uploads/48f2065f-a318-4bf0-870b-e0c3e05a20d0.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "Mazda RX-7",
      category: "Cars",
      image: "public/lovable-uploads/2f32933b-1559-4906-8f16-2303c158b258.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "Lamborghini Revuelto LMBO",
      category: "Cars",
      image: "public/lovable-uploads/ae5605b0-c842-4bbb-9715-9f1ba4a46af3.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "Ferrari LaFerrari",
      category: "Cars",
      image: "public/lovable-uploads/c5660736-ba48-4adb-a92e-ffca24e3ef76.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "Toyota GR Supra",
      category: "Cars",
      image: "public/lovable-uploads/4d6303c8-09fe-41bc-8096-7015a2c41f75.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "Porsche 918 Spyder",
      category: "Cars",
      image: "public/lovable-uploads/9ca83f20-1f47-4aa8-aaf1-b22f2eb8ddb0.png",
      priceA3: 109,
      priceA4: 99
    },
    {
      title: "BMW M3 Sports Evolution",
      category: "Cars",
      image: "public/lovable-uploads/9c04d93d-5c56-4e53-8ec4-8059c19a5ba2.png",
      priceA3: 109,
      priceA4: 99
    }
  ];

  const uploadPosterImage = async (imageUrl: string): Promise<string> => {
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

  const handleBulkUpload = async () => {
    setIsLoading(true);
    setProgress(0);
    setCompletedPosters([]);
    
    try {
      // Create posters bucket if it doesn't exist
      try {
        const { data, error } = await supabase.storage.getBucket('posters');
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
      
      {completedPosters.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded posters:</h3>
          <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
            {completedPosters.map((title, index) => (
              <li key={index} className="flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                {title}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-prosterz-100 rounded-full h-2.5">
          <div 
            className="bg-prosterz-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
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
