import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { FaUsers, FaRocket, FaTrophy, FaClock, FaChartLine, FaStar, FaCode, FaGlobe } from 'react-icons/fa';
import './AnimatedStats.css';

interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const stats: StatItem[] = [
  {
    id: 1,
    label: 'Projects Completed',
    value: 150,
    suffix: '+',
    icon: <FaRocket />,
    color: '#4ECDC4',
    description: 'Successfully delivered web solutions'
  },
  {
    id: 2,
    label: 'Client Satisfaction',
    value: 98,
    suffix: '%',
    icon: <FaStar />,
    color: '#FFD93D',
    description: 'Average client rating score'
  },
  {
    id: 3,
    label: 'Years Experience',
    value: 10,
    suffix: '+',
    icon: <FaTrophy />,
    color: '#6BCF7F',
    description: 'Building digital excellence'
  },
  {
    id: 4,
    label: 'Team Members',
    value: 25,
    suffix: '+',
    icon: <FaUsers />,
    color: '#FF6B6B',
    description: 'Expert developers and designers'
  },
  {
    id: 5,
    label: 'Lines of Code',
    value: 2000000,
    suffix: '+',
    icon: <FaCode />,
    color: '#4E5D78',
    description: 'Clean, efficient code written'
  },
  {
    id: 6,
    label: 'Global Clients',
    value: 45,
    suffix: '+',
    icon: <FaGlobe />,
    color: '#A78BFA',
    description: 'Clients across continents'
  },
  {
    id: 7,
    label: 'Support Available',
    value: 24,
    suffix: '/7',
    icon: <FaClock />,
    color: '#FCA5A5',
    description: 'Round-the-clock assistance'
  },
  {
    id: 8,
    label: 'Revenue Growth',
    value: 320,
    suffix: '%',
    prefix: '+',
    icon: <FaChartLine />,
    color: '#34D399',
    description: 'Average client revenue increase'
  }
];

interface AnimatedNumberProps {
  value: number;
  inView: boolean;
  duration?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, inView, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  
  useEffect(() => {
    if (inView) {
      spring.set(value);
    } else {
      spring.set(0);
    }
  }, [inView, value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.floor(latest));
    });
    return unsubscribe;
  }, [spring]);

  // Format large numbers with commas
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return <span>{formatNumber(displayValue)}</span>;
};

const AnimatedStats: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <section className="animated-stats-section" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="stats-header"
        >
          <span className="section-label">By The Numbers</span>
          <h2 className="section-title">
            Our Impact in <span className="gradient-text">Real Numbers</span>
          </h2>
          <p className="section-description">
            Measurable results that speak louder than words
          </p>
        </motion.div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
            >
              <div 
                className="stat-icon-wrapper"
                style={{ background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)` }}
              >
                <div className="stat-icon" style={{ color: stat.color }}>
                  {stat.icon}
                </div>
              </div>
              
              <div className="stat-content">
                <div className="stat-value-wrapper">
                  <span className="stat-prefix">{stat.prefix}</span>
                  <span className="stat-value" style={{ color: stat.color }}>
                    <AnimatedNumber value={stat.value} inView={isInView} />
                  </span>
                  <span className="stat-suffix">{stat.suffix}</span>
                </div>
                <h3 className="stat-label">{stat.label}</h3>
                <p className="stat-description">{stat.description}</p>
              </div>

              <div className="stat-background-decoration">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path 
                    fill={`${stat.color}10`}
                    d="M47.6,-57.7C59.8,-47.8,66.7,-31.2,68.5,-14.1C70.3,3,67,20.5,58.9,35.3C50.8,50.1,37.9,62.2,22.4,66.8C6.9,71.4,-11.2,68.5,-27.5,61.3C-43.8,54.1,-58.3,42.6,-65.7,27.4C-73.1,12.2,-73.4,-6.6,-68.3,-23.5C-63.2,-40.4,-52.7,-55.3,-38.5,-64.8C-24.3,-74.3,-6.4,-78.4,10.7,-77.9C27.8,-77.5,35.4,-67.6,47.6,-57.7Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="stats-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3>Want to Be Part of These Numbers?</h3>
          <p>Join hundreds of satisfied clients who have transformed their digital presence</p>
          <button className="cta-button primary">Start Your Success Story</button>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedStats;