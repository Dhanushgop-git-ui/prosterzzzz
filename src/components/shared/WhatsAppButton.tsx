
import React from 'react';
import { motion } from 'framer-motion';

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
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.48 2 2 6.48 2 12c0 2.15.69 4.13 1.85 5.75L2.7 21.5c-.14.24.12.5.37.36l3.43-1.37C7.94 21.44 9.91 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.74 0-3.34-.56-4.65-1.5l-.33-.2-2.38.94.94-2.31-.21-.35A7.987 7.987 0 012 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8zm4.47-5.23c-.38-.19-2.28-1.18-2.64-1.31-.35-.14-.61-.21-.87.19-.26.4-1 1.31-1.22 1.57-.22.26-.44.3-.82.1-.38-.2-1.6-.62-3.04-1.96-1.12-1.04-1.88-2.33-2.1-2.73-.22-.4-.02-.61.17-.81.17-.17.38-.44.57-.67.19-.23.25-.4.38-.66.13-.27.06-.5-.03-.7-.1-.2-.87-2.18-1.2-2.98-.32-.8-.65-.68-.87-.69a5.76 5.76 0 00-.65-.02c-.24.01-.61.09-.93.44s-1.22 1.27-1.22 3.09c0 1.82 1.24 3.58 1.41 3.83.17.25 2.39 4.05 5.79 5.67.81.35 1.44.56 1.93.72.81.26 1.55.22 2.14.13.65-.1 2.01-.87 2.3-1.7.29-.84.29-1.55.2-1.7-.09-.15-.33-.24-.71-.44z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </motion.div>
  );
};

export default WhatsAppButton;
