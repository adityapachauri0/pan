import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaLightbulb, FaPencilRuler, FaCode, FaRocket, FaChartLine, FaHandshake,
  FaSearch, FaPalette, FaMobileAlt, FaBug, FaServer, FaShieldAlt,
  FaCheckCircle, FaClock, FaUsers, FaComments
} from 'react-icons/fa';
import './ProcessTimeline.css';

interface ProcessPhase {
  id: number;
  phase: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  color: string;
  activities: string[];
  deliverables: string[];
  tools: string[];
}

const processPhases: ProcessPhase[] = [
  {
    id: 1,
    phase: 'Discovery',
    title: 'Understanding Your Vision',
    description: 'We dive deep into your business goals, target audience, and project requirements to create a solid foundation.',
    icon: <FaLightbulb />,
    duration: '1-2 weeks',
    color: '#FF6B6B',
    activities: [
      'Stakeholder interviews',
      'Market research',
      'Competitor analysis',
      'Requirements gathering'
    ],
    deliverables: [
      'Project brief',
      'User personas',
      'Project roadmap',
      'Success metrics'
    ],
    tools: ['Figma', 'Miro', 'Google Analytics', 'Hotjar']
  },
  {
    id: 2,
    phase: 'Strategy',
    title: 'Planning for Success',
    description: 'We develop a comprehensive strategy that aligns with your business objectives and user needs.',
    icon: <FaSearch />,
    duration: '1 week',
    color: '#4ECDC4',
    activities: [
      'Information architecture',
      'User journey mapping',
      'Content strategy',
      'Technical planning'
    ],
    deliverables: [
      'Site map',
      'User flows',
      'Technical specifications',
      'Project timeline'
    ],
    tools: ['Whimsical', 'Notion', 'Jira', 'Confluence']
  },
  {
    id: 3,
    phase: 'Design',
    title: 'Crafting Visual Excellence',
    description: 'Our designers create stunning, user-centric designs that bring your brand to life.',
    icon: <FaPalette />,
    duration: '2-3 weeks',
    color: '#FFD93D',
    activities: [
      'Wireframing',
      'Visual design',
      'Prototype creation',
      'Design system development'
    ],
    deliverables: [
      'Wireframes',
      'High-fidelity mockups',
      'Interactive prototypes',
      'Design system'
    ],
    tools: ['Figma', 'Adobe Creative Suite', 'Principle', 'Zeplin']
  },
  {
    id: 4,
    phase: 'Development',
    title: 'Building Your Solution',
    description: 'Our developers bring designs to life with clean, efficient, and scalable code.',
    icon: <FaCode />,
    duration: '4-8 weeks',
    color: '#6BCF7F',
    activities: [
      'Frontend development',
      'Backend development',
      'API integration',
      'Database setup'
    ],
    deliverables: [
      'Functional website',
      'Admin panel',
      'API documentation',
      'Source code'
    ],
    tools: ['React', 'Node.js', 'MongoDB', 'AWS', 'Git']
  },
  {
    id: 5,
    phase: 'Testing',
    title: 'Ensuring Perfection',
    description: 'Rigorous testing ensures your website performs flawlessly across all devices and scenarios.',
    icon: <FaBug />,
    duration: '1-2 weeks',
    color: '#A78BFA',
    activities: [
      'Functionality testing',
      'Performance testing',
      'Security testing',
      'User acceptance testing'
    ],
    deliverables: [
      'Test reports',
      'Bug fixes',
      'Performance optimization',
      'Security audit'
    ],
    tools: ['Jest', 'Cypress', 'Lighthouse', 'BrowserStack']
  },
  {
    id: 6,
    phase: 'Launch',
    title: 'Going Live',
    description: 'We ensure a smooth launch with proper deployment, monitoring, and optimization.',
    icon: <FaRocket />,
    duration: '1 week',
    color: '#FF6B6B',
    activities: [
      'Server deployment',
      'Domain configuration',
      'SSL setup',
      'Analytics integration'
    ],
    deliverables: [
      'Live website',
      'Deployment documentation',
      'Analytics dashboard',
      'SEO optimization'
    ],
    tools: ['AWS', 'Vercel', 'Cloudflare', 'Google Analytics']
  },
  {
    id: 7,
    phase: 'Growth',
    title: 'Continuous Improvement',
    description: 'Post-launch support and optimization to ensure continued success and growth.',
    icon: <FaChartLine />,
    duration: 'Ongoing',
    color: '#4ECDC4',
    activities: [
      'Performance monitoring',
      'A/B testing',
      'Content updates',
      'Feature enhancements'
    ],
    deliverables: [
      'Monthly reports',
      'Optimization recommendations',
      'New features',
      'Maintenance updates'
    ],
    tools: ['Google Analytics', 'Hotjar', 'Optimizely', 'Contentful']
  }
];

