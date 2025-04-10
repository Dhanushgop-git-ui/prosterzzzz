
import React, { useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import PosterGrid from '@/components/posters/PosterGrid';
import CategoryFilter from '@/components/posters/CategoryFilter';
import { usePosterStore } from '@/store/usePosterStore';

const PostersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const posters = usePosterStore((state) => state.posters);
  
  // Use useMemo to prevent unnecessary recalculations
  const filteredPosters = useMemo(() => {
    if (selectedCategory === 'All') {
      return posters;
    }
    return usePosterStore.getState().getPostersByCategory(selectedCategory);
  }, [selectedCategory, posters]);
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Shop Car Posters</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-1/4">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </aside>
          
          <div className="md:w-3/4">
            <PosterGrid 
              posters={filteredPosters} 
              title={selectedCategory === 'All' ? 'All Car Posters' : selectedCategory}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostersPage;
