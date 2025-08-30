import React, { useState } from 'react';
import './ContactForm.css';
import { 
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaBriefcase,
  FaCalendarAlt, FaClock, FaDollarSign, FaGlobe, FaMapMarkerAlt,
  FaPaperclip, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaRocket, FaChartLine, FaCode, FaDesktop, FaMobile,
  FaShoppingCart, FaUserTie, FaHeadset, FaComments
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
  services: string[];
  preferredContact: string;
  timezone: string;
  attachment?: File;
}

interface FormErrors {
  [key: string]: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    services: [],
    preferredContact: 'email',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeStep, setActiveStep] = useState(1);
  const [attachmentName, setAttachmentName] = useState('');

  const projectTypes = [
    { value: 'new-website', label: 'New Website', icon: <FaDesktop /> },
    { value: 'redesign', label: 'Website Redesign', icon: <FaChartLine /> },
    { value: 'ecommerce', label: 'E-Commerce', icon: <FaShoppingCart /> },
    { value: 'web-app', label: 'Web Application', icon: <FaCode /> },
    { value: 'mobile-app', label: 'Mobile App', icon: <FaMobile /> },
    { value: 'consultation', label: 'Consultation', icon: <FaUserTie /> }
  ];

  const services = [
    'UI/UX Design',
    'Frontend Development',
    'Backend Development',
    'Full-Stack Development',
    'API Integration',
    'Database Design',
    'Cloud Hosting',
    'SEO Optimization',
    'Performance Optimization',
    'Security Audit',
    'Maintenance & Support',
    'Digital Marketing'
  ];

  const budgetRanges = [
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000+'
  ];

  const timelines = [
    'ASAP',
    '1-2 weeks',
    '1 month',
    '2-3 months',
    '3-6 months',
    '6+ months'
  ];

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
        if (formData.phone && !validatePhone(formData.phone)) {
          newErrors.phone = 'Invalid phone number';
        }
        break;
      case 2:
        if (!formData.projectType) newErrors.projectType = 'Please select a project type';
        if (formData.services.length === 0) newErrors.services = 'Please select at least one service';
        break;
      case 3:
        if (!formData.message.trim()) newErrors.message = 'Please provide project details';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, attachment: 'File size must be less than 10MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, attachment: file }));
      setAttachmentName(file.name);
      setErrors(prev => ({ ...prev, attachment: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
        services: [],
        preferredContact: 'email',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      setActiveStep(1);
      setAttachmentName('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step"
          >
            <h3>Let's Get to Know You</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser /> Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope /> Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FaPhone /> Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="company">
                  <FaBuilding /> Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Acme Inc."
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">
                  <FaGlobe /> Current Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="timezone">
                  <FaMapMarkerAlt /> Timezone
                </label>
                <input
                  type="text"
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label>Preferred Contact Method</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleInputChange}
                  />
                  <span>Email</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleInputChange}
                  />
                  <span>Phone</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="both"
                    checked={formData.preferredContact === 'both'}
                    onChange={handleInputChange}
                  />
                  <span>Both</span>
                </label>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step"
          >
            <h3>Tell Us About Your Project</h3>
            
            <div className="form-group">
              <label>Project Type *</label>
              <div className="project-type-grid">
                {projectTypes.map(type => (
                  <div
                    key={type.value}
                    className={`project-type-card ${formData.projectType === type.value ? 'selected' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, projectType: type.value }));
                      if (errors.projectType) {
                        setErrors(prev => ({ ...prev, projectType: '' }));
                      }
                    }}
                  >
                    <div className="project-type-icon">{type.icon}</div>
                    <span>{type.label}</span>
                  </div>
                ))}
              </div>
              {errors.projectType && <span className="error-message">{errors.projectType}</span>}
            </div>

            <div className="form-group">
              <label>Services Needed *</label>
              <div className="services-grid">
                {services.map(service => (
                  <label key={service} className="service-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
              {errors.services && <span className="error-message">{errors.services}</span>}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="budget">
                  <FaDollarSign /> Budget Range
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                >
                  <option value="">Select budget</option>
                  {budgetRanges.map(range => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timeline">
                  <FaCalendarAlt /> Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                >
                  <option value="">Select timeline</option>
                  {timelines.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="form-step"
          >
            <h3>Project Details</h3>
            
            <div className="form-group">
              <label htmlFor="message">
                <FaComments /> Tell us more about your project *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={errors.message ? 'error' : ''}
                rows={8}
                placeholder="Describe your project goals, requirements, and any specific features you need..."
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="attachment">
                <FaPaperclip /> Attach Files (Optional)
              </label>
              <div className="file-upload">
                <input
                  type="file"
                  id="attachment"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.zip"
                />
                <label htmlFor="attachment" className="file-upload-label">
                  {attachmentName || 'Choose file (Max 10MB)'}
                </label>
              </div>
              {errors.attachment && <span className="error-message">{errors.attachment}</span>}
            </div>

            <div className="summary-box">
              <h4>Project Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <strong>Contact:</strong> {formData.name || 'Not provided'}
                </div>
                <div className="summary-item">
                  <strong>Email:</strong> {formData.email || 'Not provided'}
                </div>
                <div className="summary-item">
                  <strong>Project Type:</strong> {projectTypes.find(t => t.value === formData.projectType)?.label || 'Not selected'}
                </div>
                <div className="summary-item">
                  <strong>Services:</strong> {formData.services.length > 0 ? formData.services.join(', ') : 'None selected'}
                </div>
                {formData.budget && (
                  <div className="summary-item">
                    <strong>Budget:</strong> {formData.budget}
                  </div>
                )}
                {formData.timeline && (
                  <div className="summary-item">
                    <strong>Timeline:</strong> {formData.timeline}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="contact-form-section">
      <div className="container">
        <motion.div 
          className="contact-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Start Your Project Today</h2>
          <p>Tell us about your vision and let's create something amazing together</p>
        </motion.div>

        <div className="contact-container">
          <div className="contact-info">
            <h3>Why Choose Panchroma?</h3>
            <div className="info-cards">
              <div className="info-card">
                <FaRocket className="info-icon" />
                <h4>Fast Turnaround</h4>
                <p>Get your project completed on time, every time</p>
              </div>
              <div className="info-card">
                <FaHeadset className="info-icon" />
                <h4>24/7 Support</h4>
                <p>Round-the-clock assistance for your peace of mind</p>
              </div>
              <div className="info-card">
                <FaChartLine className="info-icon" />
                <h4>Proven Results</h4>
                <p>Track record of successful projects and happy clients</p>
              </div>
              <div className="info-card">
                <FaUserTie className="info-icon" />
                <h4>Expert Team</h4>
                <p>Skilled professionals dedicated to your success</p>
              </div>
            </div>

            <div className="contact-details">
              <h4>Get in Touch</h4>
              <div className="contact-item">
                <FaEnvelope />
                <span>hello@panchroma.com</span>
              </div>
              <div className="contact-item">
                <FaPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FaClock />
                <span>Mon-Fri: 9AM-6PM EST</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>New York, NY 10001</span>
              </div>
            </div>
          </div>

          <div className="contact-form">
            <div className="form-progress">
              <div className="progress-steps">
                {[1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`progress-step ${activeStep >= step ? 'active' : ''} ${activeStep > step ? 'completed' : ''}`}
                  >
                    <div className="step-number">
                      {activeStep > step ? <FaCheckCircle /> : step}
                    </div>
                    <span className="step-label">
                      {step === 1 ? 'Contact Info' : step === 2 ? 'Project Type' : 'Details'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(activeStep / 3) * 100}%` }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              <div className="form-actions">
                {activeStep > 1 && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
                {activeStep < 3 ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNext}
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="spinner" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                )}
              </div>
            </form>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  className="submit-message success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FaCheckCircle />
                  <h4>Thank You!</h4>
                  <p>Your message has been sent successfully. We'll get back to you within 24 hours.</p>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  className="submit-message error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FaTimesCircle />
                  <h4>Oops!</h4>
                  <p>Something went wrong. Please try again or contact us directly.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;