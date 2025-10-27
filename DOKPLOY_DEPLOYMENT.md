# 🚀 Dokploy Deployment Guide

## Overview

This guide shows how to deploy the TRAYB Recorder system to Dokploy, just like your existing trayb.az and server.trayb.az deployments.

---

## 📋 Prerequisites

- Dokploy instance running (you already have this)
- GitHub repository for this project
- Domain: rec.trayb.az pointed to your server
- Discord bot tokens

---

## 🎯 Deployment Strategy

You'll deploy **3 services** on Dokploy:

1. **trayb-recorder-bot1** - Discord Bot 1 (Team A recorder)
2. **trayb-recorder-bot2** - Discord Bot 2 (Team B recorder)  
3. **trayb-recorder-web** - Web interface (rec.trayb.az)

---

## 📦 Step 1: Push to GitHub

```bash
cd /root/recorder

# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "TRAYB Recorder - Initial deployment"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/trayb-recorder.git

# Push
git push -u origin main
```

---

## 🔧 Step 2: Create Dokploy Services

### Service 1: Bot 1

**In Dokploy Dashboard:**

1. **Create New Service**
   - Name: `trayb-recorder-bot1`
   - Type: `Application`
   - Source: `GitHub`

2. **GitHub Settings:**
   - Repository: `YOUR_USERNAME/trayb-recorder`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm run bot1`

3. **Environment Variables:**
   ```env
   BOT1_TOKEN=your_bot1_token_here
   BOT1_AUTHORIZED_USERS=your_discord_user_id
   BOT1_UPLOAD_CHANNEL_ID=your_channel_id
   WEB_URL=https://rec.trayb.az
   NODE_ENV=production
   ```

4. **Volumes (Important!):**
   - Mount: `/app/output` → Host: `/var/dokploy/recorder/output`
   - Mount: `/app/data` → Host: `/var/dokploy/recorder/data`
   
   This ensures all 3 services share the same files!

5. **Deploy:** Click deploy button

---

### Service 2: Bot 2

**Same as Bot 1, but:**

1. **Create New Service**
   - Name: `trayb-recorder-bot2`
   - Start Command: `npm run bot2`

2. **Environment Variables:**
   ```env
   BOT2_TOKEN=your_bot2_token_here
   BOT2_AUTHORIZED_USERS=your_discord_user_id
   BOT2_UPLOAD_CHANNEL_ID=your_channel_id
   WEB_URL=https://rec.trayb.az
   NODE_ENV=production
   ```

3. **Volumes (Same as Bot 1!):**
   - Mount: `/app/output` → Host: `/var/dokploy/recorder/output`
   - Mount: `/app/data` → Host: `/var/dokploy/recorder/data`

4. **Deploy**

---

### Service 3: Web Interface

1. **Create New Service**
   - Name: `trayb-recorder-web`
   - Type: `Application`
   - Source: `GitHub`

2. **GitHub Settings:**
   - Repository: `YOUR_USERNAME/trayb-recorder`
   - Branch: `main`
   - Build Command: `npm install`
   - Start Command: `npm run web`

3. **Environment Variables:**
   ```env
   WEB_PORT=8080
   WEB_URL=https://rec.trayb.az
   NODE_ENV=production
   ```

4. **Volumes (Same shared volumes!):**
   - Mount: `/app/output` → Host: `/var/dokploy/recorder/output`
   - Mount: `/app/data` → Host: `/var/dokploy/recorder/data`

5. **Port Mapping:**
   - Internal Port: `8080`
   - External Port: `8080`

6. **Domain:**
   - Add domain: `rec.trayb.az`
   - Enable SSL (Let's Encrypt)

7. **Deploy**

---

## 🌐 Step 3: DNS Configuration

**In your DNS provider (Cloudflare, etc):**

```
Type: A or CNAME
Name: rec
Value: Your Dokploy server IP (same as trayb.az)
Proxy: Yes (if using Cloudflare)
TTL: Auto
```

**Or if using CNAME:**
```
Type: CNAME
Name: rec
Value: trayb.az
Proxy: Yes
TTL: Auto
```

---

## 🔒 Step 4: SSL Configuration (Dokploy)

Dokploy should auto-configure SSL via Let's Encrypt when you add the domain.

**If manual:**
1. Go to `trayb-recorder-web` service
2. Domains → Add Domain
3. Enter: `rec.trayb.az`
4. Enable SSL
5. Save

---

## 📁 Step 5: Shared Storage Setup

**SSH into your Dokploy server:**

```bash
# Create shared directories
mkdir -p /var/dokploy/recorder/output
mkdir -p /var/dokploy/recorder/data

# Set permissions
chmod -R 755 /var/dokploy/recorder

