import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Leaf } from 'lucide-react';

const Footer = ({ footerData }) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Default values if data is not available
  const data = footerData || {
    email: "hello@subekshyasart.com",
    phone: "+1 (234) 567-8901",
    address: "123 Art Street, City, Country",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      twitter: "#"
    },
    newsletterText: "Stay updated with our latest artworks and events.",
    copyrightText: "Subekshya's Artistry. All rights reserved."
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscriptionStatus('Subscribing...');
    setShowSuccess(false);

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscriptionStatus('Subscribed successfully!');
        setShowSuccess(true);
        setEmail('');
      } else {
        setSubscriptionStatus(`Error: ${data.message}`);
      }
    } catch (error) {
      setSubscriptionStatus('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <footer className="relative bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 text-amber-100 py-16 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 2C14 2 10 6 10 12C10 18 14 22 20 22C26 22 30 18 30 12C30 6 26 2 20 2Z" fill="currentColor" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
        </svg>
      </div>

      {/* Floating Leaves */}
      <FloatingLeaves />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <motion.h3
              className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-green-400 to-teal-400 inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Subekshya's Artistry
            </motion.h3>
            <p className="text-amber-200">Bringing imagination to life through art.</p>
            <div className="flex space-x-4">
              <SocialIcon Icon={Facebook} href={data.socialLinks.facebook} />
              <SocialIcon Icon={Instagram} href={data.socialLinks.instagram} />
              <SocialIcon Icon={Twitter} href={data.socialLinks.twitter} />
            </div>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-200">Quick Links</h4>
            <ul className="space-y-2">
              <FooterLink href="/" text="Home" setHoveredLink={setHoveredLink} />
              <FooterLink href="/#about" text="About" setHoveredLink={setHoveredLink} />
              <FooterLink href="/portfolio" text="Portfolio" setHoveredLink={setHoveredLink} />
              <FooterLink href="/#contact" text="Contact" setHoveredLink={setHoveredLink} />
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-200">Contact Info</h4>
            <ul className="space-y-2">
              <ContactItem Icon={MapPin} text={data.address} />
              <ContactItem Icon={Phone} text={data.phone} />
              <ContactItem Icon={Mail} text={data.email} />
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-amber-200">Newsletter</h4>
            <p className="text-amber-300 mb-4">{data.newsletterText}</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-amber-900/50 text-amber-100 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-amber-500/50"
                required
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-amber-900 to-green-900 text-amber-100 px-4 py-2 rounded-md hover:from-amber-800 hover:to-green-800 transition duration-300"
              >
                Subscribe
              </motion.button>
            </form>
            <AnimatePresence>
              {showSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 text-sm text-amber-100 bg-green-900 px-4 py-2 rounded-md shadow-md"
                >
                  {subscriptionStatus}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="pt-4 flex justify-center items-center">
          <p className="text-amber-300 text-sm">
            © {new Date().getFullYear()} {data.copyrightText}
          </p>
        </div>
      </div>

      {/* Animated link preview */}
      <AnimatePresence>
        {hoveredLink && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-amber-900 text-amber-100 px-4 py-2 rounded-full shadow-lg"
          >
            {hoveredLink}
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
};

const SocialIcon = ({ Icon, href }) => (
  <motion.a
    href={href}
    className="text-amber-400 hover:text-amber-200 transition-colors duration-300"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon className="h-6 w-6" />
  </motion.a>
);

const FooterLink = ({ href, text, setHoveredLink }) => (
  <li>
    <Link href={href} legacyBehavior>
      <motion.span
        className="text-amber-300 hover:text-amber-100 transition-colors duration-300 inline-block"
        onHoverStart={() => setHoveredLink(text)}
        onHoverEnd={() => setHoveredLink(null)}
        whileHover={{ x: 5 }}
      >
        {text}
      </motion.span>
    </Link>
  </li>
);

const ContactItem = ({ Icon, text }) => (
  <li className="flex items-center space-x-2">
    <Icon className="h-5 w-5 text-amber-400" />
    <span className="text-amber-200">{text}</span>
  </li>
);

const FloatingLeaves = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-amber-500/30"
        animate={{
          x: [0, Math.random() * 100 - 50],
          y: [0, Math.random() * 100 - 50],
          rotate: [0, 360],
          scale: [1, Math.random() * 0.5 + 0.5],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: Math.random() * 5 + 5,
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
      >
        <Leaf className="h-4 w-4" />
      </motion.div>
    ))}
  </div>
);

export default Footer;
