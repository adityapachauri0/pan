#!/bin/bash

# Panchroma Infrastructure Deployment - Completely Different Approach
# Using systemd services, custom directory structure, and advanced monitoring

set -euo pipefail

# Configuration
DEPLOY_USER="panchroma-deploy"
APP_NAME="panchroma"
BASE_DIR="/opt/panchroma"
WEBAPP_DIR="${BASE_DIR}/webapp"
CONFIG_DIR="${BASE_DIR}/config"
LOGS_DIR="${BASE_DIR}/logs"
PIDS_DIR="${BASE_DIR}/pids"
BACKUP_DIR="${BASE_DIR}/backups"
NGINX_SITE="panchroma-webserver"
SYSTEMD_SERVICE="panchroma-app"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "Don't run this script as root! Use a regular user with sudo privileges."
    fi
}

# Check system requirements
check_requirements() {
    log "Checking system requirements..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js 18+ first."
    fi
    
    local node_version=$(node --version | cut -d'v' -f2)
    local major_version=$(echo $node_version | cut -d'.' -f1)
    
    if [[ $major_version -lt 18 ]]; then
        error "Node.js version 18+ required. Current version: $node_version"
    fi
    
    # Check required packages
    local required_packages=("nginx" "redis-server" "mongodb" "git" "curl" "jq")
    for package in "${required_packages[@]}"; do
        if ! command -v $package &> /dev/null; then
            warning "$package not found. Installing..."
            sudo apt update && sudo apt install -y $package
        fi
    done
    
    success "System requirements check completed"
}

# Create directory structure
setup_directories() {
    log "Setting up directory structure..."
    
    sudo mkdir -p $BASE_DIR/{webapp,config,logs,pids,backups,ssl,uploads,cache}
    sudo mkdir -p $WEBAPP_DIR/{dist,server,workers,services}
    sudo mkdir -p $CONFIG_DIR/{nginx,systemd,environment}
    sudo mkdir -p $LOGS_DIR/{nginx,app,workers,system}
    
    # Set permissions
    sudo chown -R $USER:www-data $BASE_DIR
    sudo chmod -R 755 $BASE_DIR
    sudo chmod -R 775 $LOGS_DIR
    sudo chmod -R 755 $CONFIG_DIR
    
    success "Directory structure created"
}

# Setup system user for deployment
setup_deployment_user() {
    log "Setting up deployment user..."
    
    if ! id "$DEPLOY_USER" &>/dev/null; then
        sudo useradd -r -s /bin/bash -d $BASE_DIR -m $DEPLOY_USER
        sudo usermod -a -G www-data $DEPLOY_USER
        success "Created deployment user: $DEPLOY_USER"
    else
        info "Deployment user already exists"
    fi
}

# Install PM2 globally with different configuration
setup_process_manager() {
    log "Setting up process manager..."
    
    # Install PM2 with custom configuration
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2@latest
    fi
    
    # Configure PM2 for production
    pm2 install pm2-logrotate
    pm2 set pm2-logrotate:max_size 50M
    pm2 set pm2-logrotate:retain 30
    pm2 set pm2-logrotate:compress true
    
    # Install monitoring modules
    pm2 install pm2-server-monit
    
    success "Process manager configured"
}

# Setup Redis for session and caching
setup_redis() {
    log "Configuring Redis..."
    
    sudo systemctl enable redis-server
    sudo systemctl start redis-server
    
    # Configure Redis for production
    sudo tee /etc/redis/redis-panchroma.conf > /dev/null <<EOF
# Panchroma Redis Configuration
port 6380
bind 127.0.0.1
timeout 300
databases 16
save 900 1
save 300 10
save 60 10000
rdbcompression yes
dbfilename panchroma-dump.rdb
dir /var/lib/redis/panchroma/
maxmemory 256mb
maxmemory-policy allkeys-lru
EOF
    
    sudo mkdir -p /var/lib/redis/panchroma
    sudo chown redis:redis /var/lib/redis/panchroma
    
    success "Redis configured"
}

# Setup MongoDB with custom database
setup_database() {
    log "Configuring MongoDB..."
    
    sudo systemctl enable mongod
    sudo systemctl start mongod
    
    # Create database and user
    mongo <<EOF
use panchroma_app;
db.createUser({
  user: "panchroma_user",
  pwd: "$(openssl rand -base64 32)",
  roles: ["readWrite"]
});
db.settings.insertOne({
  app_name: "panchroma",
  version: "1.0.0",
  initialized_at: new Date()
});
EOF
    
    success "MongoDB configured"
}

# Deploy application files
deploy_application() {
    log "Deploying application files..."
    
    # Copy application files
    cp -r ./client/build/* $WEBAPP_DIR/dist/
    cp -r ./server/* $WEBAPP_DIR/server/
    
    # Copy configuration files
    cp process-manager.config.js $CONFIG_DIR/
    cp webserver.conf $CONFIG_DIR/nginx/
    
    # Install dependencies
    cd $WEBAPP_DIR/server
    npm ci --only=production
    
    # Set permissions
    sudo chown -R $DEPLOY_USER:www-data $WEBAPP_DIR
    sudo chmod -R 755 $WEBAPP_DIR
    
    success "Application deployed"
}

# Setup Nginx with custom configuration
setup_webserver() {
    log "Configuring web server..."
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Copy custom configuration
    sudo cp $CONFIG_DIR/nginx/webserver.conf /etc/nginx/sites-available/$NGINX_SITE
    sudo ln -sf /etc/nginx/sites-available/$NGINX_SITE /etc/nginx/sites-enabled/
    
    # Test configuration
    sudo nginx -t || error "Nginx configuration test failed"
    
    # Enable and start nginx
    sudo systemctl enable nginx
    sudo systemctl reload nginx
    
    success "Web server configured"
}

# Create systemd service
setup_systemd_service() {
    log "Creating systemd service..."
    
    sudo tee /etc/systemd/system/${SYSTEMD_SERVICE}.service > /dev/null <<EOF
[Unit]
Description=Panchroma Web Application
After=network.target mongodb.service redis-server.service
Wants=mongodb.service redis-server.service

[Service]
Type=forking
User=$DEPLOY_USER
Group=www-data
WorkingDirectory=$WEBAPP_DIR
Environment=NODE_ENV=production
Environment=PORT=7001
Environment=PM2_HOME=$BASE_DIR/.pm2
ExecStart=/usr/bin/pm2 start $CONFIG_DIR/process-manager.config.js --env production
ExecReload=/usr/bin/pm2 reload $CONFIG_DIR/process-manager.config.js --env production
ExecStop=/usr/bin/pm2 stop $CONFIG_DIR/process-manager.config.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=panchroma-app

[Install]
WantedBy=multi-user.target
EOF
    
    # Enable service
    sudo systemctl daemon-reload
    sudo systemctl enable ${SYSTEMD_SERVICE}.service
    
    success "Systemd service created"
}

# Setup SSL certificates
setup_ssl() {
    log "Setting up SSL certificates..."
    
    # Create self-signed certificate for testing
    sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout $BASE_DIR/ssl/privkey.pem \
        -out $BASE_DIR/ssl/fullchain.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=panchroma.local"
    
    # Generate DH parameters
    sudo openssl dhparam -out $BASE_DIR/ssl/dhparam.pem 2048
    
    # Set permissions
    sudo chmod 600 $BASE_DIR/ssl/privkey.pem
    sudo chmod 644 $BASE_DIR/ssl/fullchain.pem
    sudo chmod 644 $BASE_DIR/ssl/dhparam.pem
    
    success "SSL certificates configured"
}

# Setup monitoring and logging
setup_monitoring() {
    log "Setting up monitoring..."
    
    # Install log monitoring tools
    sudo apt install -y logwatch fail2ban
    
    # Configure fail2ban for nginx
    sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true

[nginx-noproxy]
enabled = true
EOF
    
    # Setup logrotate for application logs
    sudo tee /etc/logrotate.d/panchroma > /dev/null <<EOF
$LOGS_DIR/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $DEPLOY_USER www-data
    postrotate
        systemctl reload $SYSTEMD_SERVICE
    endscript
}
EOF
    
    success "Monitoring configured"
}

# Start services
start_services() {
    log "Starting services..."
    
    # Start application
    sudo systemctl start ${SYSTEMD_SERVICE}.service
    
    # Start supporting services
    sudo systemctl start fail2ban
    
    # Verify services are running
    sleep 5
    
    if sudo systemctl is-active --quiet ${SYSTEMD_SERVICE}.service; then
        success "Application service started"
    else
        error "Application service failed to start"
    fi
    
    if sudo systemctl is-active --quiet nginx; then
        success "Web server started"
    else
        error "Web server failed to start"
    fi
}

# Health check
perform_health_check() {
    log "Performing health check..."
    
    # Check if ports are listening
    local ports=(7001 7002 8080 8443)
    for port in "${ports[@]}"; do
        if netstat -tlnp | grep -q ":$port "; then
            success "Port $port is listening"
        else
            warning "Port $port is not listening"
        fi
    done
    
    # Check application health
    if curl -f -s http://localhost:7001/health-status > /dev/null; then
        success "Application health check passed"
    else
        warning "Application health check failed"
    fi
    
    # Check web server
    if curl -f -s -k https://localhost:8443/health-status > /dev/null; then
        success "Web server health check passed"
    else
        warning "Web server health check failed"
    fi
}

# Display deployment summary
show_summary() {
    echo
    echo -e "${PURPLE}🎉 Panchroma Deployment Complete! ${NC}"
    echo -e "${PURPLE}================================${NC}"
    echo
    info "Application Directory: $BASE_DIR"
    info "Configuration: $CONFIG_DIR"
    info "Logs: $LOGS_DIR"
    info "Web Server Ports: 8080 (HTTP), 8443 (HTTPS)"
    info "API Ports: 7001 (Main), 7002 (WebSocket), 7003 (Email)"
    echo
    info "Service Management:"
    echo "  • Start:   sudo systemctl start $SYSTEMD_SERVICE"
    echo "  • Stop:    sudo systemctl stop $SYSTEMD_SERVICE"
    echo "  • Restart: sudo systemctl restart $SYSTEMD_SERVICE"
    echo "  • Status:  sudo systemctl status $SYSTEMD_SERVICE"
    echo
    info "Process Management:"
    echo "  • PM2 Status: pm2 list"
    echo "  • PM2 Logs:   pm2 logs"
    echo "  • PM2 Monit:  pm2 monit"
    echo
    info "Monitoring:"
    echo "  • Nginx Status: curl http://127.0.0.1:9001/nginx_status"
    echo "  • App Health:   curl http://localhost:7001/health-status"
    echo "  • Web Health:   curl -k https://localhost:8443/health-status"
    echo
    success "🚀 Your Panchroma application is now running!"
}

# Main deployment function
main() {
    log "🚀 Starting Panchroma Infrastructure Deployment..."
    echo
    
    check_root
    check_requirements
    setup_directories
    setup_deployment_user
    setup_process_manager
    setup_redis
    setup_database
    deploy_application
    setup_webserver
    setup_systemd_service
    setup_ssl
    setup_monitoring
    start_services
    perform_health_check
    show_summary
    
    echo
    success "🎉 Deployment completed successfully!"
}

# Run main function
main "$@"