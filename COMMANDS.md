# 🎮 Command Reference

## Slash Commands

The bots use Discord's modern slash commands (`/`). Just type `/` in any channel to see available commands!

### `/record`
Start recording a voice channel.

**Parameters:**
- `channel` (required) - The voice channel to record
- `teamname` (required) - Name of the team/session

**Example:**
```
/record channel:#voice-1 teamname:TRAYB
```

**Response:**
The bot will join the voice channel and start recording. You'll get a message with **Stop Recording** and **Check Status** buttons.

---

### `/stop`
Stop the current recording session.

**No parameters required**

**Example:**
```
/stop
```

**Response:**
The bot will:
1. Stop recording
2. Process all audio files
3. Generate talk time statistics
4. Upload everything to the designated channel

---

### `/status`
Check the status of the current recording.

**No parameters required**

**Example:**
```
/status
```

**Response:**
Shows an embed with:
- Team name
- Voice channel
- Recording duration
- Number of participants
- Recording status (active/paused)

---

## Interactive Buttons

When you start a recording, the bot provides interactive buttons for easier control:

### ⏹️ Stop Recording
Immediately stops the recording and begins processing. Same as `/stop` command.

### 📊 Check Status
Shows current recording status. Same as `/status` command.

### 🔄 Refresh Status
When viewing status, click to refresh the statistics in real-time.

---

## How Commands Work

1. **Slash commands auto-complete** - Discord will show you the available options as you type
2. **Commands are server-wide** - Only one recording per server at a time
3. **Buttons persist** - The control buttons remain active until recording stops
4. **Ephemeral responses** - Status messages are only visible to you

---

## Permissions Required

The bot needs these permissions to function:
- ✅ View Channels
- ✅ Send Messages
- ✅ Attach Files
- ✅ Connect (to voice)
- ✅ Speak (to receive audio)
- ✅ Use Slash Commands

---

## Tips

💡 **Use autocomplete**: When typing `/record`, Discord will show you all available voice channels

💡 **Use buttons**: Instead of typing commands, use the interactive buttons for quick access

💡 **Check status anytime**: You can use `/status` multiple times during a recording to monitor progress

💡 **Pause behavior**: The recording automatically pauses when everyone leaves the voice channel

---

## Example Workflow

1. Type `/record` and select your voice channel and enter team name
2. Bot joins and starts recording, showing control buttons
3. During recording, click **📊 Check Status** to see progress
4. When done, click **⏹️ Stop Recording** or use `/stop`
5. Bot processes and uploads files automatically

---

## Troubleshooting Commands

**Slash commands not appearing?**
- Wait a few minutes (can take up to an hour for global registration)
- Try restarting Discord
- Make sure the bot has "Use Slash Commands" permission

**Can't select voice channel?**
- Make sure you're selecting a voice channel, not a text channel
- Check the bot has permission to view that channel

**Command says "Already recording"?**
- Use `/stop` to stop the current recording first
- Or use `/status` to check what's currently recording

