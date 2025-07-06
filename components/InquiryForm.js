import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const InquiryForm = ({ artwork, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
      toast.warning('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          artworkId: artwork.id,
          artworkTitle: artwork.title,
          price: artwork.price,
        }),
      });

      if (response.ok) {
        toast.success('Inquiry sent successfully! We will get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        // Close form after short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error('Failed to send inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again later.');
    }

    setIsSubmitting(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-950/90 flex items-center justify-center z-50 p-4 sm:p-6 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="bg-gradient-to-br from-gray-900 via-amber-950 to-green-950 rounded-3xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden shadow-2xl border border-amber-700/30"
        >
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 text-amber-100 bg-amber-700/30 p-2 rounded-full hover:bg-amber-700/50 transition-colors"
          >
            <X className="w-6 h-6" />
          </motion.button>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-green-200 to-teal-200"
          >
            Inquiry for "{artwork.title}"
          </motion.h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label htmlFor="name" className="block text-amber-100 font-medium mb-2">Name</label>
              <div className="relative">
                <User className="absolute top-3 left-3 text-amber-500" size={18} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-800/50 text-amber-100 border border-amber-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <label htmlFor="email" className="block text-amber-100 font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 text-amber-500" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-800/50 text-amber-100 border border-amber-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <label htmlFor="phone" className="block text-amber-100 font-medium mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute top-3 left-3 text-amber-500" size={18} />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-gray-800/50 text-amber-100 border border-amber-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your phone number"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <label htmlFor="message" className="block text-amber-100 font-medium mb-2">Message</label>
              <div className="relative">
                <MessageSquare className="absolute top-3 left-3 text-amber-500" size={18} />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full pl-10 pr-3 py-2 bg-gray-800/50 text-amber-100 border border-amber-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="Your inquiry about the artwork..."
                ></textarea>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-end space-x-4"
            >
              <motion.button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-amber-700 rounded-full text-amber-100 hover:bg-amber-800/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                className={`px-6 py-2 border border-transparent rounded-full shadow-sm text-amber-100 bg-gradient-to-r from-amber-900 via-green-900 to-teal-900 hover:from-amber-800 hover:via-green-800 hover:to-teal-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(217, 119, 6, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="inline-block mr-2" size={18} />
                    Submit Inquiry
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>


        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InquiryForm;
