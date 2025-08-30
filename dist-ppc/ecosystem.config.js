module.exports = {
  apps: [{
    name: 'panchroma-server',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 5009  // Using 5009 to avoid conflicts with existing 5008
    },
    error_file: './logs/panchroma-error.log',
    out_file: './logs/panchroma-out.log',
    log_file: './logs/panchroma-combined.log',
    time: true
  }]
};
