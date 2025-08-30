#!/bin/bash

# Panchroma Server Deployment Script
# Compatible with your existing server workflow and add-new-project.sh

set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration - matching your server setup
PROJECT_NAME="panchroma"
PROJECT_DIR="/var/www/panchroma"
PM2_CONFIG="panchroma-pm2.config.js"
NGINX_CONFIG="panchroma.conf"
PORT_API=7001
PORT_WS=7002

echo -e "${BLUE}🚀 Panchroma Server Deployment${NC}"
echo "=================================="

# Step 1: Run add-new-project.sh first
echo -e "${YELLOW}Step 1: Preparing project with add-new-project.sh${NC}"
echo "Please run: /root/add-new-project.sh"
echo "Project Name: $PROJECT_NAME"
echo "Project Directory: $PROJECT_DIR"
echo "Press Enter after running add-new-project.sh..."
read

# Step 2: Create project directory structure
echo -e "${BLUE}Step 2: Setting up project directories...${NC}"
sudo mkdir -p $PROJECT_DIR/{client,server,logs,config}
sudo chown -R $USER:www-data $PROJECT_DIR

# Step 3: Copy files to server directories
echo -e "${BLUE}Step 3: Copying project files...${NC}"
cp -r client/build/* $PROJECT_DIR/client/
cp -r server/* $PROJECT_DIR/server/
cp panchroma-pm2.config.js $PROJECT_DIR/config/
cp panchroma.conf $PROJECT_DIR/config/

# Step 4: Install dependencies
echo -e "${BLUE}Step 4: Installing dependencies...${NC}"
cd $PROJECT_DIR/server
npm install --production

# Step 5: Setup environment
echo -e "${BLUE}Step 5: Setting up environment...${NC}"
cat > $PROJECT_DIR/server/.env << EOF
NODE_ENV=production
PORT=$PORT_API
WS_PORT=$PORT_WS
DATABASE_URL=mongodb://localhost:27017/panchroma_db
SERVICE_NAME=panchroma
EOF

# Step 6: Configure PM2 (following your server standards)
echo -e "${BLUE}Step 6: Starting with PM2...${NC}"
cd $PROJECT_DIR

# Delete if exists (clean start)
pm2 delete panchroma 2>/dev/null || true

# Start with PM2
pm2 start config/$PM2_CONFIG --env production

# IMPORTANT: Save PM2 state (as per your workflow)
pm2 save
echo -e "${GREEN}✅ PM2 state saved${NC}"

# Step 7: Setup Nginx
echo -e "${BLUE}Step 7: Configuring Nginx...${NC}"
sudo cp $PROJECT_DIR/config/$NGINX_CONFIG /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/$NGINX_CONFIG /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Step 8: Verify deployment
echo -e "${BLUE}Step 8: Verifying deployment...${NC}"
sleep 3

# Check PM2 processes
echo -e "${YELLOW}PM2 Processes:${NC}"
pm2 list

# Check if service is running
if curl -f -s http://localhost:$PORT_API/health-status > /dev/null; then
    echo -e "${GREEN}✅ API is running on port $PORT_API${NC}"
else
    echo -e "${RED}❌ API health check failed${NC}"
fi

# Final instructions
echo
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================="
echo
echo -e "${YELLOW}Your Server Workflow Commands:${NC}"
echo "1. View all processes:"
echo "   ${BLUE}pm2 list${NC}"
echo
echo "2. Monitor in real-time:"
echo "   ${BLUE}pm2 monit${NC}"
echo
echo "3. View logs:"
echo "   ${BLUE}pm2 logs panchroma${NC}"
echo
echo "4. After any changes:"
echo "   ${BLUE}pm2 save${NC}  # Saves current state"
echo
echo "5. If something crashes:"
echo "   ${BLUE}pm2 resurrect${NC}  # Restores saved state"
echo
echo "6. Restart service:"
echo "   ${BLUE}pm2 restart panchroma${NC}"
echo
echo -e "${GREEN}✅ Panchroma is now part of your PM2 managed services!${NC}"
echo "Port: $PORT_API (API), $PORT_WS (WebSocket)"
echo "Directory: $PROJECT_DIR"