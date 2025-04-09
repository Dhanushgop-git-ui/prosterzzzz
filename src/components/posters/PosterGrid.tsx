
import React from 'react';
import { Poster } from '@/types';
import PosterCard from './PosterCard';

interface PosterGridProps {
  posters: Poster[];
  title?: string;
}

const PosterGrid = ({ posters, title }: PosterGridProps) => {
  return (
    <div>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posters.map((poster) => (
          <PosterCard key={poster.id} poster={poster} />
        ))}
        {posters.length === 0 && (
          <div className="col-span-full py-12 text-center text-prosterz-500">
            <p>No posters found. Try a different category or check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterGrid;
