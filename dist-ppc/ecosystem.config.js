module.exports = {
  apps: [{
    name: 'ppc-panchroma-server',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      PORT: 5001
    }
  }]
};
