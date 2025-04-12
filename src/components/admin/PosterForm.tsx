
import React, { useState, useEffect } from 'react';
import { usePosterStore } from '@/store/usePosterStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';
import { PosterCategory } from '@/types';
import { uploadImageToSupabase, ensureStorageBucketExists } from '@/utils/imageUploader';
import PosterImageUpload from './form/PosterImageUpload';
import CategorySelector from './form/CategorySelector';
import PricingInputs from './form/PricingInputs';

interface PosterFormProps {
  onComplete?: () => void;
}

const PosterForm = ({ onComplete }: PosterFormProps) => {
  const { toast } = useToast();
  const { addPoster, categories, addCategory, error, setError } = usePosterStore();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [priceA3, setPriceA3] = useState<number>(599);
  const [priceA4, setPriceA4] = useState<number>(399);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Create posters bucket if it doesn't exist already
  useEffect(() => {
    const initStorage = async () => {
      try {
        await ensureStorageBucketExists();
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        toast({
          title: 'Storage Error',
          description: 'Failed to initialize storage. Please try again.',
          variant: 'destructive',
        });
      }
    };
    
    initStorage();
  }, [toast]);
  
  // Reset the form when error changes
  useEffect(() => {
    if (error) {
      setIsLoading(false);
      setUploadProgress(0);
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      setError(null); // Clear the error after showing toast
    }
  }, [error, toast, setError]);
  
  const validateForm = (): boolean => {
    if (!title.trim()) {
      toast({
        title: 'Missing Title',
        description: 'Please enter a title for the poster.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (!category.trim()) {
      toast({
        title: 'Missing Category',
        description: 'Please select or enter a category for the poster.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (!image) {
      toast({
        title: 'Missing Image',
        description: 'Please upload an image for the poster.',
        variant: 'destructive',
      });
      return false;
    }
    
    if (priceA3 <= 0 || priceA4 <= 0) {
      toast({
        title: 'Invalid Pricing',
        description: 'Please enter valid prices for A3 and A4 formats.',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(10);
    
    try {
      // Upload the image and get the URL
      setUploadProgress(30);
      console.log('Uploading image to Supabase...');
      const imageUrl = await uploadImageToSupabase(image);
      setUploadProgress(70);
      console.log('Image uploaded successfully, URL:', imageUrl);
      
      console.log('Adding poster to database...');
      await addPoster({
        title,
        image: imageUrl,
        category,
        priceA3,
        priceA4,
      });
      
      setUploadProgress(100);
      
      toast({
        title: 'Poster Added',
        description: 'Your poster has been added successfully.',
      });
      
      // Reset the form
      setTitle('');
      setCategory('');
      setPriceA3(599);
      setPriceA4(399);
      setImage(null);
      setPreview('');
      setUploadProgress(0);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to add poster. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Poster Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter poster title"
          required
          disabled={isLoading}
        />
      </div>
      
      <CategorySelector 
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
        onAddCategory={addCategory}
        disabled={isLoading}
      />
      
      <PricingInputs 
        priceA3={priceA3}
        priceA4={priceA4}
        onPriceA3Change={setPriceA3}
        onPriceA4Change={setPriceA4}
      />
      
      <PosterImageUpload 
        onImageChange={setImage}
        onPreviewChange={setPreview}
        preview={preview}
        disabled={isLoading}
      />
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-prosterz-100 rounded-full h-2.5">
          <div 
            className="bg-prosterz-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader size={16} className="mr-2 animate-spin" />
            Adding Poster...
          </>
        ) : (
          'Add Poster'
        )}
      </Button>
    </form>
  );
};

export default PosterForm;
