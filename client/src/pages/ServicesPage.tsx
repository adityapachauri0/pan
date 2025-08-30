import React from 'react';
import Services from '../components/Services';

const ServicesPage: React.FC = () => {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Our <span className="gradient-text">Services</span></h1>
          <p>Comprehensive solutions for your digital needs</p>
        </div>
      </section>
      <Services />
    </div>
  );
};

export default ServicesPage;