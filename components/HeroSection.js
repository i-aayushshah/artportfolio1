import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronDown, Palette, Camera, Heart, Sparkles } from 'lucide-react';

const HeroSection = ({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  const scale = useSpring(1, springConfig);

  // Default values if data is not available
  const heroData = data || {
    title: "Subekshya's Artistry",
    subtitle: "Where imagination comes to life",
    backgroundImage: "/images/art.jpg",
    ctaText: "Explore Gallery",
    ctaLink: "/portfolio"
  };

  useEffect(() => {
    setIsLoaded(true);
    const timer = setTimeout(() => scale.set(1.1), 500);

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [scale]);

  const iconVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handleExplore = () => {
    if (heroData.ctaLink === '/portfolio') {
      window.location.href = '/portfolio';
    } else {
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('${heroData.backgroundImage}')`,
          y,
          scale,
          filter: "brightness(0.3) contrast(1.2) saturate(0.8)",
        }}
      />
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-amber-950/70 to-green-950/70"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.5], [0.9, 1]) }}
      />

      {isLoaded && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-400/50"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height
          }}
          animate={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      <motion.div
        className="relative z-10 text-center text-amber-100 max-w-4xl mx-auto px-4"
        style={{ opacity }}
      >
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-green-200 to-teal-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {heroData.title}
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl mb-8 italic text-amber-200"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {heroData.subtitle}
        </motion.p>
        <motion.div
          className="flex justify-center space-x-6 mb-10"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2, delayChildren: 0.6 }}
        >
          {[Palette, Camera, Heart, Sparkles].map((Icon, index) => (
            <motion.div
              key={index}
              variants={iconVariants}
              className="p-3 bg-gradient-to-br from-amber-900 to-green-900 rounded-full hover:from-amber-800 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-amber-100" />
            </motion.div>
          ))}
        </motion.div>
        <motion.button
          onClick={handleExplore}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(217, 119, 6, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-amber-900 via-green-900 to-teal-900 text-amber-100 px-8 sm:px-10 py-4 rounded-full text-lg sm:text-xl font-semibold transition-all duration-300 hover:from-amber-800 hover:via-green-800 hover:to-teal-800 shadow-lg hover:shadow-xl"
        >
          {heroData.ctaText}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
