import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaStripe, FaPaypal, FaGoogle, FaAmazon, FaFacebook,
  FaTwitter, FaLinkedin, FaGithub, FaSlack, FaShopify,
  FaWordpress, FaMailchimp, FaPhone, FaDropbox, FaSpotify,
  FaYoutube, FaInstagram, FaPinterest, FaReddit, FaTiktok,
  FaDiscord, FaMicrosoft, FaApple, FaSalesforce, FaHubspot,
  FaCloud, FaDatabase, FaLock, FaChartLine, FaEnvelope,
  FaCreditCard, FaShippingFast, FaBell, FaComments, FaRobot,
  FaPlug, FaCheckCircle, FaArrowRight, FaCode, FaLink, FaClock
} from 'react-icons/fa';
import { 
  SiZoom, SiNotion, SiAirtable, SiAsana, SiTrello,
  SiIntercom, SiZendesk, SiJira, SiConfluence,
  SiFirebase, SiAuth0, SiOkta, SiTwilio, SiMailchimp as SiSendgrid,
  SiMailgun, SiStrapi, SiContentful, SiPrismic, SiGraphql as SiGraphcms,
  SiAlgolia, SiElasticsearch, SiRedis, SiPostgresql, SiMongodb,
  SiOpenai, SiGoogleanalytics, SiGoogleads, SiMetabase, SiTableau,
  SiKlarna, SiSquare, SiRazorpay, SiAdyen, SiShopify as SiMollie
} from 'react-icons/si';
import './IntegrationShowcase.css';

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  features: string[];
  status: 'available' | 'coming-soon' | 'beta';
  popularity: number;
  setupTime?: string;
  documentation?: string;
}

