# 🔧 Troubleshooting Guide

## Common Errors and Solutions

### ❌ Error: The compressed data passed is corrupted

**Full Error:**
```
TypeError: The compressed data passed is corrupted
    at Decoder._decode
```

**Cause:** Discord occasionally sends corrupted or invalid Opus audio packets, especially when users start/stop speaking or during network issues.

**Solution:** 
✅ **Already fixed!** The bot now handles these errors gracefully and continues recording.

**What happens now:**
- You'll see a warning: `⚠️ Opus decode error for [username]: ... (continuing...)`
- The bot continues recording
- Silence is written during the error
- No crash!

**If you still see crashes:**
1. Make sure you have the latest code
2. Restart the bot: `npm run bot1`

---

### ❌ Error: No compatible encryption modes

**Full Error:**
```
Error: No compatible encryption modes. Available include: aead_aes256_gcm_rtpsize, aead_xchacha20_poly1305_rtpsize
```

**Cause:** Using an outdated version of `@discordjs/voice` or Node.js

**Solution:**
1. **Upgrade to Node.js 22:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install nodejs -y
   ```

2. **Reinstall dependencies:**
   ```bash
   cd /root/recorder
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Verify versions:**
   ```bash
   node --version  # Should show v22.x.x
   npm list @discordjs/voice  # Should show 0.19.0 or higher
   ```

---

### ❌ Canvas installation fails

**Error:** `gyp ERR! configure error` or `pkg-config: not found`

**Solution:**
```bash
sudo apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config
npm install
```

---

### ❌ Slash commands not appearing in Discord

**Symptoms:** Commands don't show up when typing `/`

**Solutions:**

1. **Wait:** Commands can take up to 1 hour to register globally
   
2. **Restart Discord:** Close and reopen Discord client

3. **Check bot is running:**
   ```bash
   ps aux | grep "node src/bot.js"
   ```

4. **Re-invite bot with correct permissions:**
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=3165184&scope=bot%20applications.commands
   ```
   Make sure `applications.commands` is in the scope!

5. **Check bot logs:** Look for "✅ Slash commands registered successfully!"

---

### ❌ Bot doesn't record audio

**Symptoms:** Recording starts but no audio files are generated

**Solutions:**

1. **Make sure bot isn't deafened:**
   - Check the bot's icon in the voice channel
   - It should NOT have a headphone icon with a line through it

2. **Users must speak:**
   - The bot only records when people are actually talking
   - Discord only sends audio when someone is speaking

3. **Check FFmpeg:**
   ```bash
   ffmpeg -version
   ```
   If not installed:
   ```bash
   sudo apt install ffmpeg
   ```

4. **Check recordings directory:**
   ```bash
   ls -lh recordings/
   ```
   You should see PCM files being created during recording

---

### ❌ Files won't upload / "Cannot send an empty message"

**Cause:** No audio was recorded or processing failed

**Solutions:**

1. **Check upload channel ID:**
   - Verify `UPLOAD_CHANNEL_ID` in `.env` is correct
   - Make sure bot has permission to send messages in that channel

2. **Check file sizes:**
   ```bash
   ls -lh output/
   ```
   If files are 0 bytes, no audio was recorded

3. **Check disk space:**
   ```bash
   df -h
   ```
   Recordings can be large

---

### ❌ "Application did not respond" error

**Symptoms:** Commands show "The application did not respond" in Discord

**Solutions:**

1. **Bot might be starting up:** Wait 10 seconds and try again

2. **Check bot is running:**
   ```bash
   npm run bot1
   ```
   Look for errors in the output

3. **Check .env file exists:**
   ```bash
   cat .env
   ```
   Make sure it has your bot tokens

4. **Discord API issues:** Sometimes Discord has temporary issues, wait a few minutes

---

### ❌ "BOT1_TOKEN not found in environment variables"

**Cause:** `.env` file doesn't exist or is incorrectly configured

**Solution:**
```bash
# Create .env from template
cp env.example .env

# Edit and add your tokens
nano .env
```

Make sure your `.env` file looks like:
```env
BOT1_TOKEN=your_actual_token_here
BOT1_UPLOAD_CHANNEL_ID=123456789012345678

BOT2_TOKEN=your_second_token_here
BOT2_UPLOAD_CHANNEL_ID=123456789012345678
```

---

### ❌ Bot crashes with "Cannot read properties of undefined"

**Cause:** Usually missing permissions or trying to access a channel that doesn't exist

**Solutions:**

1. **Check bot permissions:**
   - View Channels
   - Send Messages
   - Attach Files
   - Connect (voice)
   - Speak (voice)
   - Use Slash Commands

2. **Verify channel IDs are correct:**
   ```bash
   grep CHANNEL .env
   ```

3. **Check bot is in the server:**
   - Bot must be invited to the server before use

---

### ❌ "Already recording in this server"

**Cause:** A recording is currently active or wasn't properly stopped

**Solutions:**

1. **Stop the current recording:**
   ```
   /stop
   ```

2. **Restart the bot:**
   ```bash
   # Stop with Ctrl+C, then:
   npm run bot1
   ```

3. **If using PM2:**
   ```bash
   pm2 restart trayb-recorder-1
   ```

---

### ❌ High CPU usage during recording

**Normal behavior:** Audio processing is CPU-intensive

**Solutions:**

1. **Limit simultaneous recordings:** Don't record on both bots in the same server at once

2. **Use a more powerful server:** Consider upgrading if recording frequently

3. **Clean up old files regularly:**
   ```bash
   rm -rf recordings/*
   rm -rf output/*
   ```

---

### ❌ PM2 won't start bots

**Error:** `pm2 start` fails

**Solutions:**

1. **Install PM2 globally:**
   ```bash
   sudo npm install -g pm2
   ```

2. **Check config file:**
   ```bash
   cat ecosystem.config.js
   ```

3. **Start with full path:**
   ```bash
   pm2 start /root/recorder/src/bot.js --name "bot1" -- 1
   ```

4. **Check PM2 logs:**
   ```bash
   pm2 logs
   ```

---

### ❌ Docker containers won't start

**Solutions:**

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **View logs:**
   ```bash
   docker-compose logs -f
   ```

3. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose up --build -d
   ```

---

## Getting More Help

### Check Logs

**Regular run:**
```bash
npm run bot1  # Look at console output
```

**PM2:**
```bash
pm2 logs trayb-recorder-1
pm2 logs trayb-recorder-2
```

**Docker:**
```bash
docker-compose logs -f recorder-bot-1
docker-compose logs -f recorder-bot-2
```

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v22.x.x

# Check npm packages
npm list

# Check FFmpeg
ffmpeg -version

# Check disk space
df -h

# Check bot processes
ps aux | grep node
```

### Reset Everything

If all else fails, start fresh:

```bash
# Stop everything
pm2 stop all 2>/dev/null || true
pkill -f "node src/bot.js" 2>/dev/null || true

# Clean install
cd /root/recorder
rm -rf node_modules package-lock.json
npm install

# Restart
npm run bot1
```

---

## Still Having Issues?

1. Check the documentation files:
   - `README.md` - Complete documentation
   - `SETUP_GUIDE.md` - Setup instructions
   - `COMMANDS.md` - Command reference

2. Check Discord.js documentation:
   - https://discord.js.org/
   - https://discordjs.guide/voice/

3. Verify Node.js 22+ is installed:
   ```bash
   node --version
   ```

4. Make sure all system dependencies are installed (see QUICK_START.md)

