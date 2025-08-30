import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRocket, FaChartLine, FaMobile, FaShoppingCart } from 'react-icons/fa';
import './BeforeAfterShowcase.css';

interface TransformationProject {
  id: number;
  title: string;
  client: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  improvements: {
    metric: string;
    value: string;
    icon: React.ReactNode;
  }[];
  description: string;
  technologies: string[];
  liveUrl?: string;
}

const transformations: TransformationProject[] = [
  {
    id: 1,
    title: 'E-Commerce Platform Redesign',
    client: 'Wilde Properties',
    category: 'Real Estate',
    beforeImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    afterImage: '/portfolio/wilde-properties.png',
    improvements: [
      { metric: 'Page Load Speed', value: '3.2s → 0.8s', icon: <FaRocket /> },
      { metric: 'Conversion Rate', value: '+156%', icon: <FaChartLine /> },
      { metric: 'Mobile Score', value: '65 → 98', icon: <FaMobile /> },
      { metric: 'Sales Increase', value: '+240%', icon: <FaShoppingCart /> }
    ],
    description: 'Complete redesign and optimization of property listing platform with enhanced search capabilities and virtual tours.',
    technologies: ['React', 'Node.js', 'MongoDB', 'MLS Integration'],
    liveUrl: 'https://wildeproperties.ca'
  },
  {
    id: 2,
    title: 'Conservation Website Transformation',
    client: 'Wolastoq Conservation',
    category: 'Non-Profit',
    beforeImage: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    afterImage: '/portfolio/wolastoq-conservation.png',
    improvements: [
      { metric: 'User Engagement', value: '+320%', icon: <FaChartLine /> },
      { metric: 'Donation Rate', value: '+185%', icon: <FaShoppingCart /> },
      { metric: 'Page Views', value: '+420%', icon: <FaRocket /> },
      { metric: 'Mobile Traffic', value: '+280%', icon: <FaMobile /> }
    ],
    description: 'Modernized environmental organization website with interactive maps, donation system, and educational resources.',
    technologies: ['WordPress', 'Custom Theme', 'Payment Gateway', 'Interactive Maps'],
    liveUrl: 'https://wolastoqconservation.ca'
  },
  {
    id: 3,
    title: 'Construction Company Digital Presence',
    client: 'Amico Construction',
    category: 'Construction',
    beforeImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80',
    afterImage: '/portfolio/amico-construction.png',
    improvements: [
      { metric: 'Lead Generation', value: '+275%', icon: <FaChartLine /> },
      { metric: 'SEO Ranking', value: 'Page 5 → Top 3', icon: <FaRocket /> },
      { metric: 'Project Inquiries', value: '+195%', icon: <FaShoppingCart /> },
      { metric: 'Site Performance', value: '92/100', icon: <FaMobile /> }
    ],
    description: 'Professional construction website showcasing portfolio galleries, service information, and client testimonials.',
    technologies: ['WordPress', 'SEO Optimization', 'Gallery System', 'Contact Forms'],
    liveUrl: 'https://amicoconstruction.ca'
  },
  {
    id: 4,
    title: 'Experience Platform Innovation',
    client: 'Brix Experience',
    category: 'Digital Agency',
    beforeImage: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80',
    afterImage: '/portfolio/brix-experience.png',
    improvements: [
      { metric: 'User Experience', value: '5x Better', icon: <FaRocket /> },
      { metric: 'Client Acquisition', value: '+340%', icon: <FaChartLine /> },
      { metric: 'Engagement Time', value: '+180%', icon: <FaMobile /> },
      { metric: 'Brand Recognition', value: '+250%', icon: <FaShoppingCart /> }
    ],
    description: 'Dynamic experience platform with immersive interactions, 3D animations, and cutting-edge web technologies.',
    technologies: ['React', 'Three.js', 'GSAP', 'Node.js'],
    liveUrl: 'https://www.brixexperience.ca'
  }
];

const BeforeAfterShowcase: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState(transformations[0]);

  return (
    <section className="before-after-showcase">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="showcase-header"
        >
          <span className="section-label">Transformations</span>
          <h2 className="section-title">
            Website <span className="gradient-text">Performance Improvements</span>
          </h2>
          <p className="section-description">
            See the dramatic improvements we've delivered for our clients through data-driven optimization.
          </p>
        </motion.div>

        <div className="showcase-content">
          <motion.div 
            className="metrics-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {selectedProject.improvements.map((improvement, index) => (
              <motion.div
                key={index}
                className="metric-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="metric-icon">{improvement.icon}</div>
                <h4>{improvement.metric}</h4>
                <p className="metric-value">{improvement.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="showcase-details">
          <motion.div 
            className="project-info"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3>{selectedProject.title}</h3>
            <p className="client-name">{selectedProject.client} • {selectedProject.category}</p>
            <p className="project-description">{selectedProject.description}</p>
            <div className="tech-stack">
              {selectedProject.technologies.map((tech, index) => (
                <span key={index} className="tech-tag">{tech}</span>
              ))}
            </div>
            {selectedProject.liveUrl && (
              <a 
                href={selectedProject.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="view-live-btn"
              >
                View Live Site <FaArrowRight />
              </a>
            )}
          </motion.div>

          <motion.div 
            className="project-selector"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4>Other Transformations</h4>
            <div className="project-list">
              {transformations.map((project) => (
                <motion.div
                  key={project.id}
                  className={`project-item ${selectedProject.id === project.id ? 'active' : ''}`}
                  onClick={() => setSelectedProject(project)}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="project-thumb">
                    <img src={project.afterImage} alt={project.client} />
                  </div>
                  <div className="project-details">
                    <h5>{project.client}</h5>
                    <p>{project.category}</p>
                  </div>
                  <FaArrowRight className="project-arrow" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="showcase-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3>Ready for Your Website Transformation?</h3>
          <p>Let's discuss how we can dramatically improve your online presence</p>
          <button className="cta-button primary">Get Your Free Website Audit</button>
        </motion.div>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;