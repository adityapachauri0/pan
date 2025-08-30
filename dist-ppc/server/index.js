const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cluster = require('cluster');
const os = require('os');

// Load environment configuration
dotenv.config();

// Different application setup
const app = express();
const SERVER_PORT = process.env.PORT || 7001;
const WS_PORT = process.env.WS_PORT || 7002;
const SERVICE_NAME = 'panchroma-web-service';
const INSTANCE_ID = process.env.INSTANCE_ID || 'main';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced database connection with different database name
const connectDB = async () => {
  try {
    const dbUri = process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/panchroma_app';
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] Database connected: ${dbUri}`);
  } catch (error) {
    console.error(`[${SERVICE_NAME}:${INSTANCE_ID}] Database connection error:`, error);
    process.exit(1);
  }
};

// Enhanced API routes with different endpoints
app.get('/', (req, res) => {
  res.json({ 
    service: SERVICE_NAME,
    instance: INSTANCE_ID,
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

app.get('/health-status', (req, res) => {
  res.json({
    status: 'healthy',
    service: SERVICE_NAME,
    instance: INSTANCE_ID,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid
  });
});

app.get('/metrics', (req, res) => {
  res.json({
    service: SERVICE_NAME,
    instance: INSTANCE_ID,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    connections: app._connections || 0
  });
});

// Contact form route
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Here you would typically save to database and send email
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.json({ 
      success: true, 
      message: 'Your message has been received. We will get back to you soon!' 
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred. Please try again later.' 
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
      description: 'Modern e-commerce solution',
      tech: ['React', 'Node.js', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Healthcare App',
      category: 'mobile',
      description: 'Telemedicine platform',
      tech: ['React Native', 'Firebase'],
    },
  ];
  
  res.json(projects);
});

// Enhanced server startup with different approach
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(SERVER_PORT, '0.0.0.0', () => {
      console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] HTTP Server running on port ${SERVER_PORT}`);
      console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] Process ID: ${process.pid}`);
      console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] Ready to accept connections`);
    });
    
    // Graceful shutdown handling
    const gracefulShutdown = (signal) => {
      console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] Received ${signal}. Graceful shutdown initiated...`);
      
      server.close(() => {
        console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] HTTP server closed`);
        
        mongoose.connection.close(() => {
          console.log(`[${SERVICE_NAME}:${INSTANCE_ID}] Database connection closed`);
          process.exit(0);
        });
      });
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Error handling
    server.on('error', (error) => {
      console.error(`[${SERVICE_NAME}:${INSTANCE_ID}] Server error:`, error);
      process.exit(1);
    });
    
    return server;
  } catch (error) {
    console.error(`[${SERVICE_NAME}:${INSTANCE_ID}] Failed to start server:`, error);
    process.exit(1);
  }
};

// Start the application
if (require.main === module) {
  startServer();
}