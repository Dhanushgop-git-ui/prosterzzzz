
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
  const { addPoster, categories, addCategory } = usePosterStore();
  
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
    ensureStorageBucketExists();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image || !title || !category || !priceA3 || !priceA4) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all fields and upload an image.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(10);
    
    try {
      // Upload the image and get the URL
      setUploadProgress(30);
      const imageUrl = await uploadImageToSupabase(image);
      setUploadProgress(70);
      
      await addPoster({
        title,
        image: imageUrl, // Store the permanent URL
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
      console.error('Error adding poster:', error);
      toast({
        title: 'Error',
        description: 'Failed to add poster. Please try again.',
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
        />
      </div>
      
      <CategorySelector 
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
        onAddCategory={addCategory}
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
