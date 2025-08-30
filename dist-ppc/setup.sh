#!/bin/bash
# Run this on the server after uploading files

# Install dependencies
cd /var/www/ppc.panchroma.ca/server
npm install --production

# Start with PM2
pm2 delete ppc-panchroma-server 2>/dev/null
pm2 start /var/www/ppc.panchroma.ca/ecosystem.config.js
pm2 save

# Copy nginx config
sudo cp /var/www/ppc.panchroma.ca/nginx-ppc.conf /etc/nginx/sites-available/ppc.panchroma.ca
sudo ln -sf /etc/nginx/sites-available/ppc.panchroma.ca /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Setup complete!"
