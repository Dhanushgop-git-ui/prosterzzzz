
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PosterGrid from '@/components/posters/PosterGrid';
import CategoryFilter from '@/components/posters/CategoryFilter';
import { usePosterStore } from '@/store/usePosterStore';

const Index = () => {
  // Get all posters and categories using useMemo to prevent infinite updates
  const posters = usePosterStore(state => state.posters);
  const getFeaturedPosters = usePosterStore(state => state.getFeaturedPosters);
  const featuredPosters = useMemo(() => getFeaturedPosters(), [getFeaturedPosters]);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Use useMemo to prevent infinite updates
  const filteredPosters = useMemo(() => {
    if (selectedCategory === 'All') {
      return posters;
    }
    return usePosterStore.getState().getPostersByCategory(selectedCategory);
  }, [selectedCategory, posters]);
  
  return (
    <Layout>
      <div className="hero bg-prosterz-50 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Premium Car Posters for Your Space</h1>
          <p className="text-xl md:text-2xl text-prosterz-600 mb-8 max-w-3xl mx-auto">
            Discover our collection of high-quality car posters to beautify your home, office, or any space.
          </p>
          <Link
            to="/posters"
            className="inline-block bg-prosterz-900 text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-prosterz-800 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto py-16 px-4">
        <PosterGrid posters={featuredPosters} title="Featured Car Posters" />
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8">Browse All Car Posters</h2>
          
          <div className="mb-8">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          
          <PosterGrid posters={filteredPosters} />
        </div>
        
        <div className="mt-12 text-center">
          <Link
            to="/posters"
            className="inline-block border-2 border-prosterz-900 text-prosterz-900 px-6 py-3 rounded-md font-medium hover:bg-prosterz-50 transition-colors"
          >
            View All Posters
          </Link>
        </div>
      </div>
      
      <div className="bg-prosterz-100 py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-prosterz-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-prosterz-600">
                Our car posters are printed on high-quality paper for vibrant colors and durability.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-prosterz-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-prosterz-600">
                We ensure quick processing and shipping to get your car posters to you as soon as possible.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-prosterz-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-prosterz-600">
                Browse our diverse collection of car designs, from classic cars to modern supercars.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