# Create empty matches.json
echo '[]' > /var/dokploy/recorder/data/matches.json
```

This ensures all 3 services access the same recordings and match data!

---

## 🎯 Deployment Structure

```
Your Dokploy Server
│
├── trayb-recorder-bot1 (Service)
│   ├── Runs: npm run bot1
│   ├── Shares: /var/dokploy/recorder/*
│   └── Auto-restart on crash
│
├── trayb-recorder-bot2 (Service)
│   ├── Runs: npm run bot2
│   ├── Shares: /var/dokploy/recorder/*
│   └── Auto-restart on crash
│
└── trayb-recorder-web (Service)
    ├── Runs: npm run web
    ├── Port: 8080
    ├── Domain: rec.trayb.az
    ├── SSL: Let's Encrypt
    └── Shares: /var/dokploy/recorder/*
```

---

## ✅ Verification Steps

### 1. Check Services Running

In Dokploy dashboard:
- ✅ trayb-recorder-bot1 - Running
- ✅ trayb-recorder-bot2 - Running
- ✅ trayb-recorder-web - Running

### 2. Check Logs

```bash
# In Dokploy, view logs for each service
# You should see:

Bot 1:
  ✅ Bot 1 logged in as ...
  🔒 Authorized users: 1
  ✅ Slash commands registered

Bot 2:
  ✅ Bot 2 logged in as ...
  🔒 Authorized users: 1
  ✅ Slash commands registered

Web:
  🌐 Web interface running at http://localhost:8080
  📊 View recordings at http://localhost:8080
```

### 3. Test Web Interface

```bash
curl https://rec.trayb.az
# Should return HTML
```

Or visit in browser: **https://rec.trayb.az**

### 4. Test Discord Bots

In Discord:
```
/record channel:#voice teamname:Test
```

Should work!

---

## 🔄 Auto-Deploy on Push

Dokploy automatically redeploys when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Dokploy will:
# 1. Detect push
# 2. Pull latest code
# 3. Run npm install
# 4. Restart services
# 5. Done!
```

---

## 🐛 Troubleshooting

### Services Won't Start

**Check logs in Dokploy:**
```
Common issues:
- Missing environment variables
- npm install failed
- Port conflict
```

**Fix:**
1. Go to service settings
2. Check environment variables
3. Check build logs
4. Redeploy

### Web Interface 502 Error

**Check:**
```bash
# In Dokploy server
curl localhost:8080
```

If works locally but not on domain:
- Check domain DNS
- Check SSL certificate
- Check port mapping (8080 → 8080)

### Bots Not Recording

**Check:**
1. Both bots logged in? (check logs)
2. Authorized users set? (check env vars)
3. Slash commands registered? (check logs)
4. Bot has permissions in Discord?

### Files Not Shared Between Services

**Check volumes:**
```bash
# SSH to Dokploy server
ls -la /var/dokploy/recorder/output
ls -la /var/dokploy/recorder/data

# Should show recordings and matches.json
```

If not:
- Check volume mounts in each service
- All 3 services must use same host paths

### Domain Not Working

**Check DNS:**
```bash
dig rec.trayb.az
# Should return your server IP
```

**Check Dokploy domain config:**
- Domain added to web service?
- SSL enabled?
- Port 8080 exposed?

---

## 📊 Resource Usage

**Expected usage:**
- Bot 1: ~100MB RAM
- Bot 2: ~100MB RAM
- Web: ~50MB RAM
- Total: ~250MB RAM

**Storage:**
- Grows with recordings
- 1 hour recording ≈ 50-100MB per person
- Plan accordingly!

---

## 🔐 Security Checklist

- ✅ Bot tokens in environment variables (not in code)
- ✅ Authorized users configured
- ✅ SSL enabled on rec.trayb.az
- ✅ GitHub repository private (optional)
- ✅ Firewall allows port 8080
- ✅ Regular backups of `/var/dokploy/recorder`

---

## 🎉 You're Done!

Your setup:
- ✅ Bot 1 running on Dokploy
- ✅ Bot 2 running on Dokploy
- ✅ Web at https://rec.trayb.az
- ✅ Auto-deploy from GitHub
- ✅ Shared storage
- ✅ SSL enabled

**Test it:**
```
Discord: /record channel:#voice teamname:TeamA vsteam:TeamB
Browser: https://rec.trayb.az
```

---

## 🔄 Alternative: Docker Compose (Optional)

If you prefer single-service deployment:

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  bot1:
    build: .
    command: npm run bot1
    environment:
      - BOT1_TOKEN=${BOT1_TOKEN}
      - BOT1_AUTHORIZED_USERS=${BOT1_AUTHORIZED_USERS}
      - WEB_URL=https://rec.trayb.az
    volumes:
      - ./output:/app/output
      - ./data:/app/data
    restart: unless-stopped

  bot2:
    build: .
    command: npm run bot2
    environment:
      - BOT2_TOKEN=${BOT2_TOKEN}
      - BOT2_AUTHORIZED_USERS=${BOT2_AUTHORIZED_USERS}
      - WEB_URL=https://rec.trayb.az
    volumes:
      - ./output:/app/output
      - ./data:/app/data
    restart: unless-stopped

  web:
    build: .
    command: npm run web
    ports:
      - "8080:8080"
    environment:
      - WEB_PORT=8080
      - WEB_URL=https://rec.trayb.az
    volumes:
      - ./output:/app/output
      - ./data:/app/data
    restart: unless-stopped
```

Deploy as single Dokploy service using docker-compose!

---

**Need help?** Check Dokploy docs or Discord!

