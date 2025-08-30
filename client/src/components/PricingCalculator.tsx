import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheck, FaTimes, FaRocket, FaShieldAlt, FaCrown, 
  FaPlus, FaMinus, FaInfoCircle, FaStar, FaLock,
  FaCode, FaPalette, FaMobile, FaServer, FaChartLine,
  FaHeadset, FaTools, FaGlobe, FaDatabase, FaCloud, FaClock
} from 'react-icons/fa';
import './PricingCalculator.css';

interface Feature {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: React.ReactNode;
  category: string;
  required?: boolean;
  popular?: boolean;
}

interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  icon: React.ReactNode;
  color: string;
  features: string[];
  highlight?: boolean;
}

const features: Feature[] = [
  // Design Features
  {
    id: 'custom-design',
    name: 'Custom Design',
    description: 'Unique, branded design tailored to your business',
    basePrice: 750,
    icon: <FaPalette />,
    category: 'Design',
    required: true
  },
  {
    id: 'responsive-design',
    name: 'Responsive Design',
    description: 'Perfect display on all devices',
    basePrice: 300,
    icon: <FaMobile />,
    category: 'Design',
    required: true
  },
  {
    id: 'ui-ux',
    name: 'Advanced UI/UX',
    description: 'User research and optimized user experience',
    basePrice: 600,
    icon: <FaPalette />,
    category: 'Design',
    popular: true
  },
  {
    id: 'animations',
    name: 'Custom Animations',
    description: 'Engaging animations and micro-interactions',
    basePrice: 450,
    icon: <FaRocket />,
    category: 'Design'
  },
  
  // Development Features
  {
    id: 'cms',
    name: 'Content Management System',
    description: 'Easy content updates without coding',
    basePrice: 600,
    icon: <FaTools />,
    category: 'Development',
    popular: true
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Functionality',
    description: 'Complete online store with payment processing',
    basePrice: 1200,
    icon: <FaShieldAlt />,
    category: 'Development'
  },
  {
    id: 'api-integration',
    name: 'API Integrations',
    description: 'Connect with third-party services',
    basePrice: 450,
    icon: <FaCloud />,
    category: 'Development'
  },
  {
    id: 'database',
    name: 'Database Setup',
    description: 'Structured data storage and management',
    basePrice: 540,
    icon: <FaDatabase />,
    category: 'Development'
  },
  {
    id: 'auth',
    name: 'User Authentication',
    description: 'Secure login and user management',
    basePrice: 360,
    icon: <FaLock />,
    category: 'Development'
  },
  
  // Marketing Features
  {
    id: 'seo',
    name: 'SEO Optimization',
    description: 'On-page SEO for better rankings',
    basePrice: 450,
    icon: <FaChartLine />,
    category: 'Marketing',
    popular: true
  },
  {
    id: 'analytics',
    name: 'Analytics Setup',
    description: 'Track visitor behavior and conversions',
    basePrice: 150,
    icon: <FaChartLine />,
    category: 'Marketing'
  },
  {
    id: 'social-integration',
    name: 'Social Media Integration',
    description: 'Connect and share to social platforms',
    basePrice: 240,
    icon: <FaGlobe />,
    category: 'Marketing'
  },
  
  // Support Features
  {
    id: 'training',
    name: 'Team Training',
    description: '4 hours of personalized training',
    basePrice: 240,
    icon: <FaHeadset />,
    category: 'Support'
  },
  {
    id: 'support-3',
    name: '3 Months Support',
    description: 'Priority support and maintenance',
    basePrice: 360,
    icon: <FaHeadset />,
    category: 'Support',
    popular: true
  },
  {
    id: 'support-12',
    name: '12 Months Support',
    description: 'Full year of priority support',
    basePrice: 1080,
    icon: <FaHeadset />,
    category: 'Support'
  }
];

const packages: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for small businesses and startups',
    basePrice: 2500,
    icon: <FaRocket />,
    color: '#6BCF7F',
    features: ['custom-design', 'responsive-design', 'seo', 'analytics', 'support-3']
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Ideal for growing businesses',
    basePrice: 4500,
    icon: <FaShieldAlt />,
    color: '#4ECDC4',
    features: ['custom-design', 'responsive-design', 'ui-ux', 'cms', 'seo', 'analytics', 'api-integration', 'support-3'],
    highlight: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    basePrice: 7500,
    icon: <FaCrown />,
    color: '#FFD93D',
    features: ['custom-design', 'responsive-design', 'ui-ux', 'animations', 'cms', 'ecommerce', 'api-integration', 'database', 'auth', 'seo', 'analytics', 'social-integration', 'training', 'support-12']
  }
];

