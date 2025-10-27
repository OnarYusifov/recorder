# 🚀 START HERE - TRAYB Discord Recorder Bots

## ✅ Installation Complete!

Your two Discord recorder bots are ready to deploy. Here's what you have:

### 📦 What's Included

- ✅ **Two separate bots** (TRAYB Recorder 1 & 2)
- ✅ **Slash commands** (`/record`, `/stop`, `/status`)
- ✅ **Interactive buttons** (⏹️ Stop, 📊 Status)
- ✅ **Voice recording** with auto-pause
- ✅ **Individual audio tracks** (up to unlimited users)
- ✅ **Combined audio** track
- ✅ **Talk time statistics** with beautiful canvas visualization
- ✅ **Automatic upload** to your chosen channel
- ✅ **Secure tokens** via environment variables

## 🏃 Quick Start (3 Steps)

### 1. Install System Dependencies
```bash
# Already done! ✅
# But if you need to on another system:

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install nodejs -y

# Install other dependencies
sudo apt update && sudo apt install -y ffmpeg build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config
```

### 2. Install Node.js Dependencies
```bash
npm install  # Already done! ✅
```

### 3. Configure Environment
```bash
# Create your .env file
cp env.example .env

# Edit it with your bot tokens
nano .env
```

Add your Discord bot tokens:
```env
BOT1_TOKEN=your_first_bot_token_here
BOT1_UPLOAD_CHANNEL_ID=your_channel_id_here

BOT2_TOKEN=your_second_bot_token_here
BOT2_UPLOAD_CHANNEL_ID=your_channel_id_here
```

### 4. Start the Bots
```bash
# Terminal 1
npm run bot1

# Terminal 2 (in a new terminal)
npm run bot2

# Or use the helper script:
./start-both.sh
```

## 📖 Documentation

| File | Purpose |
|------|---------|
| **START_HERE.md** (this file) | Quick overview |
| **QUICK_START.md** | 3-minute setup guide |
| **SETUP_GUIDE.md** | Detailed setup instructions |
| **COMMANDS.md** | Complete command reference |
| **README.md** | Full technical documentation |
| **UPGRADE_NOTES.md** | Info about slash commands vs prefix |

## 🎮 Using the Bots

### Start Recording
```
/record channel:#your-voice-channel teamname:TRAYB
```

You'll get interactive buttons:
- **⏹️ Stop Recording** - Stops and processes audio
- **📊 Check Status** - Shows current stats

### Stop Recording
Click **⏹️ Stop Recording** button or type `/stop`

### Check Status
Click **📊 Check Status** button or type `/status`

## 📊 What You Get

After stopping, the bot uploads to your configured channel:

1. **stats.png** - Beautiful talk time visualization 📊
2. **combined.mp3** - Everyone's audio mixed together 🎵
3. **[User1].mp3** - Individual track for User 1 👤
4. **[User2].mp3** - Individual track for User 2 👤
5. **[User3].mp3** - Individual track for User 3 👤
6. ... (and more individual tracks)

## 🔧 Configuration Files

```
recorder/
├── .env                    ← Your bot tokens (CREATE THIS!)
├── env.example            ← Template for .env
├── package.json           ← Dependencies
├── src/
│   ├── bot.js            ← Main bot code
│   ├── recordingManager.js
│   ├── audioProcessor.js
│   └── canvasGenerator.js
└── Documentation files...
```

## 🎯 Next Steps

1. **Create Discord Bots**
   - Visit https://discord.com/developers/applications
   - Create two applications
   - Get bot tokens
   - Enable required intents

2. **Get Your Discord User ID** (for authorization)
   - Enable Developer Mode in Discord
   - Right-click your username
   - Click "Copy User ID"

3. **Get Channel ID**
   - Right-click your upload channel
   - Click "Copy ID"

4. **Update .env file**
   ```env
   BOT1_TOKEN=your_token_here
   BOT1_UPLOAD_CHANNEL_ID=your_channel_id
   BOT1_AUTHORIZED_USERS=your_user_id,friend_user_id
   ```

5. **Invite Bots**
   - Use this URL (replace CLIENT_ID):
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3165184&scope=bot%20applications.commands
   ```

6. **Start & Test**
   ```bash
   npm run bot1
   # In Discord: /record channel:#voice teamname:TRAYB
   ```

## 🐛 Common Issues

**npm install fails?**
→ Install system dependencies first (see QUICK_START.md)

**Slash commands not showing?**
→ Wait 5-10 minutes or restart Discord

**Bot can't record audio?**
→ Make sure bot isn't deafened in voice channel

**Files won't upload?**
→ Check channel ID in .env is correct

## 📚 Learn More

- **Production Deployment** → See README.md (PM2, Docker)
- **Command Reference** → See COMMANDS.md
- **Troubleshooting** → See TROUBLESHOOTING.md
- **Authorization Setup** → See AUTHORIZATION.md
- **Audio Sync Explained** → See AUDIO_SYNC.md
- **Technical Details** → See README.md

## 🎉 You're Ready!

Everything is set up and ready to go. Just:
1. Add your tokens to `.env`
2. Start the bots with `npm run bot1` and `npm run bot2`
3. Use `/record` in Discord

**Need help?** Check the documentation files above!

---

**Made with ❤️ for TRAYB**

