import React from 'react';
import { motion } from 'framer-motion';
import Portfolio from '../components/Portfolio';

const PortfolioPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Hero Section */}
      <section style={{
        padding: '120px 20px 80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 style={{
              fontSize: '56px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px'
            }}>
              Our <span style={{
                background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Portfolio</span>
            </h1>
            <p style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: '300'
            }}>
              Showcasing our best work and success stories
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Portfolio Component */}
      <Portfolio />
    </div>
  );
};

export default PortfolioPage;