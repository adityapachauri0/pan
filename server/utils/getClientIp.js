const axios = require('axios');

// Cache for public IP (valid for 1 hour)
let publicIpCache = {
  ip: null,
  timestamp: 0
};

const getPublicIp = async () => {
  try {
    // Check cache (1 hour expiry)
    if (publicIpCache.ip && Date.now() - publicIpCache.timestamp < 3600000) {
      return publicIpCache.ip;
    }

    // Try multiple services for redundancy
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://api.my-ip.io/ip.json'
    ];

    for (const service of services) {
      try {
        const response = await axios.get(service, { timeout: 2000 });
        const ip = response.data.ip || response.data;
        if (ip && typeof ip === 'string' && ip.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
          publicIpCache = { ip, timestamp: Date.now() };
          return ip;
        }
      } catch (err) {
        // Try next service
        continue;
      }
    }
  } catch (error) {
    console.error('Failed to get public IP:', error.message);
  }
  return null;
};

const getClientIp = async (req) => {
  // Check for various headers that might contain the real IP
  const headers = [
    'x-real-ip',
    'x-forwarded-for',
    'cf-connecting-ip',
    'fastly-client-ip',
    'true-client-ip',
    'x-cluster-client-ip',
    'x-forwarded',
    'forwarded-for',
    'forwarded'
  ];

  for (const header of headers) {
    if (req.headers[header]) {
      // Handle comma-separated list of IPs (take the first one)
      const ip = req.headers[header].split(',')[0].trim();
      if (ip && ip !== 'unknown' && !ip.startsWith('::') && ip !== '127.0.0.1') {
        return ip;
      }
    }
  }

  // Get connection IP
  const connectionIp = req.connection?.remoteAddress || 
                      req.socket?.remoteAddress || 
                      req.connection?.socket?.remoteAddress ||
                      req.ip ||
                      'unknown';

  // If it's localhost, try to get public IP
  if (connectionIp === '::1' || connectionIp === '::ffff:127.0.0.1' || connectionIp === '127.0.0.1') {
    const publicIp = await getPublicIp();
    if (publicIp) {
      return publicIp + ' (dev)';
    }
  }

  return connectionIp;
};

module.exports = getClientIp;