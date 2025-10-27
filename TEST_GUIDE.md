# 🧪 Testing Guide

## Quick Test

### Step 1: Start All Services

Open **3 terminals**:

**Terminal 1:**
```bash
cd /root/recorder
npm run bot1
```

**Terminal 2:**
```bash
cd /root/recorder
npm run bot2
```

**Terminal 3:**
```bash
cd /root/recorder
npm run web
```

Wait for:
```
✅ Bot 1 logged in as ...
✅ Bot 2 logged in as ...
🌐 Web interface running at http://localhost:3000
```

---

### Step 2: Start Recording

**In Discord (with Bot 1):**
```
/record channel:#your-voice-channel teamname:TeamAlpha vsteam:TeamBravo
```

You should see:
```
✅ Recording started!
📍 Channel: your-voice-channel
👥 Team: TeamAlpha
🎮 Match: TeamAlpha vs TeamBravo
```

**In Discord (with Bot 2):**
```
/record channel:#your-voice-channel
```

You should see:
```
✅ Recording started!
📍 Channel: your-voice-channel
👥 Team: TeamBravo
🎮 Match: TeamAlpha vs TeamBravo
```

**In Terminal 1 & 2:**
```
🎮 Match started: TeamAlpha vs TeamBravo
👥 Users in voice channel: YourName
📡 Pre-subscribing to: YourName
📼 Started recording: YourName
🎵 Recording YourName
```

---

### Step 3: Talk!

- Join the voice channel you're recording
- Talk for a few seconds
- You should see "🎵 Recording YourName" in the bot terminals

---

### Step 4: Stop Recording

**In Discord (with Bot 1):**
```
/stop
```

Both bots should stop recording automatically!

**In Terminals:**
```
✅ Processed audio for YourName
✅ Created combined audio file
✅ Generated stats canvas
📊 Recording uploaded!
🏆 MATCH COMPLETE!
```

**In Discord:**
You should receive:
- 🎙️ Recording Complete embed
- Stats chart (canvas)
- Combined audio file
- Individual audio files for each participant
- 🏆 Match summary with link to web interface

---

### Step 5: Check Web Interface

Open browser: **http://localhost:3000**

You should see:
```
╔════════════════════════════════════════╗
║       TRAYB RECORDINGS                 ║
║       Match recordings archive         ║
╠════════════════════════════════════════╣
║                                        ║
║  TeamAlpha  VS  TeamBravo  [date]     ║
║  ┌─────────────┬─────────────┐        ║
║  │ TeamAlpha   │ TeamBravo   │        ║
║  │ • YourName  │ • YourName  │        ║
║  │             │             │        ║
║  │ ▶ Combined  │ ▶ Combined  │        ║
║  │ ▶ YourName  │ ▶ YourName  │        ║
║  │ ▶ Stats     │ ▶ Stats     │        ║
║  └─────────────┴─────────────┘        ║
╚════════════════════════════════════════╝
```

Click any file to download!

---

## Expected File Structure

After recording, you should have:

```
/root/recorder/
├── output/
│   ├── 1234567890_TeamAlpha/
│   │   ├── combined.mp3
│   │   ├── YourName.mp3
│   │   └── stats.png
│   └── 1234567891_TeamBravo/
│       ├── combined.mp3
│       ├── YourName.mp3
│       └── stats.png
└── data/
    └── matches.json
```

---

## Troubleshooting

### Bot won't start
```bash
# Check .env file exists
cat .env

# Should have:
BOT1_TOKEN=...
BOT2_TOKEN=...
BOT1_AUTHORIZED_USERS=your_discord_user_id
BOT2_AUTHORIZED_USERS=your_discord_user_id
```

### "Access Denied" error
```bash
# Get your Discord User ID:
# 1. Enable Developer Mode in Discord
# 2. Right-click your username
# 3. Copy ID

# Add to .env:
BOT1_AUTHORIZED_USERS=123456789012345678
BOT2_AUTHORIZED_USERS=123456789012345678
```

### Bot 2 says "No active match"
- Make sure Bot 1 started recording FIRST
- Bot 1 creates the match, Bot 2 joins it

### No audio in recordings
- Make sure you're TALKING in the voice channel
- Check terminal for "🎵 Recording YourName"
- If you see it, audio is being recorded

### Audio stuttering
- Should be fixed with the new Transform stream approach
- If still happening, report it!

### Files not showing in web interface
```bash
# Check data directory
ls -la /root/recorder/data/

# Check matches.json
cat /root/recorder/data/matches.json

# Should show your match data
```

### Web interface won't start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill if needed
kill -9 <PID>

# Or use different port
WEB_PORT=8080 npm run web
```

---

## Advanced Testing

### Test Timeline Sync

1. Record for 1 minute
2. Stop recording
3. Download all audio files
4. Import into Audacity or any DAW
5. All tracks should have the **same duration**
6. Drop them all at time 0:00 - they should align perfectly!

### Test Multiple Users

1. Have 2+ people join voice channel
2. Start recording
3. Take turns talking
4. Stop recording
5. Each person should have their own audio file
6. Combined file should have everyone

### Test Pause/Resume

1. Start recording
2. Everyone leaves voice channel
3. Bot should pause (check terminal)
4. Someone rejoins
5. Bot should resume
6. All recording should be continuous

---

## Success Criteria

✅ Both bots start without errors
✅ `/record` creates a match
✅ Both bots record simultaneously
✅ Audio is captured for all participants
✅ `/stop` processes and uploads files
✅ Web interface displays the match
✅ All audio files are downloadable
✅ Individual tracks have same duration as combined
✅ Stats canvas is generated correctly
✅ Match summary is sent to Discord

---

**If all checks pass, you're ready to use the system! 🎉**

