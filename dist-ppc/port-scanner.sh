#!/bin/bash

# Advanced Port Scanner and Conflict Resolution
# Completely different approach to port management

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Panchroma port configuration - completely different from standard
declare -A PANCHROMA_PORTS=(
    ["web_api"]="7001"
    ["websocket"]="7002"  
    ["email_service"]="7003"
    ["http_proxy"]="8080"
    ["https_proxy"]="8443"
    ["nginx_status"]="9001"
    ["redis_cache"]="6380"
    ["mongodb"]="27017"
    ["health_monitor"]="9999"
)

# Existing project ports (user's current setup)
declare -A EXISTING_PORTS=(
    ["frontend_3008"]="3008"
    ["backend_5008"]="5008"
)

log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

header() {
    echo -e "${PURPLE}$1${NC}"
}

# Advanced port scanning function
scan_port() {
    local port=$1
    local timeout=3
    
    # Multiple methods to check port availability
    local methods=0
    local available=0
    
    # Method 1: netstat
    if command -v netstat >/dev/null 2>&1; then
        ((methods++))
        if ! netstat -tlnp 2>/dev/null | grep -q ":$port "; then
            ((available++))
        fi
    fi
    
    # Method 2: ss (more modern)
    if command -v ss >/dev/null 2>&1; then
        ((methods++))
        if ! ss -tlnp 2>/dev/null | grep -q ":$port "; then
            ((available++))
        fi
    fi
    
    # Method 3: lsof
    if command -v lsof >/dev/null 2>&1; then
        ((methods++))
        if ! lsof -i :$port >/dev/null 2>&1; then
            ((available++))
        fi
    fi
    
    # Method 4: nc (netcat) test
    if command -v nc >/dev/null 2>&1; then
        ((methods++))
        if ! timeout $timeout nc -z localhost $port 2>/dev/null; then
            ((available++))
        fi
    fi
    
    # Return true if majority of methods say port is available
    if [[ $methods -gt 0 ]] && [[ $available -eq $methods ]]; then
        return 0  # Available
    else
        return 1  # Busy
    fi
}

# Get detailed port information
get_port_info() {
    local port=$1
    
    echo "Port $port details:"
    
    # netstat info
    if command -v netstat >/dev/null 2>&1; then
        local netstat_info=$(netstat -tlnp 2>/dev/null | grep ":$port " | head -1)
        if [[ -n "$netstat_info" ]]; then
            echo "  netstat: $netstat_info"
        fi
    fi
    
    # lsof info  
    if command -v lsof >/dev/null 2>&1; then
        local lsof_info=$(lsof -i :$port 2>/dev/null | grep LISTEN | head -1)
        if [[ -n "$lsof_info" ]]; then
            echo "  lsof: $lsof_info"
        fi
    fi
    
    # ss info
    if command -v ss >/dev/null 2>&1; then
        local ss_info=$(ss -tlnp 2>/dev/null | grep ":$port " | head -1)
        if [[ -n "$ss_info" ]]; then
            echo "  ss: $ss_info"
        fi
    fi
}

# Scan all Panchroma ports
scan_panchroma_ports() {
    header "🔍 Scanning Panchroma Ports..."
    echo "=================================="
    
    local conflicts=0
    local available_count=0
    
    for service in "${!PANCHROMA_PORTS[@]}"; do
        local port=${PANCHROMA_PORTS[$service]}
        
        printf "%-20s Port %-5s: " "$service" "$port"
        
        if scan_port $port; then
            success "AVAILABLE"
            ((available_count++))
        else
            error "BUSY"
            ((conflicts++))
            get_port_info $port
        fi
    done
    
    echo
    info "Panchroma Ports Summary:"
    info "  Available: $available_count"
    info "  Conflicts: $conflicts"
    
    return $conflicts
}

# Scan existing project ports
scan_existing_ports() {
    header "🔍 Scanning Your Existing Project Ports..."
    echo "=========================================="
    
    for service in "${!EXISTING_PORTS[@]}"; do
        local port=${EXISTING_PORTS[$service]}
        
        printf "%-20s Port %-5s: " "$service" "$port"
        
        if scan_port $port; then
            warning "NOT RUNNING"
        else
            success "RUNNING"
            get_port_info $port
        fi
    done
    echo
}

# Generate alternative port suggestions
suggest_alternatives() {
    header "🔧 Port Conflict Resolution..."
    echo "=============================="
    
    local alternatives=()
    
    # Generate alternative ports in different ranges
    local ranges=(
        "7100-7199"  # 7100 series
        "8100-8199"  # 8100 series  
        "9100-9199"  # 9100 series
        "6100-6199"  # 6100 series
    )
    
    echo "Suggested alternative port assignments:"
    echo
    
    for service in "${!PANCHROMA_PORTS[@]}"; do
        local current_port=${PANCHROMA_PORTS[$service]}
        
        if ! scan_port $current_port; then
            echo "❌ $service (currently $current_port) - NEEDS ALTERNATIVE:"
            
            local found_alternative=false
            for range in "${ranges[@]}"; do
                local start_port=$(echo $range | cut -d'-' -f1)
                local end_port=$(echo $range | cut -d'-' -f2)
                
                for ((test_port=start_port; test_port<=end_port; test_port++)); do
                    if scan_port $test_port; then
                        info "   → Suggested: $test_port"
                        found_alternative=true
                        break 2
                    fi
                done
            done
            
            if [[ "$found_alternative" == "false" ]]; then
                warning "   → No alternative found in suggested ranges"
            fi
        else
            success "✅ $service ($current_port) - OK"
        fi
    done
}

