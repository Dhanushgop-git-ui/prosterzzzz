
import React from 'react';
import { motion } from 'framer-motion';
import { Whatsapp } from 'lucide-react';
import { generateWhatsAppLink } from '@/lib/utils';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const message = "Hi, I'm interested in your car posters. Can you provide more information?";
    window.open(generateWhatsAppLink(message), '_blank');
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.button
        onClick={handleWhatsAppClick}
        className="bg-green-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
        aria-label="Contact us on WhatsApp"
        whileTap={{ scale: 0.95 }}
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        <div className="flex items-center">
          <div className="w-12 h-12 flex items-center justify-center relative">
            <Whatsapp size={28} className="text-white" />
            <motion.span
              className="absolute -top-1 -right-1 bg-white w-3 h-3 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5 
              }}
            />
          </div>
          <span className="ml-2 mr-3 font-medium hidden md:inline">Chat with us</span>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default WhatsAppButton;