const integrations: Integration[] = [
  // Payment & Commerce
  {
    id: 'stripe',
    name: 'Stripe',
    icon: <FaStripe />,
    category: 'Payment',
    description: 'Complete payment processing solution with subscriptions support',
    features: ['Payment processing', 'Subscriptions', 'Invoicing', 'Fraud detection'],
    status: 'available',
    popularity: 95,
    setupTime: '30 mins'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: <FaPaypal />,
    category: 'Payment',
    description: 'Global payment gateway with buyer protection',
    features: ['Express checkout', 'Recurring payments', 'Multi-currency', 'Mobile payments'],
    status: 'available',
    popularity: 88,
    setupTime: '20 mins'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    icon: <FaShopify />,
    category: 'E-Commerce',
    description: 'Complete e-commerce platform integration',
    features: ['Product sync', 'Inventory management', 'Order processing', 'Analytics'],
    status: 'available',
    popularity: 92,
    setupTime: '45 mins'
  },
  {
    id: 'klarna',
    name: 'Klarna',
    icon: <SiKlarna />,
    category: 'Payment',
    description: 'Buy now, pay later solution',
    features: ['Flexible payments', 'Instant approval', 'Risk management', 'Customer insights'],
    status: 'available',
    popularity: 75,
    setupTime: '25 mins'
  },
  {
    id: 'square',
    name: 'Square',
    icon: <SiSquare />,
    category: 'Payment',
    description: 'Omnichannel payment processing',
    features: ['POS integration', 'Online payments', 'Invoicing', 'Analytics'],
    status: 'available',
    popularity: 80,
    setupTime: '30 mins'
  },

  // Communication & Marketing
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    icon: <FaMailchimp />,
    category: 'Marketing',
    description: 'Email marketing and automation platform',
    features: ['Email campaigns', 'Automation', 'Segmentation', 'Analytics'],
    status: 'available',
    popularity: 85,
    setupTime: '20 mins'
  },
  {
    id: 'twilio',
    name: 'Twilio',
    icon: <FaPhone />,
    category: 'Communication',
    description: 'SMS, voice, and video communication APIs',
    features: ['SMS messaging', 'Voice calls', 'Video chat', 'WhatsApp integration'],
    status: 'available',
    popularity: 87,
    setupTime: '40 mins'
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    icon: <SiSendgrid />,
    category: 'Communication',
    description: 'Transactional email delivery service',
    features: ['Email API', 'Templates', 'Analytics', 'Deliverability tools'],
    status: 'available',
    popularity: 82,
    setupTime: '15 mins'
  },
  {
    id: 'intercom',
    name: 'Intercom',
    icon: <SiIntercom />,
    category: 'Communication',
    description: 'Customer messaging and support platform',
    features: ['Live chat', 'Help center', 'Product tours', 'Customer data'],
    status: 'available',
    popularity: 78,
    setupTime: '25 mins'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: <FaSlack />,
    category: 'Communication',
    description: 'Team collaboration and notifications',
    features: ['Notifications', 'Webhooks', 'Bot integration', 'File sharing'],
    status: 'available',
    popularity: 90,
    setupTime: '15 mins'
  },

  // Analytics & Data
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    icon: <SiGoogleanalytics />,
    category: 'Analytics',
    description: 'Comprehensive web analytics platform',
    features: ['Traffic analysis', 'User behavior', 'Conversion tracking', 'Custom reports'],
    status: 'available',
    popularity: 98,
    setupTime: '10 mins'
  },
  {
    id: 'google-ads',
    name: 'Google Ads',
    icon: <SiGoogleads />,
    category: 'Marketing',
    description: 'Online advertising platform',
    features: ['PPC campaigns', 'Remarketing', 'Conversion tracking', 'Budget management'],
    status: 'available',
    popularity: 85,
    setupTime: '30 mins'
  },
  {
    id: 'metabase',
    name: 'Metabase',
    icon: <SiMetabase />,
    category: 'Analytics',
    description: 'Open-source business intelligence',
    features: ['Data visualization', 'SQL queries', 'Dashboards', 'Alerts'],
    status: 'available',
    popularity: 70,
    setupTime: '45 mins'
  },
  {
    id: 'tableau',
    name: 'Tableau',
    icon: <SiTableau />,
    category: 'Analytics',
    description: 'Advanced data visualization platform',
    features: ['Interactive dashboards', 'Real-time analytics', 'Data blending', 'Predictive analytics'],
    status: 'beta',
    popularity: 65,
    setupTime: '60 mins'
  },

  // Social Media
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <FaFacebook />,
    category: 'Social Media',
    description: 'Facebook login and social sharing',
    features: ['Social login', 'Share buttons', 'Comments', 'Analytics'],
    status: 'available',
    popularity: 88,
    setupTime: '20 mins'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <FaTwitter />,
    category: 'Social Media',
    description: 'Twitter integration for social features',
    features: ['Tweet embedding', 'Timeline display', 'Share buttons', 'Analytics'],
    status: 'available',
    popularity: 75,
    setupTime: '15 mins'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <FaInstagram />,
    category: 'Social Media',
    description: 'Instagram feed and media integration',
    features: ['Feed display', 'Stories', 'Shopping tags', 'Analytics'],
    status: 'available',
    popularity: 82,
    setupTime: '25 mins'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <FaLinkedin />,
    category: 'Social Media',
    description: 'Professional networking integration',
    features: ['Social login', 'Profile data', 'Company pages', 'Job postings'],
    status: 'available',
    popularity: 70,
    setupTime: '20 mins'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <FaYoutube />,
    category: 'Social Media',
    description: 'Video content integration',
    features: ['Video embedding', 'Playlists', 'Analytics', 'Live streaming'],
    status: 'available',
    popularity: 90,
    setupTime: '10 mins'
  },

  // Cloud & Infrastructure
  {
    id: 'aws',
    name: 'AWS',
    icon: <FaAmazon />,
    category: 'Cloud',
    description: 'Amazon Web Services cloud infrastructure',
    features: ['S3 storage', 'Lambda functions', 'EC2 hosting', 'CloudFront CDN'],
    status: 'available',
    popularity: 95,
    setupTime: '60 mins'
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud',
    icon: <FaGoogle />,
    category: 'Cloud',
    description: 'Google Cloud Platform services',
    features: ['Cloud storage', 'App engine', 'BigQuery', 'AI/ML services'],
    status: 'available',
    popularity: 85,
    setupTime: '60 mins'
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: <SiFirebase />,
    category: 'Cloud',
    description: 'Real-time database and backend services',
    features: ['Real-time database', 'Authentication', 'Cloud functions', 'Hosting'],
    status: 'available',
    popularity: 88,
    setupTime: '30 mins'
  },
  {
    id: 'microsoft-azure',
    name: 'Microsoft Azure',
    icon: <FaMicrosoft />,
    category: 'Cloud',
    description: 'Microsoft cloud computing platform',
    features: ['Virtual machines', 'App services', 'Databases', 'AI services'],
    status: 'available',
    popularity: 80,
    setupTime: '60 mins'
  },

  // Authentication
  {
    id: 'auth0',
    name: 'Auth0',
    icon: <SiAuth0 />,
    category: 'Authentication',
    description: 'Universal authentication and authorization',
    features: ['Social login', 'MFA', 'SSO', 'User management'],
    status: 'available',
    popularity: 85,
    setupTime: '30 mins'
  },
  {
    id: 'okta',
    name: 'Okta',
    icon: <SiOkta />,
    category: 'Authentication',
    description: 'Enterprise identity management',
    features: ['SSO', 'MFA', 'Lifecycle management', 'API access'],
    status: 'available',
    popularity: 75,
    setupTime: '45 mins'
  },

  // CMS & Content
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: <FaWordpress />,
    category: 'CMS',
    description: 'Popular content management system',
    features: ['Content sync', 'Plugin integration', 'Custom post types', 'REST API'],
    status: 'available',
    popularity: 92,
    setupTime: '30 mins'
  },
  {
    id: 'strapi',
    name: 'Strapi',
    icon: <SiStrapi />,
    category: 'CMS',
    description: 'Headless CMS for modern applications',
    features: ['REST & GraphQL', 'Custom content types', 'Media library', 'Role-based access'],
    status: 'available',
    popularity: 78,
    setupTime: '40 mins'
  },
  {
    id: 'contentful',
    name: 'Contentful',
    icon: <SiContentful />,
    category: 'CMS',
    description: 'API-first content platform',
    features: ['Content modeling', 'CDN delivery', 'Webhooks', 'Localization'],
    status: 'available',
    popularity: 75,
    setupTime: '35 mins'
  },

  // Project Management
  {
    id: 'jira',
    name: 'Jira',
    icon: <SiJira />,
    category: 'Project Management',
    description: 'Agile project management tool',
    features: ['Issue tracking', 'Sprints', 'Boards', 'Reporting'],
    status: 'available',
    popularity: 85,
    setupTime: '40 mins'
  },
  {
    id: 'trello',
    name: 'Trello',
    icon: <SiTrello />,
    category: 'Project Management',
    description: 'Visual collaboration tool',
    features: ['Boards', 'Cards', 'Automation', 'Power-ups'],
    status: 'available',
    popularity: 80,
    setupTime: '15 mins'
  },
  {
    id: 'asana',
    name: 'Asana',
    icon: <SiAsana />,
    category: 'Project Management',
    description: 'Work management platform',
    features: ['Tasks', 'Projects', 'Timeline', 'Portfolios'],
    status: 'available',
    popularity: 75,
    setupTime: '20 mins'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: <SiNotion />,
    category: 'Project Management',
    description: 'All-in-one workspace',
    features: ['Docs', 'Databases', 'Kanban', 'Calendar'],
    status: 'available',
    popularity: 82,
    setupTime: '25 mins'
  },

  // AI & Machine Learning
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <SiOpenai />,
    category: 'AI',
    description: 'Advanced AI models and APIs',
    features: ['GPT models', 'Image generation', 'Embeddings', 'Fine-tuning'],
    status: 'available',
    popularity: 95,
    setupTime: '20 mins'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <FaGithub />,
    category: 'Development',
    description: 'Code repository and collaboration',
    features: ['Webhooks', 'Actions', 'OAuth', 'Issue tracking'],
    status: 'available',
    popularity: 98,
    setupTime: '15 mins'
  },

  // Databases
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: <SiMongodb />,
    category: 'Database',
    description: 'NoSQL database platform',
    features: ['Atlas cloud', 'Real-time sync', 'Charts', 'Search'],
    status: 'available',
    popularity: 85,
    setupTime: '30 mins'
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: <SiPostgresql />,
    category: 'Database',
    description: 'Advanced relational database',
    features: ['ACID compliance', 'JSON support', 'Full-text search', 'Extensions'],
    status: 'available',
    popularity: 88,
    setupTime: '40 mins'
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: <SiRedis />,
    category: 'Database',
    description: 'In-memory data structure store',
    features: ['Caching', 'Pub/sub', 'Queues', 'Session storage'],
    status: 'available',
    popularity: 82,
    setupTime: '20 mins'
  },

  // Search
  {
    id: 'algolia',
    name: 'Algolia',
    icon: <SiAlgolia />,
    category: 'Search',
    description: 'Powerful search and discovery API',
    features: ['Instant search', 'Faceted search', 'AI ranking', 'Analytics'],
    status: 'available',
    popularity: 78,
    setupTime: '25 mins'
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    icon: <SiElasticsearch />,
    category: 'Search',
    description: 'Distributed search and analytics engine',
    features: ['Full-text search', 'Analytics', 'Machine learning', 'Monitoring'],
    status: 'available',
    popularity: 80,
    setupTime: '45 mins'
  }
];

