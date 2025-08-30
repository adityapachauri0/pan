#!/bin/bash
# Run this on the server after uploading files

echo "🚀 Starting Panchroma deployment..."

# Create directories
sudo mkdir -p /var/www/panchroma/logs
sudo chown -R $USER:$USER /var/www/panchroma/

# Install dependencies
echo "📦 Installing server dependencies..."
cd /var/www/panchroma/server
npm install --production

# Start with PM2
echo "🔄 Starting PM2 process..."
pm2 delete panchroma-server 2>/dev/null || true
pm2 start /var/www/panchroma/ecosystem.config.js
pm2 save

# Copy nginx config (you need to update the domain name first)
echo "🌐 Setting up Nginx configuration..."
echo "⚠️  Please update the domain name in nginx-ppc.conf before running:"
echo "   sudo cp /var/www/panchroma/nginx-ppc.conf /etc/nginx/sites-available/panchroma.conf"
echo "   sudo ln -sf /etc/nginx/sites-available/panchroma.conf /etc/nginx/sites-enabled/"
echo "   sudo nginx -t && sudo systemctl reload nginx"

# Show status
echo ""
echo "📊 Current PM2 processes:"
pm2 list

echo ""
echo "✅ Panchroma setup complete!"
echo "🚀 Backend running on port 5009"
echo "🌐 Frontend ready to serve from /var/www/panchroma/client"
echo ""
echo "📋 Next steps:"
echo "1. Update nginx-ppc.conf with your domain name"
echo "2. Copy nginx config and reload"
echo "3. Update SSL certificates if needed"
echo "4. Your site will be live!"
