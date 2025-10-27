# Quick Setup Guide for TRAYB Discord Recorder Bots

## Step-by-Step Setup

### 1. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install FFmpeg (if not already installed)
# Ubuntu/Debian:
sudo apt update && sudo apt install ffmpeg

# macOS:
# brew install ffmpeg
```

### 2. Create Discord Bots

1. Go to https://discord.com/developers/applications
2. Create TWO applications:
   - **TRAYB Recorder 1**
   - **TRAYB Recorder 2**

For each application:
1. Click "Bot" in the left sidebar
2. Click "Add Bot"
3. Under "Privileged Gateway Intents", enable:
   - ✅ SERVER MEMBERS INTENT
   - ✅ MESSAGE CONTENT INTENT
4. Click "Reset Token" and copy the token
5. Save tokens securely for next step

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp env.example .env

# Edit the .env file
nano .env
```

Fill in your configuration:

```env
# Bot 1 Configuration
BOT1_TOKEN=YOUR_FIRST_BOT_TOKEN_HERE
BOT1_PREFIX=!
BOT1_UPLOAD_CHANNEL_ID=YOUR_CHANNEL_ID_HERE

# Bot 2 Configuration
BOT2_TOKEN=YOUR_SECOND_BOT_TOKEN_HERE
BOT2_PREFIX=!
BOT2_UPLOAD_CHANNEL_ID=YOUR_CHANNEL_ID_HERE
```

**How to get Channel ID:**
1. Enable Developer Mode in Discord (Settings > Advanced > Developer Mode)
2. Right-click on the channel where you want recordings uploaded
3. Click "Copy ID"
4. Paste as the `UPLOAD_CHANNEL_ID`

### 4. Invite Bots to Your Server

For each bot, create an invite URL:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3165184&scope=bot
```

**How to get Client ID:**
1. Go to your application in Discord Developer Portal
2. Click "OAuth2" in the left sidebar
3. Copy the "Client ID"
4. Replace `YOUR_CLIENT_ID` in the URL above

Visit both URLs to invite both bots to your server.

### 5. Start the Bots

**Option A: Run both bots in one command (Linux/macOS)**
```bash
./start-both.sh
```

**Option B: Run in separate terminals**

Terminal 1:
```bash
npm run bot1
```

Terminal 2:
```bash
npm run bot2
```

**Option C: Use PM2 (recommended for production)**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**Option D: Use Docker**
```bash
docker-compose up -d
```

### 6. Test the Bots

In your Discord server:

1. Join a voice channel
2. Type: `/record` and fill in the parameters
   - `channel`: Select your voice channel
   - `teamname`: Enter `TRAYB`
3. Talk for a bit
4. Click the **⏹️ Stop Recording** button or type `/stop`
5. Check the upload channel for your recordings!

## Commands Reference

| Command | Description | Example |
|---------|-------------|---------|
| `/record` | Start recording | `/record channel:#general teamname:TRAYB` |
| `/stop` | Stop recording and upload | `/stop` |
| `/status` | Check recording status | `/status` |
| **⏹️ Stop Recording** (button) | Stop via button | Click the button |
| **📊 Check Status** (button) | Status via button | Click the button |

## File Output

After stopping a recording, you'll receive:
- **stats.png** - Talk time visualization
- **combined.mp3** - All audio mixed together
- **[Username].mp3** - Individual audio for each person

## Troubleshooting

### "Bot token not found"
- Make sure your `.env` file exists and has the correct tokens
- Verify there are no extra spaces or quotes around tokens

### "Permission denied" on start-both.sh
```bash
chmod +x start-both.sh
```

### Bot doesn't receive audio
1. Make sure the bot is NOT deafened in the voice channel
2. Check that users are actually speaking
3. Verify FFmpeg is installed: `ffmpeg -version`

### Canvas/Image generation fails
Install canvas dependencies:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg
```

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start both bots
pm2 start ecosystem.config.js

# View logs
pm2 logs

# View status
pm2 status

# Stop bots
pm2 stop all

# Restart bots
pm2 restart all

# Set up auto-start on system boot
pm2 startup
pm2 save
```

### Using Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

## Security Checklist

- [ ] `.env` file is NOT committed to git
- [ ] Bot tokens are kept secret
- [ ] Only trusted users have access to bot commands
- [ ] Users are informed before being recorded
- [ ] Recordings are stored securely
- [ ] Old recordings are deleted regularly

## Next Steps

1. Customize the prefix if needed (change `BOT1_PREFIX` in `.env`)
2. Set up automatic cleanup of old recordings
3. Consider adding authentication/role restrictions
4. Monitor disk space (recordings can be large)
5. Set up log rotation if running long-term

## Support

If you encounter issues:
1. Check the logs (in `logs/` directory if using PM2)
2. Verify all dependencies are installed
3. Ensure Discord bot has proper permissions
4. Check that FFmpeg is working: `ffmpeg -version`

Happy recording! 🎙️

