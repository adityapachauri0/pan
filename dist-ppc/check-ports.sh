#!/bin/bash

echo "🔍 Checking port availability on VPS..."
echo "========================================="

# Function to check if port is in use
check_port() {
    local port=$1
    local service=$2
    
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        echo "❌ Port $port is BUSY ($service)"
        echo "   Process using port $port:"
        netstat -tlnp 2>/dev/null | grep ":$port " | head -1
        return 1
    else
        echo "✅ Port $port is AVAILABLE ($service)"
        return 0
    fi
}

echo "Checking ports for multi-project setup:"
echo ""

# Check existing projects
check_port 3008 "Your existing frontend project"
check_port 5008 "Your existing backend project"

echo ""
echo "Checking Panchroma ports:"
check_port 5009 "Panchroma backend (planned)"
check_port 80   "HTTP (Nginx)"
check_port 443  "HTTPS (Nginx)"

echo ""
echo "Checking database ports:"
check_port 27017 "MongoDB"
check_port 3306  "MySQL (if used)"
check_port 5432  "PostgreSQL (if used)"

echo ""
echo "========================================="

# Count available ports
available=0
busy=0

for port in 3008 5008 5009; do
    if netstat -tlnp 2>/dev/null | grep -q ":$port "; then
        ((busy++))
    else
        ((available++))
    fi
done

if [ $available -eq 3 ]; then
    echo "🎉 All ports available - ready to deploy!"
elif [ $busy -eq 2 ] && ! netstat -tlnp 2>/dev/null | grep -q ":5009 "; then
    echo "✅ Existing projects detected on 3008/5008"
    echo "✅ Port 5009 available for Panchroma - good to go!"
else
    echo "⚠️  Port conflicts detected. Please check running services."
fi

echo ""
echo "📋 PM2 processes currently running:"
if command -v pm2 >/dev/null 2>&1; then
    pm2 list
else
    echo "PM2 not installed or not in PATH"
fi

echo ""
echo "🔧 To resolve port conflicts:"
echo "   - Stop conflicting services: pm2 stop <process-name>"
echo "   - Or modify ports in ecosystem.config.js"
echo "   - Or use different ports for new deployment"