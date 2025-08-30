#!/bin/bash

# Panchroma Production Deployment Script
# Usage: ./deploy.sh

echo "🚀 Starting Panchroma deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# 1. Build the client
echo -e "${YELLOW}Building client...${NC}"
cd client
npm run build
check_status "Client build"

# 2. Create production directory structure
echo -e "${YELLOW}Creating production structure...${NC}"
cd ..
mkdir -p dist
rm -rf dist/*
check_status "Clean dist directory"

# 3. Copy client build
cp -r client/build dist/client
check_status "Copy client build"

# 4. Copy server files
mkdir -p dist/server
cp -r server/index.js dist/server/
cp server/package.json dist/server/
cp server/.env.production dist/server/.env
check_status "Copy server files"

# 5. Install production dependencies for server
echo -e "${YELLOW}Installing server production dependencies...${NC}"
cd dist/server
npm install --production
check_status "Server dependencies"

# 6. Create start script
cat > ../start.sh << 'EOF'
#!/bin/bash
# Start Panchroma production server
cd server && NODE_ENV=production npm start
EOF
chmod +x ../start.sh
check_status "Create start script"

# 7. Create PM2 ecosystem file for process management
cat > ../ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'panchroma-server',
    script: './server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
EOF
check_status "Create PM2 config"

echo -e "${GREEN}✓ Deployment preparation complete!${NC}"
echo ""
echo "📦 Production files are in: ./dist/"
echo ""
echo "To deploy to your server:"
echo "1. Upload the ./dist/ folder to your server"
echo "2. Run: cd dist && npm install -g pm2 (if not installed)"
echo "3. Run: pm2 start ecosystem.config.js"
echo "4. Configure your web server (nginx/apache) to:"
echo "   - Serve client files from /dist/client"
echo "   - Proxy API requests to localhost:5000"
echo ""
echo "For static hosting (Vercel/Netlify):"
echo "   - Deploy the ./client/build folder"
echo "   - Set up API endpoints separately"