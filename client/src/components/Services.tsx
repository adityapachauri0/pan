import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
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
import { PlatformLogo } from './icons/PlatformLogos';
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
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const platforms = [
    'Google Ads', 'Facebook', 'Instagram', 'TikTok', 'LinkedIn',
    'Twitter/X', 'Snapchat', 'Pinterest', 'YouTube', 'Taboola',
    'Outbrain', 'Reddit', 'Quora', 'Amazon DSP', 'Microsoft Ads',
    'Apple Search', 'Spotify', 'Podcast Ads', 'Display Networks', 
    'Email', 'SMS'
  ];

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

        {/* 20+ Platforms Showcase */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="platforms-showcase"
          style={{ marginTop: '80px' }}
        >
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h3 style={{ 
              fontSize: 'clamp(2rem, 4vw, 3rem)', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '16px' 
            }}>
              20+ Digital Channels At Your Disposal
            </h3>
            <p style={{ 
              fontSize: '1.25rem', 
              color: '#9CA3AF', 
              maxWidth: '600px', 
              margin: '0 auto' 
            }}>
              From web to mobile to cloud, we leverage every technology to deliver your perfect solution
            </p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              inset: '0',
              background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: '24px',
              filter: 'blur(48px)'
            }}/>
            <div style={{
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '24px',
                justifyItems: 'center'
              }}>
                {platforms.map((platform, idx) => (
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.8 + idx * 0.05 }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    style={{
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                    className="platform-item"
                  >
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        inset: '0',
                        background: 'linear-gradient(to right, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                        borderRadius: '12px',
                        filter: 'blur(12px)',
                        opacity: '0',
                        transition: 'opacity 0.3s'
                      }} className="platform-glow"/>
                      <div style={{
                        position: 'relative',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s'
                      }} className="platform-card">
                        <PlatformLogo name={platform} className="w-8 h-8 mx-auto mb-2" />
                        <p style={{
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          margin: '0'
                        }}>{platform}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;