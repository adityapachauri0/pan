import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaChevronDown, FaQuestionCircle, FaLightbulb,
  FaDollarSign, FaClock, FaCode, FaRocket, FaShieldAlt,
  FaHeadset, FaTools, FaChartLine, FaMobile, FaGlobe
} from 'react-icons/fa';
import './FAQAccordion.css';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
  keywords: string[];
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: 1,
    question: "How long does it take to build a website?",
    answer: "The timeline varies based on project complexity. A simple website typically takes 2-4 weeks, while more complex projects with custom features can take 6-12 weeks. We'll provide a detailed timeline during our initial consultation based on your specific requirements.",
    category: "General",
    icon: <FaClock />,
    keywords: ["timeline", "duration", "time", "delivery", "schedule"]
  },
  {
    id: 2,
    question: "What makes Panchroma different from other web agencies?",
    answer: "We combine cutting-edge technology with personalized service. Our team focuses on creating custom solutions tailored to your business needs, not templates. We offer transparent pricing, dedicated support, and a proven track record of delivering results that exceed expectations.",
    category: "General",
    icon: <FaLightbulb />,
    keywords: ["unique", "different", "why", "choose", "benefits"]
  },
  {
    id: 3,
    question: "Do you work with small businesses?",
    answer: "Absolutely! We love working with small businesses and startups. Our Starter package is specifically designed for small businesses, offering professional web solutions at affordable prices. We understand the unique challenges small businesses face and tailor our approach accordingly.",
    category: "General",
    icon: <FaRocket />,
    keywords: ["small business", "startup", "budget", "affordable"]
  },
  
  // Pricing Questions
  {
    id: 4,
    question: "How much does a website cost?",
    answer: "Our website packages start at $2,500 for a basic site and go up to $7,500 for enterprise solutions. The final cost depends on your specific requirements, features needed, and project complexity. We offer transparent pricing with no hidden fees, and you can use our pricing calculator to get an instant estimate.",
    category: "Pricing",
    icon: <FaDollarSign />,
    keywords: ["cost", "price", "budget", "expensive", "cheap", "affordable"]
  },
  {
    id: 5,
    question: "Do you offer payment plans?",
    answer: "Yes! We offer flexible payment options to suit your budget. You can choose to pay 50% upfront and 50% on completion, or opt for our monthly payment plans. We also offer 0% financing options for qualified businesses. Contact us to discuss the best payment plan for your needs.",
    category: "Pricing",
    icon: <FaDollarSign />,
    keywords: ["payment", "financing", "installments", "monthly", "flexible"]
  },
  {
    id: 6,
    question: "Are there any hidden costs?",
    answer: "No, we believe in complete transparency. Our quotes include everything discussed in the project scope. Any additional features or changes requested after the project begins will be clearly communicated with associated costs before implementation. You'll never be surprised by hidden fees.",
    category: "Pricing",
    icon: <FaShieldAlt />,
    keywords: ["hidden", "extra", "additional", "transparent", "fees"]
  },
  
  // Process Questions
  {
    id: 7,
    question: "What is your development process?",
    answer: "Our process follows 7 key phases: Discovery (understanding your needs), Strategy (planning the solution), Design (creating the visual experience), Development (building the website), Testing (ensuring quality), Launch (going live), and Growth (ongoing optimization). Each phase is collaborative, keeping you informed and involved throughout.",
    category: "Process",
    icon: <FaTools />,
    keywords: ["process", "workflow", "steps", "methodology", "approach"]
  },
  {
    id: 8,
    question: "Will I be able to update the website myself?",
    answer: "Yes! We build websites with user-friendly content management systems (CMS) that allow you to easily update text, images, and other content without any coding knowledge. We also provide training and documentation to ensure you're comfortable managing your site.",
    category: "Process",
    icon: <FaCode />,
    keywords: ["update", "edit", "cms", "manage", "control", "changes"]
  },
  {
    id: 9,
    question: "Do you provide website hosting?",
    answer: "We can help you set up reliable hosting solutions tailored to your needs. While we don't host websites directly, we partner with top-tier hosting providers and will handle all the technical setup. We'll recommend the best hosting solution based on your traffic, security, and performance requirements.",
    category: "Process",
    icon: <FaGlobe />,
    keywords: ["hosting", "server", "domain", "storage", "bandwidth"]
  },
  
  // Technical Questions
  {
    id: 10,
    question: "Will my website be mobile-friendly?",
    answer: "Absolutely! Every website we build is fully responsive and optimized for all devices - desktop, tablet, and mobile. With over 60% of web traffic coming from mobile devices, we ensure your site looks and performs perfectly on every screen size.",
    category: "Technical",
    icon: <FaMobile />,
    keywords: ["mobile", "responsive", "tablet", "phone", "device"]
  },
  {
    id: 11,
    question: "What technologies do you use?",
    answer: "We use modern, industry-standard technologies including React, Next.js, Node.js, and WordPress, depending on your needs. We choose the best technology stack for each project based on factors like scalability, performance, and maintenance requirements. Our tech choices ensure your website is fast, secure, and future-proof.",
    category: "Technical",
    icon: <FaCode />,
    keywords: ["technology", "stack", "programming", "react", "wordpress", "nodejs"]
  },
  {
    id: 12,
    question: "How do you ensure website security?",
    answer: "Security is our top priority. We implement SSL certificates, regular security updates, secure coding practices, firewall protection, and regular backups. For e-commerce sites, we ensure PCI compliance. We also offer ongoing security monitoring and maintenance packages.",
    category: "Technical",
    icon: <FaShieldAlt />,
    keywords: ["security", "ssl", "https", "safe", "protection", "hacking"]
  },
  
  // Support Questions
  {
    id: 13,
    question: "What kind of support do you provide after launch?",
    answer: "We offer comprehensive post-launch support including bug fixes, technical assistance, content updates, and performance monitoring. Our support packages range from 3 to 12 months, with 24/7 emergency support available. We're here to ensure your website continues to perform optimally.",
    category: "Support",
    icon: <FaHeadset />,
    keywords: ["support", "help", "maintenance", "assistance", "after"]
  },
  {
    id: 14,
    question: "Do you provide training?",
    answer: "Yes! We provide comprehensive training to ensure you can manage your website confidently. This includes video tutorials, documentation, and hands-on training sessions. We'll teach you how to update content, manage users, view analytics, and handle basic troubleshooting.",
    category: "Support",
    icon: <FaLightbulb />,
    keywords: ["training", "learn", "tutorial", "teach", "documentation"]
  },
  {
    id: 15,
    question: "What if I need changes after the website is complete?",
    answer: "We're here for the long term! Minor changes and updates are often covered under our support packages. For larger changes or new features, we provide clear quotes and can implement them quickly thanks to our familiarity with your site. We offer both hourly rates and project-based pricing for post-launch work.",
    category: "Support",
    icon: <FaTools />,
    keywords: ["changes", "updates", "modifications", "revisions", "new features"]
  },
  
  // SEO & Marketing Questions
  {
    id: 16,
    question: "Will my website be SEO-friendly?",
    answer: "Yes! Every website we build includes on-page SEO optimization as standard. This includes optimized meta tags, clean URL structure, fast loading speeds, mobile optimization, and proper heading hierarchy. We also offer advanced SEO services for businesses looking to dominate search rankings.",
    category: "Marketing",
    icon: <FaChartLine />,
    keywords: ["seo", "google", "search", "ranking", "optimization"]
  },
  {
    id: 17,
    question: "Can you help with digital marketing?",
    answer: "While our primary focus is web development, we partner with digital marketing experts to offer comprehensive solutions. We can help with SEO, content marketing, social media integration, and analytics setup. We'll ensure your website is built with marketing best practices in mind.",
    category: "Marketing",
    icon: <FaChartLine />,
    keywords: ["marketing", "advertising", "promotion", "social media", "ads"]
  },
  {
    id: 18,
    question: "How will I track my website's performance?",
    answer: "We set up Google Analytics and other tracking tools to monitor your website's performance. You'll be able to track visitors, page views, conversion rates, and user behavior. We also provide monthly reports and insights to help you understand and improve your site's performance.",
    category: "Marketing",
    icon: <FaChartLine />,
    keywords: ["analytics", "tracking", "performance", "metrics", "statistics"]
  }
];

