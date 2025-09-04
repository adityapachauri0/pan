import React from 'react';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import ProcessTimeline from '../components/ProcessTimeline';
import Portfolio from '../components/Portfolio';
import AnimatedStats from '../components/AnimatedStats';
import Testimonials from '../components/Testimonials';
import PricingCalculator from '../components/PricingCalculator';
import FAQAccordion from '../components/FAQAccordion';
import CTA from '../components/CTA';
import IntegrationShowcase from '../components/IntegrationShowcase';
import ParticleNetwork from '../components/ParticleNetwork';

const HomePage: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      position: 'relative'
    }}>
      <ParticleNetwork />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero />
        <Stats />
        <Services />
        <ProcessTimeline />
        <Portfolio />
        <IntegrationShowcase />
        <AnimatedStats />
        <Testimonials />
        <PricingCalculator />
        <FAQAccordion />
        <CTA />
      </div>
    </div>
  );
};

export default HomePage;