
import React from 'react';
import { usePosterStore } from '@/store/usePosterStore';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const categories = usePosterStore((state) => state.categories);
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory('All')}
          className={`category-pill ${
            selectedCategory === 'All' ? 'bg-prosterz-900 text-white' : ''
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`category-pill ${
              selectedCategory === category ? 'bg-prosterz-900 text-white' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