const categories = [
  'All',
  'Payment',
  'E-Commerce',
  'Communication',
  'Marketing',
  'Analytics',
  'Social Media',
  'Cloud',
  'Authentication',
  'CMS',
  'Project Management',
  'AI',
  'Development',
  'Database',
  'Search'
];

const IntegrationShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = selectedCategory === 'All' || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Payment': return <FaCreditCard />;
      case 'E-Commerce': return <FaShippingFast />;
      case 'Communication': return <FaComments />;
      case 'Marketing': return <FaChartLine />;
      case 'Analytics': return <FaChartLine />;
      case 'Social Media': return <FaLink />;
      case 'Cloud': return <FaCloud />;
      case 'Authentication': return <FaLock />;
      case 'CMS': return <FaDatabase />;
      case 'Project Management': return <FaCode />;
      case 'AI': return <FaRobot />;
      case 'Development': return <FaCode />;
      case 'Database': return <FaDatabase />;
      case 'Search': return <FaGoogle />;
      default: return <FaPlug />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'beta': return '#FF9800';
      case 'coming-soon': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const getCategoryCount = (category: string) => {
    if (category === 'All') return integrations.length;
    return integrations.filter(i => i.category === category).length;
  };

  return (
    <section className="integration-showcase">
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2>Powerful Integrations</h2>
          <p>Connect with your favorite tools and services seamlessly</p>
        </motion.div>

        <motion.div 
          className="integration-stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="stat-card">
            <span className="stat-number">{integrations.length}+</span>
            <span className="stat-label">Integrations</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">99.9%</span>
            <span className="stat-label">Uptime</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </motion.div>

        <motion.div 
          className="integration-controls"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="search-box">
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="view-toggles">
            <button 
              className={viewMode === 'grid' ? 'active' : ''}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button 
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="category-filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {categories.map(category => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {getCategoryIcon(category)}
              <span className="category-name">{category}</span>
              <span className="category-count">{getCategoryCount(category)}</span>
            </button>
          ))}
        </motion.div>

        {viewMode === 'grid' ? (
          <motion.div 
            className="integrations-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                className="integration-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedIntegration(integration)}
              >
                <div className="card-header">
                  <div className="integration-icon">{integration.icon}</div>
                  <div className="integration-info">
                    <h3>{integration.name}</h3>
                    <span className="integration-category">{integration.category}</span>
                  </div>
                  <span 
                    className={`status-badge ${integration.status}`}
                    style={{ backgroundColor: getStatusColor(integration.status) }}
                  >
                    {integration.status === 'coming-soon' ? 'Coming' : integration.status}
                  </span>
                </div>

                <p className="integration-description">{integration.description}</p>

                <div className="integration-features">
                  {integration.features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className="feature-tag">
                      <FaCheckCircle />
                      {feature}
                    </span>
                  ))}
                  {integration.features.length > 3 && (
                    <span className="feature-more">+{integration.features.length - 3} more</span>
                  )}
                </div>

                <div className="card-footer">
                  <div className="popularity">
                    <span className="popularity-label">Popularity</span>
                    <div className="popularity-bar">
                      <motion.div 
                        className="popularity-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${integration.popularity}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                  {integration.setupTime && (
                    <span className="setup-time">
                      <FaClock />
                      {integration.setupTime}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="integrations-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredIntegrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                className="integration-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                viewport={{ once: true }}
                whileHover={{ backgroundColor: 'rgba(102, 126, 234, 0.05)' }}
                onClick={() => setSelectedIntegration(integration)}
              >
                <div className="row-icon">{integration.icon}</div>
                <div className="row-info">
                  <h4>{integration.name}</h4>
                  <p>{integration.description}</p>
                </div>
                <div className="row-category">
                  <span className="category-tag">{integration.category}</span>
                </div>
                <div className="row-status">
                  <span 
                    className={`status-badge ${integration.status}`}
                    style={{ backgroundColor: getStatusColor(integration.status) }}
                  >
                    {integration.status}
                  </span>
                </div>
                <div className="row-action">
                  <FaArrowRight />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {selectedIntegration && (
            <motion.div 
              className="integration-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedIntegration(null)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-btn"
                  onClick={() => setSelectedIntegration(null)}
                >
                  ×
                </button>
                
                <div className="modal-header">
                  <div className="modal-icon">{selectedIntegration.icon}</div>
                  <div>
                    <h2>{selectedIntegration.name}</h2>
                    <span className="modal-category">{selectedIntegration.category}</span>
                  </div>
                  <span 
                    className={`modal-status ${selectedIntegration.status}`}
                    style={{ backgroundColor: getStatusColor(selectedIntegration.status) }}
                  >
                    {selectedIntegration.status}
                  </span>
                </div>

                <p className="modal-description">{selectedIntegration.description}</p>

                <div className="modal-features">
                  <h3>Key Features</h3>
                  <div className="features-list">
                    {selectedIntegration.features.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <FaCheckCircle style={{ color: '#4CAF50' }} />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="modal-meta">
                  <div className="meta-item">
                    <span className="meta-label">Setup Time</span>
                    <span className="meta-value">{selectedIntegration.setupTime || 'Varies'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Popularity</span>
                    <div className="popularity-bar">
                      <div 
                        className="popularity-fill"
                        style={{ width: `${selectedIntegration.popularity}%` }}
                      />
                    </div>
                    <span className="meta-value">{selectedIntegration.popularity}%</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="action-btn primary">
                    Get Started
                  </button>
                  <button className="action-btn secondary">
                    View Documentation
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default IntegrationShowcase;