# Generate configuration files with alternative ports
generate_config_alternatives() {
    local config_dir="./alternative-configs"
    mkdir -p $config_dir
    
    header "📝 Generating Alternative Configurations..."
    echo "==========================================="
    
    # Find alternative ports
    declare -A alt_ports
    for service in "${!PANCHROMA_PORTS[@]}"; do
        local current_port=${PANCHROMA_PORTS[$service]}
        
        if ! scan_port $current_port; then
            # Find alternative
            for ((test_port=7100; test_port<=7199; test_port++)); do
                if scan_port $test_port; then
                    alt_ports[$service]=$test_port
                    break
                fi
            done
        else
            alt_ports[$service]=$current_port
        fi
    done
    
    # Generate PM2 config with alternative ports
    cat > $config_dir/process-manager-alt.config.js <<EOF
// Alternative PM2 Configuration with Conflict-Free Ports
module.exports = {
  apps: [
    {
      name: 'panchroma-web-service-alt',
      script: './server/app.js',
      instances: 1,
      env_production: {
        NODE_ENV: 'production',
        PORT: ${alt_ports[web_api]},
        WS_PORT: ${alt_ports[websocket]},
        EMAIL_PORT: ${alt_ports[email_service]}
      }
    }
  ]
};
EOF
    
    # Generate nginx config with alternative ports
    cat > $config_dir/webserver-alt.conf <<EOF
# Alternative Nginx Configuration
upstream panchroma_api_backend_alt {
    server 127.0.0.1:${alt_ports[web_api]};
}

server {
    listen ${alt_ports[http_proxy]};
    server_name panchroma.alt.local;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen ${alt_ports[https_proxy]} ssl http2;
    server_name panchroma.alt.local;
    
    # Your SSL configuration here
    
    location /panchroma-api/ {
        rewrite ^/panchroma-api/(.*) /\$1 break;
        proxy_pass http://panchroma_api_backend_alt;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
    
    location / {
        root /opt/panchroma/webapp/dist;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
    
    success "Alternative configurations generated in $config_dir/"
    info "Files created:"
    info "  • process-manager-alt.config.js"
    info "  • webserver-alt.conf"
    
    echo
    info "Alternative Port Assignments:"
    for service in "${!alt_ports[@]}"; do
        printf "  %-20s: %s" "$service" "${alt_ports[$service]}"
        if [[ ${alt_ports[$service]} != ${PANCHROMA_PORTS[$service]} ]]; then
            echo -e " ${YELLOW}(changed from ${PANCHROMA_PORTS[$service]})${NC}"
        else
            echo -e " ${GREEN}(unchanged)${NC}"
        fi
    done
}

# System resource check
check_system_resources() {
    header "💻 System Resource Check..."
    echo "============================"
    
    # Check available memory
    if command -v free >/dev/null 2>&1; then
        local mem_info=$(free -h | grep "Mem:")
        info "Memory: $mem_info"
    fi
    
    # Check CPU load
    if [[ -r /proc/loadavg ]]; then
        local load_avg=$(cat /proc/loadavg | cut -d' ' -f1-3)
        info "Load Average: $load_avg"
    fi
    
    # Check disk space
    if command -v df >/dev/null 2>&1; then
        local disk_info=$(df -h / | tail -1)
        info "Disk Space: $disk_info"
    fi
    
    # Check running processes
    local process_count=$(ps aux | wc -l)
    info "Running Processes: $process_count"
    
    echo
}

# Network interface check
check_network() {
    header "🌐 Network Interface Check..."
    echo "============================="
    
    # Check network interfaces
    if command -v ip >/dev/null 2>&1; then
        info "Active Network Interfaces:"
        ip addr show | grep -E "inet " | grep -v "127.0.0.1" | while read line; do
            echo "  $line"
        done
    elif command -v ifconfig >/dev/null 2>&1; then
        info "Network Interfaces:"
        ifconfig | grep -E "inet " | grep -v "127.0.0.1"
    fi
    
    echo
}

# Main function
main() {
    clear
    header "🚀 Panchroma Advanced Port Scanner & Conflict Resolver"
    header "======================================================"
    echo
    
    log "Starting comprehensive port analysis..."
    echo
    
    scan_existing_ports
    
    if scan_panchroma_ports; then
        success "🎉 No port conflicts detected! Ready to deploy."
    else
        warning "⚠️  Port conflicts found!"
        suggest_alternatives
        generate_config_alternatives
    fi
    
    echo
    check_system_resources
    check_network
    
    header "📋 Deployment Readiness Summary"
    header "==============================="
    
    info "Next Steps:"
    echo "  1. Review port assignments above"
    echo "  2. Use alternative configs if conflicts found"
    echo "  3. Run: ./infrastructure-deploy.sh"
    echo "  4. Monitor with: pm2 monit"
    echo
    
    success "✅ Port analysis complete!"
}

# Handle command line arguments
case "${1:-}" in
    --scan-only)
        scan_panchroma_ports
        scan_existing_ports
        ;;
    --suggest)
        suggest_alternatives
        ;;
    --generate-alt)
        generate_config_alternatives
        ;;
    --help)
        echo "Usage: $0 [--scan-only|--suggest|--generate-alt|--help]"
        echo
        echo "Options:"
        echo "  --scan-only     Only scan ports, don't generate configs"
        echo "  --suggest       Suggest alternative ports for conflicts"
        echo "  --generate-alt  Generate alternative configuration files"
        echo "  --help          Show this help message"
        ;;
    *)
        main
        ;;
esac