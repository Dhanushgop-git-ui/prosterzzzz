
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PosterGrid from '@/components/posters/PosterGrid';
import CategoryFilter from '@/components/posters/CategoryFilter';
import { usePosterStore } from '@/store/usePosterStore';

const PostersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const posters = usePosterStore((state) => state.posters);
  
  const filteredPosters = selectedCategory === 'All'
    ? posters
    : posters.filter((poster) => poster.category === selectedCategory);
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Shop Posters</h1>
        
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
              title={selectedCategory === 'All' ? 'All Posters' : selectedCategory}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PostersPage;
