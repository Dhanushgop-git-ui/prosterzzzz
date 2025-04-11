
import React from 'react';
import { Poster } from '@/types';
import PosterCard from './PosterCard';
import { ImageOff } from 'lucide-react';

interface PosterGridProps {
  posters: Poster[];
  title?: string;
}

const PosterGrid = ({ posters, title }: PosterGridProps) => {
  return (
    <div>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      
      {posters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posters.map((poster) => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-prosterz-500 bg-prosterz-50 rounded-lg">
          <ImageOff className="mx-auto h-12 w-12 text-prosterz-400 mb-4" />
          <h3 className="text-lg font-medium text-prosterz-900 mb-2">No posters found</h3>
          <p>Try a different category or check back later for new additions.</p>
        </div>
      )}
    </div>
  );
};

export default PosterGrid;
