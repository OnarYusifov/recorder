# TRAYB Discord Recorder Bots

Two Discord bots designed to record voice channel audio, process individual user tracks, and generate talk time statistics.

## Features

- 🎙️ Record all audio in Discord voice channels
- 👥 Separate audio tracks for each participant (up to any number of users)
- 📊 Beautiful talk time statistics visualization
- ⏸️ Automatic pause when no one is in the voice channel
- 📤 Automatic upload of processed audio files
- 🔒 Secure token management with environment variables
- 🤖 Two independent bot instances

## Prerequisites

- **Node.js v22 or higher** (required for latest voice encryption)
- FFmpeg (for audio processing)
- Discord Bot Tokens (two separate bots)

## Installation

### 1. Install FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 2. Install Node.js Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit the `.env` file and add your bot tokens:

```env
# Bot 1 Configuration
BOT1_TOKEN=your_bot_1_token_here
BOT1_PREFIX=!
BOT1_UPLOAD_CHANNEL_ID=123456789012345678

# Bot 2 Configuration
BOT2_TOKEN=your_bot_2_token_here
BOT2_PREFIX=!
BOT2_UPLOAD_CHANNEL_ID=123456789012345678
```

## Creating Discord Bots

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and name it "TRAYB Recorder 1"
3. Go to the "Bot" section and click "Add Bot"
4. Copy the token and paste it into your `.env` file as `BOT1_TOKEN`
5. Repeat steps 2-4 for "TRAYB Recorder 2" (use `BOT2_TOKEN`)

### Bot Permissions Required

Your bots need the following permissions:
- View Channels
- Send Messages
- Attach Files
- Connect (to voice channels)
- Speak (to receive audio)

**Permission Integer:** `3165184`

### Invite Links

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT1_CLIENT_ID&permissions=3165184&scope=bot

https://discord.com/api/oauth2/authorize?client_id=YOUR_BOT2_CLIENT_ID&permissions=3165184&scope=bot
```

Replace `YOUR_BOT1_CLIENT_ID` and `YOUR_BOT2_CLIENT_ID` with your actual client IDs.

## Usage

### Starting the Bots

**Run Bot 1:**
```bash
npm run bot1
```

**Run Bot 2:**
```bash
npm run bot2
```

**Run Both (in separate terminals):**
```bash
# Terminal 1
npm run bot1

# Terminal 2
npm run bot2
```

### Slash Commands

The bots use Discord's modern **slash commands** (`/`) with interactive **buttons**!

#### Start Recording
```
/record channel:#voice-channel teamname:Team Name
```

**Examples:**
```
/record channel:#general teamname:TRAYB
/record channel:#voice-1 teamname:Alpha Team
/record channel:#meeting-room teamname:Development Squad
```

After starting, you'll get interactive buttons:
- **⏹️ Stop Recording** - Instantly stop and process
- **📊 Check Status** - View current status

#### Stop Recording
```
/stop
```
Or click the **⏹️ Stop Recording** button.

This will:
1. Stop the recording
2. Process all audio files
3. Generate talk time statistics
4. Upload everything to the designated channel

#### Check Status
```
/status
```
Or click the **📊 Check Status** button.

Shows current recording information:
- Team name
- Voice channel
- Duration
- Number of participants
- Recording status (active/paused)

## Output Files

After stopping a recording, the bot will upload:

1. **stats.png** - Visual chart showing talk time for each participant
2. **combined.mp3** - All audio mixed together
3. **[Username].mp3** - Individual audio track for each participant (up to 5 files)

Total: Up to 6 files (1 combined + 5 individual + 1 stats image)

## File Structure

```
recorder/
├── src/
│   ├── bot.js              # Main bot entry point
│   ├── recordingManager.js # Handles recording sessions
│   ├── audioProcessor.js   # Audio processing and merging
│   └── canvasGenerator.js  # Statistics visualization
├── recordings/             # Temporary PCM audio files
├── output/                 # Processed MP3 files
├── package.json
├── .env                    # Environment variables (not in git)
├── env.example            # Example environment file
└── README.md
```

## Deployment

### Option 1: Same Server (PM2)

Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'recorder-bot-1',
      script: 'src/bot.js',
      args: '1',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'recorder-bot-2',
      script: 'src/bot.js',
      args: '2',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

Start both bots:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Separate Servers

Deploy the same codebase to two different servers, but only run one bot on each:

**Server 1:**
```bash
npm run bot1
```

**Server 2:**
```bash
npm run bot2
```

### Option 3: Docker (Same or Separate)

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

CMD ["node", "src/bot.js", "1"]
```

Build and run:
```bash
# Bot 1
docker build -t trayb-recorder-1 .
docker run -d --name recorder-1 --env-file .env trayb-recorder-1 node src/bot.js 1

# Bot 2
docker run -d --name recorder-2 --env-file .env trayb-recorder-1 node src/bot.js 2
```

## Troubleshooting

### Bot doesn't join voice channel
- Check bot permissions
- Ensure the bot has "Connect" and "Speak" permissions
- Verify the channel ID is correct

### No audio recorded
- Discord requires users to speak for audio to be received
- Check that the bot is not deafened
- Ensure FFmpeg is installed correctly

### Audio files too large
- Reduce recording duration
- Consider implementing compression
- Discord has a file size limit (8MB for non-Nitro servers, 100MB for boosted servers)

### Bot crashes on startup
- Verify your bot token is correct
- Check Node.js version (should be v16+)
- Run `npm install` to ensure all dependencies are installed

## Technical Details

### Audio Processing

1. **Recording**: Audio is received as Opus packets from Discord
2. **Decoding**: Opus is decoded to PCM (raw audio)
3. **Storage**: PCM files are temporarily stored per user
4. **Conversion**: PCM is converted to MP3 using FFmpeg
5. **Merging**: Individual MP3 files are mixed together for combined track

### Talk Time Tracking

Talk time is calculated by tracking when users start and stop speaking using Discord's speaking events.

## Security Notes

- ⚠️ Never commit your `.env` file
- ⚠️ Keep your bot tokens secret
- ⚠️ Ensure only trusted users can use the bot
- ⚠️ Be aware of privacy laws regarding recording conversations
- ⚠️ Always inform users they are being recorded

## License

MIT License - Feel free to modify and use as needed.

## Support

For issues or questions, please check:
- [Discord.js Documentation](https://discord.js.org/)
- [Discord.js Voice Guide](https://discordjs.guide/voice/)

## Credits

Built with:
- [discord.js](https://discord.js.org/)
- [@discordjs/voice](https://github.com/discordjs/voice)
- [FFmpeg](https://ffmpeg.org/)
- [node-canvas](https://github.com/Automattic/node-canvas)

