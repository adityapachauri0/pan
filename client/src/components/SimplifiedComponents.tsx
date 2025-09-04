// This file contains simplified component templates
// Each component has clean inline styles and is well-organized

export const testimonialTemplate = `
import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO, TechStart',
      content: 'Panchroma transformed our online presence completely.',
      rating: 5
    }
  ];
  
  return (
    <section style={{ padding: '100px 20px', background: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2>Client Testimonials</h2>
      </div>
    </section>
  );
};

export default Testimonials;
`;