const PricingCalculator: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(packages[1]);
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set(packages[1].features));
  const [customMode, setCustomMode] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [pages, setPages] = useState(5);
  const [timeline, setTimeline] = useState(4); // weeks

  useEffect(() => {
    calculatePrice();
  }, [selectedFeatures, selectedPackage, pages, timeline, customMode]);

  const calculatePrice = () => {
    let price = 0;

    if (customMode) {
      // Custom pricing based on selected features
      selectedFeatures.forEach(featureId => {
        const feature = features.find(f => f.id === featureId);
        if (feature) {
          price += feature.basePrice;
        }
      });
      
      // Page multiplier
      const pageMultiplier = 1 + (Math.max(pages - 5, 0) * 0.1);
      price *= pageMultiplier;
      
      // Rush timeline multiplier
      if (timeline < 4) {
        price *= (1 + ((4 - timeline) * 0.15));
      }
    } else if (selectedPackage) {
      // Package pricing
      price = selectedPackage.basePrice;
      
      // Add extra features not in package
      selectedFeatures.forEach(featureId => {
        if (!selectedPackage.features.includes(featureId)) {
          const feature = features.find(f => f.id === featureId);
          if (feature) {
            price += feature.basePrice;
          }
        }
      });
      
      // Page multiplier for packages
      const pageMultiplier = 1 + (Math.max(pages - 5, 0) * 0.08);
      price *= pageMultiplier;
      
      // Rush timeline multiplier
      if (timeline < 4) {
        price *= (1 + ((4 - timeline) * 0.15));
      }
    }

    setTotalPrice(Math.round(price));
  };

  const toggleFeature = (featureId: string) => {
    const feature = features.find(f => f.id === featureId);
    if (feature?.required) return;

    const newFeatures = new Set(selectedFeatures);
    if (newFeatures.has(featureId)) {
      newFeatures.delete(featureId);
    } else {
      newFeatures.add(featureId);
    }
    setSelectedFeatures(newFeatures);
  };

  const selectPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setSelectedFeatures(new Set(pkg.features));
    setCustomMode(false);
  };

  const enableCustomMode = () => {
    setCustomMode(true);
    setSelectedPackage(null);
    // Start with required features
    const requiredFeatures = features.filter(f => f.required).map(f => f.id);
    setSelectedFeatures(new Set(requiredFeatures));
  };

  const getFeaturesByCategory = (category: string) => {
    return features.filter(f => f.category === category);
  };

  return (
    <section className="pricing-calculator-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pricing-header"
        >
          <span className="section-label">Pricing Calculator</span>
          <h2 className="section-title">
            Build Your Perfect <span className="gradient-text">Web Solution</span>
          </h2>
          <p className="section-description">
            Choose a package or customize your own. Transparent pricing with no hidden fees.
          </p>
        </motion.div>

        <div className="pricing-mode-toggle">
          <button 
            className={`mode-btn ${!customMode ? 'active' : ''}`}
            onClick={() => setCustomMode(false)}
          >
            <FaStar /> Packages
          </button>
          <button 
            className={`mode-btn ${customMode ? 'active' : ''}`}
            onClick={enableCustomMode}
          >
            <FaTools /> Custom Build
          </button>
        </div>

        <div className="pricing-content">
          {!customMode && (
            <div className="packages-grid">
              {packages.map((pkg) => (
                <motion.div
                  key={pkg.id}
                  className={`package-card ${selectedPackage?.id === pkg.id ? 'selected' : ''} ${pkg.highlight ? 'highlight' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  onClick={() => selectPackage(pkg)}
                >
                  {pkg.highlight && <span className="popular-badge">Most Popular</span>}
                  <div className="package-icon" style={{ background: `${pkg.color}20` }}>
                    <span style={{ color: pkg.color }}>{pkg.icon}</span>
                  </div>
                  <h3>{pkg.name}</h3>
                  <p className="package-description">{pkg.description}</p>
                  <div className="package-price">
                    <span className="price-label">Starting at</span>
                    <span className="price-value">${pkg.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="package-features">
                    {pkg.features.slice(0, 5).map(featureId => {
                      const feature = features.find(f => f.id === featureId);
                      return feature ? (
                        <div key={featureId} className="package-feature">
                          <FaCheck className="feature-check" />
                          <span>{feature.name}</span>
                        </div>
                      ) : null;
                    })}
                    {pkg.features.length > 5 && (
                      <div className="package-feature more">
                        <FaPlus className="feature-check" />
                        <span>+{pkg.features.length - 5} more features</span>
                      </div>
                    )}
                  </div>
                  <button className={`select-package-btn ${selectedPackage?.id === pkg.id ? 'selected' : ''}`}>
                    {selectedPackage?.id === pkg.id ? 'Selected' : 'Select Package'}
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          <div className="customization-panel">
            <h3>{customMode ? 'Build Your Package' : 'Customize Your Package'}</h3>
            
            <div className="feature-categories">
              {['Design', 'Development', 'Marketing', 'Support'].map(category => (
                <div key={category} className="feature-category">
                  <h4>{category}</h4>
                  <div className="features-list">
                    {getFeaturesByCategory(category).map(feature => (
                      <motion.div
                        key={feature.id}
                        className={`feature-item ${selectedFeatures.has(feature.id) ? 'selected' : ''} ${feature.required ? 'required' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <div className="feature-checkbox">
                          {selectedFeatures.has(feature.id) ? <FaCheck /> : feature.required ? <FaLock /> : <FaPlus />}
                        </div>
                        <div className="feature-info">
                          <div className="feature-header">
                            <span className="feature-name">{feature.name}</span>
                            {feature.popular && <span className="popular-tag">Popular</span>}
                            {feature.required && <span className="required-tag">Required</span>}
                          </div>
                          <p className="feature-description">{feature.description}</p>
                        </div>
                        <div className="feature-price">+${feature.basePrice.toLocaleString()}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="additional-options">
              <div className="option-group">
                <label>
                  <FaCode /> Number of Pages
                  <div className="info-tooltip">
                    <FaInfoCircle />
                    <span className="tooltip-text">Base price includes 5 pages. Additional pages increase cost.</span>
                  </div>
                </label>
                <div className="option-control">
                  <button onClick={() => setPages(Math.max(1, pages - 1))}><FaMinus /></button>
                  <span className="option-value">{pages}</span>
                  <button onClick={() => setPages(pages + 1)}><FaPlus /></button>
                </div>
              </div>

              <div className="option-group">
                <label>
                  <FaClock /> Timeline (weeks)
                  <div className="info-tooltip">
                    <FaInfoCircle />
                    <span className="tooltip-text">Standard timeline is 4 weeks. Rush delivery increases cost.</span>
                  </div>
                </label>
                <div className="option-control">
                  <button onClick={() => setTimeline(Math.max(1, timeline - 1))}><FaMinus /></button>
                  <span className="option-value">{timeline}</span>
                  <button onClick={() => setTimeline(Math.min(12, timeline + 1))}><FaPlus /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="pricing-summary">
            <motion.div 
              className="summary-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Your Investment</h3>
              
              <div className="selected-features-summary">
                <h4>Selected Features ({selectedFeatures.size})</h4>
                <div className="features-tags">
                  {Array.from(selectedFeatures).slice(0, 8).map(featureId => {
                    const feature = features.find(f => f.id === featureId);
                    return feature ? (
                      <span key={featureId} className="feature-tag">
                        {feature.name}
                      </span>
                    ) : null;
                  })}
                  {selectedFeatures.size > 8 && (
                    <span className="feature-tag more">+{selectedFeatures.size - 8} more</span>
                  )}
                </div>
              </div>

              <div className="price-breakdown">
                {!customMode && selectedPackage && (
                  <div className="breakdown-item">
                    <span>{selectedPackage.name} Package</span>
                    <span>${selectedPackage.basePrice.toLocaleString()}</span>
                  </div>
                )}
                {pages > 5 && (
                  <div className="breakdown-item">
                    <span>Additional Pages ({pages - 5})</span>
                    <span>+{Math.round((pages - 5) * 10)}%</span>
                  </div>
                )}
                {timeline < 4 && (
                  <div className="breakdown-item">
                    <span>Rush Delivery</span>
                    <span>+{Math.round((4 - timeline) * 15)}%</span>
                  </div>
                )}
              </div>

              <div className="total-price">
                <span className="price-label">Estimated Total</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={totalPrice}
                    className="price-amount"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    ${totalPrice.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="payment-options">
                <p>Flexible payment options available</p>
                <div className="payment-badges">
                  <span>50% Upfront</span>
                  <span>Monthly Plans</span>
                  <span>0% Financing</span>
                </div>
              </div>

              <button className="get-quote-btn">
                Get Detailed Quote
              </button>
            </motion.div>

            <div className="guarantee-card">
              <FaShieldAlt className="guarantee-icon" />
              <h4>Our Guarantee</h4>
              <ul>
                <li><FaCheck /> 100% Satisfaction Guarantee</li>
                <li><FaCheck /> No Hidden Fees</li>
                <li><FaCheck /> On-Time Delivery</li>
                <li><FaCheck /> 30-Day Money Back</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;