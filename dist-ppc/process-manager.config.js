// Panchroma Process Manager - Completely Different PM2 Configuration
const path = require('path');

module.exports = {
  apps: [
    {
      name: 'panchroma-web-service',
      script: './server/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      ignore_watch: ["node_modules", "logs", "uploads"],
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Different port configuration
      env: {
        NODE_ENV: 'development',
        PORT: 7001,
        WS_PORT: 7002,
        INSTANCE_ID: 'dev'
      },
      
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 7001,
        WS_PORT: 7002,
        INSTANCE_ID: 'stage'
      },
      
      env_production: {
        NODE_ENV: 'production',
        PORT: 7001,
        WS_PORT: 7002,
        INSTANCE_ID: 'prod',
        DATABASE_URL: 'mongodb://127.0.0.1:27017/panchroma_production'
      },
      
      // Advanced logging configuration
      log_type: 'json',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/opt/panchroma/logs/web-service-error.log',
      out_file: '/opt/panchroma/logs/web-service-out.log',
      log_file: '/opt/panchroma/logs/web-service-combined.log',
      pid_file: '/opt/panchroma/pids/web-service.pid',
      
      // Monitoring and health checks
      health_check_grace_period: 3000,
      health_check_fatal_exceptions: true,
      
      // Performance monitoring
      pmx: true,
      instance_var: 'INSTANCE_ID',
      
      // Advanced features
      source_map_support: true,
      disable_trace: false,
      
      // Environment variables
      env_file: '/opt/panchroma/config/.env.production',
      
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      // Custom metrics
      custom_metrics: {
        "HTTP requests": {
          unit: "req/min",
          historic: true
        },
        "Database queries": {
          unit: "queries/min",
          historic: true  
        },
        "Memory usage": {
          unit: "MB",
          historic: true
        }
      }
    },
    
    // Background worker process
    {
      name: 'panchroma-worker-daemon',
      script: './workers/task-processor.js',
      instances: 2,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      min_uptime: '10s',
      max_restarts: 5,
      restart_delay: 2000,
      
      env: {
        NODE_ENV: 'development',
        WORKER_TYPE: 'task_processor',
        WORKER_ID: 'worker'
      },
      
      env_production: {
        NODE_ENV: 'production',
        WORKER_TYPE: 'task_processor',
        WORKER_ID: 'prod_worker',
        REDIS_URL: 'redis://127.0.0.1:6379/1'
      },
      
      // Worker-specific logging
      error_file: '/opt/panchroma/logs/worker-error.log',
      out_file: '/opt/panchroma/logs/worker-out.log',
      log_file: '/opt/panchroma/logs/worker-combined.log',
      pid_file: '/opt/panchroma/pids/worker.pid',
      
      // Cron-based restart
      cron_restart: '0 4 * * *', // Restart daily at 4 AM
      
      // Worker environment
      env_file: '/opt/panchroma/config/.env.worker'
    },
    
    // Email service
    {
      name: 'panchroma-mail-handler',
      script: './services/email-service.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      
      env_production: {
        NODE_ENV: 'production',
        SERVICE_TYPE: 'email',
        QUEUE_NAME: 'panchroma_emails',
        PORT: 7003
      },
      
      error_file: '/opt/panchroma/logs/mail-error.log',
      out_file: '/opt/panchroma/logs/mail-out.log',
      pid_file: '/opt/panchroma/pids/mail.pid'
    }
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'panchroma-deploy',
      host: 'production.server.com',
      ref: 'origin/main',
      repo: 'git@github.com:adityapachauri0/pan.git',
      path: '/opt/panchroma/deployment',
      ssh_options: 'StrictHostKeyChecking=no',
      
      'pre-setup': 'apt update && apt install git nodejs npm -y',
      'post-setup': 'npm install && npm run build',
      
      'pre-deploy-local': 'echo "Starting deployment..."',
      'pre-deploy': 'git fetch --all',
      'post-deploy': 'npm install && npm run build:production && pm2 reload process-manager.config.js --env production && pm2 save',
      
      env: {
        NODE_ENV: 'production',
        PORT: 7001
      }
    },
    
    staging: {
      user: 'panchroma-stage',
      host: 'staging.server.com',
      ref: 'origin/develop',
      repo: 'git@github.com:adityapachauri0/pan.git',
      path: '/opt/panchroma/staging',
      
      'post-deploy': 'npm install && npm run build:staging && pm2 reload process-manager.config.js --env staging',
      
      env: {
        NODE_ENV: 'staging',
        PORT: 7001
      }
    }
  },
  
  // Global PM2 configuration
  daemon_mode: true,
  max_memory_restart: '1G',
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  
  // Error handling
  error_file: '/opt/panchroma/logs/pm2-error.log',
  out_file: '/opt/panchroma/logs/pm2-out.log',
  log_file: '/opt/panchroma/logs/pm2-combined.log',
  pid_file: '/opt/panchroma/pids/pm2.pid',
  
  // Monitoring
  monitoring: true,
  pmx: true
};