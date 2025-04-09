
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { usePosterStore } from '@/store/usePosterStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader, Upload } from 'lucide-react';

interface PosterFormProps {
  onComplete?: () => void;
}

const PosterForm = ({ onComplete }: PosterFormProps) => {
  const { toast } = useToast();
  const { addPoster, categories } = usePosterStore();
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('');
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
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    // In a real application, we would upload the image to a server here
    // For demo purposes, we'll just use the preview URL
    setTimeout(() => {
      addPoster({
        title,
        image: preview,
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
      setIsLoading(false);
      
      if (onComplete) {
        onComplete();
      }
    }, 1000);
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
        <Label htmlFor="category">Category</Label>
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
