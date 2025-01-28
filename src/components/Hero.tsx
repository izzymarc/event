import React from 'react';
import { motion } from 'framer-motion';

function Hero() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Your New Project
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Start building something amazing with React, TypeScript, and Tailwind CSS
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-medium hover:bg-indigo-700 transition-colors"
          onClick={() => window.open('https://github.com/your-username/your-project', '_blank')}
          aria-label="Get started with the project"
        >
          Get Started
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Hero;
