import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaReact, FaNodeJs, FaPython, FaAws, FaDocker,
  FaFigma, FaVuejs, FaAngular, FaJava, FaPhp, 
  FaDatabase, FaMobile, FaPaintBrush, FaCode, 
  FaServer, FaCloud, FaShieldAlt, FaChartLine,
  FaGitAlt, FaCss3Alt, FaHtml5, FaSass, FaLaravel,
  FaWordpress, FaShopify, FaStripe, FaPaypal, FaGoogle
} from 'react-icons/fa';
import { 
  SiTypescript, SiGraphql, SiMongodb, SiPostgresql,
  SiRedis, SiKubernetes, SiTerraform, SiJenkins,
  SiAdobexd, SiTailwindcss, SiNextdotjs, SiNestjs,
  SiExpress, SiDjango, SiFlask, SiRubyonrails,
  SiFlutter, SiSwift, SiKotlin, SiFirebase,
  SiSupabase, SiPrisma, SiWebpack, SiVite,
  SiJest, SiCypress, SiStorybook, SiElasticsearch
} from 'react-icons/si';
import './SkillsMatrix.css';

interface Skill {
  name: string;
  icon: React.ReactNode;
  category: string;
  level: 'Expert' | 'Advanced' | 'Intermediate';
  projects: number;
  yearsUsed: number;
}

const skillsData: Skill[] = [
  // Frontend
  { name: 'React', icon: <FaReact />, category: 'Frontend', level: 'Expert', projects: 150, yearsUsed: 6 },
  { name: 'TypeScript', icon: <SiTypescript />, category: 'Frontend', level: 'Expert', projects: 120, yearsUsed: 4 },
  { name: 'Next.js', icon: <SiNextdotjs />, category: 'Frontend', level: 'Expert', projects: 85, yearsUsed: 3 },
  { name: 'Vue.js', icon: <FaVuejs />, category: 'Frontend', level: 'Advanced', projects: 45, yearsUsed: 3 },
  { name: 'Angular', icon: <FaAngular />, category: 'Frontend', level: 'Advanced', projects: 38, yearsUsed: 4 },
  { name: 'Tailwind CSS', icon: <SiTailwindcss />, category: 'Frontend', level: 'Expert', projects: 95, yearsUsed: 3 },
  { name: 'Sass', icon: <FaSass />, category: 'Frontend', level: 'Expert', projects: 110, yearsUsed: 5 },
  { name: 'Webpack', icon: <SiWebpack />, category: 'Frontend', level: 'Advanced', projects: 70, yearsUsed: 4 },
  { name: 'Vite', icon: <SiVite />, category: 'Frontend', level: 'Advanced', projects: 40, yearsUsed: 2 },
  
  // Backend
  { name: 'Node.js', icon: <FaNodeJs />, category: 'Backend', level: 'Expert', projects: 140, yearsUsed: 7 },
  { name: 'Express', icon: <SiExpress />, category: 'Backend', level: 'Expert', projects: 120, yearsUsed: 6 },
  { name: 'NestJS', icon: <SiNestjs />, category: 'Backend', level: 'Advanced', projects: 35, yearsUsed: 2 },
  { name: 'Python', icon: <FaPython />, category: 'Backend', level: 'Expert', projects: 95, yearsUsed: 8 },
  { name: 'Django', icon: <SiDjango />, category: 'Backend', level: 'Advanced', projects: 42, yearsUsed: 4 },
  { name: 'Flask', icon: <SiFlask />, category: 'Backend', level: 'Advanced', projects: 38, yearsUsed: 3 },
  { name: 'PHP', icon: <FaPhp />, category: 'Backend', level: 'Intermediate', projects: 55, yearsUsed: 5 },
  { name: 'Laravel', icon: <FaLaravel />, category: 'Backend', level: 'Intermediate', projects: 30, yearsUsed: 3 },
  { name: 'GraphQL', icon: <SiGraphql />, category: 'Backend', level: 'Advanced', projects: 65, yearsUsed: 3 },
  
  // Database
  { name: 'PostgreSQL', icon: <SiPostgresql />, category: 'Database', level: 'Expert', projects: 110, yearsUsed: 6 },
  { name: 'MongoDB', icon: <SiMongodb />, category: 'Database', level: 'Expert', projects: 95, yearsUsed: 5 },
  { name: 'Redis', icon: <SiRedis />, category: 'Database', level: 'Advanced', projects: 70, yearsUsed: 4 },
  { name: 'Elasticsearch', icon: <SiElasticsearch />, category: 'Database', level: 'Advanced', projects: 35, yearsUsed: 3 },
  { name: 'Prisma', icon: <SiPrisma />, category: 'Database', level: 'Advanced', projects: 45, yearsUsed: 2 },
  { name: 'Supabase', icon: <SiSupabase />, category: 'Database', level: 'Advanced', projects: 28, yearsUsed: 2 },
  
  // Cloud & DevOps
  { name: 'AWS', icon: <FaAws />, category: 'Cloud', level: 'Expert', projects: 85, yearsUsed: 5 },
  { name: 'Docker', icon: <FaDocker />, category: 'DevOps', level: 'Expert', projects: 100, yearsUsed: 5 },
  { name: 'Kubernetes', icon: <SiKubernetes />, category: 'DevOps', level: 'Advanced', projects: 45, yearsUsed: 3 },
  { name: 'Terraform', icon: <SiTerraform />, category: 'DevOps', level: 'Advanced', projects: 38, yearsUsed: 3 },
  { name: 'Jenkins', icon: <SiJenkins />, category: 'DevOps', level: 'Intermediate', projects: 52, yearsUsed: 4 },
  { name: 'Firebase', icon: <SiFirebase />, category: 'Cloud', level: 'Advanced', projects: 65, yearsUsed: 4 },
  
  // Design
  { name: 'Figma', icon: <FaFigma />, category: 'Design', level: 'Expert', projects: 120, yearsUsed: 4 },
  { name: 'Adobe XD', icon: <SiAdobexd />, category: 'Design', level: 'Advanced', projects: 75, yearsUsed: 5 },
  
  // Mobile
  { name: 'React Native', icon: <FaMobile />, category: 'Mobile', level: 'Expert', projects: 48, yearsUsed: 4 },
  { name: 'Flutter', icon: <SiFlutter />, category: 'Mobile', level: 'Advanced', projects: 25, yearsUsed: 2 },
  { name: 'Swift', icon: <SiSwift />, category: 'Mobile', level: 'Intermediate', projects: 18, yearsUsed: 3 },
  { name: 'Kotlin', icon: <SiKotlin />, category: 'Mobile', level: 'Intermediate', projects: 15, yearsUsed: 2 },
  
  // Testing
  { name: 'Jest', icon: <SiJest />, category: 'Testing', level: 'Expert', projects: 110, yearsUsed: 5 },
  { name: 'Cypress', icon: <SiCypress />, category: 'Testing', level: 'Advanced', projects: 65, yearsUsed: 3 },
  { name: 'Storybook', icon: <SiStorybook />, category: 'Testing', level: 'Advanced', projects: 45, yearsUsed: 3 },
  
  // E-Commerce
  { name: 'Shopify', icon: <FaShopify />, category: 'E-Commerce', level: 'Advanced', projects: 35, yearsUsed: 3 },
  { name: 'WordPress', icon: <FaWordpress />, category: 'E-Commerce', level: 'Advanced', projects: 60, yearsUsed: 6 },
  { name: 'Stripe', icon: <FaStripe />, category: 'E-Commerce', level: 'Expert', projects: 85, yearsUsed: 4 },
  { name: 'PayPal', icon: <FaPaypal />, category: 'E-Commerce', level: 'Advanced', projects: 70, yearsUsed: 5 }
];

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Design', 'Mobile', 'Testing', 'E-Commerce'];

const SkillsMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredSkills = selectedCategory === 'All' 
    ? skillsData 
    : skillsData.filter(skill => skill.category === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return '#4CAF50';
      case 'Advanced': return '#2196F3';
      case 'Intermediate': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getCategoryStats = (category: string) => {
    const skills = category === 'All' ? skillsData : skillsData.filter(s => s.category === category);
    const totalProjects = skills.reduce((sum, skill) => sum + skill.projects, 0);
    const avgYears = Math.round(skills.reduce((sum, skill) => sum + skill.yearsUsed, 0) / skills.length * 10) / 10;
    return { count: skills.length, projects: totalProjects, avgYears };
  };

  return (
    <section className="skills-matrix">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Our Technology Stack</h2>
          <p>Comprehensive expertise across modern web technologies</p>
        </motion.div>

        <motion.div 
          className="matrix-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="category-filters">
            {categories.map(category => {
              const stats = getCategoryStats(category);
              return (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  <span className="category-name">{category}</span>
                  <span className="category-count">{stats.count}</span>
                </button>
              );
            })}
          </div>

          <div className="view-toggles">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </motion.div>

        {viewMode === 'grid' ? (
          <motion.div 
            className="skills-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="skill-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.05 }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
                style={{ '--level-color': getLevelColor(skill.level) } as React.CSSProperties}
              >
                <div className="skill-icon">{skill.icon}</div>
                <h3 className="skill-name">{skill.name}</h3>
                <span className={`skill-level ${skill.level.toLowerCase()}`}>
                  {skill.level}
                </span>
                
                <div className="skill-stats">
                  <div className="stat">
                    <span className="stat-value">{skill.projects}</span>
                    <span className="stat-label">Projects</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{skill.yearsUsed}y</span>
                    <span className="stat-label">Experience</span>
                  </div>
                </div>

                {hoveredSkill === skill.name && (
                  <motion.div 
                    className="skill-tooltip"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <strong>{skill.name}</strong>
                    <p>Category: {skill.category}</p>
                    <p>Used in {skill.projects} projects</p>
                    <p>{skill.yearsUsed} years of experience</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="skills-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="list-header">
              <span>Technology</span>
              <span>Category</span>
              <span>Expertise</span>
              <span>Projects</span>
              <span>Experience</span>
            </div>
            {filteredSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="skill-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
              >
                <div className="skill-info">
                  <span className="skill-icon">{skill.icon}</span>
                  <span className="skill-name">{skill.name}</span>
                </div>
                <span className="skill-category">{skill.category}</span>
                <span className={`skill-level ${skill.level.toLowerCase()}`}>
                  {skill.level}
                </span>
                <span className="skill-projects">{skill.projects}</span>
                <span className="skill-years">{skill.yearsUsed} years</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="matrix-summary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="summary-card">
            <FaCode />
            <div>
              <span className="summary-value">{skillsData.length}</span>
              <span className="summary-label">Technologies</span>
            </div>
          </div>
          <div className="summary-card">
            <FaChartLine />
            <div>
              <span className="summary-value">
                {skillsData.reduce((sum, skill) => sum + skill.projects, 0)}
              </span>
              <span className="summary-label">Total Projects</span>
            </div>
          </div>
          <div className="summary-card">
            <FaServer />
            <div>
              <span className="summary-value">{categories.length - 1}</span>
              <span className="summary-label">Categories</span>
            </div>
          </div>
          <div className="summary-card">
            <FaShieldAlt />
            <div>
              <span className="summary-value">
                {skillsData.filter(s => s.level === 'Expert').length}
              </span>
              <span className="summary-label">Expert Skills</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsMatrix;