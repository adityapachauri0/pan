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
    title: 'Amico Construction',
    category: 'Construction Company',
    description: 'Modern construction company website showcasing building projects with a professional design and comprehensive service information.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    technologies: ['WordPress', 'Custom Theme', 'Responsive Design', 'SEO'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#2c5282'
  },
  {
    id: 2,
    title: 'Moncton Vein Clinic',
    category: 'Healthcare',
    description: 'Professional medical clinic website with patient information, treatment details, and appointment booking capabilities.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    technologies: ['Joomla', 'Custom Components', 'HIPAA Compliant', 'Mobile Optimized'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#0891b2'
  },
  {
    id: 3,
    title: 'Alex Girouard',
    category: 'Personal Brand',
    description: 'Personal branding website featuring portfolio showcase, professional services, and client testimonials.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    technologies: ['React', 'Node.js', 'Portfolio Design', 'Animation'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#7c3aed'
  },
  {
    id: 4,
    title: 'Coco Fitness',
    category: 'Fitness & Wellness',
    description: 'Dynamic fitness studio website with class schedules, trainer profiles, membership information, and online booking system.',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    technologies: ['WordPress', 'Booking System', 'Payment Gateway', 'Member Portal'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#dc2626'
  },
  {
    id: 5,
    title: 'Prisma',
    category: 'Technology Solutions',
    description: 'Tech company website featuring innovative solutions, product showcases, and comprehensive service offerings.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    technologies: ['Next.js', 'TypeScript', 'GraphQL', 'Prisma ORM'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#0d9488'
  },
  {
    id: 6,
    title: 'Harrisville Dental',
    category: 'Dental Practice',
    description: 'Modern dental practice website with service information, patient resources, and online appointment scheduling.',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&q=80',
    technologies: ['Joomla', 'Custom Forms', 'Patient Portal', 'SEO Optimized'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#059669'
  },
  {
    id: 7,
    title: 'Wadi Rum',
    category: 'Travel & Tourism',
    description: 'Tourism website showcasing desert adventures, accommodation options, and booking capabilities for Jordan experiences.',
    image: 'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=800&q=80',
    technologies: ['WordPress', 'Booking Engine', 'Multi-language', 'Gallery'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#ea580c'
  },
  {
    id: 8,
    title: 'Nexus Physio',
    category: 'Physiotherapy Clinic',
    description: 'Healthcare website for physiotherapy services with treatment information, team profiles, and patient booking system.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
    technologies: ['Custom CMS', 'Appointment System', 'Patient Forms', 'Blog'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#2563eb'
  },
  {
    id: 9,
    title: 'ADC Group',
    category: 'Business Services',
    description: 'Corporate website for business consulting group with service portfolios, case studies, and client resources.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    technologies: ['React', 'Corporate Design', 'CRM Integration', 'Analytics'],
    liveUrl: '#',
    githubUrl: '#',
    color: '#4f46e5'
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