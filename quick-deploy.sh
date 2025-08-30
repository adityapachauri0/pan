#!/bin/bash

# Quick One-Click Deployment to VPS
# Just run: ./quick-deploy.sh

echo "🚀 Starting Panchroma VPS Deployment..."
echo "======================================="

# Check if expect is installed
if ! command -v expect &> /dev/null; then
    echo "Installing expect..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install expect
    else
        sudo apt-get install -y expect
    fi
fi

# Run the deployment
./deploy-to-vps.sh

echo "✅ Deployment initiated!"