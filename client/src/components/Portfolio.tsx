import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaEye } from 'react-icons/fa';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'web',
      description: 'Full-stack e-commerce solution with payment integration',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      liveUrl: '#',
      githubUrl: '#',
      color: '#667eea'
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      category: 'mobile',
      description: 'Secure mobile banking application with biometric authentication',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
      technologies: ['React Native', 'Firebase', 'Node.js'],
      liveUrl: '#',
      githubUrl: '#',
      color: '#764ba2'
    },
    {
      id: 3,
      title: 'Healthcare Portal',
      category: 'web',
      description: 'Patient management system with appointment scheduling',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
      technologies: ['Vue.js', 'Python', 'PostgreSQL'],
      liveUrl: '#',
      githubUrl: '#',
      color: '#ec4899'
    },
    {
      id: 4,
      title: 'Analytics Dashboard',
      category: 'design',
      description: 'Business intelligence dashboard with real-time data visualization',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
      technologies: ['React', 'D3.js', 'Node.js'],
      liveUrl: '#',
      githubUrl: '#',
      color: '#10b981'
    },
    {
      id: 5,
      title: 'Food Delivery App',
      category: 'mobile',
      description: 'Real-time food delivery tracking application',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      technologies: ['Flutter', 'Firebase', 'Google Maps'],
      liveUrl: '#',
      githubUrl: '#',
      color: '#f59e0b'
    },
    {
      id: 6,
      title: 'Learning Platform',
      category: 'web',
      description: 'Online learning platform with video streaming',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      technologies: ['Next.js', 'AWS', 'GraphQL'],
      liveUrl: '#',
      githubUrl: '#',
      color: '#ef4444'
    }
  ];

  const categories = ['all', 'web', 'mobile', 'design'];
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section style={{
      padding: '100px 20px',
      background: 'linear-gradient(135deg, #f6f8fb 0%, #f0f4f8 100%)'
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
            marginBottom: '60px'
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
            }}>Portfolio</span>
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#718096',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore our latest projects and see how we've helped businesses transform digitally
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '60px'
          }}
        >
          {categories.map(category => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(category)}
              style={{
                padding: '10px 24px',
                background: filter === category 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'white',
                border: filter === category 
                  ? 'none'
                  : '2px solid #e2e8f0',
                borderRadius: '50px',
                color: filter === category ? 'white' : '#4a5568',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                boxShadow: filter === category 
                  ? '0 10px 30px rgba(102, 126, 234, 0.3)'
                  : 'none'
              }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={filter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '40px'
            }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.08)';
                }}
              >
                {/* Image Container */}
                <div style={{
                  position: 'relative',
                  height: '250px',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${project.color}22 0%, ${project.color}44 100%)`
                }}>
                  <img 
                    src={project.image} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.9
                    }}
                  />
                  {/* Overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '20px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                  >
                    <div style={{
                      display: 'flex',
                      gap: '16px'
                    }}>
                      <a 
                        href={project.liveUrl}
                        style={{
                          padding: '10px',
                          background: 'white',
                          borderRadius: '8px',
                          color: project.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaExternalLinkAlt />
                      </a>
                      <a 
                        href={project.githubUrl}
                        style={{
                          padding: '10px',
                          background: 'white',
                          borderRadius: '8px',
                          color: project.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <FaGithub />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '30px' }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1a202c',
                    marginBottom: '12px'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{
                    fontSize: '16px',
                    color: '#718096',
                    lineHeight: '1.6',
                    marginBottom: '20px'
                  }}>
                    {project.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {project.technologies.map((tech, idx) => (
                      <span 
                        key={idx}
                        style={{
                          padding: '6px 12px',
                          background: `${project.color}11`,
                          borderRadius: '6px',
                          fontSize: '13px',
                          color: project.color,
                          fontWeight: '500'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;