
import React from 'react';
import { Poster } from '@/types';
import PosterCard from './PosterCard';
import { ImageOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface PosterGridProps {
  posters: Poster[];
  title?: string;
}

const PosterGrid = ({ posters, title }: PosterGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div>
      {title && (
        <motion.h2 
          className="text-2xl font-semibold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}
      
      {posters.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {posters.map((poster) => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="py-16 text-center text-prosterz-500 bg-prosterz-50 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <ImageOff className="mx-auto h-12 w-12 text-prosterz-400 mb-4" />
          <h3 className="text-lg font-medium text-prosterz-900 mb-2">No posters found</h3>
          <p>Try a different category or check back later for new additions.</p>
        </motion.div>
      )}
    </div>
  );
};

export default PosterGrid;
