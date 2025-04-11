
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePosterStore } from '@/store/usePosterStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader, Upload, Plus } from 'lucide-react';
import { PosterCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface PosterFormProps {
  onComplete?: () => void;
}

const PosterForm = ({ onComplete }: PosterFormProps) => {
  const { toast } = useToast();
  const { addPoster, categories, addCategory } = usePosterStore();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [priceA3, setPriceA3] = useState<number>(599);
  const [priceA4, setPriceA4] = useState<number>(399);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    },
  });

  const handleAddNewCategory = () => {
    if (!newCategory || newCategory.trim() === '') {
      toast({
        title: 'Invalid Category',
        description: 'Please enter a valid category name.',
        variant: 'destructive',
      });
      return;
    }

    // Validate that this is a new category
    if (categories.includes(newCategory as PosterCategory)) {
      toast({
        title: 'Category Already Exists',
        description: `${newCategory} is already in the list of categories.`,
        variant: 'destructive',
      });
      return;
    }

    // Add the new category
    addCategory(newCategory as PosterCategory);
    setCategory(newCategory);
    setNewCategory('');
    setShowNewCategoryInput(false);
    
    toast({
      title: 'Category Added',
      description: `${newCategory} has been added to the categories.`,
    });
  };
  
  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    try {
      // For simplicity, we're using the existing URL for demo purposes
      // In a real app, you'd upload to Supabase Storage
      return preview;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  };
  
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
    
    try {
      // For demonstration, use the preview URL
      // In a real implementation, upload the image to Supabase Storage
      const imageUrl = preview;
      
      await addPoster({
        title,
        image: imageUrl,
        category,
        priceA3,
        priceA4,
      });
      
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
      
      <div className="space-y-2">
        {showNewCategoryInput ? (
          <div className="space-y-2">
            <Label htmlFor="newCategory">New Category</Label>
            <div className="flex space-x-2">
              <Input
                id="newCategory"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleAddNewCategory} 
                className="bg-prosterz-800"
              >
                Add
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNewCategoryInput(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="category">Category</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNewCategoryInput(true)}
                className="flex items-center text-prosterz-600 hover:text-prosterz-900"
              >
                <Plus size={16} className="mr-1" />
                New Category
              </Button>
            </div>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priceA3">A3 Price (₹)</Label>
          <Input
            id="priceA3"
            type="number"
            min={1}
            value={priceA3}
            onChange={(e) => setPriceA3(Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="priceA4">A4 Price (₹)</Label>
          <Input
            id="priceA4"
            type="number"
            min={1}
            value={priceA4}
            onChange={(e) => setPriceA4(Number(e.target.value))}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Poster Image</Label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
            preview ? 'border-prosterz-300' : 'border-prosterz-200 hover:border-prosterz-300'
          }`}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-64 object-contain"
              />
              <p className="text-sm text-prosterz-600">
                Click or drag to replace the image
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-12 w-12 text-prosterz-400" />
              <p className="text-prosterz-600">Drag and drop or click to upload</p>
              <p className="text-sm text-prosterz-400">
                (Max file size: 5MB; Supported formats: JPEG, PNG, WebP)
              </p>
            </div>
          )}
        </div>
      </div>
      
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
