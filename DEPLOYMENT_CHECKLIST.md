# ✅ Dokploy Deployment Checklist

Use this checklist to ensure a smooth deployment to Dokploy.

---

## 📋 Pre-Deployment

### ✅ Local Setup Complete
- [ ] All code working locally
- [ ] Tested with `npm run bot1`, `npm run bot2`, `npm run web`
- [ ] Recordings working
- [ ] Match system working
- [ ] Web interface accessible at localhost:8080

### ✅ GitHub Repository
- [ ] GitHub repository created
- [ ] Code pushed to `main` branch
- [ ] Repository accessible from Dokploy server
- [ ] `.gitignore` configured (excludes node_modules, .env, output, data)

### ✅ Discord Bots
- [ ] Bot 1 created in Discord Developer Portal
- [ ] Bot 2 created in Discord Developer Portal
- [ ] Both bots invited to your Discord server
- [ ] Both bots have Voice permissions
- [ ] Bot tokens saved securely

### ✅ Authorized Users
- [ ] Your Discord User ID obtained
- [ ] Developer Mode enabled in Discord
- [ ] User IDs ready for environment variables

---

## 🚀 Dokploy Setup

### ✅ Server Preparation
- [ ] SSH access to Dokploy server
- [ ] Created shared directories:
  ```bash
  mkdir -p /var/dokploy/recorder/output
  mkdir -p /var/dokploy/recorder/data
  chmod -R 755 /var/dokploy/recorder
  echo '[]' > /var/dokploy/recorder/data/matches.json
  ```

### ✅ Service 1: Bot 1
- [ ] Service created: `trayb-recorder-bot1`
- [ ] Type: Application
- [ ] Source: GitHub
- [ ] Repository: YOUR_REPO
- [ ] Branch: `main`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm run bot1`
- [ ] Port: None (Discord bot)
- [ ] **Environment Variables:**
  - [ ] `BOT1_TOKEN=xxx`
  - [ ] `BOT1_AUTHORIZED_USERS=xxx`
  - [ ] `BOT1_UPLOAD_CHANNEL_ID=xxx`
  - [ ] `WEB_URL=https://rec.trayb.az`
  - [ ] `NODE_ENV=production`
- [ ] **Volumes:**
  - [ ] `/app/output` → `/var/dokploy/recorder/output`
  - [ ] `/app/data` → `/var/dokploy/recorder/data`
- [ ] Deployed successfully
- [ ] Logs show: "✅ Bot 1 logged in as..."
- [ ] Logs show: "✅ Slash commands registered"

### ✅ Service 2: Bot 2
- [ ] Service created: `trayb-recorder-bot2`
- [ ] Type: Application
- [ ] Source: GitHub (same repo)
- [ ] Branch: `main`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm run bot2`
- [ ] Port: None (Discord bot)
- [ ] **Environment Variables:**
  - [ ] `BOT2_TOKEN=xxx`
  - [ ] `BOT2_AUTHORIZED_USERS=xxx`
  - [ ] `BOT2_UPLOAD_CHANNEL_ID=xxx`
  - [ ] `WEB_URL=https://rec.trayb.az`
  - [ ] `NODE_ENV=production`
- [ ] **Volumes:** (MUST BE SAME AS BOT 1!)
  - [ ] `/app/output` → `/var/dokploy/recorder/output`
  - [ ] `/app/data` → `/var/dokploy/recorder/data`
- [ ] Deployed successfully
- [ ] Logs show: "✅ Bot 2 logged in as..."
- [ ] Logs show: "✅ Slash commands registered"

### ✅ Service 3: Web Interface
- [ ] Service created: `trayb-recorder-web`
- [ ] Type: Application
- [ ] Source: GitHub (same repo)
- [ ] Branch: `main`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm run web`
- [ ] **Port Mapping:**
  - [ ] Internal Port: `8080`
  - [ ] External Port: `8080`
- [ ] **Environment Variables:**
  - [ ] `WEB_PORT=8080`
  - [ ] `WEB_URL=https://rec.trayb.az`
  - [ ] `NODE_ENV=production`
- [ ] **Volumes:** (MUST BE SAME AS BOTS!)
  - [ ] `/app/output` → `/var/dokploy/recorder/output`
  - [ ] `/app/data` → `/var/dokploy/recorder/data`
