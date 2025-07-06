import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ChevronRight, Palette, Heart, Star, Leaf, Cloud, Sun } from 'lucide-react';

const AboutSection = ({ data }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [isHovering, setIsHovering] = useState(false);

  // Default values if data is not available
  const aboutData = data || {
    title: "Meet the Artist",
    description: "Hello, I'm Subekshya, a passionate artist dedicated to bringing emotions and stories to life through my artwork. With a keen eye for detail and a love for vibrant colors, I create pieces that speak to the soul.",
    image: "/images/artist-portrait.jpg",
    skills: ["Passion", "Creativity", "Nature", "Emotion"],
    experience: "5+ years"
  };

  // Use new field names with fallback to legacy fields
  const displayData = {
    title: (aboutData && aboutData.title) || "Meet the Artist",
    content: (aboutData && (aboutData.description || aboutData.content)) || "Hello, I'm Subekshya, a passionate artist dedicated to bringing emotions and stories to life through my artwork. With a keen eye for detail and a love for vibrant colors, I create pieces that speak to the soul.",
    image: (aboutData && aboutData.image) || "/images/artist-portrait.jpg",
    artistName: (aboutData && aboutData.artistName) || "Subekshya",
    artistBio: (aboutData && aboutData.artistBio) || "", // Remove hardcoded fallback text
    specialties: (aboutData && (aboutData.skills || aboutData.specialties)) || ["Passion", "Creativity", "Nature", "Emotion"],
    experience: (aboutData && aboutData.experience) || "5+ years"
  };

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
        staggerChildren: 0.2,
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

  const floatingElements = [
    { Icon: Leaf, color: 'text-green-300', size: 24 },
    { Icon: Cloud, color: 'text-amber-200', size: 32 },
    { Icon: Sun, color: 'text-yellow-300', size: 40 },
  ];

  const traitIcons = [Heart, Star, Leaf, Palette];

  return (
    <section id="about" className="py-24 sm:py-32 md:py-40 bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 text-amber-100 overflow-hidden relative">
      {/* Enhanced abstract shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 C25,50 75,50 100,0 L100,100 L0,100 Z" fill="rgba(217, 119, 6, 0.1)" />
          <path d="M0,100 C25,50 75,50 100,100 L100,0 L0,0 Z" fill="rgba(21, 128, 61, 0.1)" />
        </svg>
      </div>

      {/* Animated floating elements */}
      {floatingElements.map((Element, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ top: -20, left: `${Math.random() * 100}%` }}
          animate={{
            top: ['0%', '100%'],
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 20 + 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Element.Icon className={`${Element.color} opacity-30`} size={Element.size} />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-16 sm:mb-20 md:mb-24 text-center"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-green-200 to-teal-200">
            {displayData.title}
          </span>
        </motion.h2>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-col lg:flex-row items-center lg:items-start space-y-12 lg:space-y-0 lg:space-x-16"
        >
          <motion.div variants={itemVariants} className="lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-square group">
              <motion.img
                src={displayData.image}
                alt={displayData.artistName}
                className="rounded-3xl shadow-2xl w-full h-full object-cover transition-all duration-500 ease-out"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 40px rgba(217, 119, 6, 0.5)",
                }}
              />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-400 to-green-600 text-amber-100 rounded-full p-4 shadow-lg"
              >
                <Palette className="w-8 h-8" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-amber-950 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-3xl flex items-end justify-center pb-8"
              >
                <span className="text-amber-100 text-xl font-bold">{displayData.artistName}</span>
              </motion.div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl leading-relaxed text-amber-100"
            >
              {displayData.content}
            </motion.p>
            {displayData.artistBio && (
              <motion.p
                variants={itemVariants}
                className="text-xl sm:text-2xl leading-relaxed text-amber-100"
              >
                {displayData.artistBio}
              </motion.p>
            )}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mt-8"
            >
              {displayData.specialties.map((trait, index) => {
                const IconComponent = traitIcons[index % traitIcons.length];
                return (
                <motion.div
                  key={trait}
                  whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(217, 119, 6, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-amber-900 bg-opacity-50 rounded-full px-6 py-3 shadow-md"
                >
                    <IconComponent className="w-6 h-6 text-amber-300" />
                  <span className="text-lg font-semibold text-amber-100">{trait}</span>
                </motion.div>
                );
              })}
            </motion.div>
            <motion.div>
              <motion.a
                href="#portfolio"
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovering(true)}
                onHoverEnd={() => setIsHovering(false)}
                className="inline-flex items-center justify-center mt-8 bg-gradient-to-r from-amber-900 via-green-900 to-teal-900 text-amber-100 px-8 py-4 rounded-full text-xl font-black shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 mr-2">Explore My Work</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-teal-900 via-green-900 to-amber-900"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovering ? '0%' : '-100%' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="relative z-10 ml-2"
                  animate={{ x: isHovering ? 5 : 0, opacity: isHovering ? 1 : 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.div>
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
