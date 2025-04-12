
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { PosterCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddCategory: (category: PosterCategory) => void;
  disabled?: boolean;
}

const CategorySelector = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  onAddCategory,
  disabled = false
}: CategorySelectorProps) => {
  const { toast } = useToast();
  const [newCategory, setNewCategory] = useState<string>('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

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
    onAddCategory(newCategory as PosterCategory);
    onCategoryChange(newCategory);
    setNewCategory('');
    setShowNewCategoryInput(false);
    
    toast({
      title: 'Category Added',
      description: `${newCategory} has been added to the categories.`,
    });
  };

  return (
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
              disabled={disabled}
            />
            <Button 
              type="button" 
              onClick={handleAddNewCategory} 
              className="bg-prosterz-800"
              disabled={disabled}
            >
              Add
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowNewCategoryInput(false)}
              disabled={disabled}
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
              disabled={disabled}
            >
              <Plus size={16} className="mr-1" />
              New Category
            </Button>
          </div>
          <Select value={selectedCategory} onValueChange={onCategoryChange} required disabled={disabled}>
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
  );
};

export default CategorySelector;
