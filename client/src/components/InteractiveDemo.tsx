import React, { useState, useEffect } from 'react';
import './InteractiveDemo.css';
import { 
  FaPlay, FaPause, FaRedo, FaExpand, FaCompress,
  FaMobile, FaTablet, FaDesktop, FaCode, FaEye,
  FaPalette, FaFont, FaMagic, FaCog, FaDownload,
  FaShareAlt, FaSave, FaHistory, FaLightbulb, FaRocket,
  FaShoppingBag, FaChartBar, FaPaintBrush, FaUtensils,
  FaDumbbell, FaGraduationCap, FaBox, FaChartPie, FaBolt,
  FaWrench, FaChartLine
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

interface Template {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  features: string[];
  primaryColor: string;
  layout: 'modern' | 'classic' | 'minimal' | 'bold';
}

const InteractiveDemo: React.FC = () => {
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null);
  const [deviceView, setDeviceView] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#4F46E5');
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const templates: Template[] = [
    {
      id: 'ecommerce-modern',
      name: 'Modern E-Commerce',
      category: 'E-Commerce',
      thumbnail: 'shopping',
      features: ['Product Grid', 'Shopping Cart', 'Quick View', 'Filters', 'Reviews'],
      primaryColor: '#10B981',
      layout: 'modern'
    },
    {
      id: 'saas-dashboard',
      name: 'SaaS Dashboard',
      category: 'Business',
      thumbnail: 'chart',
      features: ['Analytics', 'Charts', 'User Management', 'Reports', 'Integrations'],
      primaryColor: '#6366F1',
      layout: 'minimal'
    },
    {
      id: 'portfolio-creative',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      thumbnail: 'paint',
      features: ['Gallery', 'About', 'Contact Form', 'Blog', 'Testimonials'],
      primaryColor: '#EC4899',
      layout: 'bold'
    },
    {
      id: 'restaurant-elegant',
      name: 'Restaurant Elegant',
      category: 'Food & Drink',
      thumbnail: 'food',
      features: ['Menu', 'Reservations', 'Gallery', 'Reviews', 'Location'],
      primaryColor: '#F59E0B',
      layout: 'classic'
    },
    {
      id: 'fitness-dynamic',
      name: 'Fitness Studio',
      category: 'Health',
      thumbnail: 'fitness',
      features: ['Classes', 'Trainers', 'Schedule', 'Membership', 'Blog'],
      primaryColor: '#EF4444',
      layout: 'bold'
    },
    {
      id: 'education-platform',
      name: 'Education Platform',
      category: 'Education',
      thumbnail: 'education',
      features: ['Courses', 'Instructors', 'Progress', 'Certificates', 'Forum'],
      primaryColor: '#3B82F6',
      layout: 'modern'
    }
  ];

  const demoFeatures: DemoFeature[] = [
    {
      id: 'play-demo',
      name: 'Auto Play',
      description: 'Watch features in action',
      icon: isPlaying ? <FaPause /> : <FaPlay />,
      action: () => setIsPlaying(!isPlaying)
    },
    {
      id: 'toggle-code',
      name: 'View Code',
      description: 'See the source code',
      icon: showCode ? <FaEye /> : <FaCode />,
      action: () => setShowCode(!showCode)
    },
    {
      id: 'change-color',
      name: 'Color Theme',
      description: 'Customize colors',
      icon: <FaPalette />,
      action: () => {
        const colors = ['#4F46E5', '#10B981', '#EC4899', '#F59E0B', '#EF4444'];
        const currentIndex = colors.indexOf(primaryColor);
        setPrimaryColor(colors[(currentIndex + 1) % colors.length]);
      }
    },
    {
      id: 'toggle-dark',
      name: 'Dark Mode',
      description: 'Switch theme',
      icon: <FaLightbulb />,
      action: () => setDarkMode(!darkMode)
    },
    {
      id: 'font-size',
      name: 'Font Size',
      description: 'Adjust text size',
      icon: <FaFont />,
      action: () => setFontSize(fontSize === 16 ? 18 : fontSize === 18 ? 20 : 16)
    },
    {
      id: 'animations',
      name: 'Animations',
      description: 'Toggle animations',
      icon: <FaMagic />,
      action: () => setAnimations(!animations)
    }
  ];

  useEffect(() => {
    if (isPlaying && templates.length > 0) {
      const interval = setInterval(() => {
        const currentIndex = activeTemplate 
          ? templates.findIndex(t => t.id === activeTemplate.id)
          : -1;
        const nextIndex = (currentIndex + 1) % templates.length;
        setActiveTemplate(templates[nextIndex]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, activeTemplate, templates]);

  const handleTemplateSelect = (template: Template) => {
    setActiveTemplate(template);
    setPrimaryColor(template.primaryColor);
    
    // Add to history
    const newHistory = [...history.slice(0, currentHistoryIndex + 1), template.id];
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const prevIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(prevIndex);
      const template = templates.find(t => t.id === history[prevIndex]);
      if (template) {
        setActiveTemplate(template);
        setPrimaryColor(template.primaryColor);
      }
    }
  };

  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(nextIndex);
      const template = templates.find(t => t.id === history[nextIndex]);
      if (template) {
        setActiveTemplate(template);
        setPrimaryColor(template.primaryColor);
      }
    }
  };

  const getDeviceWidth = () => {
    switch (deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
    }
  };

  const renderPreviewContent = () => {
    if (!activeTemplate) {
      return (
        <div className="demo-placeholder">
          <FaRocket className="placeholder-icon" />
          <h3>Select a Template to Preview</h3>
          <p>Choose from our collection of professionally designed templates</p>
        </div>
      );
    }

    if (showCode) {
      return (
        <div className="code-preview">
          <pre>
            <code>
{`// ${activeTemplate.name} Template
import React from 'react';
import { motion } from 'framer-motion';

const ${activeTemplate.name.replace(/\s+/g, '')} = () => {
  return (
    <div className="${activeTemplate.layout}-layout"
         style={{ 
           color: '${primaryColor}',
           fontSize: '${fontSize}px',
           theme: '${darkMode ? 'dark' : 'light'}'
         }}>
      {/* Template Components */}
      ${activeTemplate.features.map(f => `<${f.replace(/\s+/g, '')} />`).join('\n      ')}
    </div>
  );
};

export default ${activeTemplate.name.replace(/\s+/g, '')};`}
            </code>
          </pre>
        </div>
      );
    }

    return (
      <div 
        className={`template-preview ${activeTemplate.layout} ${darkMode ? 'dark' : ''}`}
        style={{ 
          '--primary-color': primaryColor,
          fontSize: `${fontSize}px`
        } as React.CSSProperties}
      >
        <div className="preview-header">
          <div className="preview-nav">
            <span className="logo">
              {activeTemplate.thumbnail === 'shopping' && <FaShoppingBag />}
              {activeTemplate.thumbnail === 'chart' && <FaChartBar />}
              {activeTemplate.thumbnail === 'paint' && <FaPaintBrush />}
              {activeTemplate.thumbnail === 'food' && <FaUtensils />}
              {activeTemplate.thumbnail === 'fitness' && <FaDumbbell />}
              {activeTemplate.thumbnail === 'education' && <FaGraduationCap />}
            </span>
            <nav>
              {activeTemplate.features.slice(0, 4).map(feature => (
                <a key={feature} href="#" onClick={(e) => e.preventDefault()}>
                  {feature}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="preview-hero">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTemplate.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Experience the power of modern web design
          </motion.p>
          <motion.button
            className="cta-button"
            whileHover={{ scale: animations ? 1.05 : 1 }}
            whileTap={{ scale: animations ? 0.95 : 1 }}
            style={{ backgroundColor: primaryColor }}
          >
            Get Started
          </motion.button>
        </div>

        <div className="preview-features">
          {activeTemplate.features.map((feature, index) => (
            <motion.div
              key={feature}
              className="feature-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="feature-icon" style={{ color: primaryColor }}>
                {index % 5 === 0 && <FaBox />}
                {index % 5 === 1 && <FaChartPie />}
                {index % 5 === 2 && <FaBolt />}
                {index % 5 === 3 && <FaWrench />}
                {index % 5 === 4 && <FaChartLine />}
              </div>
              <h3>{feature}</h3>
              <p>Powerful {feature.toLowerCase()} functionality</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="interactive-demo">
      <div className="container">
        <motion.div 
          className="demo-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Interactive Demo Playground</h2>
          <p>Explore and customize our templates in real-time</p>
        </motion.div>

        <div className="demo-container">
          <div className="demo-sidebar">
            <div className="template-selector">
              <h3>Choose Template</h3>
              <div className="template-grid">
                {templates.map(template => (
                  <motion.div
                    key={template.id}
                    className={`template-card ${activeTemplate?.id === template.id ? 'active' : ''}`}
                    onClick={() => handleTemplateSelect(template)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="template-thumbnail">
                      {template.thumbnail === 'shopping' && <FaShoppingBag />}
                      {template.thumbnail === 'chart' && <FaChartBar />}
                      {template.thumbnail === 'paint' && <FaPaintBrush />}
                      {template.thumbnail === 'food' && <FaUtensils />}
                      {template.thumbnail === 'fitness' && <FaDumbbell />}
                      {template.thumbnail === 'education' && <FaGraduationCap />}
                    </div>
                    <div className="template-info">
                      <h4>{template.name}</h4>
                      <span>{template.category}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="demo-controls">
              <h3>Customization</h3>
              <div className="control-grid">
                {demoFeatures.map(feature => (
                  <motion.button
                    key={feature.id}
                    className="control-button"
                    onClick={feature.action}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={feature.description}
                  >
                    {feature.icon}
                    <span>{feature.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="history-controls">
              <button 
                onClick={handleUndo} 
                disabled={currentHistoryIndex <= 0}
                title="Undo"
              >
                <FaHistory /> Undo
              </button>
              <button 
                onClick={handleRedo}
                disabled={currentHistoryIndex >= history.length - 1}
                title="Redo"
              >
                <FaRedo /> Redo
              </button>
            </div>
          </div>

          <div className="demo-preview">
            <div className="preview-toolbar">
              <div className="device-selector">
                <button
                  className={deviceView === 'mobile' ? 'active' : ''}
                  onClick={() => setDeviceView('mobile')}
                >
                  <FaMobile />
                </button>
                <button
                  className={deviceView === 'tablet' ? 'active' : ''}
                  onClick={() => setDeviceView('tablet')}
                >
                  <FaTablet />
                </button>
                <button
                  className={deviceView === 'desktop' ? 'active' : ''}
                  onClick={() => setDeviceView('desktop')}
                >
                  <FaDesktop />
                </button>
              </div>

              <div className="preview-actions">
                <button title="Fullscreen">
                  <FaExpand />
                </button>
                <button title="Share">
                  <FaShareAlt />
                </button>
                <button title="Download">
                  <FaDownload />
                </button>
                <button title="Save">
                  <FaSave />
                </button>
              </div>
            </div>

            <div 
              className="preview-frame"
              style={{ 
                width: getDeviceWidth(),
                margin: deviceView !== 'desktop' ? '0 auto' : '0'
              }}
            >
              <AnimatePresence mode="wait">
                {renderPreviewContent()}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <motion.div 
          className="demo-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="demo-stats">
            <div className="stat">
              <span className="stat-value">50+</span>
              <span className="stat-label">Templates</span>
            </div>
            <div className="stat">
              <span className="stat-value">1000+</span>
              <span className="stat-label">Customizations</span>
            </div>
            <div className="stat">
              <span className="stat-value">100%</span>
              <span className="stat-label">Responsive</span>
            </div>
            <div className="stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Coding Required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveDemo;