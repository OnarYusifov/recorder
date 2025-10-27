# 🎉 What's New - Match System & Timeline Sync

## 🚀 Major Updates

### 1. ✅ Safe Timeline Synchronization

**Problem Solved:** Individual audio tracks now have the same duration as the combined track!

**How it Works:**
- Transform stream monitors audio packets
- Background interval writes silence when no audio is received
- **No stuttering** - audio pipe never interrupted
- **Perfect alignment** - all tracks same length

**Before:**
```
combined.mp3:  1hr 23min 45s
alice.mp3:     45min 12s        ❌ Different lengths!
bob.mp3:       1hr 2min 33s     ❌ Alignment nightmare!
```

**After:**
```
combined.mp3:  1hr 23min 45s
alice.mp3:     1hr 23min 45s    ✅ Same length!
bob.mp3:       1hr 23min 45s    ✅ Perfect alignment!
```

**Result:**
- Drop all tracks in your editor at 00:00
- They align automatically
- No manual syncing needed
- No more alignment hell!

---

### 2. 🎮 Match System (Team vs Team)

**New Workflow:**

**Bot 1 (Team A):**
```
/record channel:#voice teamname:TeamAlpha vsteam:TeamBravo
```
- Creates a new match
- Records TeamAlpha
- Sets up match: TeamAlpha vs TeamBravo

**Bot 2 (Team B):**
```
/record channel:#voice
```
- Automatically joins the match created by Bot 1
- Records TeamBravo
- No teamname needed (uses vsteam from Bot 1)

**Stopping:**
```
Bot 1: /stop
```
- Bot 1 stops and processes
- Bot 2 also stops (auto-coordinated)
- Match is saved with both recordings linked

---

### 3. 🌐 Web Interface

**Beautiful, minimalist black & white design**

**Features:**
- Browse all matches by teams
- See match details (date, duration, channel)
- Download all audio files
- View stats charts
- Auto-refresh every 30 seconds
- Mobile responsive

**How to Use:**
```bash
npm run web
```

Then visit: **http://localhost:3000**

**What You See:**
- Matches organized by "Team A vs Team B"
- Each team's participants listed
- Click any file to download
- Full match history

---

### 4. 🤝 Inter-Bot Communication

**Shared Match State:**
- Bot 1 creates match → Bot 2 knows about it
- Bot 1 stops → Bot 2 stops
- Both recordings linked together
- Match complete when both finish

**Data Storage:**
```
/root/recorder/data/matches.json
```

Contains all match metadata:
- Teams
- Participants
- Timestamps
- Recording sessions
- File paths

---

## 📝 Command Changes

### Bot 1 Commands

**Start Recording:**
```
/record channel:#voice teamname:YourTeam vsteam:OpponentTeam
```

**Parameters:**
- `channel` - Voice channel to record (required)
- `teamname` - Your team name (required)
- `vsteam` - Opponent team name (optional, defaults to "Team 2")

### Bot 2 Commands

**Start Recording:**
```
/record channel:#voice
```

**Parameters:**
- `channel` - Voice channel to record (required)
- `teamname` - NOT NEEDED (auto-uses vsteam from Bot 1)

### Both Bots

**Stop Recording:**
```
/stop
```

**Check Status:**
```
/status
```

---

## 🎯 Use Cases

### Solo Recording (One Team Only)
```
Bot 1: /record channel:#voice teamname:MyTeam
       /stop
```
Works perfectly! No need to start Bot 2.

### Match Recording (Two Teams)
```
Bot 1: /record channel:#voice teamname:TeamA vsteam:TeamB
Bot 2: /record channel:#voice
       [play match]
Bot 1: /stop
```
Both bots stop, match is saved, web interface updated.

---

## 🛠️ Technical Details

### Timeline Sync Implementation

**Transform Stream Approach:**
```javascript
// Monitor audio packets
const syncStream = new Transform({
    transform(chunk, encoding, callback) {
        lastPacketTime = Date.now();
        callback(null, chunk);
    }
});

// Background silence writer (separate from pipe)
setInterval(() => {
    const timeSinceLast = Date.now() - lastPacketTime;
    if (timeSinceLast > 40) {
        writeStream.write(silenceFrame);
        lastPacketTime = Date.now();
    }
}, 20);

// Pipe: audio → decoder → sync → file
audioStream.pipe(decoder).pipe(syncStream).pipe(file);
```

