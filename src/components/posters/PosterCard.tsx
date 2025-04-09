
import React from 'react';
import { Link } from 'react-router-dom';
import { Poster } from '@/types';
import { formatPrice } from '@/lib/utils';

interface PosterCardProps {
  poster: Poster;
}

const PosterCard = ({ poster }: PosterCardProps) => {
  return (
    <Link to={`/poster/${poster.id}`} className="poster-card group">
      <div className="poster-image-container relative overflow-hidden">
        <div className="poster-image bg-prosterz-100 aspect-[3/4]">
          <img
            src={poster.image}
            alt={poster.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="absolute top-2 right-2">
          <span className="category-pill">{poster.category}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-prosterz-900 mb-1 truncate">{poster.title}</h3>
        <div className="flex justify-between items-center">
          <div className="text-sm text-prosterz-600">
            <span className="font-medium">From {formatPrice(Math.min(poster.priceA4, poster.priceA3))}</span>
          </div>
          <span className="text-xs bg-prosterz-50 text-prosterz-800 px-2 py-1 rounded">2 sizes</span>
        </div>
      </div>
    </Link>
  );
};

export default PosterCard;
