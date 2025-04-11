
import React, { useState, useEffect, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import PosterGrid from '@/components/posters/PosterGrid';
import CategoryFilter from '@/components/posters/CategoryFilter';
import { usePosterStore } from '@/store/usePosterStore';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PostersPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { posters, fetchPosters, getPostersByCategory, isLoading, error } = usePosterStore();
  const { toast } = useToast();
  
  // Fetch posters on component mount
  useEffect(() => {
    // Force refresh from database on mount
    const loadPosters = async () => {
      await fetchPosters();
    };
    
    loadPosters();
  }, [fetchPosters]);
  
  // Show error toast if fetching posters fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Use useMemo to prevent unnecessary recalculations
  const filteredPosters = useMemo(() => {
    return selectedCategory === 'All' ? posters : getPostersByCategory(selectedCategory);
  }, [selectedCategory, posters, getPostersByCategory]);
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Shop Car Posters</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-prosterz-600 mr-2" />
            <span>Loading posters...</span>
          </div>
        ) : (
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
        )}
      </div>
    </Layout>
  );
};

export default PostersPage;
