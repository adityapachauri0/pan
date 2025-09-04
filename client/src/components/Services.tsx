import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaPalette, 
  FaMobile, 
  FaChartLine, 
  FaShieldAlt,
  FaRocket,
  FaDatabase,
  FaCloud
} from 'react-icons/fa';

const Services: React.FC = () => {
  const services = [
    {
      icon: FaCode,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies for optimal performance.',
      color: '#667eea',
      features: ['React/Vue/Angular', 'Node.js/Python', 'Responsive Design', 'API Integration']
    },
    {
      icon: FaPalette,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive designs that engage users and drive conversions with seamless experiences.',
      color: '#764ba2',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems']
    },
    {
      icon: FaMobile,
      title: 'Mobile Apps',
      description: 'Native and cross-platform mobile applications for iOS and Android that users love.',
      color: '#ec4899',
      features: ['React Native', 'Flutter', 'iOS/Android', 'App Store Deploy']
    },
    {
      icon: FaDatabase,
      title: 'Backend Development',
      description: 'Robust server-side solutions with scalable architecture and secure data management.',
      color: '#10b981',
      features: ['REST APIs', 'GraphQL', 'Microservices', 'Database Design']
    },
    {
      icon: FaCloud,
      title: 'Cloud Solutions',
      description: 'Deploy and scale your applications with modern cloud infrastructure and DevOps practices.',
      color: '#f59e0b',
      features: ['AWS/Azure/GCP', 'Docker/K8s', 'CI/CD Pipeline', 'Monitoring']
    },
    {
      icon: FaShieldAlt,
      title: 'Cybersecurity',
      description: 'Protect your digital assets with comprehensive security audits and implementations.',
      color: '#ef4444',
      features: ['Security Audits', 'Penetration Testing', 'GDPR Compliance', 'SSL/Encryption']
    }
  ];

  return (
    <section style={{
      padding: '100px 20px',
      background: 'white',
      position: 'relative'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginBottom: '80px'
          }}
        >
          <h2 style={{
            fontSize: '48px',
            fontWeight: '800',
            color: '#1a202c',
            marginBottom: '20px'
          }}>
            Our <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Services</span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#718096',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            We offer comprehensive digital solutions tailored to your business needs with cutting-edge technology
          </p>
        </motion.div>

        {/* Services Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '40px'
        }}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = service.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Gradient Accent */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}88 100%)`
              }} />

              {/* Icon */}
              <div style={{
                width: '70px',
                height: '70px',
                background: `linear-gradient(135deg, ${service.color}22 0%, ${service.color}11 100%)`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px'
              }}>
                <service.icon style={{
                  fontSize: '32px',
                  color: service.color
                }} />
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '16px'
              }}>
                {service.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: '#718096',
                lineHeight: '1.6',
                marginBottom: '24px'
              }}>
                {service.description}
              </p>

              {/* Features */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {service.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    style={{
                      padding: '6px 12px',
                      background: '#f7fafc',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#4a5568',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          style={{
            textAlign: 'center',
            marginTop: '80px',
            padding: '60px',
            background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)',
            borderRadius: '24px'
          }}
        >
          <h3 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '16px'
          }}>
            Ready to Transform Your Business?
          </h3>
          <p style={{
            fontSize: '18px',
            color: '#718096',
            marginBottom: '32px'
          }}>
            Let's discuss how our services can help you achieve your goals
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
            }}
            onClick={() => window.location.href = '/contact'}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;