- [ ] **Domain Configuration:**
  - [ ] Domain added: `rec.trayb.az`
  - [ ] SSL enabled (Let's Encrypt)
  - [ ] Certificate issued
- [ ] Deployed successfully
- [ ] Logs show: "🌐 Web interface running at..."

---

## 🌐 DNS Configuration

### ✅ DNS Provider
- [ ] DNS provider accessed (Cloudflare, etc.)
- [ ] A record created:
  - Name: `rec`
  - Type: `A`
  - Value: YOUR_DOKPLOY_SERVER_IP
  - TTL: Auto or 300
  - Proxy: Yes (if Cloudflare)
- [ ] DNS propagation checked (dig rec.trayb.az)
- [ ] Domain resolves to correct IP

---

## 🧪 Testing

### ✅ Web Interface
- [ ] Visit https://rec.trayb.az in browser
- [ ] Page loads without errors
- [ ] No SSL warnings
- [ ] "TRAYB RECORDINGS" header visible
- [ ] "No matches recorded yet" shown (initially)

### ✅ Discord Bot 1
- [ ] Open Discord
- [ ] Type `/` in any channel
- [ ] See `/record`, `/stop`, `/status` commands
- [ ] Try `/status` - should say "No active recording"
- [ ] Try `/record` with wrong channel - should fail
- [ ] Try `/record` in voice channel - should work

### ✅ Discord Bot 2
- [ ] Same checks as Bot 1
- [ ] Commands registered independently
- [ ] Can access same commands

### ✅ Full Recording Test
- [ ] Join a voice channel
- [ ] Bot 1: `/record channel:#your-channel teamname:TeamA vsteam:TeamB`
- [ ] See confirmation message
- [ ] See "Match: TeamA vs TeamB" in message
- [ ] Bot 2: `/record channel:#your-channel`
- [ ] See confirmation message
- [ ] See "Match: TeamA vs TeamB" in message
- [ ] Talk for 10 seconds
- [ ] Check Dokploy logs - see "🎵 Recording YourName"
- [ ] Bot 1: `/stop`
- [ ] Both bots stop recording
- [ ] Files uploaded to Discord
- [ ] Message shows "View at https://rec.trayb.az"
- [ ] Visit https://rec.trayb.az
- [ ] See the match listed
- [ ] Click to download audio files
- [ ] Files download successfully
- [ ] Audio files play correctly

### ✅ Timeline Sync Test
- [ ] Download all individual audio tracks
- [ ] Check durations - all should be the same
- [ ] Import into audio editor
- [ ] Drop all tracks at time 0:00
- [ ] Tracks align perfectly

---

## 🔒 Security Verification

### ✅ Environment Variables
- [ ] No tokens in code
- [ ] No tokens in git history
- [ ] All secrets in Dokploy environment variables
- [ ] `.env` in `.gitignore`

### ✅ Authorization
- [ ] Only authorized users can use bots
- [ ] Test with unauthorized user - should see "Access Denied"
- [ ] Authorized users can use all commands

### ✅ SSL/TLS
- [ ] rec.trayb.az uses HTTPS
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] Certificate auto-renews

### ✅ Firewall
- [ ] Port 8080 accessible externally
- [ ] No other ports exposed unnecessarily
- [ ] SSH protected (if applicable)

---

## 📊 Monitoring

### ✅ Service Health
- [ ] All 3 services showing "Running" in Dokploy
- [ ] No error logs
- [ ] CPU usage reasonable (<50%)
- [ ] Memory usage reasonable (<500MB total)
- [ ] Disk space sufficient

### ✅ Logs
- [ ] Bot 1 logs clean
- [ ] Bot 2 logs clean
- [ ] Web logs clean
- [ ] No repeating errors
- [ ] Health checks passing

---

## 🔄 Auto-Deploy Testing

### ✅ Git Push Deploy
- [ ] Make a small change (e.g., add comment)
- [ ] Commit: `git commit -m "Test auto-deploy"`
- [ ] Push: `git push`
- [ ] Dokploy detects push
- [ ] Services rebuild automatically
- [ ] Services restart successfully
- [ ] Changes reflected in running services

---

## 📁 File System

### ✅ Shared Storage
- [ ] SSH to Dokploy server
- [ ] Check: `ls /var/dokploy/recorder/output`
- [ ] Check: `ls /var/dokploy/recorder/data`
- [ ] After test recording, files exist in output/
- [ ] matches.json updated in data/
- [ ] All 3 services can access files

---

## 🎉 Final Verification

### ✅ Complete Workflow
- [ ] Start match recording (Bot 1 & 2)
- [ ] Record for 1 minute
- [ ] Stop recording
- [ ] Files uploaded to Discord ✅
- [ ] Match visible on web interface ✅
- [ ] Files downloadable from web ✅
- [ ] Audio quality good ✅
- [ ] Timeline sync working ✅
- [ ] Stats chart generated ✅
- [ ] Match summary in Discord ✅

### ✅ Production Ready
- [ ] All services running 24/7
- [ ] Auto-restart on crash enabled
- [ ] Auto-deploy on push working
- [ ] Backups configured (optional)
- [ ] Monitoring set up (optional)
- [ ] Team notified about system

---

## 🐛 Troubleshooting Reference

If anything fails, check:

**Services won't start:**
- View logs in Dokploy
- Check environment variables
- Verify GitHub access
- Check build logs

**Web 502 Error:**
- Check port 8080 open
- Verify domain DNS
- Check SSL certificate
- Wait for DNS propagation

**Bots not responding:**
- Check bot tokens valid
- Verify bots in server
- Check authorized users
- View bot logs

**Files not shared:**
- Verify volume mounts identical
- Check directory permissions
- SSH to server and verify paths

**For detailed troubleshooting:** See `DOKPLOY_DEPLOYMENT.md` or `TEST_GUIDE.md`

---

## ✅ Completion

Once all items checked:
- [ ] System fully deployed ✅
- [ ] Team can use Discord commands ✅
- [ ] Recordings accessible via web ✅
- [ ] Auto-deploy configured ✅
- [ ] Production ready ✅

**Congratulations! Your TRAYB Recorder is live! 🎉**

Access: https://rec.trayb.az
Discord: `/record`, `/stop`, `/status`

---

**Deployment Date:** _____________
**Deployed By:** _____________
**Notes:** _____________

