import React from 'react';
import Portfolio from '../components/Portfolio';

const PortfolioPage: React.FC = () => {
  return (
    <div className="page">
      <section className="page-hero">
        <div className="container">
          <h1>Our <span className="gradient-text">Portfolio</span></h1>
          <p>Showcasing our best work and success stories</p>
        </div>
      </section>
      <Portfolio />
    </div>
  );
};

export default PortfolioPage;