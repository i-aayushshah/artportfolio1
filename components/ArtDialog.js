import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, ShoppingCart } from 'lucide-react';
import InquiryForm from './InquiryForm';

const ArtDialog = ({ artwork, onClose }) => {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Close dialog when URL changes (for better UX)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const dialogOpen = urlParams.get('dialog') === 'true';
      if (!dialogOpen) {
        onClose();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [onClose]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBuyNow = () => {
    setShowInquiryForm(true);
  };

  const handleClose = () => {
    // Clean up URL parameters when closing dialog
    const url = new URL(window.location);
    url.searchParams.delete('dialog');
    url.searchParams.delete('title');
    url.searchParams.delete('id');
    window.history.replaceState({}, '', url);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className={`bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 overflow-hidden shadow-2xl w-full flex flex-col ${
            isFullscreen ? 'fixed inset-0' : 'max-w-4xl max-h-[90vh] rounded-3xl'
          }`}
        >
          <div className={`relative ${isFullscreen ? 'h-full' : ''}`}>
            <motion.img
              src={artwork.image}
              alt={artwork.title}
              className={`${
                isFullscreen
                  ? 'w-full h-full object-contain'
                  : 'w-full h-64 sm:h-80 md:h-96 object-cover'
              }`}
              layoutId={`artwork-image-${artwork.id}`}
            />
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-4 right-4 text-amber-100 bg-green-900 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 text-amber-100 bg-green-900 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-colors z-10"
            >
              <Maximize2 className="w-6 h-6" />
            </motion.button>
          </div>
          {(!isFullscreen || !isMobile) && (
            <div className="flex-grow overflow-y-auto">
              <div className="p-6 sm:p-8 text-amber-100">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-green-200 to-teal-200"
                >
                  {artwork.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-amber-200 mb-6"
                >
                  {artwork.description}
                </motion.p>

                {/* Artwork Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
                >
                  {artwork.medium && (
                    <div>
                      <span className="text-amber-300 font-medium">Medium:</span>
                      <p className="text-amber-200">{artwork.medium}</p>
                    </div>
                  )}
                  {artwork.dimensions && (
                    <div>
                      <span className="text-amber-300 font-medium">Dimensions:</span>
                      <p className="text-amber-200">{artwork.dimensions}</p>
                    </div>
                  )}
                  {artwork.year && (
                    <div>
                      <span className="text-amber-300 font-medium">Year:</span>
                      <p className="text-amber-200">{artwork.year}</p>
                    </div>
                  )}
                  {artwork.category && (
                    <div>
                      <span className="text-amber-300 font-medium">Category:</span>
                      <p className="text-amber-200">{artwork.category}</p>
                    </div>
                  )}
                </motion.div>

                {artwork.price && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl sm:text-3xl font-semibold mb-2 text-green-300"
                  >
                    ${artwork.price}
                  </motion.p>
                )}

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className={`text-sm mb-6 ${artwork.isAvailable !== false ? 'text-green-400' : 'text-gray-400'}`}
                >
                  {artwork.isAvailable !== false ? 'Available for purchase' : 'Not available for purchase'}
                </motion.p>
                {artwork.isAvailable !== false && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBuyNow}
                    className="bg-gradient-to-r from-amber-900 via-green-900 to-teal-900 text-amber-100 px-6 py-3 rounded-full hover:from-amber-800 hover:via-green-800 hover:to-teal-800 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Buy Now
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-900 via-green-900 to-amber-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                  </motion.button>
                </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
      <AnimatePresence>
        {showInquiryForm && (
          <InquiryForm
            artwork={artwork}
            onClose={() => setShowInquiryForm(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ArtDialog;
