import React from 'react';
import { motion } from 'framer-motion';

const BeforeAfterShowcase: React.FC = () => {
  return (
    <section style={{
      padding: '100px 20px',
      background: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#1a202c',
            marginBottom: '20px'
          }}
        >
          Section Coming Soon
        </motion.h2>
        <p style={{
          fontSize: '20px',
          color: '#718096'
        }}>
          This section is being redesigned for better user experience
        </p>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;
