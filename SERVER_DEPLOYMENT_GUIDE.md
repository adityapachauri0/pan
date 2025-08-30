# 🚀 Panchroma Server Deployment Guide

## Following Your Existing Server Workflow

This deployment is designed to work with your current server setup where you already have projects on ports 3008 and 5008, and use `/root/add-new-project.sh` for new deployments.

---

## 📋 Pre-Deployment Checklist

### Your Existing Setup (Unchanged):
- ✅ Projects on ports 3008 and 5008
- ✅ PM2 managing multiple services
- ✅ `/root/add-new-project.sh` workflow
- ✅ PM2 save/resurrect system

### Panchroma Will Use:
- ✅ Port 7001 (API)
- ✅ Port 7002 (WebSocket)
- ✅ Directory: `/var/www/panchroma`
- ✅ PM2 process name: `panchroma`

---

## 🎯 Deployment Steps

### Step 1: Upload Files to Server

```bash
# From your local machine
scp -r dist-ppc/* root@your-server:/tmp/panchroma-deploy/
```

### Step 2: SSH to Your Server

```bash
ssh root@your-server
cd /tmp/panchroma-deploy
```

### Step 3: Run Your Standard Workflow

```bash
# 1. First, use your existing script
/root/add-new-project.sh
# When prompted:
#   Project Name: panchroma
#   Port: 7001
#   Directory: /var/www/panchroma

# 2. Then run the Panchroma setup
./server-deploy.sh
```

### Step 4: Verify with Your Standard Commands

```bash
# Your standard PM2 commands
pm2 list           # Should show 'panchroma' along with your other projects
pm2 monit          # Real-time monitoring of all projects
pm2 save           # Save the current state (IMPORTANT!)
```

---

## 🔧 Integration with Your PM2 Workflow

### After Deployment:

```bash
# 1. Always save PM2 state after adding Panchroma
pm2 save

# 2. Your existing projects remain unchanged
pm2 list
# Should show:
# - Your project on 3008
# - Your project on 5008  
# - panchroma (new)

# 3. Monitor everything together
pm2 monit
```

### If Something Goes Wrong:

```bash
# Your standard recovery process works
pm2 resurrect     # Restores all services including Panchroma
```

---

## 📁 File Structure on Server

```
/var/www/panchroma/              # Follows your server's structure
├── client/                      # React build files
├── server/                      # Node.js backend
│   ├── index.js                # Main server file
│   ├── package.json            
│   └── .env                    # Environment variables
├── logs/                        # PM2 logs
│   ├── error.log
│   ├── out.log
│   └── combined.log
└── config/                      # Configuration files
    ├── panchroma-pm2.config.js # PM2 config
    └── panchroma.conf          # Nginx config
```

---

## 🌐 Nginx Configuration

### Update Domain Name:

Edit `/etc/nginx/sites-available/panchroma.conf`:
```nginx
server_name your-actual-domain.com;  # Change this
```

### SSL Certificates:

Update certificate paths in the nginx config:
```nginx
ssl_certificate /path/to/your/cert.crt;
ssl_certificate_key /path/to/your/key.key;
```

### Apply Changes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 Management Commands

### PM2 Commands (Your Standard Workflow):

```bash
# View all processes
pm2 list

# Monitor in real-time
pm2 monit

# View Panchroma logs
pm2 logs panchroma

# Restart Panchroma
pm2 restart panchroma

# Stop Panchroma
pm2 stop panchroma

# Delete Panchroma
pm2 delete panchroma

# IMPORTANT: After any changes
pm2 save

# If something crashes
pm2 resurrect
```

### Health Checks:

```bash
# Check API
curl http://localhost:7001/health-status

# Check via Nginx
curl https://your-domain.com/health

# Check all PM2 processes
pm2 status
```

---

## 🔍 Troubleshooting

### Port Conflicts:

```bash
# Check if port 7001 is available
netstat -tlnp | grep 7001

# Check all your services
pm2 list
```

### Logs:

```bash
# PM2 logs for Panchroma
pm2 logs panchroma --lines 100

# Nginx logs
tail -f /var/log/nginx/panchroma_error.log
tail -f /var/log/nginx/panchroma_access.log

# All PM2 logs
pm2 logs
```

### Recovery:

```bash
# If Panchroma crashes
pm2 resurrect      # Restores saved state

# Manual restart
pm2 restart panchroma

# Full reset
pm2 delete panchroma
pm2 start /var/www/panchroma/config/panchroma-pm2.config.js
pm2 save
```

---

## ✅ Quick Reference

### Your Server's Workflow:
1. **Before adding**: `/root/add-new-project.sh`
2. **After changes**: `pm2 save`
3. **Monitor**: `pm2 list` / `pm2 monit`
4. **Recovery**: `pm2 resurrect`

### Panchroma Specifics:
- **Port**: 7001 (API), 7002 (WebSocket)
- **Process Name**: `panchroma`
- **Directory**: `/var/www/panchroma`
- **Config**: `panchroma-pm2.config.js`

### Complete Status Check:
```bash
pm2 list                                    # All processes
curl http://localhost:7001/health-status   # Panchroma health
curl http://localhost:3008                 # Your existing project
curl http://localhost:5008                 # Your other project
```

---

## 🎉 Success Indicators

When deployment is successful:
- ✅ `pm2 list` shows `panchroma` as "online"
- ✅ `pm2 save` confirms state is saved
- ✅ Health check returns positive response
- ✅ Your existing services (3008/5008) still running
- ✅ Nginx serving Panchroma on HTTPS

---

## 📞 Support Commands

```bash
# Full system status
pm2 list && echo "---" && pm2 prettylist

# Panchroma specific
pm2 describe panchroma

# System resources
pm2 monit

# Everything at once
pm2 status && curl http://localhost:7001/health-status
```

**Your Panchroma deployment now integrates perfectly with your existing PM2 workflow!**