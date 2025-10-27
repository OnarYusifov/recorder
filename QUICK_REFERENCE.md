# 📋 Quick Reference Card

## 🎮 Commands

```bash
# Slash Commands in Discord
/record channel:#voice-1 teamname:TRAYB    # Start recording
/stop                                       # Stop recording
/status                                     # Check status

# Interactive Buttons (appear after /record)
⏹️ Stop Recording    # Stops and processes
📊 Check Status      # Shows current stats
🔄 Refresh Status    # Updates status display
```

## 🚀 Starting the Bots

```bash
# Terminal 1
npm run bot1

# Terminal 2
npm run bot2

# Or both at once (Linux/macOS)
./start-both.sh

# Production (PM2)
pm2 start ecosystem.config.js
pm2 logs              # View logs
pm2 status            # Check status
pm2 stop all          # Stop bots
pm2 restart all       # Restart bots

# Docker
docker-compose up -d              # Start
docker-compose logs -f            # View logs
docker-compose down               # Stop
```

## ⚙️ Configuration

```bash
# Create .env file
cp env.example .env

# Edit configuration
nano .env
```

```env
# Required settings
BOT1_TOKEN=your_bot_token_here
BOT1_UPLOAD_CHANNEL_ID=channel_id_here

BOT2_TOKEN=your_bot_token_here
BOT2_UPLOAD_CHANNEL_ID=channel_id_here
```

## 🔑 Getting Discord Info

```bash
# Get Bot Token:
# 1. https://discord.com/developers/applications
# 2. Select your bot
# 3. Go to "Bot" section
# 4. Click "Reset Token"
# 5. Copy and paste into .env

# Get Channel ID:
# 1. Enable Developer Mode (Discord Settings > Advanced)
# 2. Right-click the channel
# 3. Click "Copy ID"
# 4. Paste into .env
```

## 🔗 Bot Invite URL

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3165184&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your bot's client ID.

## 📦 What Gets Uploaded

After `/stop`, the bot uploads to your configured channel:

1. **stats.png** - Talk time visualization
2. **combined.mp3** - All audio mixed
3. **User1.mp3** - Individual track
4. **User2.mp3** - Individual track
5. **User3.mp3** - Individual track
6. ... (more individual tracks)

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| npm install fails | `sudo apt install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config` |
| Commands not showing | Wait 5-10 minutes, restart Discord, or re-invite bot with new URL |
| No audio recorded | Make sure bot is NOT deafened in voice channel |
| Bot won't start | Check `.env` file exists and has valid tokens |
| Can't upload files | Check `UPLOAD_CHANNEL_ID` in `.env` is correct |

## 📊 Example Workflow

```bash
# 1. Start bot
npm run bot1

# 2. In Discord, type:
/record channel:#voice-1 teamname:TRAYB

# 3. Bot joins and shows:
✅ Recording started!
📍 Channel: voice-1
👥 Team: TRAYB
[⏹️ Stop Recording] [📊 Check Status]

# 4. Click "📊 Check Status" to see progress

# 5. Click "⏹️ Stop Recording" when done

# 6. Bot processes and uploads files automatically
```

## 🔍 Useful Commands

```bash
# Check if bot is running
ps aux | grep "node src/bot.js"

# View logs (if using PM2)
pm2 logs trayb-recorder-1
pm2 logs trayb-recorder-2

# Check disk space (recordings can be large)
df -h

# Find recordings directory
ls -lh recordings/
ls -lh output/

# Clean up old recordings
rm -rf recordings/*
rm -rf output/*
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| START_HERE.md | Quick overview & getting started |
| QUICK_START.md | 3-minute setup guide |
| QUICK_REFERENCE.md | This file - quick commands |
| COMMANDS.md | Complete command reference |
| SETUP_GUIDE.md | Detailed setup instructions |
| README.md | Full technical documentation |
| UPGRADE_NOTES.md | Slash commands vs prefix info |

## 💡 Pro Tips

- **Use autocomplete**: Discord shows available channels when you type `/record`
- **Buttons are faster**: Click buttons instead of typing commands
- **Check status often**: Monitor talk time during long recordings
- **Set upload channel**: Use `UPLOAD_CHANNEL_ID` to organize recordings
- **Run both bots**: Have separate bots for different teams/purposes

---

**Keep this handy for quick reference!** 📌