const categories = ["All", "General", "Pricing", "Process", "Technical", "Support", "Marketing"];

const FAQAccordion: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredFAQs = useMemo(() => {
    return faqData.filter(item => {
      const matchesSearch = searchTerm === "" || 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={index} className="highlight">{part}</mark> : part
    );
  };

  return (
    <section className="faq-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="faq-header"
        >
          <span className="section-label">FAQ</span>
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="section-description">
            Find answers to common questions about our services, process, and pricing
          </p>
        </motion.div>

        <div className="faq-controls">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
                {category !== "All" && (
                  <span className="category-count">
                    {faqData.filter(item => item.category === category).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="faq-content">
          {filteredFAQs.length === 0 ? (
            <motion.div 
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <FaQuestionCircle className="no-results-icon" />
              <h3>No questions found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <div className="faq-grid">
              <AnimatePresence mode="wait">
                {filteredFAQs.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className={`faq-item ${openItems.has(item.id) ? 'open' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <button
                      className="faq-question"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="question-content">
                        <div className="question-icon">
                          {item.icon}
                        </div>
                        <div className="question-text">
                          <h3>{highlightText(item.question)}</h3>
                          <span className="question-category">{item.category}</span>
                        </div>
                      </div>
                      <motion.div 
                        className="expand-icon"
                        animate={{ rotate: openItems.has(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronDown />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence mode="wait">
                      {openItems.has(item.id) && (
                        <motion.div
                          className="faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>{highlightText(item.answer)}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {filteredFAQs.length > 0 && (
          <motion.div 
            className="faq-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Showing {filteredFAQs.length} of {faqData.length} questions
          </motion.div>
        )}

        <motion.div 
          className="faq-cta"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3>Still Have Questions?</h3>
          <p>Can't find what you're looking for? We're here to help!</p>
          <div className="cta-buttons">
            <button className="cta-button primary">
              <FaHeadset /> Contact Support
            </button>
            <button className="cta-button secondary">
              <FaRocket /> Schedule Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQAccordion;