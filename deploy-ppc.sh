#!/bin/bash

# Deploy to ppc.panchroma.ca
# This script prepares and deploys the site to the ppc subdomain

echo "🚀 Deploying to ppc.panchroma.ca..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Server details (update these with your actual server info)
SERVER_USER="root"  # Change to your server username
SERVER_HOST="panchroma.ca"  # Your server IP or hostname
REMOTE_PATH="/var/www/ppc.panchroma.ca"

# Build the project
echo -e "${YELLOW}Building production version...${NC}"
cd client
npm run build
cd ..

# Create deployment package
echo -e "${YELLOW}Creating deployment package...${NC}"
rm -rf dist-ppc
mkdir -p dist-ppc

# Copy client build
cp -r client/build dist-ppc/client

# Copy server files
mkdir -p dist-ppc/server
cp server/index.js dist-ppc/server/
cp server/package.json dist-ppc/server/
cp server/.env.production dist-ppc/server/.env

# Copy nginx config
cp nginx-ppc.conf dist-ppc/

# Create PM2 config for ppc subdomain
cat > dist-ppc/ecosystem.config.js << 'EOF'
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
EOF

# Create setup script for server
cat > dist-ppc/setup.sh << 'EOF'
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
EOF
chmod +x dist-ppc/setup.sh

echo -e "${GREEN}✅ Deployment package ready in dist-ppc/${NC}"
echo ""
echo "📤 To deploy to server, run:"
echo ""
echo "  # Upload files to server"
echo "  scp -r dist-ppc/* ${SERVER_USER}@${SERVER_HOST}:${REMOTE_PATH}/"
echo ""
echo "  # SSH into server and run setup"
echo "  ssh ${SERVER_USER}@${SERVER_HOST}"
echo "  cd ${REMOTE_PATH}"
echo "  ./setup.sh"
echo ""
echo "🌐 Your site will be live at: https://ppc.panchroma.ca"