import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaExternalLinkAlt, FaGithub, FaEye } from 'react-icons/fa';
import './Portfolio.css';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  color: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Brix Experience',
    category: 'Experience Design',
    description: 'A dynamic experience platform showcasing innovative design solutions with immersive user interactions and cutting-edge web technologies.',
    image: '/portfolio/brix-experience.png',
    technologies: ['React', 'Three.js', 'GSAP', 'Node.js'],
    liveUrl: 'https://www.brixexperience.ca',
    githubUrl: '#',
    color: '#dc2626'
  },
  {
    id: 2,
    title: 'Wolastoq Conservation',
    category: 'Environmental Organization',
    description: 'Conservation organization website promoting environmental protection initiatives along the Wolastoq (Saint John River) with educational resources and community engagement.',
    image: '/portfolio/wolastoq-conservation.png',
    technologies: ['WordPress', 'Custom Theme', 'Interactive Maps', 'Donation System'],
    liveUrl: 'https://wolastoqconservation.ca',
    githubUrl: '#',
    color: '#059669'
  },
  {
    id: 3,
    title: 'Amico Construction',
    category: 'Construction Company',
    description: 'Professional construction company website showcasing commercial and residential projects with detailed service information and portfolio galleries.',
    image: '/portfolio/amico-construction.png',
    technologies: ['WordPress', 'Custom Theme', 'Project Gallery', 'SEO Optimized'],
    liveUrl: 'https://amicoconstruction.ca',
    githubUrl: '#',
    color: '#2c5282'
  },
  {
    id: 4,
    title: 'Wilde Properties',
    category: 'Real Estate',
    description: 'Modern real estate website featuring property listings, virtual tours, and advanced search capabilities for buyers and sellers.',
    image: '/portfolio/wilde-properties.png',
    technologies: ['React', 'MLS Integration', 'Virtual Tours', 'Property Management'],
    liveUrl: 'https://wildeproperties.ca',
    githubUrl: '#',
    color: '#7c3aed'
  }
];

const Portfolio: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const getVisibleProjects = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(projects[(currentIndex + i) % projects.length]);
    }
    return visible;
  };

  return (
    <section className="portfolio-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="portfolio-header"
        >
          <span className="section-label">Our Work</span>
          <h2 className="section-title">Recent Website Designs</h2>
          <p className="section-description">
            Showcasing our latest projects that combine innovative design with cutting-edge technology
          </p>
        </motion.div>

        <div className="portfolio-container">
          <button className="carousel-control carousel-control-prev" onClick={handlePrevious}>
            <FaChevronLeft />
          </button>

          <div className="portfolio-grid">
            <AnimatePresence mode="wait">
              {getVisibleProjects().map((project, index) => (
                <motion.div
                  key={`${project.id}-${currentIndex}`}
                  className={`portfolio-card ${index === 1 ? 'featured' : ''}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: index === 1 ? 1 : 0.95 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  style={{
                    '--project-color': project.color
                  } as React.CSSProperties}
                >
                  <div className="portfolio-card-inner">
                    <div className="portfolio-image-container">
                      <img src={project.image} alt={project.title} className="portfolio-image" />
                      <div className="portfolio-overlay">
                        <div className="portfolio-category">{project.category}</div>
                        <div className="portfolio-actions">
                          {project.liveUrl && (
                            <a href={project.liveUrl} className="portfolio-action-btn" target="_blank" rel="noopener noreferrer">
                              <FaEye /> <span>View Live</span>
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} className="portfolio-action-btn" target="_blank" rel="noopener noreferrer">
                              <FaGithub /> <span>Code</span>
                            </a>
                          )}
                        </div>
                      </div>
                      {hoveredProject === project.id && (
                        <motion.div
                          className="portfolio-hover-effect"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </div>
                    <div className="portfolio-content">
                      <h3 className="portfolio-title">{project.title}</h3>
                      <p className="portfolio-description">{project.description}</p>
                      <div className="portfolio-tech-stack">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <button className="portfolio-learn-more">
                        Learn More <FaExternalLinkAlt />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button className="carousel-control carousel-control-next" onClick={handleNext}>
            <FaChevronRight />
          </button>
        </div>

        <div className="portfolio-dots">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`portfolio-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.div
          className="portfolio-cta"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button className="cta-button primary">View Full Portfolio</button>
          <button className="cta-button secondary">Start Your Project</button>
        </motion.div>
      </div>
    </section>
  );
};

export default Portfolio;