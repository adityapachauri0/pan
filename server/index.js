const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import models
const Contact = require('./models/Contact');
const Project = require('./models/Project');
const User = require('./models/User');
const ContactSubmission = require('./models/ContactSubmission');

// Import routes
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const contactsRoutes = require('./routes/contacts');
const projectsRoutes = require('./routes/projects');
const contactRoutes = require('./routes/contactRoutes');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panchroma', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Panchroma API is running!' });
});

// Public contact form route (for website)
app.post('/api/contact', async (req, res) => {
  try {
    const contactData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    const contact = new Contact(contactData);
    await contact.save();
    
    console.log('Contact form submission saved:', contact._id);
    
    res.json({ 
      success: true, 
      message: 'Your message has been received. We will get back to you soon!',
      contactId: contact._id 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Portfolio route
app.get('/api/portfolio', (req, res) => {
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      category: 'web',
      description: 'Modern e-commerce solution with payment integration',
      tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      image: '/images/portfolio/ecommerce.jpg',
      url: 'https://demo-ecommerce.panchroma.com'
    },
    {
      id: 2,
      title: 'Healthcare App',
      category: 'mobile',
      description: 'Telemedicine platform for remote consultations',
      tech: ['React Native', 'Firebase', 'WebRTC'],
      image: '/images/portfolio/healthcare.jpg',
      url: 'https://demo-health.panchroma.com'
    },
    {
      id: 3,
      title: 'Restaurant Management',
      category: 'web',
      description: 'Complete POS and inventory management system',
      tech: ['Vue.js', 'Express', 'PostgreSQL'],
      image: '/images/portfolio/restaurant.jpg',
      url: 'https://demo-restaurant.panchroma.com'
    },
    {
      id: 4,
      title: 'Educational Platform',
      category: 'web',
      description: 'Online learning management system',
      tech: ['Angular', 'NestJS', 'MongoDB'],
      image: '/images/portfolio/education.jpg',
      url: 'https://demo-edu.panchroma.com'
    }
  ];
  
  res.json({ success: true, data: projects });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);

// Contact routes - register before any catch-all handlers
app.use('/api/contact', contactRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler - MUST BE LAST
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  connectDB();
});