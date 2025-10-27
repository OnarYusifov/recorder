# 🎯 Dokploy Step-by-Step Setup Guide

## Overview

You'll create **3 separate services** in your Dokploy dashboard at **server.trayb.az:3000**

**Services to create:**
1. `trayb-recorder-bot1` - Discord Bot 1 (records Team A)
2. `trayb-recorder-bot2` - Discord Bot 2 (records Team B)
3. `trayb-recorder-web` - Web interface (rec.trayb.az)

---

## 📦 BEFORE YOU START

### Step 0A: Push Code to GitHub

```bash
cd /root/recorder

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "TRAYB Recorder - Initial deployment"

# Add your GitHub remote (replace with your repo)
git remote add origin https://github.com/YOUR_USERNAME/trayb-recorder.git

# Push
git push -u origin main
```

**✅ Checkpoint:** Code is on GitHub, accessible to Dokploy

---

### Step 0B: Create Shared Directories on Server

SSH to your Dokploy server:

```bash
ssh your-server

# Create shared directories
sudo mkdir -p /var/dokploy/recorder/output
sudo mkdir -p /var/dokploy/recorder/data

# Set permissions
sudo chmod -R 755 /var/dokploy/recorder

# Create empty matches file
echo '[]' | sudo tee /var/dokploy/recorder/data/matches.json

# Verify
ls -la /var/dokploy/recorder/
```

**✅ Checkpoint:** Directories exist and are writable

---

## 🤖 SERVICE 1: BOT 1

### Step 1: Open Dokploy Dashboard

1. Go to: **https://server.trayb.az:3000** (or http if no SSL)
2. Log in with your credentials

---

### Step 2: Create New Project (if needed)

1. Click **"Projects"** in sidebar
2. If you want a dedicated project:
   - Click **"Create Project"**
   - Name: `TRAYB Recorder`
   - Click **"Create"**
3. Or use existing project

---

### Step 3: Create Service - Bot 1

1. Click **"Applications"** or **"Services"** in sidebar
2. Click **"Create Application"** or **"+ New"** button
3. Fill in the form:

**Basic Settings:**
```
Name: trayb-recorder-bot1
Description: Discord Bot 1 - Team A Recorder
```

**Source:**
```
Type: GitHub
Repository: Select your repo (trayb-recorder)
Branch: main
```

**Build Settings:**
```
Build Type: Node.js / npm
Build Command: npm install
Start Command: npm run bot1
```

**Port Settings:**
```
Skip this - Discord bots don't need ports
```

4. Click **"Create"** or **"Next"**

---

### Step 4: Configure Environment Variables - Bot 1

Find the **"Environment Variables"** section (might be a separate tab)

Add these variables:

```
BOT1_TOKEN = your_discord_bot_1_token_here
BOT1_AUTHORIZED_USERS = your_discord_user_id_here
BOT1_UPLOAD_CHANNEL_ID = your_discord_channel_id_here
WEB_URL = https://rec.trayb.az
NODE_ENV = production
```

**How to add:**
1. Click **"Add Variable"** or **"+"**
2. Enter **Key** (e.g., `BOT1_TOKEN`)
3. Enter **Value** (paste your token)
4. Repeat for each variable
5. Click **"Save"**

---

### Step 5: Configure Volumes - Bot 1

Find the **"Volumes"** or **"Mounts"** section

Add these two volumes:

**Volume 1:**
```
Container Path: /app/output
Host Path: /var/dokploy/recorder/output
Type: Bind Mount
```

**Volume 2:**
```
Container Path: /app/data
Host Path: /var/dokploy/recorder/data
Type: Bind Mount
```

**How to add:**
1. Click **"Add Volume"** or **"+"**
2. Enter container path: `/app/output`
3. Enter host path: `/var/dokploy/recorder/output`
4. Select type: **Bind Mount**
5. Click **"Add"** or **"Save"**
6. Repeat for second volume

---

### Step 6: Deploy Bot 1

1. Click **"Deploy"** button
2. Wait for deployment (watch logs)
3. Look for success message:
   ```
   ✅ Bot 1 logged in as YourBot#1234
   ✅ Slash commands registered
   ```

**✅ Checkpoint:** Bot 1 is running!

---

## 🤖 SERVICE 2: BOT 2

### Step 7: Create Service - Bot 2

Repeat the same process as Bot 1, but with these differences:

1. Click **"Create Application"** again
2. Fill in:

**Basic Settings:**
```
Name: trayb-recorder-bot2
Description: Discord Bot 2 - Team B Recorder
```

**Source:**
```
Type: GitHub
Repository: Same repo (trayb-recorder)
Branch: main
```

**Build Settings:**
```
Build Command: npm install
Start Command: npm run bot2    ← DIFFERENT!
```

---

### Step 8: Configure Environment Variables - Bot 2

```
BOT2_TOKEN = your_discord_bot_2_token_here    ← DIFFERENT!
BOT2_AUTHORIZED_USERS = your_discord_user_id_here    ← DIFFERENT!
BOT2_UPLOAD_CHANNEL_ID = your_discord_channel_id_here    ← DIFFERENT!
WEB_URL = https://rec.trayb.az
NODE_ENV = production
```

