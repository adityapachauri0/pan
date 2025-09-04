import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-300 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Go to Homepage
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;