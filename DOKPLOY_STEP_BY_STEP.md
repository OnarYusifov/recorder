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
3. Fill in the **PROVIDER** section:

**Provider Tab:**
```
Provider: GitHub (click the GitHub icon)
GitHub Account: Select your account (trecorder or your username)
Repository: recorder
Branch: main
Build Path: / (leave as default)
Trigger Type: On Push (leave as default)
Watch Paths: (leave empty)
Enable Submodules: (leave unchecked)
```

Click **"Save"** at the bottom

4. Go to **BUILD TYPE** tab:

**Build Type Tab:**
```
Build Type: Select "Nixpacks" (should be default)
Publish Directory: (leave empty - not needed)
```

Click **"Save"**

**Note:** Nixpacks automatically detects Node.js and runs the right commands. No need to manually specify build/start commands!

---

### Step 4: Configure Environment Variables - Bot 1

1. Go to **"Environment"** tab (or **"Environment Variables"** section)
2. Add these variables by clicking **"+ Add"** or similar button:

**Required Variables:**
```
Key: BOT1_TOKEN
Value: your_discord_bot_1_token_here

Key: BOT1_AUTHORIZED_USERS
Value: your_discord_user_id_here

Key: BOT1_UPLOAD_CHANNEL_ID
Value: your_discord_channel_id_here

Key: WEB_URL
Value: https://rec.trayb.az

Key: NODE_ENV
Value: production
```

**How to add each variable:**
1. Click **"+ Add"** or **"Add Variable"**
2. Enter **Key** (e.g., `BOT1_TOKEN`)
3. Enter **Value** (paste your token)
4. Click **"Add"** or **"Save"**
5. Repeat for all 5 variables
6. Click **"Save"** at the bottom of the page

---

### Step 5: Configure Volumes - Bot 1

1. Go to **"Volumes"** or **"Mounts"** tab
2. Add **two volumes** by clicking **"+ Add Volume"** or similar:

**Volume 1 (Output Directory):**
```
Name: output (or leave auto-generated)
Container Path: /app/output
Host Path: /var/dokploy/recorder/output
Type: Bind Mount (or Volume)
```

**Volume 2 (Data Directory):**
```
Name: data (or leave auto-generated)
Container Path: /app/data
Host Path: /var/dokploy/recorder/data
Type: Bind Mount (or Volume)
```

**How to add each volume:**
1. Click **"+ Add Volume"** or **"Add Mount"**
2. Fill in the fields as shown above
3. Click **"Add"** or **"Save"**
4. Repeat for second volume
5. Click **"Save"** at the bottom of the page

**⚠️ Important:** Make sure the host paths are EXACTLY:
- `/var/dokploy/recorder/output`
- `/var/dokploy/recorder/data`

---

### Step 6: Configure Start Command - Bot 1

**IMPORTANT:** Nixpacks auto-detects Node.js, but we need to tell it which command to run!

1. Go to **"Advanced"** tab or look for **"Custom Start Command"** setting
2. Find **"Start Command"** or **"Command"** field
3. Enter: `npm run bot1`
4. Click **"Save"**

### Step 7: Deploy Bot 1

1. Go back to the main service page (or **"Deployments"** tab)
2. Click **"Deploy"** button (or **"Redeploy"**)
3. Wait for deployment (you can click **"Logs"** to watch progress)
4. Look for success messages in logs:
   ```
   ✅ Bot 1 logged in as YourBot#1234
   🔒 Authorized users: 1
   ✅ Slash commands registered successfully!
   ```

**✅ Checkpoint:** Bot 1 is running! Status should show **"Running"** or **"Active"**

---

## 🤖 SERVICE 2: BOT 2

### Step 8: Create Service - Bot 2

**Repeat the same process as Bot 1, with ONE difference: the start command!**

1. Click **"Create Application"** again
2. **Provider Tab:**
   ```
   Provider: GitHub
   GitHub Account: Your account
   Repository: recorder
   Branch: main
   Build Path: /
   Trigger Type: On Push
   ```
   Save

3. **Build Type Tab:**
   ```
   Build Type: Nixpacks
   ```
   Save