---

### Step 9: Configure Volumes - Bot 2

**IMPORTANT:** Same volumes as Bot 1!

**Volume 1:**
```
Container Path: /app/output
Host Path: /var/dokploy/recorder/output    ← SAME AS BOT 1!
```

**Volume 2:**
```
Container Path: /app/data
Host Path: /var/dokploy/recorder/data    ← SAME AS BOT 1!
```

---

### Step 10: Deploy Bot 2

1. Click **"Deploy"**
2. Wait for deployment
3. Look for:
   ```
   ✅ Bot 2 logged in as YourBot#5678
   ✅ Slash commands registered
   ```

**✅ Checkpoint:** Bot 2 is running!

---

## 🌐 SERVICE 3: WEB INTERFACE

### Step 11: Create Service - Web

1. Click **"Create Application"** again
2. Fill in:

**Basic Settings:**
```
Name: trayb-recorder-web
Description: Web interface for recordings
```

**Source:**
```
Type: GitHub
Repository: Same repo (trayb-recorder)
Branch: main
```

**Build Settings:**
```
Build Command: npm install
Start Command: npm run web    ← DIFFERENT!
```

**Port Settings:**
```
Internal Port: 8080    ← IMPORTANT!
External Port: 8080    ← IMPORTANT!
Protocol: HTTP
```

---

### Step 12: Configure Domain - Web

Find the **"Domains"** section

Add domain:
```
Domain: rec.trayb.az
Path: /
Port: 8080
SSL: Enable (Let's Encrypt)    ← IMPORTANT!
```

**How to add:**
1. Click **"Add Domain"** or **"+"**
2. Enter: `rec.trayb.az`
3. Select port: `8080`
4. Enable SSL toggle
5. Click **"Save"** or **"Add"**

Dokploy will automatically request SSL certificate from Let's Encrypt.

---

### Step 13: Configure Environment Variables - Web

```
WEB_PORT = 8080
WEB_URL = https://rec.trayb.az
NODE_ENV = production
```

---

### Step 14: Configure Volumes - Web

**IMPORTANT:** Same volumes as Bot 1 & Bot 2!

**Volume 1:**
```
Container Path: /app/output
Host Path: /var/dokploy/recorder/output    ← SAME AS BOTS!
```

**Volume 2:**
```
Container Path: /app/data
Host Path: /var/dokploy/recorder/data    ← SAME AS BOTS!
```

---

### Step 15: Deploy Web

1. Click **"Deploy"**
2. Wait for deployment
3. Look for:
   ```
   🌐 Web interface running at http://localhost:8080
   📊 View recordings at http://localhost:8080
   ```

**✅ Checkpoint:** Web service is running!

---

## 🌐 DNS CONFIGURATION

### Step 16: Add DNS Record

Go to your DNS provider (Cloudflare, etc.):

**Option A: A Record**
```
Type: A
Name: rec
Value: YOUR_DOKPLOY_SERVER_IP
TTL: Auto (or 300)
Proxy: Yes (if Cloudflare)
```

**Option B: CNAME Record**
```
Type: CNAME
Name: rec
Value: trayb.az
TTL: Auto (or 300)
Proxy: Yes (if Cloudflare)
```

**How to find your server IP:**
```bash
# If you're already using trayb.az on this server:
dig trayb.az +short
# Use the same IP!
```

---

### Step 17: Wait for DNS Propagation

```bash
# Check if DNS is working (from your local machine)
dig rec.trayb.az +short

# Should return your server IP
```

Usually takes 1-5 minutes with Cloudflare, up to 30 minutes elsewhere.

---

## ✅ VERIFICATION

### Step 18: Check All Services

**In Dokploy Dashboard:**

You should see 3 services all with status: **Running** ✅

```
✅ trayb-recorder-bot1    Running
✅ trayb-recorder-bot2    Running
✅ trayb-recorder-web     Running
```

---

### Step 19: Check Logs

**For each service:**

1. Click on the service name
2. Click **"Logs"** tab
3. Check for success messages:

**Bot 1 Logs:**
```
✅ Bot 1 logged in as RecorderBot1#1234
🔒 Authorized users: 1
✅ Slash commands registered successfully!
```

**Bot 2 Logs:**
```
✅ Bot 2 logged in as RecorderBot2#5678
🔒 Authorized users: 1
✅ Slash commands registered successfully!
```

**Web Logs:**
```
🌐 Web interface running at http://localhost:8080
📊 View recordings at http://localhost:8080
```

---

### Step 20: Test Web Interface

Open browser: **https://rec.trayb.az**

You should see:
```
╔════════════════════════════════╗
║    TRAYB RECORDINGS            ║
║    Match recordings archive    ║
╠════════════════════════════════╣
║                                ║
║  No matches recorded yet       ║
║                                ║
╚════════════════════════════════╝
```

✅ SSL certificate valid (green lock icon)
✅ No browser warnings
✅ Page loads correctly

---

