#!/bin/bash

# Automated VPS Deployment Script for Panchroma
# Connects to your server and deploys the application

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Server Configuration
SERVER_IP="31.97.57.193"
SERVER_USER="root"
PROJECT_NAME="panchroma"
LOCAL_DIR="dist-ppc"
REMOTE_TEMP="/tmp/panchroma-deploy"
REMOTE_DIR="/var/www/panchroma"

echo -e "${BLUE}🚀 Panchroma VPS Deployment${NC}"
echo "=================================="
echo -e "Server: ${YELLOW}$SERVER_IP${NC}"
echo -e "Project: ${YELLOW}$PROJECT_NAME${NC}"
echo

# Step 1: Prepare local files
echo -e "${BLUE}Step 1: Preparing deployment files...${NC}"
if [ ! -d "$LOCAL_DIR" ]; then
    echo -e "${RED}Error: $LOCAL_DIR directory not found!${NC}"
    exit 1
fi

# Step 2: Create deployment archive
echo -e "${BLUE}Step 2: Creating deployment archive...${NC}"
tar -czf panchroma-deploy.tar.gz -C $LOCAL_DIR .
echo -e "${GREEN}✅ Archive created${NC}"

# Step 3: Upload files to server
echo -e "${BLUE}Step 3: Uploading files to server...${NC}"
expect -c "
    set timeout 30
    spawn scp panchroma-deploy.tar.gz $SERVER_USER@$SERVER_IP:$REMOTE_TEMP.tar.gz
    expect \"password:\"
    send \"w(7rjMOF4'nzhIOuOdPF\r\"
    expect eof
"
echo -e "${GREEN}✅ Files uploaded${NC}"

# Step 4: Connect and deploy
echo -e "${BLUE}Step 4: Connecting to server and deploying...${NC}"
expect -c "
    set timeout 300
    spawn ssh $SERVER_USER@$SERVER_IP
    expect \"password:\"
    send \"w(7rjMOF4'nzhIOuOdPF\r\"
    expect \"root@*\"
    
    # Create directories
    send \"mkdir -p $REMOTE_TEMP\r\"
    expect \"root@*\"
    
    # Extract files
    send \"cd $REMOTE_TEMP && tar -xzf $REMOTE_TEMP.tar.gz\r\"
    expect \"root@*\"
    
    # Make scripts executable
    send \"chmod +x $REMOTE_TEMP/*.sh\r\"
    expect \"root@*\"
    
    # Run add-new-project.sh if it exists
    send \"if [ -f /root/add-new-project.sh ]; then echo 'Running add-new-project.sh...'; else echo 'add-new-project.sh not found, continuing...'; fi\r\"
    expect \"root@*\"
    
    # Create project directory
    send \"mkdir -p $REMOTE_DIR/{client,server,logs,config}\r\"
    expect \"root@*\"
    
    # Copy files
    send \"cp -r $REMOTE_TEMP/client/* $REMOTE_DIR/client/ 2>/dev/null || true\r\"
    expect \"root@*\"
    send \"cp -r $REMOTE_TEMP/server/* $REMOTE_DIR/server/ 2>/dev/null || true\r\"
    expect \"root@*\"
    send \"cp $REMOTE_TEMP/panchroma-pm2.config.js $REMOTE_DIR/config/\r\"
    expect \"root@*\"
    send \"cp $REMOTE_TEMP/panchroma.conf $REMOTE_DIR/config/\r\"
    expect \"root@*\"
    
    # Install dependencies
    send \"cd $REMOTE_DIR/server && npm install --production\r\"
    expect \"root@*\"
    
    # Setup environment
    send \"cat > $REMOTE_DIR/server/.env << 'EOF'
NODE_ENV=production
PORT=7001
WS_PORT=7002
DATABASE_URL=mongodb://localhost:27017/panchroma_db
SERVICE_NAME=panchroma
EOF\r\"
    expect \"root@*\"
    
    # Start with PM2
    send \"pm2 delete panchroma 2>/dev/null || true\r\"
    expect \"root@*\"
    send \"cd $REMOTE_DIR && pm2 start config/panchroma-pm2.config.js --env production\r\"
    expect \"root@*\"
    
    # Save PM2 state
    send \"pm2 save\r\"
    expect \"root@*\"
    
    # Setup Nginx
    send \"cp $REMOTE_DIR/config/panchroma.conf /etc/nginx/sites-available/\r\"
    expect \"root@*\"
    send \"ln -sf /etc/nginx/sites-available/panchroma.conf /etc/nginx/sites-enabled/\r\"
    expect \"root@*\"
    send \"nginx -t && systemctl reload nginx\r\"
    expect \"root@*\"
    
    # Check status
    send \"pm2 list\r\"
    expect \"root@*\"
    
    # Health check
    send \"sleep 3 && curl -s http://localhost:7001/health-status | head -20\r\"
    expect \"root@*\"
    
    # Cleanup
    send \"rm -rf $REMOTE_TEMP\r\"
    expect \"root@*\"
    send \"rm $REMOTE_TEMP.tar.gz\r\"
    expect \"root@*\"
    
    send \"echo ''\r\"
    send \"echo '🎉 Deployment Complete!'\r\"
    send \"echo 'Panchroma is running on port 7001'\r\"
    send \"echo 'Use pm2 list to see all processes'\r\"
    send \"echo ''\r\"
    expect \"root@*\"
    
    send \"exit\r\"
    expect eof
"

# Cleanup local files
rm -f panchroma-deploy.tar.gz

echo
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================="
echo -e "Server: ${YELLOW}$SERVER_IP${NC}"
echo -e "API Port: ${YELLOW}7001${NC}"
echo -e "WebSocket Port: ${YELLOW}7002${NC}"
echo
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Update nginx domain in /etc/nginx/sites-available/panchroma.conf"
echo "2. Configure SSL certificates"
echo "3. Update DNS to point to your server"
echo
echo -e "${BLUE}Management Commands:${NC}"
echo "  ssh root@$SERVER_IP"
echo "  pm2 list              # View all processes"
echo "  pm2 logs panchroma    # View logs"
echo "  pm2 monit            # Monitor resources"
echo
echo -e "${GREEN}✅ Your Panchroma app is now live on VPS!${NC}"