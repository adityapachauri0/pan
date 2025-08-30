import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TechRadar from '../components/TechRadar';
import BeforeAfterShowcase from '../components/BeforeAfterShowcase';
import AnimatedStats from '../components/AnimatedStats';
import ROICalculator from '../components/ROICalculator';
import ProcessTimeline from '../components/ProcessTimeline';
import PricingCalculator from '../components/PricingCalculator';
import FAQAccordion from '../components/FAQAccordion';
import SkillsMatrix from '../components/SkillsMatrix';
import ProjectTimeline from '../components/ProjectTimeline';
import PerformanceMetrics from '../components/PerformanceMetrics';
import IntegrationShowcase from '../components/IntegrationShowcase';
import SecurityShowcase from '../components/SecurityShowcase';
import CaseStudies from '../components/CaseStudies';
import InteractiveDemo from '../components/InteractiveDemo';
import ContactForm from '../components/ContactForm';
import Portfolio from '../components/Portfolio';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <Hero />
      <Services />
      <TechRadar />
      <BeforeAfterShowcase />
      <AnimatedStats />
      <ROICalculator />
      <ProcessTimeline />
      <PricingCalculator />
      <FAQAccordion />
      <SkillsMatrix />
      <ProjectTimeline />
      <PerformanceMetrics />
      <IntegrationShowcase />
      <SecurityShowcase />
      <CaseStudies />
      <InteractiveDemo />
      <ContactForm />
      <Stats />
      <Portfolio />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default HomePage;