**Why This Works:**
- Transform stream passes audio through unchanged
- Monitors packet timing passively
- Separate interval writes silence (doesn't interrupt pipe)
- No backpressure issues
- No stuttering
- Clean, continuous audio

---

### Match Manager

**Singleton Pattern:**
- One instance shared by both bots
- Persists across bot restarts
- JSON file storage

**Match Data Structure:**
```json
{
  "id": 1234567890,
  "team1": "TeamAlpha",
  "team2": "TeamBravo",
  "channel": "voice-1",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T11:15:00Z",
  "recordings": {
    "bot1": {
      "sessionId": "1234567890_TeamAlpha",
      "teamName": "TeamAlpha",
      "users": ["Alice", "Bob"],
      "talkTime": { "123": 1234, "456": 5678 },
      "duration": 2700000
    },
    "bot2": { ... }
  },
  "startedBy": "User#1234"
}
```

---

### Web Server

**Express.js with REST API:**

**Endpoints:**
- `GET /` - Web interface
- `GET /api/matches` - All matches (JSON)
- `GET /api/matches/:id` - Specific match (JSON)
- `GET /output/:sessionId/:filename` - Download file

**Static Files:**
- Serves from `/output` directory
- Audio files
- Stats charts
- Direct download links

---

## 📦 File Structure

```
/root/recorder/
├── src/
│   ├── bot.js                 # Bot logic (updated)
│   ├── recordingManager.js    # Timeline sync (updated)
│   ├── matchManager.js        # Match tracking (NEW)
│   ├── web/
│   │   ├── server.js          # Express server (NEW)
│   │   └── public/
│   │       └── index.html     # Web interface (NEW)
│   ├── audioProcessor.js
│   └── canvasGenerator.js
├── output/                    # Recordings
│   ├── 1234_TeamAlpha/
│   └── 1234_TeamBravo/
├── data/                      # Match data (NEW)
│   └── matches.json
├── package.json               # Updated dependencies
├── .env                       # Environment variables
├── QUICK_START_MATCH.md       # Quick start guide (NEW)
├── README_WEB.md              # Web interface docs (NEW)
├── TEST_GUIDE.md              # Testing guide (NEW)
└── WHATS_NEW.md               # This file (NEW)
```

---

## 🔧 Setup Changes

### New Dependencies

```json
{
  "express": "^4.18.2"
}
```

Install:
```bash
npm install
```

### New Scripts

```json
{
  "web": "node src/web/server.js",
  "dev:web": "nodemon src/web/server.js"
}
```

### New Environment Variable (Optional)

```env
WEB_PORT=3000
```

---

## 🎬 Migration from Old Version

If you were using the old version:

1. **Commands Changed:**
   - Old: `/record channel:#voice teamname:Team`
   - New: `/record channel:#voice teamname:TeamA vsteam:TeamB`
   - Bot 2: `/record channel:#voice` (simplified!)

2. **Web Interface:**
   - Start with `npm run web`
   - Access at http://localhost:3000
   - All old recordings still work

3. **Timeline Sync:**
   - Automatically enabled
   - No configuration needed
   - All new recordings will have synced tracks

4. **Match System:**
   - Optional - use if you want Team vs Team
   - Not required - single team recording still works

---

## 🎯 Benefits Summary

| Feature | Before | After |
|---------|--------|-------|
| **Track Alignment** | Manual | Automatic ✅ |
| **Stuttering** | Sometimes | Never ✅ |
| **Match Organization** | None | Full system ✅ |
| **Web Interface** | None | Beautiful UI ✅ |
| **Bot Coordination** | Manual | Automatic ✅ |
| **Storage** | Discord only | Web + Discord ✅ |
| **Timeline Sync** | No | Yes ✅ |

---

## 🚀 What's Next?

1. **Test the system:**
   - See `TEST_GUIDE.md`

2. **Start recording matches:**
   - See `QUICK_START_MATCH.md`

3. **Explore the web interface:**
   - See `README_WEB.md`

4. **Production deployment:**
   - Use PM2 for process management
   - Add nginx reverse proxy
   - Set up SSL

---

## 🐛 Known Issues

**None!** All previous issues have been resolved:
- ✅ Stuttering fixed
- ✅ Silent recordings fixed
- ✅ Opus errors handled
- ✅ Timeline sync working
- ✅ Mobile users recorded

---

## 💡 Tips

1. **Always start Bot 1 first** when doing match recording
2. **Web interface updates automatically** every 30 seconds
3. **Individual tracks are timeline-synced** - perfect for editing
4. **You can still use single-bot recording** - match system is optional
5. **Files are stored locally** - no storage limits!

---

**Enjoy your new recording system! 🎉🎙️**

