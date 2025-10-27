# 🌐 Web Interface Guide

## Overview

The TRAYB Recorder includes a beautiful, minimalist web interface to browse and download all your match recordings.

## Features

- **Match-based organization** - Recordings grouped by Team A vs Team B
- **Clean black & white design** - Minimalist, professional look
- **Easy downloads** - Click to download any audio file or stats chart
- **Auto-refresh** - Updates every 30 seconds automatically
- **Mobile responsive** - Works great on phones and tablets

## Starting the Web Server

```bash
npm run web
```

The web interface will be available at: **http://localhost:3000**

## How It Works

### Match Recording Flow

1. **Bot 1 starts recording:**
   ```
   /record channel:#voice teamname:TeamA vsteam:TeamB
   ```
   - Creates a new match: TeamA vs TeamB
   - Starts recording TeamA

2. **Bot 2 joins the match:**
   ```
   /record channel:#voice
   ```
   - Automatically joins the active match
   - Starts recording TeamB (no teamname needed)

3. **Bot 1 stops recording:**
   ```
   /stop
   ```
   - Stops Bot 1's recording
   - Bot 2 receives signal to stop (if needed)

4. **Match is saved:**
   - Both recordings are linked together
   - Viewable on the web interface
   - Organized by date and teams

### Web Interface Layout

```
╔══════════════════════════════════════════════════╗
║            TRAYB RECORDINGS                      ║
║            Match recordings archive              ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║  Team Alpha  VS  Team Bravo      [2024-01-15]  ║
║  ┌────────────────┬────────────────┐            ║
║  │ Team Alpha     │ Team Bravo     │            ║
║  │ • Alice        │ • Charlie      │            ║
║  │ • Bob          │ • Dave         │            ║
║  │                │                │            ║
║  │ ▶ Combined     │ ▶ Combined     │            ║
║  │ ▶ Alice        │ ▶ Charlie      │            ║
║  │ ▶ Bob          │ ▶ Dave         │            ║
║  │ ▶ Stats Chart  │ ▶ Stats Chart  │            ║
║  └────────────────┴────────────────┘            ║
║  Duration: 45min    Channel: voice-1            ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

## Configuration

### Port (Optional)

Default port is 3000. To change it, add to your `.env`:

```env
WEB_PORT=8080
```

### Running in Production

For production, use a process manager like PM2:

```bash
# Install PM2
npm install -g pm2

# Start all services
pm2 start ecosystem.config.js

# Or start individually
pm2 start npm --name "bot1" -- run bot1
pm2 start npm --name "bot2" -- run bot2
pm2 start npm --name "web" -- run web
```

### Example PM2 config (ecosystem.config.js):

```javascript
module.exports = {
  apps: [
    {
      name: 'trayb-bot1',
      script: 'src/bot.js',
      args: '1',
      instances: 1,
      autorestart: true,
    },
    {
      name: 'trayb-bot2',
      script: 'src/bot.js',
      args: '2',
      instances: 1,
      autorestart: true,
    },
    {
      name: 'trayb-web',
      script: 'src/web/server.js',
      instances: 1,
      autorestart: true,
    }
  ]
};
```

## File Storage

Recordings are stored in:
```
/root/recorder/
  ├── output/
  │   ├── 1234567890_TeamA/
  │   │   ├── combined.mp3
  │   │   ├── Alice.mp3
  │   │   ├── Bob.mp3
  │   │   └── stats.png
  │   └── 1234567891_TeamB/
  │       ├── combined.mp3
  │       ├── Charlie.mp3
  │       └── ...
  └── data/
      └── matches.json  # Match metadata
```

## Timeline Sync

**✅ All individual audio tracks are now timeline-synced!**

Each user's audio file includes:
- Their actual speech
- Silence gaps when they're not talking
- **Same total duration as combined track**

This means you can:
- Drop all tracks into your editor
- They auto-align perfectly
- No manual syncing needed
- Edit 1-hour recordings easily!

### How It Works

The recorder uses a **Transform stream** with background silence writing:
- When audio arrives → written immediately
- When no audio for 40ms → silence frame written
- No stuttering (silence writer runs independently)
- Clean, smooth audio

## API Endpoints

### GET /api/matches
Returns all matches as JSON:

```json
[
  {
    "id": 1234567890,
    "team1": "Team Alpha",
    "team2": "Team Bravo",
    "channel": "voice-1",
    "startTime": "2024-01-15T10:30:00Z",
    "endTime": "2024-01-15T11:15:00Z",
    "recordings": {
      "bot1": { ... },
      "bot2": { ... }
    }
  }
]
```

### GET /api/matches/:id
Returns specific match by ID

### GET /output/:sessionId/:filename
Downloads audio file or stats chart

## Troubleshooting

### Web interface won't start
```bash
# Check if port is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>

# Or use a different port
WEB_PORT=8080 npm run web
```

### Matches not showing
```bash
# Check data directory exists
ls -la data/

# Check matches.json
cat data/matches.json

# Permissions
chmod -R 755 data/
```

### Files not downloading
```bash
# Check output directory
ls -la output/

# Permissions
chmod -R 755 output/
```

## Security Notes

⚠️ **Important for production:**

1. **Don't expose publicly without authentication**
2. **Use a reverse proxy (nginx) with HTTPS**
3. **Add basic auth if needed**
4. **Firewall the port if on a server**

Example nginx config:
```nginx
server {
    listen 80;
    server_name recordings.yourdomain.com;

    auth_basic "TRAYB Recordings";
    auth_basic_user_file /etc/nginx/.htpasswd;

    location / {
        proxy_pass http://localhost:3000;
    }
}
```

## Support

Issues? Check:
1. Bot tokens are valid
2. Both bots are running
3. Web server is running
4. Port 3000 is not blocked
5. Recordings exist in `output/` directory

---

**Enjoy your beautiful, organized recordings! 🎙️✨**

