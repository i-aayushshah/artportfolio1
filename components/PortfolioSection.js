import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ChevronRight, Share2, Maximize2 } from 'lucide-react';
import ArtDialog from './ArtDialog';

const PortfolioSection = ({ artworks, limit, showExploreButton = true, onArtworkSelect }) => {
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Ensure artworks is always an array to prevent map errors
  const safeArtworks = Array.isArray(artworks) ? artworks : [];

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  const generateDialogUrl = (artwork) => {
    const baseUrl = window.location.origin;
    const currentPath = window.location.pathname;
    const encodedTitle = encodeURIComponent(artwork.title);
    const encodedId = encodeURIComponent(artwork.id);
    return `${baseUrl}${currentPath}?dialog=true&title=${encodedTitle}&id=${encodedId}`;
  };

  const handleShare = (artwork) => {
    const url = generateDialogUrl(artwork);
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: artwork.description,
        url: url,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      window.prompt("Copy this link to share the artwork:", url);
    }
  };

  const displayedArtworks = limit ? safeArtworks.slice(0, limit) : safeArtworks;

  // Function to check if artwork should show "NEW" badge
  const isNewArtwork = (artwork, index) => {
    // Show "NEW" badge for the first 6 artworks (newest ones)
    const artworkIndex = safeArtworks.findIndex(art => art.id === artwork.id);
    return artworkIndex < 6;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dialogOpen = urlParams.get('dialog') === 'true';
    const artworkId = urlParams.get('id');

    if (dialogOpen && artworkId && safeArtworks.length > 0) {
      const artwork = safeArtworks.find(art => art.id.toString() === artworkId);
      if (artwork) {
        onArtworkSelect ? onArtworkSelect(artwork) : setSelectedArtwork(artwork);
      }
    }
  }, [safeArtworks, onArtworkSelect]);

  return (
    <section id="portfolio" className="py-16 sm:py-24 md:py-32 bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 text-amber-100 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-12 sm:mb-16 md:mb-20 text-center"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-green-200 to-teal-200">
            Nature's Gallery
          </span>
        </motion.h2>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 md:gap-12"
        >
          {displayedArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl lg:shadow-2xl transform group-hover:scale-105 transition-all duration-500 ease-out">
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-all duration-500 ease-out transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-amber-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-out text-amber-100">{artwork.title}</h3>
                  <p className="text-sm sm:text-base md:text-lg text-amber-200 mb-2 sm:mb-4 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75 line-clamp-2">{artwork.description}</p>
                  <div className="space-y-2 transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-out delay-75">
                    {/* Artwork Details */}
                    {artwork.medium && (
                      <p className="text-sm text-amber-300"><span className="font-medium">Medium:</span> {artwork.medium}</p>
                    )}
                    {artwork.dimensions && (
                      <p className="text-sm text-amber-300"><span className="font-medium">Size:</span> {artwork.dimensions}</p>
                    )}
                    {artwork.year && (
                      <p className="text-sm text-amber-300"><span className="font-medium">Year:</span> {artwork.year}</p>
                    )}
                    {artwork.category && (
                      <p className="text-sm text-amber-300"><span className="font-medium">Category:</span> {artwork.category}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 ease-out delay-100">
                    <div className="flex flex-col">
                      {artwork.price && (
                    <p className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-300">${artwork.price}</p>
                      )}
                      {artwork.isAvailable !== false ? (
                        <p className="text-xs text-green-400">Available for purchase</p>
                      ) : (
                        <p className="text-xs text-gray-400">Not available</p>
                      )}
                    </div>
                    <div className="flex space-x-2 sm:space-x-4">
                      <motion.button
                        onClick={() => handleShare(artwork)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-amber-900 text-amber-100 p-2 sm:p-3 rounded-full"
                      >
                        <Share2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </motion.button>
                      <motion.button
                        onClick={() => onArtworkSelect ? onArtworkSelect(artwork) : setSelectedArtwork(artwork)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-green-900 text-amber-100 p-2 sm:p-3 rounded-full"
                      >
                        <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
              {isNewArtwork(artwork, index) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-bold shadow-lg z-10 animate-pulse"
                >
                  NEW
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
        {showExploreButton && limit < safeArtworks.length && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mt-12 sm:mt-16 md:mt-20"
          >
            <Link href="/portfolio" legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-gradient-to-r from-amber-900 via-green-900 to-teal-900 text-amber-100 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-full text-lg sm:text-xl md:text-2xl font-black shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10">Explore Full Gallery</span>
                <span className="absolute inset-0 bg-gradient-to-r from-teal-900 via-green-900 to-amber-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </span>
              </motion.a>
            </Link>
          </motion.div>
        )}
      </div>
      {selectedArtwork && (
        <ArtDialog artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </section>
  );
};

export default PortfolioSection;
