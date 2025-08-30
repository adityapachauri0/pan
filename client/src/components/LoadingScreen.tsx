import React from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

interface LoadingScreenProps {
  message?: string;
  progress?: number;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...', 
  progress 
}) => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo Animation */}
        <motion.div
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo-circle">
            <motion.div
              className="logo-inner"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Loading Message */}
        <motion.h3
          className="loading-message"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {message}
        </motion.h3>

        {/* Progress Bar */}
        {progress !== undefined && (
          <div className="progress-container">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        )}

        {/* Loading Animation */}
        <div className="loading-dots">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="dot"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;