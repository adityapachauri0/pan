import React, { useState } from 'react';
import './CaseStudies.css';
import { 
  FaArrowRight, FaChartLine, FaRocket, FaTrophy, FaQuoteLeft,
  FaShoppingCart, FaHeart, FaGraduationCap, FaHome, FaCar,
  FaUtensils, FaPlane, FaGamepad, FaMusic, FaDumbbell,
  FaCheck, FaTimes, FaArrowUp, FaClock, FaUsers, FaDollarSign,
  FaMobile, FaDesktop, FaTablet, FaCode, FaPalette, FaServer
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Metric {
  label: string;
  before: string;
  after: string;
  improvement: string;
  icon: React.ReactNode;
}

interface Challenge {
  title: string;
  description: string;
  solution: string;
}

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  icon: React.ReactNode;
  tagline: string;
  overview: string;
  image: string;
  technologies: string[];
  challenges: Challenge[];
  metrics: Metric[];
  testimonial: {
    text: string;
    author: string;
    position: string;
    company: string;
  };
  results: string[];
  platforms: string[];
}

const CaseStudies: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');

  const caseStudies: CaseStudy[] = [
    {
      id: 'ecommerce-revolution',
      title: 'E-Commerce Revolution',
      client: 'StyleHub Fashion',
      industry: 'E-Commerce',
      duration: '6 months',
      icon: <FaShoppingCart />,
      tagline: 'From Startup to Market Leader',
      overview: 'Transformed a small fashion startup into a thriving online marketplace with 500K+ active users',
      image: 'ecommerce-case.jpg',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS', 'Redis'],
      challenges: [
        {
          title: 'Scalability Issues',
          description: 'Legacy system couldn\'t handle more than 100 concurrent users',
          solution: 'Implemented microservices architecture with auto-scaling'
        },
        {
          title: 'Poor Mobile Experience',
          description: '70% cart abandonment rate on mobile devices',
          solution: 'Built Progressive Web App with offline capabilities'
        },
        {
          title: 'Slow Checkout Process',
          description: 'Average checkout time was 5+ minutes',
          solution: 'One-click checkout with saved preferences'
        }
      ],
      metrics: [
        {
          label: 'Conversion Rate',
          before: '1.2%',
          after: '4.8%',
          improvement: '+300%',
          icon: <FaChartLine />
        },
        {
          label: 'Page Load Time',
          before: '8.5s',
          after: '1.2s',
          improvement: '-86%',
          icon: <FaClock />
        },
        {
          label: 'Monthly Revenue',
          before: '$50K',
          after: '$850K',
          improvement: '+1600%',
          icon: <FaDollarSign />
        },
        {
          label: 'Active Users',
          before: '5K',
          after: '500K',
          improvement: '+9900%',
          icon: <FaUsers />
        }
      ],
      testimonial: {
        text: 'Panchroma didn\'t just build us a website; they built us a business empire. Our revenue has increased 16x, and we\'re now the leading fashion marketplace in our region.',
        author: 'Sarah Chen',
        position: 'CEO & Founder',
        company: 'StyleHub Fashion'
      },
      results: [
        'Achieved #1 ranking in App Store for fashion category',
        'Featured in TechCrunch as "Startup of the Year"',
        'Secured $5M Series A funding',
        'Expanded to 15 new markets'
      ],
      platforms: ['Web', 'iOS', 'Android', 'PWA']
    },
    {
      id: 'healthcare-transformation',
      title: 'Healthcare Digital Transformation',
      client: 'MediCare Plus',
      industry: 'Healthcare',
      duration: '8 months',
      icon: <FaHeart />,
      tagline: 'Revolutionizing Patient Care',
      overview: 'Created an integrated healthcare platform connecting 10,000+ patients with 500+ healthcare providers',
      image: 'healthcare-case.jpg',
      technologies: ['React Native', 'Python', 'PostgreSQL', 'WebRTC', 'HIPAA Compliant', 'AI/ML'],
      challenges: [
        {
          title: 'HIPAA Compliance',
          description: 'Strict healthcare data regulations and security requirements',
          solution: 'End-to-end encryption with HIPAA-compliant infrastructure'
        },
        {
          title: 'Complex Scheduling',
          description: 'Managing appointments for 500+ providers',
          solution: 'AI-powered smart scheduling system'
        },
        {
          title: 'Telemedicine Integration',
          description: 'Need for reliable video consultations',
          solution: 'WebRTC-based video platform with 99.9% uptime'
        }
      ],
      metrics: [
        {
          label: 'Patient Satisfaction',
          before: '62%',
          after: '94%',
          improvement: '+52%',
          icon: <FaHeart />
        },
        {
          label: 'Appointment No-shows',
          before: '35%',
          after: '8%',
          improvement: '-77%',
          icon: <FaUsers />
        },
        {
          label: 'Processing Time',
          before: '48 hours',
          after: '30 minutes',
          improvement: '-96%',
          icon: <FaClock />
        },
        {
          label: 'Cost per Patient',
          before: '$150',
          after: '$45',
          improvement: '-70%',
          icon: <FaDollarSign />
        }
      ],
      testimonial: {
        text: 'The platform Panchroma built has revolutionized how we deliver healthcare. Patient satisfaction is at an all-time high, and we\'ve reduced operational costs by 70%.',
        author: 'Dr. Michael Roberts',
        position: 'Chief Medical Officer',
        company: 'MediCare Plus'
      },
      results: [
        'Processed 1M+ appointments successfully',
        'Reduced patient wait times by 85%',
        'Won "Healthcare Innovation Award 2024"',
        'Saved $10M in operational costs'
      ],
      platforms: ['Web Portal', 'Mobile App', 'Tablet App', 'Kiosk System']
    },
    {
      id: 'edtech-platform',
      title: 'EdTech Learning Revolution',
      client: 'LearnSmart Academy',
      industry: 'Education',
      duration: '5 months',
      icon: <FaGraduationCap />,
      tagline: 'Empowering Next-Gen Learning',
      overview: 'Built an AI-powered learning platform serving 100,000+ students across 50 countries',
      image: 'edtech-case.jpg',
      technologies: ['Vue.js', 'Django', 'TensorFlow', 'WebSockets', 'Kubernetes', 'GraphQL'],
      challenges: [
        {
          title: 'Personalized Learning',
          description: 'One-size-fits-all approach wasn\'t working',
          solution: 'AI-driven adaptive learning paths'
        },
        {
          title: 'Global Scale',
          description: 'Supporting students across different time zones',
          solution: 'CDN deployment with regional servers'
        },
        {
          title: 'Engagement Issues',
          description: 'Low course completion rates (15%)',
          solution: 'Gamification and interactive content'
        }
      ],
      metrics: [
        {
          label: 'Course Completion',
          before: '15%',
          after: '78%',
          improvement: '+420%',
          icon: <FaTrophy />
        },
        {
          label: 'Student Engagement',
          before: '20 min/day',
          after: '95 min/day',
          improvement: '+375%',
          icon: <FaClock />
        },
        {
          label: 'Learning Outcomes',
          before: '45%',
          after: '89%',
          improvement: '+98%',
          icon: <FaChartLine />
        },
        {
          label: 'Platform Users',
          before: '2K',
          after: '100K',
          improvement: '+4900%',
          icon: <FaUsers />
        }
      ],
      testimonial: {
        text: 'Panchroma transformed our vision into reality. The AI-powered platform they built has helped thousands of students achieve their learning goals.',
        author: 'Emily Thompson',
        position: 'Director of Education',
        company: 'LearnSmart Academy'
      },
      results: [
        'Reached 100,000+ active learners',
        'Launched in 50 countries',
        'Partnership with 200+ schools',
        '95% student satisfaction rate'
      ],
      platforms: ['Web', 'iOS', 'Android', 'Smart TV']
    },
    {
      id: 'realestate-portal',
      title: 'Real Estate Digital Hub',
      client: 'HomeFinder Pro',
      industry: 'Real Estate',
      duration: '7 months',
      icon: <FaHome />,
      tagline: 'Finding Dream Homes Made Easy',
      overview: 'Developed a comprehensive real estate platform with 3D virtual tours and AI property matching',
      image: 'realestate-case.jpg',
      technologies: ['Next.js', 'Three.js', 'PostgreSQL', 'Elasticsearch', 'Maps API', 'VR/AR'],
      challenges: [
        {
          title: 'Property Search',
          description: 'Users couldn\'t find relevant properties easily',
          solution: 'AI-powered recommendation engine'
        },
        {
          title: 'Virtual Tours',
          description: 'Physical visits were time-consuming',
          solution: '3D virtual tours with VR support'
        },
        {
          title: 'Market Analysis',
          description: 'Lack of real-time market insights',
          solution: 'Real-time analytics dashboard'
        }
      ],
      metrics: [
        {
          label: 'Property Listings',
          before: '5K',
          after: '250K',
          improvement: '+4900%',
          icon: <FaHome />
        },
        {
          label: 'Search Accuracy',
          before: '40%',
          after: '92%',
          improvement: '+130%',
          icon: <FaChartLine />
        },
        {
          label: 'Deal Closure Time',
          before: '45 days',
          after: '12 days',
          improvement: '-73%',
          icon: <FaClock />
        },
        {
          label: 'Monthly Transactions',
          before: '$2M',
          after: '$45M',
          improvement: '+2150%',
          icon: <FaDollarSign />
        }
      ],
      testimonial: {
        text: 'The platform has completely transformed our business. We\'re now the go-to real estate platform in our market, thanks to Panchroma\'s innovative solutions.',
        author: 'James Wilson',
        position: 'CEO',
        company: 'HomeFinder Pro'
      },
      results: [
        'Facilitated $500M+ in property transactions',
        'Reduced property viewing time by 80%',
        'Increased agent productivity by 300%',
        'Expanded to 25 cities'
      ],
      platforms: ['Web', 'Mobile', 'VR Headsets']
    },
    {
      id: 'fitness-app',
      title: 'Fitness & Wellness Platform',
      client: 'FitLife Pro',
      industry: 'Health & Fitness',
      duration: '4 months',
      icon: <FaDumbbell />,
      tagline: 'Your Personal Fitness Journey',
      overview: 'Created an all-in-one fitness platform with AI coaching, nutrition tracking, and community features',
      image: 'fitness-case.jpg',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'TensorFlow', 'HealthKit', 'Wearables API'],
      challenges: [
        {
          title: 'User Retention',
          description: 'High drop-off rate after first week',
          solution: 'Personalized AI coaching and gamification'
        },
        {
          title: 'Device Integration',
          description: 'Multiple fitness tracker compatibility',
          solution: 'Universal wearables API integration'
        },
        {
          title: 'Community Building',
          description: 'Users felt isolated in their journey',
          solution: 'Social features and challenges'
        }
      ],
      metrics: [
        {
          label: 'User Retention',
          before: '12%',
          after: '67%',
          improvement: '+458%',
          icon: <FaUsers />
        },
        {
          label: 'Daily Active Users',
          before: '1K',
          after: '85K',
          improvement: '+8400%',
          icon: <FaChartLine />
        },
        {
          label: 'Workout Completion',
          before: '25%',
          after: '82%',
          improvement: '+228%',
          icon: <FaTrophy />
        },
        {
          label: 'App Store Rating',
          before: '3.2',
          after: '4.9',
          improvement: '+53%',
          icon: <FaRocket />
        }
      ],
      testimonial: {
        text: 'Panchroma built us more than an app - they built a movement. Our users are achieving their fitness goals and building lasting healthy habits.',
        author: 'Maria Garcia',
        position: 'Founder',
        company: 'FitLife Pro'
      },
      results: [
        '1M+ workouts completed',
        '85K daily active users',
        'Featured as "App of the Day"',
        '$3M in annual revenue'
      ],
      platforms: ['iOS', 'Android', 'Apple Watch', 'Web Dashboard']
    }
  ];

  const industries = [
    { name: 'All', value: 'all' },
    { name: 'E-Commerce', value: 'E-Commerce' },
    { name: 'Healthcare', value: 'Healthcare' },
    { name: 'Education', value: 'Education' },
    { name: 'Real Estate', value: 'Real Estate' },
    { name: 'Health & Fitness', value: 'Health & Fitness' }
  ];

  const filteredStudies = activeFilter === 'all' 
    ? caseStudies 
    : caseStudies.filter(study => study.industry === activeFilter);

  const handleStudyClick = (study: CaseStudy) => {
    setSelectedStudy(study);
  };

  return (
    <section className="case-studies">
      <div className="container">
        <div className="section-header">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Success Stories
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Real results from real clients
          </motion.p>
        </div>

        <div className="studies-controls">
          <div className="industry-filters">
            {industries.map(industry => (
              <button
                key={industry.value}
                className={activeFilter === industry.value ? 'active' : ''}
                onClick={() => setActiveFilter(industry.value)}
              >
                {industry.name}
              </button>
            ))}
          </div>
          <div className="view-toggle">
            <button
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              <FaDesktop /> Grid
            </button>
            <button
              className={viewMode === 'carousel' ? 'active' : ''}
              onClick={() => setViewMode('carousel')}
            >
              <FaMobile /> Carousel
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              className="studies-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  className="study-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleStudyClick(study)}
                >
                  <div className="card-header">
                    <div className="study-icon">{study.icon}</div>
                    <div className="study-info">
                      <h3>{study.title}</h3>
                      <p className="client-name">{study.client}</p>
                    </div>
                  </div>
                  <p className="study-tagline">{study.tagline}</p>
                  <p className="study-overview">{study.overview}</p>
                  
                  <div className="key-metrics">
                    {study.metrics.slice(0, 2).map((metric, idx) => (
                      <div key={idx} className="metric-preview">
                        <div className="metric-icon">{metric.icon}</div>
                        <div className="metric-info">
                          <span className="metric-label">{metric.label}</span>
                          <span className="metric-improvement">{metric.improvement}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer">
                    <div className="study-meta">
                      <span className="industry-tag">{study.industry}</span>
                      <span className="duration">{study.duration}</span>
                    </div>
                    <button className="view-details">
                      View Case Study <FaArrowRight />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="carousel"
              className="studies-carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  className="carousel-slide"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="slide-content">
                    <div className="slide-left">
                      <div className="slide-header">
                        <div className="study-icon-large">{study.icon}</div>
                        <div>
                          <h3>{study.title}</h3>
                          <p className="client-name">{study.client}</p>
                        </div>
                      </div>
                      <p className="study-tagline">{study.tagline}</p>
                      <p className="study-overview">{study.overview}</p>
                      
                      <div className="technologies">
                        <h4>Technologies Used</h4>
                        <div className="tech-tags">
                          {study.technologies.map((tech, idx) => (
                            <span key={idx} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>

                      <button 
                        className="view-full-case"
                        onClick={() => handleStudyClick(study)}
                      >
                        View Full Case Study <FaArrowRight />
                      </button>
                    </div>
                    
                    <div className="slide-right">
                      <div className="metrics-showcase">
                        <h4>Key Results</h4>
                        {study.metrics.map((metric, idx) => (
                          <div key={idx} className="metric-item">
                            <div className="metric-header">
                              {metric.icon}
                              <span>{metric.label}</span>
                            </div>
                            <div className="metric-values">
                              <div className="before">
                                <span className="label">Before</span>
                                <span className="value">{metric.before}</span>
                              </div>
                              <div className="arrow"><FaArrowRight /></div>
                              <div className="after">
                                <span className="label">After</span>
                                <span className="value">{metric.after}</span>
                              </div>
                              <div className="improvement">{metric.improvement}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {selectedStudy && (
          <div className="study-modal" onClick={() => setSelectedStudy(null)}>
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setSelectedStudy(null)}>×</button>
              
              <div className="modal-header">
                <div className="modal-icon">{selectedStudy.icon}</div>
                <div>
                  <h2>{selectedStudy.title}</h2>
                  <p className="modal-client">{selectedStudy.client} • {selectedStudy.industry}</p>
                </div>
              </div>

              <p className="modal-tagline">{selectedStudy.tagline}</p>
              <p className="modal-overview">{selectedStudy.overview}</p>

              <div className="modal-section">
                <h3>Challenges & Solutions</h3>
                <div className="challenges-list">
                  {selectedStudy.challenges.map((challenge, index) => (
                    <div key={index} className="challenge-item">
                      <div className="challenge-header">
                        <FaTimes className="challenge-icon" />
                        <h4>{challenge.title}</h4>
                      </div>
                      <p className="challenge-desc">{challenge.description}</p>
                      <div className="solution">
                        <FaCheck className="solution-icon" />
                        <p>{challenge.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>Impact & Metrics</h3>
                <div className="metrics-grid">
                  {selectedStudy.metrics.map((metric, index) => (
                    <div key={index} className="metric-card">
                      <div className="metric-icon">{metric.icon}</div>
                      <h4>{metric.label}</h4>
                      <div className="metric-change">
                        <span className="before">{metric.before}</span>
                        <FaArrowUp className="arrow-up" />
                        <span className="after">{metric.after}</span>
                      </div>
                      <span className="improvement-badge">{metric.improvement}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>Key Achievements</h3>
                <div className="results-list">
                  {selectedStudy.results.map((result, index) => (
                    <div key={index} className="result-item">
                      <FaTrophy className="result-icon" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="testimonial-section">
                <FaQuoteLeft className="quote-icon" />
                <p className="testimonial-text">{selectedStudy.testimonial.text}</p>
                <div className="testimonial-author">
                  <strong>{selectedStudy.testimonial.author}</strong>
                  <span>{selectedStudy.testimonial.position}, {selectedStudy.testimonial.company}</span>
                </div>
              </div>

              <div className="modal-footer">
                <div className="platforms">
                  <span>Platforms:</span>
                  {selectedStudy.platforms.map((platform, idx) => (
                    <span key={idx} className="platform-tag">{platform}</span>
                  ))}
                </div>
                <div className="duration-info">
                  <FaClock /> Project Duration: {selectedStudy.duration}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;