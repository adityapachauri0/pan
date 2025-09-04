const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const Sentry = require('@sentry/node');

// Load environment variables
dotenv.config();

// Import security and logging
const { configureSecurityMiddleware, authLimiter, contactLimiter } = require('./config/security');
const logger = require('./config/logger');
const { errorHandler, notFound, asyncHandler } = require('./middleware/errorHandler');
const { validators } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Sentry for production
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
  });
  
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
}

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

// Configure security middleware
configureSecurityMiddleware(app);

// CORS configuration - more restrictive
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:3001'
    ];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware with limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Logging middleware
app.use(morgan('combined', { stream: logger.stream }));

// MongoDB connection with retry logic
const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panchroma', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      logger.info('MongoDB connected successfully');
      
      // Create indexes for better performance
      await createIndexes();
      break;
    } catch (error) {
      retries++;
      logger.error(`MongoDB connection attempt ${retries} failed:`, error);
      
      if (retries === maxRetries) {
        logger.error('Failed to connect to MongoDB after maximum retries');
        process.exit(1);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Create database indexes
const createIndexes = async () => {
  try {
    await Contact.collection.createIndex({ email: 1 });
    await Contact.collection.createIndex({ createdAt: -1 });
    await ContactSubmission.collection.createIndex({ email: 1 });
    await ContactSubmission.collection.createIndex({ status: 1 });
    await ContactSubmission.collection.createIndex({ createdAt: -1 });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await Project.collection.createIndex({ featured: 1 });
    logger.info('Database indexes created successfully');
  } catch (error) {
    logger.error('Error creating indexes:', error);
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  
  res.status(200).json(health);
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        verify: 'GET /api/auth/verify'
      },
      contact: {
        submit: 'POST /api/contact/submit',
        list: 'GET /api/contact/submissions',
        delete: 'DELETE /api/contact/submissions/:id',
        update: 'PATCH /api/contact/submissions/:id/status'
      },
      dashboard: 'GET /api/dashboard/*',
      projects: 'GET /api/projects/*'
    }
  });
});

// Public contact form route with validation and rate limiting
app.post('/api/contact', 
  contactLimiter,
  validators.contactSubmission,
  asyncHandler(async (req, res) => {
    const contactData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    const contact = new Contact(contactData);
    await contact.save();
    
    logger.info(`Contact form submission saved: ${contact._id}`);
    
    res.json({ 
      success: true, 
      message: 'Your message has been received. We will get back to you soon!',
      contactId: contact._id 
    });
  })
);

// Portfolio route
app.get('/api/portfolio', asyncHandler(async (req, res) => {
  const projects = await Project.find({ featured: true }).limit(10);
  res.json({ success: true, data: projects });
}));

// API Routes with authentication rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/contact', contactRoutes);

// Sentry error handler (must be before other error handlers)
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, shutting down gracefully`);
  
  // Close server
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Close database connection
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error('Error closing MongoDB connection:', error);
  }
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process in production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  connectDB();
});

module.exports = app;