### Step 21: Test Discord Bots

**In Discord:**

1. Type `/` in any channel
2. You should see your bot commands:
   - `/record`
   - `/stop`
   - `/status`

3. Try `/status`
   - Should reply: "No active recording in this server"

✅ Commands working!

---

### Step 22: Full Test - Record a Match

1. Join a voice channel
2. **Bot 1:** `/record channel:#your-channel teamname:TestTeamA vsteam:TestTeamB`
3. **Bot 2:** `/record channel:#your-channel`
4. Talk for 10 seconds
5. **Bot 1:** `/stop`
6. Check Discord - files uploaded ✅
7. Visit **https://rec.trayb.az** - match listed ✅
8. Download files ✅
9. Play audio files ✅

**✅ EVERYTHING WORKING!**

---

## 🎉 SUCCESS CHECKLIST

- [x] Code pushed to GitHub
- [x] Shared directories created on server
- [x] Bot 1 service created and running
- [x] Bot 2 service created and running
- [x] Web service created and running
- [x] DNS configured (rec.trayb.az)
- [x] SSL certificate issued
- [x] All services sharing same volumes
- [x] Environment variables set correctly
- [x] Web interface accessible
- [x] Discord commands working
- [x] Test recording successful
- [x] Match visible on web interface
- [x] Files downloadable

---

## 🔄 MANAGING YOUR SERVICES

### Viewing Logs

1. Go to **https://server.trayb.az:3000**
2. Click on service name
3. Click **"Logs"** tab
4. Real-time logs appear

### Restarting a Service

1. Click on service name
2. Click **"Restart"** button
3. Wait for service to come back up

### Updating Code

**Automatic (on git push):**
```bash
git add .
git commit -m "Update feature"
git push
```
Dokploy auto-deploys! ✅

**Manual:**
1. Go to service in Dokploy
2. Click **"Deploy"** or **"Redeploy"**
3. Wait for completion

### Updating Environment Variables

1. Click on service
2. Go to **"Environment"** tab
3. Edit or add variables
4. Click **"Save"**
5. **Restart** service for changes to take effect

### Viewing Resource Usage

1. Click on service
2. Check **"Metrics"** or **"Stats"** tab
3. See CPU, Memory, Disk usage

---

## 🐛 TROUBLESHOOTING

### Service Won't Start

**Check logs:**
1. Go to service → Logs tab
2. Look for error messages

**Common issues:**
- Missing environment variable → Add it in Environment tab
- Wrong build command → Edit in settings
- GitHub access denied → Check Dokploy GitHub integration

### Bot Not Responding in Discord

**Check:**
1. Service is running (green status in Dokploy)
2. Bot token is correct (check env vars)
3. Bot is in your Discord server
4. Slash commands registered (check logs for "✅ Slash commands registered")

**Fix:**
1. Restart the service
2. Wait 1-2 minutes
3. Try commands again

### Web Shows 502 Error

**Check:**
1. Service is running
2. Port 8080 is configured
3. Domain points to correct server
4. SSL certificate issued

**Fix:**
1. Check logs for errors
2. Restart web service
3. Wait for SSL cert (can take 1-2 minutes)

### Files Not Showing on Web

**Check volumes:**
```bash
ssh your-server
ls -la /var/dokploy/recorder/output
ls -la /var/dokploy/recorder/data
```

Should show recordings after you've done a test recording.

**Check all services have same volume mounts:**
1. Each service → Volumes tab
2. Verify paths match exactly

### SSL Certificate Issues

**If cert won't issue:**
1. Verify DNS is correct (dig rec.trayb.az)
2. Check port 80 and 443 are open
3. Wait 5 minutes and try again
4. Check Dokploy logs for Let's Encrypt errors

---

## 📚 USEFUL COMMANDS

### Check Service Status (SSH)

```bash
# If using Docker
docker ps | grep recorder

# Should show 3 containers running
```

### Check Shared Storage

```bash
ssh your-server
ls -lah /var/dokploy/recorder/output/
cat /var/dokploy/recorder/data/matches.json
```

### View Service Logs (SSH)

```bash
# If using Docker
docker logs trayb-recorder-bot1
docker logs trayb-recorder-bot2
docker logs trayb-recorder-web
```

### Check DNS

```bash
dig rec.trayb.az +short
# Should return your server IP
```

### Test Web Port

```bash
curl http://YOUR_SERVER_IP:8080
# Should return HTML

curl https://rec.trayb.az
# Should return HTML with SSL
```

---

## 🎯 NEXT STEPS

1. ✅ All services deployed
2. ✅ Test recording works
3. ✅ Share web link with team: https://rec.trayb.az
4. ✅ Start recording matches!

---

## 💡 TIPS

1. **Bookmark Dokploy Dashboard:** https://server.trayb.az:3000
2. **Monitor logs regularly** - check for errors
3. **Test after updates** - verify everything works
4. **Backup `/var/dokploy/recorder`** - contains all recordings
5. **Keep tokens secret** - never commit to git

---

**You're all set! Enjoy your professional recording system! 🎉**

