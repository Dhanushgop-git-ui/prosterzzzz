
import React from 'react';
import { motion } from 'framer-motion';

const WhatsAppButton = () => {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
    >
      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="bg-green-500 text-white rounded-full p-3 shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
        aria-label="Contact us on WhatsApp"
      >
        <div className="w-12 h-12 flex items-center justify-center">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M17.415 14.382C17.117 14.233 15.656 13.515 15.384 13.415C15.112 13.316 14.914 13.267 14.715 13.565C14.517 13.861 13.948 14.531 13.775 14.729C13.601 14.928 13.428 14.952 13.131 14.803C12.834 14.654 11.876 14.341 10.741 13.329C9.858 12.541 9.261 11.568 9.088 11.27C8.915 10.973 9.069 10.812 9.218 10.664C9.352 10.532 9.516 10.315 9.664 10.142C9.813 9.969 9.862 9.844 9.961 9.646C10.06 9.449 10.011 9.275 9.936 9.127C9.862 8.979 9.268 7.515 9.02 6.92C8.779 6.341 8.534 6.419 8.352 6.41C8.17 6.402 7.972 6.4 7.773 6.4C7.575 6.4 7.254 6.474 6.982 6.772C6.711 7.07 5.944 7.788 5.944 9.251C5.944 10.713 6.969 12.126 7.117 12.325C7.266 12.523 9.259 15.525 12.239 16.812C12.949 17.118 13.502 17.301 13.933 17.437C14.645 17.664 15.293 17.632 15.805 17.556C16.376 17.47 17.563 16.836 17.811 16.142C18.059 15.448 18.059 14.853 17.984 14.729C17.91 14.605 17.712 14.531 17.415 14.382Z" 
              fill="white"
            />
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M2.13 21.859L2.88 16.436C1.85 14.815 1.29 12.944 1.29 11.01C1.29 5.50598 5.79 1.00098 11.3 1.00098C16.81 1.00098 21.31 5.50598 21.31 11.01C21.31 16.515 16.81 21.02 11.3 21.02C9.41 21.02 7.58 20.489 6 19.539L2.13 21.859ZM11.3 3.00098C6.89 3.00098 3.29 6.60098 3.29 11.01C3.29 12.842 3.83 14.55 4.81 16.01L4.29 19.13L7.51 17.96C8.89 18.82 10.03 19.02 11.3 19.02C15.71 19.02 19.31 15.42 19.31 11.01C19.31 6.60098 15.71 3.00098 11.3 3.00098Z" 
              fill="white"
            />
          </svg>
        </div>
        <span className="ml-2 mr-3 font-medium">Chat with us</span>
      </a>
    </motion.div>
  );
};

export default WhatsAppButton;
