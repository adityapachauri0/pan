import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { FaShoppingBag, FaPaintBrush, FaChartLine } from 'react-icons/fa';
import './TechRadar.css';

interface TechData {
  technology: string;
  expertise: number;
  projects: number;
  description: string;
  icon: string;
}

const techStackData: TechData[] = [
  {
    technology: 'React/Next.js',
    expertise: 95,
    projects: 85,
    description: 'Modern web applications with optimal performance',
    icon: '⚛️'
  },
  {
    technology: 'WordPress/WooCommerce',
    expertise: 92,
    projects: 120,
    description: 'Custom e-commerce solutions and CMS development',
    icon: '🔵'
  },
  {
    technology: 'Node.js/TypeScript',
    expertise: 90,
    projects: 78,
    description: 'Scalable backend APIs with type-safe development',
    icon: '🟢'
  },
  {
    technology: 'React Native/Flutter',
    expertise: 85,
    projects: 45,
    description: 'Cross-platform mobile apps for iOS and Android',
    icon: '📱'
  },
  {
    technology: 'Shopify',
    expertise: 88,
    projects: 65,
    description: 'Complete e-commerce platforms with custom features',
    icon: 'shopping'
  },
  {
    technology: 'UI/UX Design',
    expertise: 93,
    projects: 95,
    description: 'Wireframing, prototyping, and user research',
    icon: 'design'
  },
  {
    technology: 'SEO & Marketing',
    expertise: 87,
    projects: 80,
    description: 'On-page SEO, Google Ads, and analytics',
    icon: 'analytics'
  },
  {
    technology: 'AWS/Cloud',
    expertise: 82,
    projects: 55,
    description: 'Cloud infrastructure and DevOps solutions',
    icon: '☁️'
  }
];

const TechRadar: React.FC = () => {
  const [selectedTech, setSelectedTech] = useState<TechData | null>(null);
  const [activeDataKey, setActiveDataKey] = useState<'expertise' | 'projects'>('expertise');

  const radarData = techStackData.map(tech => ({
    technology: tech.technology,
    expertise: tech.expertise,
    projects: tech.projects,
    fullMark: 100
  }));

  const handleTechClick = (tech: string) => {
    const selected = techStackData.find(t => t.technology === tech);
    setSelectedTech(selected || null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const tech = techStackData.find(t => t.technology === payload[0].payload.technology);
      return (
        <div className="tech-radar-tooltip">
          <p className="tech-name">{tech?.icon} {payload[0].payload.technology}</p>
          <p className="tech-value">Expertise: {payload[0].payload.expertise}%</p>
          <p className="tech-value">Projects: {payload[0].payload.projects}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="tech-radar-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="tech-radar-header"
        >
          <span className="section-label">Technical Expertise</span>
          <h2 className="section-title">
            Our Technology <span className="gradient-text">Proficiency Map</span>
          </h2>
          <p className="section-description">
            Interactive visualization of our technical expertise across different technologies and frameworks
          </p>
        </motion.div>

        <div className="tech-radar-container">
          <motion.div 
            className="radar-chart-wrapper"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="data-toggle">
              <button 
                className={`toggle-btn ${activeDataKey === 'expertise' ? 'active' : ''}`}
                onClick={() => setActiveDataKey('expertise')}
              >
                Expertise Level
              </button>
              <button 
                className={`toggle-btn ${activeDataKey === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveDataKey('projects')}
              >
                Project Count
              </button>
            </div>

            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={radarData}>
                <PolarGrid 
                  gridType="polygon"
                  radialLines={true}
                  stroke="#e0e0e0"
                  strokeDasharray="3 3"
                />
                <PolarAngleAxis 
                  dataKey="technology"
                  tick={{ fill: '#666', fontSize: 12 }}
                  className="radar-axis"
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#999', fontSize: 10 }}
                  tickCount={6}
                />
                <Radar
                  name="Expertise"
                  dataKey={activeDataKey}
                  stroke="#4ECDC4"
                  fill="#4ECDC4"
                  fillOpacity={0.25}
                  strokeWidth={2.5}
                  animationDuration={1500}
                  animationBegin={0}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>

            <div className="radar-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#4ECDC4' }}></span>
                <span>{activeDataKey === 'expertise' ? 'Expertise Level (%)' : 'Projects Completed'}</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="tech-cards-grid"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {techStackData.map((tech, index) => (
              <motion.div
                key={tech.technology}
                className={`tech-card ${selectedTech?.technology === tech.technology ? 'selected' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleTechClick(tech.technology)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="tech-card-header">
                  <span className="tech-icon">{tech.icon}</span>
                  <h4>{tech.technology}</h4>
                </div>
                <p className="tech-description">{tech.description}</p>
                <div className="tech-stats">
                  <div className="stat">
                    <span className="stat-value">{tech.expertise}%</span>
                    <span className="stat-label">Expertise</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{tech.projects}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                </div>
                <div className="expertise-bar">
                  <motion.div 
                    className="expertise-fill"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tech.expertise}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {selectedTech && (
          <motion.div 
            className="tech-detail-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <button className="close-btn" onClick={() => setSelectedTech(null)}>×</button>
            <h3>{selectedTech.icon} {selectedTech.technology}</h3>
            <p>{selectedTech.description}</p>
            <div className="detail-stats">
              <div>Expertise Level: <strong>{selectedTech.expertise}%</strong></div>
              <div>Projects Completed: <strong>{selectedTech.projects}</strong></div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TechRadar;