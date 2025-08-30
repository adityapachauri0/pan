import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaMobile, 
  FaRocket, 
  FaShoppingCart, 
  FaSearch, 
  FaCloud,
  FaPalette,
  FaShieldAlt 
} from 'react-icons/fa';
import './Services.css';

const services = [
  {
    icon: <FaCode />,
    title: 'Web Development',
    description: 'Custom websites built with cutting-edge technologies for optimal performance and user experience.',
    features: ['React/Next.js', 'Node.js', 'MongoDB', 'TypeScript'],
    color: 'primary'
  },
  {
    icon: <FaMobile />,
    title: 'Mobile Apps',
    description: 'Native and cross-platform mobile applications that deliver seamless experiences across all devices.',
    features: ['React Native', 'iOS', 'Android', 'Flutter'],
    color: 'secondary'
  },
  {
    icon: <FaShoppingCart />,
    title: 'E-Commerce',
    description: 'Complete e-commerce solutions with secure payment processing and inventory management.',
    features: ['Shopify', 'WooCommerce', 'Custom Cart', 'Payment Integration'],
    color: 'accent'
  },
  {
    icon: <FaPalette />,
    title: 'UI/UX Design',
    description: 'Beautiful, intuitive designs that enhance user engagement and drive conversions.',
    features: ['Wireframing', 'Prototyping', 'User Research', 'A/B Testing'],
    color: 'primary'
  },
  {
    icon: <FaSearch />,
    title: 'SEO & Marketing',
    description: 'Data-driven strategies to improve your online visibility and attract more customers.',
    features: ['On-Page SEO', 'Content Strategy', 'Google Ads', 'Analytics'],
    color: 'secondary'
  },
  {
    icon: <FaCloud />,
    title: 'Cloud Solutions',
    description: 'Scalable cloud infrastructure and deployment solutions for modern applications.',
    features: ['AWS', 'Google Cloud', 'Azure', 'DevOps'],
    color: 'accent'
  }
];

const Services: React.FC = () => {
  return (
    <section className="services section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">What We Do</span>
          <h2>Services That Drive <span className="gradient-text">Digital Success</span></h2>
          <p>We offer comprehensive web solutions tailored to your business needs</p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className={`service-icon ${service.color}`}>
                {service.icon}
              </div>
              
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              
              <div className="service-features">
                {service.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    {feature}
                  </span>
                ))}
              </div>
              
              <button className="service-link">
                Learn More
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 10H14M14 10L10 6M14 10L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;