import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { motion, useAnimation, useInView } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { Send, Loader, ChevronRight, Palette, Heart, Star, Leaf } from 'lucide-react';

const Contact = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      toast.warning('Please fill in all fields');
      return false;
    }
    setLoading(true);
    try {
      const res = await axios.post('/api/mail', values);
      if (res.status === 200) {
        setValues({ name: '', email: '', subject: '', message: '' });
        toast.success('Message sent successfully!');
      }
    } catch (err) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setValues((prevInput) => ({
      ...prevInput,
      [e.target.name]: e.target.value,
    }));
  };

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
    { Icon: Star, color: 'text-amber-200', size: 32 },
    { Icon: Heart, color: 'text-red-300', size: 40 },
  ];

  return (
    <section id="contact" className="py-24 sm:py-32 md:py-40 bg-gradient-to-br from-gray-950 via-amber-950 to-green-950 text-amber-100 overflow-hidden relative">
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
            Get in Touch
          </span>
        </motion.h2>
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-col lg:flex-row items-center lg:items-start space-y-12 lg:space-y-0 lg:space-x-16"
        >
         <motion.div variants={itemVariants} className="lg:w-1/2 flex flex-col justify-between">
            <div className="relative w-full aspect-square group mb-8">
              <motion.img
                src="/images/contact.png"
                alt="Contact"
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
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="lg:w-1/2 space-y-8">
            <motion.h3 variants={itemVariants} className="text-3xl font-bold text-amber-200">Let's Connect</motion.h3>
            <motion.p variants={itemVariants} className="text-xl sm:text-2xl leading-relaxed text-amber-100">
              My inbox is always open! 💌 Whether you've got a burning question or want to drop a friendly "hello", I'm all ears! 👂 Let's chat! 🎉
            </motion.p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <input
                  onChange={handleChange}
                  required
                  value={values.name}
                  name="name"
                  type="text"
                  placeholder="Full Name *"
                  className="w-full px-4 py-3 bg-amber-900 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 text-amber-100 placeholder-amber-300"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <input
                  onChange={handleChange}
                  required
                  value={values.email}
                  name="email"
                  type="email"
                  placeholder="Email *"
                  className="w-full px-4 py-3 bg-amber-900 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 text-amber-100 placeholder-amber-300"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <input
                  onChange={handleChange}
                  required
                  value={values.subject}
                  name="subject"
                  type="text"
                  placeholder="Subject *"
                  className="w-full px-4 py-3 bg-amber-900 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 text-amber-100 placeholder-amber-300"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <textarea
                  onChange={handleChange}
                  required
                  value={values.message}
                  name="message"
                  rows={4}
                  placeholder="Message *"
                  className="w-full px-4 py-3 bg-amber-900 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 resize-none text-amber-100 placeholder-amber-300"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.7)" }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovering(true)}
                  onHoverEnd={() => setIsHovering(false)}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center bg-gradient-to-r from-amber-900 via-green-900 to-teal-900 text-amber-100 px-8 py-4 rounded-full text-xl font-black shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 mr-2">
                    {loading ? 'Sending...' : 'Send Message'}
                  </span>
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
                    {loading ? (
                      <Loader className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6" />
                    )}
                  </motion.div>
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
      <ToastContainer position="bottom-right" theme="dark" />
    </section>
  );
};

export default Contact;
