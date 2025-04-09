
import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // The phone number is 7995902773 as specified in requirements
    window.open('https://wa.me/917995902773', '_blank');
  };

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <button
        onClick={handleWhatsAppClick}
        className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center group"
        aria-label="Contact us on WhatsApp"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6" />
          <motion.span 
            className="absolute -right-1 -top-1 flex h-3 w-3"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </motion.span>
        </div>
        <span className="ml-2 max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-linear">
          Chat with us
        </span>
      </button>
    </motion.div>
  );
};

export default WhatsAppButton;
