# ⚡ Quick Start: Match Recording

## 🎯 TL;DR - 30 Second Setup

```bash
# Terminal 1: Start Bot 1
npm run bot1

# Terminal 2: Start Bot 2  
npm run bot2

# Terminal 3: Start Web Interface
npm run web
```

Then in Discord:
```
Bot 1: /record channel:#voice teamname:TeamA vsteam:TeamB
Bot 2: /record channel:#voice

[Play your match]

Bot 1: /stop
```

Visit: **http://localhost:3000** to download recordings!

---

## 📋 Step by Step

### 1️⃣ Setup Environment

Create `.env` file:
```env
BOT1_TOKEN=your_bot1_token_here
BOT2_TOKEN=your_bot2_token_here
BOT1_AUTHORIZED_USERS=your_user_id
BOT2_AUTHORIZED_USERS=your_user_id
```

### 2️⃣ Start Everything

```bash
# Start Bot 1 (records Team A)
npm run bot1

# Start Bot 2 (records Team B)
npm run bot2

# Start Web Interface
npm run web
```

### 3️⃣ Start Match Recording

**In Discord, with Bot 1:**
```
/record channel:#your-voice-channel teamname:TeamAlpha vsteam:TeamBravo
```

**Then with Bot 2:**
```
/record channel:#your-voice-channel
```
(Note: Bot 2 doesn't need teamname - it auto-joins the match!)

### 4️⃣ Stop Recording

**With Bot 1:**
```
/stop
```

Bot 2 will automatically stop when Bot 1 stops!

### 5️⃣ View Recordings

Open your browser:
```
http://localhost:3000
```

You'll see:
- ✅ Match: TeamAlpha vs TeamBravo
- ✅ All participants listed
- ✅ Individual audio tracks for each person
- ✅ Combined audio for each team
- ✅ Stats charts showing talk time

---

## 🎮 Match Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  BOT 1 (Team A)        BOT 2 (Team B)           │
├─────────────────────────────────────────────────┤
│                                                 │
│  /record               (waiting...)             │
│  ✅ Match started                               │
│                                                 │
│  📼 Recording...       /record                  │
│                        ✅ Joined match          │
│                                                 │
│  📼 Recording...       📼 Recording...          │
│                                                 │
│  /stop                 🛑 Auto-stop             │
│  ✅ Stopped            ✅ Stopped               │
│                                                 │
│  📊 Uploading...       📊 Uploading...          │
│  ✅ Done               ✅ Done                  │
│                                                 │
│        🏆 MATCH COMPLETE!                       │
│     View at http://localhost:3000               │
└─────────────────────────────────────────────────┘
```

---

## 🎙️ What You Get

### For Each Team:

**Audio Files:**
- `combined.mp3` - All team members mixed
- `Alice.mp3` - Alice's audio only
- `Bob.mp3` - Bob's audio only
- `Charlie.mp3` - Charlie's audio only
- (etc...)

**Stats:**
- `stats.png` - Talk time visualization

### Timeline Synced! ⏱️

All individual tracks have the **same duration** as the combined track:
- ✅ Drop into your editor
- ✅ Auto-align perfectly
- ✅ No manual syncing
- ✅ Silence gaps preserved

---

## 💡 Pro Tips

### Tip 1: Pre-join Voice Channel
Have both bots join the voice channel BEFORE starting recording to catch everyone from the start.

### Tip 2: Bot 2 is Lazy
Bot 2 doesn't need a teamname - it automatically uses the `vsteam` name from Bot 1!

### Tip 3: Solo Recording
If you only need one team recorded:
```
/record channel:#voice teamname:MyTeam
```
No need to start Bot 2. Works perfectly fine!

### Tip 4: Check Status Anytime
```
/status
```
Shows who's being recorded, how long, etc.

---

## 🐛 Troubleshooting

### "No active match" error on Bot 2
**Solution:** Start Bot 1 first! Bot 2 needs an active match to join.

### Web interface shows no matches
**Solution:** 
1. Check `data/matches.json` exists
2. Complete a recording (both bots must stop)
3. Refresh the web page

### Audio files are short/cut off
**Solution:** 
- Make sure users are in the voice channel BEFORE starting recording
- Bot subscribes to users when recording starts

---

## 📁 File Structure

```
/root/recorder/
├── output/                    # All recordings
│   ├── 1234_TeamAlpha/
│   │   ├── combined.mp3
│   │   ├── Alice.mp3
│   │   ├── Bob.mp3
│   │   └── stats.png
│   └── 1234_TeamBravo/
│       ├── combined.mp3
│       ├── Charlie.mp3
│       └── stats.png
├── data/                      # Match metadata
│   └── matches.json
└── src/
    ├── bot.js                 # Bot logic
    ├── matchManager.js        # Match tracking
    └── web/
        ├── server.js          # Web server
        └── public/
            └── index.html     # Web interface
```

---

## 🚀 Next Steps

1. ✅ Record your first match
2. ✅ Download the files from web interface
3. ✅ Import into your video editor
4. ✅ Tracks auto-align (they're timeline-synced!)
5. ✅ Edit and publish!

**Questions?** Check `README_WEB.md` for detailed web interface documentation.

---

**Happy recording! 🎉**

