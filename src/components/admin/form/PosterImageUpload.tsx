
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { Upload, ImageOff } from 'lucide-react';

interface PosterImageUploadProps {
  onImageChange: (file: File | null) => void;
  onPreviewChange: (preview: string) => void;
  preview: string;
}

const PosterImageUpload = ({ onImageChange, onPreviewChange, preview }: PosterImageUploadProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        onImageChange(file);
        onPreviewChange(URL.createObjectURL(file));
      }
    },
  });

  return (
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
  );
};

export default PosterImageUpload;