const ProcessTimeline: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const phase = processPhases[activePhase];

  return (
    <section className="process-timeline-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="timeline-header"
        >
          <span className="section-label">Our Process</span>
          <h2 className="section-title">
            How We <span className="gradient-text">Build Success</span>
          </h2>
          <p className="section-description">
            A proven, systematic approach to delivering exceptional digital solutions
          </p>
        </motion.div>

        <div className="timeline-container">
          <div className="timeline-track">
            <div className="timeline-progress" style={{ width: `${((activePhase + 1) / processPhases.length) * 100}%` }} />
            
            <div className="timeline-nodes">
              {processPhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  className={`timeline-node ${index === activePhase ? 'active' : ''} ${index < activePhase ? 'completed' : ''}`}
                  onClick={() => setActivePhase(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className="node-circle"
                    style={{ 
                      borderColor: index <= activePhase ? phase.color : '#ddd',
                      background: index <= activePhase ? phase.color : 'white'
                    }}
                  >
                    <span className="node-icon" style={{ color: index <= activePhase ? 'white' : '#999' }}>
                      {phase.icon}
                    </span>
                  </div>
                  <span className="node-label">{phase.phase}</span>
                  <span className="node-duration">{phase.duration}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            key={activePhase}
            className="phase-details"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="phase-header">
              <div 
                className="phase-icon"
                style={{ background: `linear-gradient(135deg, ${phase.color}20 0%, ${phase.color}10 100%)` }}
              >
                <span style={{ color: phase.color }}>{phase.icon}</span>
              </div>
              <div className="phase-info">
                <h3>{phase.title}</h3>
                <p>{phase.description}</p>
                <div className="phase-meta">
                  <span><FaClock /> {phase.duration}</span>
                  <span><FaUsers /> Collaborative Process</span>
                </div>
              </div>
            </div>

            <div className={`phase-content ${isExpanded ? 'expanded' : ''}`}>
              <div className="content-grid">
                <div className="content-section">
                  <h4>
                    <FaCheckCircle /> Key Activities
                  </h4>
                  <ul>
                    {phase.activities.map((activity, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {activity}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="content-section">
                  <h4>
                    <FaHandshake /> Deliverables
                  </h4>
                  <ul>
                    {phase.deliverables.map((deliverable, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {deliverable}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="content-section">
                  <h4>
                    <FaServer /> Tools & Technologies
                  </h4>
                  <div className="tools-list">
                    {phase.tools.map((tool, index) => (
                      <motion.span
                        key={index}
                        className="tool-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                className="expand-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Show More Details'}
              </button>
            </div>

            <div className="phase-navigation">
              <button 
                className="nav-btn prev"
                onClick={() => setActivePhase(Math.max(0, activePhase - 1))}
                disabled={activePhase === 0}
              >
                ← Previous Phase
              </button>
              <div className="phase-indicator">
                Phase {activePhase + 1} of {processPhases.length}
              </div>
              <button 
                className="nav-btn next"
                onClick={() => setActivePhase(Math.min(processPhases.length - 1, activePhase + 1))}
                disabled={activePhase === processPhases.length - 1}
              >
                Next Phase →
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="timeline-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="cta-content">
            <div className="cta-text">
              <h3>Ready to Start Your Journey?</h3>
              <p>Let's work together to bring your vision to life through our proven process</p>
            </div>
            <div className="cta-buttons">
              <button className="cta-button primary">
                <FaComments /> Schedule Consultation
              </button>
              <button className="cta-button secondary">
                <FaChartLine /> View Case Studies
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessTimeline;