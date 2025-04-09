
import React from 'react';
import { Link } from 'react-router-dom';
import { Poster } from '@/types';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PosterCardProps {
  poster: Poster;
}

const PosterCard = ({ poster }: PosterCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: a0.4 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        z: 20,
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
      }}
    >
      <Link to={`/poster/${poster.id}`} className="poster-card group block">
        <div className="poster-image-container relative overflow-hidden rounded-t-lg">
          <motion.div 
            className="poster-image bg-gradient-to-br from-prosterz-50 to-prosterz-100 aspect-[3/4]"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={poster.image}
              alt={poster.title}
              className="w-full h-full object-cover transition-transform duration-500"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </motion.div>
          <div className="absolute top-2 right-2">
            <span className={`category-pill ${getCategoryColor(poster.category)}`}>
              {poster.category}
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-b-lg">
          <h3 className="font-medium text-prosterz-900 mb-1 truncate">{poster.title}</h3>
          <div className="flex justify-between items-center">
            <div className="text-sm text-prosterz-600">
              <span className="font-medium">From {formatPrice(Math.min(poster.priceA4, poster.priceA3))}</span>
            </div>
            <motion.span 
              className="text-xs bg-prosterz-50 text-prosterz-800 px-2 py-1 rounded"
              whileHover={{ scale: 1.1 }}
            >
              2 sizes
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Function to return appropriate color class based on category
const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Abstract':
      return 'bg-purple-100 text-purple-800';
    case 'Motivational':
      return 'bg-blue-100 text-blue-800';
    case 'Nature':
      return 'bg-green-100 text-green-800';
    case 'Minimalist':
      return 'bg-gray-100 text-gray-800';
    case 'Educational':
      return 'bg-yellow-100 text-yellow-800';
    case 'Art':
      return 'bg-red-100 text-red-800';
    case 'Typography':
      return 'bg-indigo-100 text-indigo-800';
    case 'Digital Art':
      return 'bg-pink-100 text-pink-800';
    default:
      return 'bg-prosterz-100 text-prosterz-800';
  }
};

export default PosterCard;
