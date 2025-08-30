#!/bin/bash

# Quick VPS Status Check
# Shows all PM2 processes and Panchroma health

SERVER_IP="31.97.57.193"
SERVER_USER="root"

echo "🔍 Checking VPS Status..."
echo "========================="

expect -c "
    set timeout 30
    spawn ssh $SERVER_USER@$SERVER_IP
    expect \"password:\"
    send \"w(7rjMOF4'nzhIOuOdPF\r\"
    expect \"root@*\"
    
    send \"echo '=== PM2 Processes ==='\r\"
    expect \"root@*\"
    send \"pm2 list\r\"
    expect \"root@*\"
    
    send \"echo ''\r\"
    send \"echo '=== Panchroma Health Check ==='\r\"
    expect \"root@*\"
    send \"curl -s http://localhost:7001/health-status 2>/dev/null | head -5 || echo 'Panchroma not running on 7001'\r\"
    expect \"root@*\"
    
    send \"echo ''\r\"
    send \"echo '=== Port Usage ==='\r\"
    expect \"root@*\"
    send \"netstat -tlnp | grep -E ':(3008|5008|7001|7002)' || echo 'No services on expected ports'\r\"
    expect \"root@*\"
    
    send \"echo ''\r\"
    send \"echo '=== Nginx Status ==='\r\"
    expect \"root@*\"
    send \"systemctl is-active nginx\r\"
    expect \"root@*\"
    
    send \"exit\r\"
    expect eof
"

echo ""
echo "✅ Status check complete!"