---

### Step 9: Configure Environment Variables - Bot 2

Go to **"Environment"** tab and add:

```
BOT2_TOKEN = your_discord_bot_2_token_here    ← DIFFERENT!
BOT2_AUTHORIZED_USERS = your_discord_user_id_here    ← DIFFERENT!
BOT2_UPLOAD_CHANNEL_ID = your_discord_channel_id_here    ← DIFFERENT!
WEB_URL = https://rec.trayb.az
NODE_ENV = production
```

Click **"Save"**

---

### Step 10: Configure Volumes - Bot 2

Go to **"Volumes"** tab and add:

**⚠️ CRITICAL:** Use the EXACT SAME paths as Bot 1!

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

Click **"Save"**

---

### Step 11: Configure Start Command - Bot 2

Go to **"Advanced"** tab and set:

```
Start Command: npm run bot2    ← DIFFERENT FROM BOT 1!
```

Click **"Save"**

### Step 12: Deploy Bot 2

1. Click **"Deploy"** button
2. Wait for deployment (watch logs)
3. Look for:
   ```
   ✅ Bot 2 logged in as YourBot#5678
   🔒 Authorized users: 1
   ✅ Slash commands registered successfully!
   ```

**✅ Checkpoint:** Bot 2 is running!

---

## 🌐 SERVICE 3: WEB INTERFACE

### Step 13: Create Service - Web

1. Click **"Create Application"** again
2. **Provider Tab:**
   ```
   Provider: GitHub
   GitHub Account: Your account
   Repository: recorder
   Branch: main
   Build Path: /
   Trigger Type: On Push
   ```
   Save

3. **Build Type Tab:**
   ```
   Build Type: Nixpacks
   ```
   Save

---

### Step 14: Configure Port - Web

1. Go to **"Ports"** or **"Network"** tab
2. Add port mapping:
   ```
   Container Port: 8080
   Published Port: 8080
   Protocol: TCP
   ```
3. Click **"Save"**

### Step 15: Configure Domain - Web

1. Go to **"Domains"** tab
2. Click **"Add Domain"** or **"+"**
3. Fill in:
   ```
   Domain: rec.trayb.az
   Container Port: 8080
   Path: / (default)
   HTTPS: Enable (toggle on)
   Certificate: Let's Encrypt (automatic)
   ```
4. Click **"Add"** or **"Save"**

Dokploy will automatically request and install SSL certificate from Let's Encrypt.

---

### Step 16: Configure Environment Variables - Web

Go to **"Environment"** tab and add:

```
WEB_PORT = 8080
WEB_URL = https://rec.trayb.az
NODE_ENV = production
```

Click **"Save"**

---

### Step 17: Configure Volumes - Web

Go to **"Volumes"** tab and add:

**⚠️ CRITICAL:** Use the EXACT SAME paths as the bots!

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

Click **"Save"**

---

### Step 18: Configure Start Command - Web

Go to **"Advanced"** tab and set:

```
Start Command: npm run web
```

Click **"Save"**

### Step 19: Deploy Web

1. Click **"Deploy"** button
2. Wait for deployment (watch logs)
3. Look for:
   ```
   🌐 Web interface running at http://localhost:8080
   📊 View recordings at http://localhost:8080
   ```

**✅ Checkpoint:** Web service is running!

---

## 🌐 DNS CONFIGURATION

### Step 20: Add DNS Record

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

### Step 21: Wait for DNS Propagation

```bash
# Check if DNS is working (from your local machine)
dig rec.trayb.az +short

# Should return your server IP
```

Usually takes 1-5 minutes with Cloudflare, up to 30 minutes elsewhere.

---

## ✅ VERIFICATION

### Step 22: Check All Services

**In Dokploy Dashboard:**

You should see 3 services all with status: **Running** ✅

```
✅ trayb-recorder-bot1    Running
✅ trayb-recorder-bot2    Running
✅ trayb-recorder-web     Running
```

---

### Step 23: Check Logs

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

### Step 24: Test Web Interface

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

### Step 25: Test Discord Bots

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

### Step 26: Full Test - Record a Match

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

