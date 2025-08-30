// PM2 Configuration for Panchroma
// Following your server's PM2 standards

module.exports = {
  apps: [{
    // Simple, clear naming for your PM2 list
    name: 'panchroma',
    
    // Main server file
    script: './server/index.js',
    
    // Working directory
    cwd: '/var/www/panchroma',
    
    // Single instance (can be changed to 'max' for clustering)
    instances: 1,
    
    // Auto restart on crash
    autorestart: true,
    
    // Watch for file changes (disable in production)
    watch: false,
    
    // Memory limit before restart
    max_memory_restart: '1G',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 7001,
      WS_PORT: 7002
    },
    
    env_production: {
      NODE_ENV: 'production',
      PORT: 7001,
      WS_PORT: 7002,
      DATABASE_URL: 'mongodb://localhost:27017/panchroma_db'
    },
    
    // Logs - following your server structure
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Merge logs
    merge_logs: true,
    
    // Log date format
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // Min uptime before considered successfully started
    min_uptime: '10s',
    
    // Max restarts in min_uptime
    max_restarts: 10,
    
    // Delay between restarts
    restart_delay: 4000,
    
    // Kill timeout
    kill_timeout: 5000,
    
    // Node arguments
    node_args: '--max-old-space-size=1024',
    
    // Interpreter arguments
    interpreter_args: '',
    
    // Post-start hook (for pm2 save)
    post_update: ['npm install', 'pm2 save'],
    
    // Enable source map support
    source_map_support: true,
    
    // Instance variable
    instance_var: 'INSTANCE_ID'
  }]
};