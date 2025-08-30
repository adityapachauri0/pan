# 🚀 Panchroma VPS Multi-Project Deployment Guide

## 🎯 Overview

This guide helps you deploy Panchroma on your VPS alongside existing projects running on ports 3008/5008. The configuration uses port **5009** for the backend to avoid conflicts.

## 📋 Current VPS Setup Detected

- **Existing Projects**: Running on ports 3008 (frontend) and 5008 (backend)
- **Panchroma**: Will use port 5009 (backend) and standard Nginx port routing

## 🔧 Pre-Deployment Configuration

### 1. Update Domain Configuration

Edit `dist-ppc/nginx-ppc.conf` and replace `panchroma.yourdomain.com` with your actual domain or subdomain:

```nginx
server_name your-actual-domain.com;  # or subdomain.yourdomain.com
```

### 2. SSL Certificate Paths

Update SSL certificate paths in `nginx-ppc.conf`:

```nginx
ssl_certificate /path/to/your/certificate.crt;
ssl_certificate_key /path/to/your/private.key;
```

## 🚀 Deployment Steps

### Step 1: Upload Files to VPS

```bash
# Option A: Using SCP
scp -r dist-ppc/ user@your-vps:/var/www/panchroma/

# Option B: Using rsync (recommended)
rsync -avz --progress dist-ppc/ user@your-vps:/var/www/panchroma/
```

### Step 2: Run Setup Script on VPS

```bash
ssh user@your-vps
cd /var/www/panchroma/
chmod +x setup.sh
./setup.sh
```

### Step 3: Configure Nginx

```bash
# Update domain name in nginx config first, then:
sudo cp /var/www/panchroma/nginx-ppc.conf /etc/nginx/sites-available/panchroma.conf
sudo ln -sf /etc/nginx/sites-available/panchroma.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔍 Port Management

### Current Port Allocation:
- **Port 3008**: Your existing frontend project
- **Port 5008**: Your existing backend project  
- **Port 5009**: Panchroma backend (new)
- **Port 80/443**: Nginx handles all incoming requests

### PM2 Process Management:

```bash
# Check all running processes
pm2 list

# Monitor Panchroma specifically
pm2 logs panchroma-server

# Restart if needed
pm2 restart panchroma-server

# Stop (if needed)
pm2 stop panchroma-server
```

## 🌐 Domain/Subdomain Options

### Option 1: Subdomain (Recommended)
```
panchroma.yourdomain.com -> Panchroma site
project1.yourdomain.com  -> Your existing project (3008/5008)
```

### Option 2: Different Domain
```
panchroma-site.com -> Panchroma site
yourdomain.com     -> Your existing projects
```

### Option 3: Path-based (Advanced)
```
yourdomain.com/          -> Main project
yourdomain.com/panchroma -> Panchroma site
```

## 📊 Health Checks

### Verify Backend is Running:
```bash
curl http://localhost:5009/api
# Should return: {"message": "Panchroma API is running!"}
```

### Check Frontend:
```bash
curl -I http://your-domain.com
# Should return: 200 OK
```

### Monitor All Services:
```bash
pm2 monit  # Interactive monitoring
pm2 list   # List all processes
```

## 🛠️ Troubleshooting

### Port Conflicts:
```bash
# Check what's using ports
sudo netstat -tlnp | grep :5009
sudo lsof -i :5009
```

### PM2 Issues:
```bash
# Restart PM2
pm2 kill
pm2 resurrect

# View logs
pm2 logs panchroma-server --lines 50
```

### Nginx Issues:
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

### SSL Certificate Issues:
```bash
# Check certificate validity
openssl x509 -in /path/to/certificate.crt -text -noout
```

## 📈 Performance Optimization

### Enable All PM2 Features:
```bash
pm2 install pm2-logrotate  # Log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### Monitor Resources:
```bash
pm2 monit  # Real-time monitoring
htop       # System resources
```

## 🔒 Security Considerations

1. **Firewall Rules**: Ensure only necessary ports are open
   ```bash
   sudo ufw status
   sudo ufw allow 80,443/tcp
   ```

2. **Process Isolation**: Each project runs in its own PM2 process
3. **Nginx Security**: Security headers already configured
4. **SSL/HTTPS**: Enforced in production

## 📋 File Structure on VPS

```
/var/www/panchroma/
├── client/                 # React build files
├── server/                 # Node.js backend
├── logs/                   # PM2 logs
├── ecosystem.config.js     # PM2 configuration
├── nginx-ppc.conf         # Nginx configuration
└── setup.sh              # Setup script
```

## 🎯 Next Steps After Deployment

1. **Test all functionality**: Forms, API endpoints, routing
2. **Set up monitoring**: PM2 monitoring, error tracking
3. **Configure backups**: Database and file backups
4. **Set up CI/CD**: Automated deployments from GitHub
5. **Performance tuning**: Optimize based on traffic

## 📞 Quick Commands Reference

```bash
# Deploy
./setup.sh

# Status
pm2 list

# Logs
pm2 logs panchroma-server

# Restart
pm2 restart panchroma-server

# Nginx reload
sudo systemctl reload nginx

# Check ports
netstat -tlnp | grep :5009
```

---

**✅ Your Panchroma site will run alongside existing projects without conflicts!**