import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Palette, User, Image, Mail } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>
      <div className={`${scrolled ? 'bg-gray-950/90' : 'bg-gradient-to-br from-gray-950 via-amber-950 to-green-950'} backdrop-blur-md transition-all duration-300 h-full`}>
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="text-2xl font-extrabold tracking-tight">
              <span className={`${scrolled ? 'bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-green-400' : 'text-amber-100'}`}>
                Subekshya's Artistry
              </span>
            </Link>
            <div className="hidden md:flex space-x-2">
              <NavLink href="/" icon={<Palette className="w-5 h-5" />} scrolled={scrolled}>Home</NavLink>
              <NavLink href="/#about" icon={<User className="w-5 h-5" />} scrolled={scrolled}>About</NavLink>
              <NavLink href="/portfolio" icon={<Image className="w-5 h-5" />} scrolled={scrolled}>Portfolio</NavLink>
              <NavLink href="/#contact" icon={<Mail className="w-5 h-5" />} scrolled={scrolled}>Contact</NavLink>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="md:hidden text-amber-100"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute w-full overflow-hidden"
          >
            <div className="bg-gray-950/95 backdrop-blur-md shadow-lg">
              <div className="container mx-auto px-4 py-2">
                <NavLink href="/" mobile icon={<Palette className="w-5 h-5" />} onClick={toggleMenu} scrolled={scrolled}>Home</NavLink>
                <NavLink href="/#about" mobile icon={<User className="w-5 h-5" />} onClick={toggleMenu} scrolled={scrolled}>About</NavLink>
                <NavLink href="/portfolio" mobile icon={<Image className="w-5 h-5" />} onClick={toggleMenu} scrolled={scrolled}>Portfolio</NavLink>
                <NavLink href="/#contact" mobile icon={<Mail className="w-5 h-5" />} onClick={toggleMenu} scrolled={scrolled}>Contact</NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavLink = ({ href, children, icon, mobile, onClick, scrolled }) => (
  <Link href={href} legacyBehavior>
    <motion.a
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center px-4 py-2 rounded-full
        ${mobile ? 'text-lg my-2' : 'text-sm'}
        ${scrolled
          ? 'text-amber-100 hover:bg-gradient-to-r hover:from-amber-900 hover:to-green-900 hover:text-amber-100'
          : 'text-amber-100 hover:bg-amber-900/20'}
        transition-all duration-200
      `}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.a>
  </Link>
);

export default Navbar;
