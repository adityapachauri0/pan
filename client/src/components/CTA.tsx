import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaArrowRight } from 'react-icons/fa';
import './CTA.css';

const CTA: React.FC = () => {
  return (
    <section className="cta">
      <div className="container">
        <motion.div
          className="cta-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="cta-text">
            <h2>Ready to Transform Your <span className="gradient-text">Digital Presence?</span></h2>
            <p>Let's work together to create something amazing. Get in touch with us today and take the first step towards digital excellence.</p>
          </div>
          
          <div className="cta-buttons">
            <button className="btn btn-primary">
              <FaRocket />
              Start Your Project
            </button>
            <button className="btn btn-secondary">
              Schedule a Call
              <FaArrowRight />
            </button>
          </div>
        </motion.div>

        <div className="cta-decoration">
          <div className="decoration-circle"></div>
          <div className="decoration-circle"></div>
        </div>
      </div>
    </section>
  );
};

export default CTA;