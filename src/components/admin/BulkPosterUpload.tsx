
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
      title: "Lamborghini Aventador",
      category: "Cars",
      image: "public/lovable-uploads/3eeeb369-c5f4-45a1-9d10-37dfd7fb474c.png",
      priceA3: 699,
      priceA4: 499
    },
    {
      title: "BMW M Power",
      category: "Cars",
      image: "public/lovable-uploads/528cdf33-591a-431d-aded-faaa2453b5be.png",
      priceA3: 699,
      priceA4: 499
    },
    {
      title: "Mazda RX-7",
      category: "Cars",
      image: "public/lovable-uploads/20b7ce3b-5de4-48a7-bdda-fe0b104cdfd3.png",
      priceA3: 699,
      priceA4: 499
    },
    {
      title: "Lamborghini Revuelto",
      category: "Cars",
      image: "public/lovable-uploads/7291398c-d40b-4bd5-a7fc-d50159b56229.png",
      priceA3: 799,
      priceA4: 599
    },
    {
      title: "Ferrari LaFerrari",
      category: "Cars",
      image: "public/lovable-uploads/b89a9232-9d23-48d2-8566-ee4f0c678c87.png",
      priceA3: 799,
      priceA4: 599
    },
    {
      title: "Toyota Supra",
      category: "Cars",
      image: "public/lovable-uploads/3830b9ed-970b-419c-a52b-615aed1a6033.png",
      priceA3: 649,
      priceA4: 449
    },
    {
      title: "Porsche 918 Spyder",
      category: "Cars",
      image: "public/lovable-uploads/e2668fa9-02b7-40b4-aa94-58813d8d893f.png",
      priceA3: 799,
      priceA4: 599
    },
    {
      title: "BMW M3 Sports Evolution",
      category: "Cars",
      image: "public/lovable-uploads/649c5dc4-3ed5-4ed7-b050-68e0df3e3dc9.png",
      priceA3: 649,
      priceA4: 449
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
