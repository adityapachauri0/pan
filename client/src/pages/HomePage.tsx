import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Hero />
      <Services />
      <Stats />
      <Portfolio />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;