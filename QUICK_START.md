# 🎙️ TRAYB Discord Recorder - Quick Start

## ⚡ 3-Minute Setup

### 1️⃣ Install Dependencies (1 min)
```bash
npm install
```

### 2️⃣ Create .env File (1 min)
```bash
cp env.example .env
nano .env  # Add your bot tokens
```

Your `.env` should look like:
```env
BOT1_TOKEN=MTA1NDU4Nzg5NTY3ODkwMTIz.GKpXYz.aBcDeFgHiJkLmNoPqRsTuVwXyZ
BOT1_UPLOAD_CHANNEL_ID=987654321098765432

BOT2_TOKEN=MTA1NDU4Nzg5NTY3ODkwMTI0.GLqYZa.bCdEfGhIjKlMnOpQrStUvWxYzA
BOT2_UPLOAD_CHANNEL_ID=987654321098765432
```

### 3️⃣ Start Both Bots (30 sec)
```bash
npm run bot1  # Terminal 1
npm run bot2  # Terminal 2
```

## 🎯 Usage

### Start Recording (Slash Command)
```
/record channel:#voice-channel teamname:TRAYB
```

### Stop Recording (Button or Command)
Click the **⏹️ Stop Recording** button, or use:
```
/stop
```

### Check Status (Button or Command)
Click the **📊 Check Status** button, or use:
```
/status
```

## 📦 What You Get

After clicking **⏹️ Stop Recording** or using `/stop`, the bot uploads:
1. **stats.png** - Beautiful talk time chart 📊
2. **combined.mp3** - Everyone's audio mixed 🎵
3. **[User1].mp3** - Individual track for User 1 👤
4. **[User2].mp3** - Individual track for User 2 👤
5. **[User3].mp3** - Individual track for User 3 👤
6. ... (up to 5 individual tracks)

## 🔧 Bot Setup (Discord Developer Portal)

1. Go to https://discord.com/developers/applications
2. Create 2 applications (TRAYB Recorder 1 & 2)
3. For each:
   - Bot → Add Bot
   - Enable "MESSAGE CONTENT INTENT"
   - Copy Token → Paste in `.env`
4. Invite both bots with this URL:
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3165184&scope=bot
   ```

## ⚠️ Requirements

- ✅ **Node.js v22+** (required for voice encryption)
- ✅ FFmpeg installed
- ✅ Discord bot tokens
- ✅ Permissions: Connect, Speak, Send Messages, Attach Files

## 🐛 Common Issues

**"Bot token not found"**
→ Check your `.env` file exists and has correct tokens

**Slash commands not showing**
→ Wait a few minutes or restart Discord. Commands can take up to an hour to register globally.

**No audio recorded**
→ Make sure bot is NOT deafened in voice channel

**Canvas installation fails**
→ Install: `sudo apt install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config`

## 🚀 Production (PM2)

```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

**Need more help?** Read `SETUP_GUIDE.md` or `README.md`

