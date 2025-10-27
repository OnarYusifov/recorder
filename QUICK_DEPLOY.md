# ⚡ Quick Deploy to Dokploy

## 🚀 5-Minute Setup

### Step 1: Push to GitHub (1 min)

```bash
cd /root/recorder
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/trayb-recorder.git
git push -u origin main
```

---

### Step 2: Create Services in Dokploy (3 min)

#### Bot 1
1. New Service → Name: `trayb-recorder-bot1`
2. GitHub → Select repo → Branch: `main`
3. Start command: `npm run bot1`
4. Environment:
   ```
   BOT1_TOKEN=xxx
   BOT1_AUTHORIZED_USERS=xxx
   WEB_URL=https://rec.trayb.az
   ```
5. Volume: `/app/output` → `/var/dokploy/recorder/output`
6. Volume: `/app/data` → `/var/dokploy/recorder/data`
7. Deploy!

#### Bot 2
1. Clone Bot 1 service settings
2. Change start command: `npm run bot2`
3. Change env: `BOT2_TOKEN`, `BOT2_AUTHORIZED_USERS`
4. Same volumes!
5. Deploy!

#### Web
1. New Service → Name: `trayb-recorder-web`
2. Same repo
3. Start command: `npm run web`
4. Port: `8080:8080`
5. Domain: `rec.trayb.az`
6. SSL: Enable
7. Environment:
   ```
   WEB_PORT=8080
   WEB_URL=https://rec.trayb.az
   ```
8. Same volumes!
9. Deploy!

---

### Step 3: DNS (1 min)

Add in your DNS:
```
Type: A
Name: rec
Value: Your Dokploy server IP
```

Or:
```
Type: CNAME
Name: rec
Value: trayb.az
```

---

### Step 4: Test!

Discord:
```
/record channel:#voice teamname:Test
```

Browser:
```
https://rec.trayb.az
```

---

## ✅ Done!

All 3 services running:
- ✅ Bot 1
- ✅ Bot 2  
- ✅ Web at rec.trayb.az

Auto-deploys on git push! 🎉

---

## 🔄 Alternative: Docker Compose

If you want all-in-one deployment:

```bash
# In Dokploy, create ONE service:
# Type: Docker Compose
# Upload: docker-compose.yml from repo
# Environment: Set all bot tokens
# Deploy!
```

Uses the `docker-compose.yml` file in the repo.

---

## 🐛 Issues?

**Bots won't start:**
- Check logs in Dokploy
- Verify bot tokens
- Check authorized users

**Web 502:**
- Check port 8080 open
- Check SSL certificate
- Wait 1-2 min for DNS

**No recordings:**
- Check volume mounts
- All services must share same paths!

---

**Need detailed help?** See `DOKPLOY_DEPLOYMENT.md`

