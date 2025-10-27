# 🔒 Authorization & Access Control

## Overview

The bots now include a **user whitelist system** to control who can use the recording commands. Only authorized users can start, stop, or check the status of recordings.

## How It Works

When a user tries to use `/record`, `/stop`, or `/status`, the bot checks if their Discord User ID is in the authorized users list. If not, they receive an access denied message with their User ID so they can request access.

## Setup

### 1. Get Your Discord User ID

**Enable Developer Mode:**
1. Open Discord
2. Go to **Settings** → **Advanced**
3. Enable **Developer Mode**

**Copy Your User ID:**
1. Right-click on your username anywhere in Discord
2. Click **"Copy User ID"**
3. You'll get a long number like: `123456789012345678`

### 2. Add Authorized Users to .env

Edit your `.env` file:

```env
# Bot 1 - Authorized Users (comma-separated)
BOT1_AUTHORIZED_USERS=123456789012345678,987654321098765432,456789012345678901

# Bot 2 - Authorized Users (comma-separated)
BOT2_AUTHORIZED_USERS=123456789012345678,987654321098765432
```

**Format:**
- Comma-separated list of Discord User IDs
- No spaces (or spaces will be trimmed automatically)
- No quotes needed

**Examples:**
```env
# Single user
BOT1_AUTHORIZED_USERS=123456789012345678

# Multiple users
BOT1_AUTHORIZED_USERS=123456789012345678,987654321098765432,456789012345678901

# With spaces (will be trimmed)
BOT1_AUTHORIZED_USERS=123456789012345678, 987654321098765432, 456789012345678901
```

### 3. Restart the Bot

After updating `.env`, restart the bot for changes to take effect:

```bash
# If running manually
# Press Ctrl+C, then:
npm run bot1

# If using PM2
pm2 restart trayb-recorder-1
pm2 restart trayb-recorder-2

# If using Docker
docker-compose restart
```

## Checking Configuration

When the bot starts, it will show how many authorized users are configured:

```bash
✅ Bot 1 logged in as Recorder#2555
📤 Upload channel ID: 1432389580958728192
🔒 Authorized users: 3
```

If no users are configured:
```bash
⚠️ Warning: No authorized users configured! Anyone can use the bot.
🔒 Authorized users: None (open to all)
```

## User Experience

### ✅ Authorized User

When an authorized user uses a command, it works normally:

```
User: /record channel:#voice-1 teamname:TRAYB
Bot: ✅ Recording started!
     📍 Channel: voice-1
     👥 Team: TRAYB
     [⏹️ Stop Recording] [📊 Check Status]
```

### ❌ Unauthorized User

When an unauthorized user tries to use a command:

```
User: /record channel:#voice-1 teamname:TRAYB
Bot: 🔒 Access Denied
     
     You are not authorized to use this bot.
     
     Your User ID: 234567890123456789
     
     Contact the bot administrator to request access.
```

This message is **ephemeral** (only visible to the person who ran the command).

## Adding New Users

### Quick Method

1. Ask the user to try running `/record` (they'll get denied)
2. They'll see their User ID in the error message
3. Copy their User ID
4. Add it to `.env`:
   ```env
   BOT1_AUTHORIZED_USERS=existing_id,new_user_id
   ```
5. Restart the bot

### Manual Method

1. Ask the user to enable Developer Mode
2. Ask them to right-click their username and Copy User ID
3. They send you their User ID
4. Add it to `.env`
5. Restart the bot

## Removing Users

Simply remove their User ID from the `.env` file and restart the bot:

```env
# Before
BOT1_AUTHORIZED_USERS=123456789012345678,987654321098765432,456789012345678901

# After (removed middle user)
BOT1_AUTHORIZED_USERS=123456789012345678,456789012345678901
```

## Security Best Practices

1. **Keep Your .env Private**: Never share your `.env` file or commit it to git

2. **Start with Yourself**: Add your own User ID first to test

3. **Trust Your Users**: Only add users you trust, as they can record any voice channel

4. **Regular Audits**: Periodically review who has access

5. **Remove When Needed**: Remove users who no longer need access

## Fallback Behavior

**If no authorized users are configured** (empty or missing `AUTHORIZED_USERS` in `.env`):
- ⚠️ The bot shows a warning on startup
- ✅ **Anyone can use the bot** (open access mode)
- 💡 This is useful for initial setup or testing

**To restrict access**, simply add at least one User ID to the list.

## Troubleshooting

### "I added myself but still get access denied"

1. **Check the User ID is correct:**
   - It should be a long number (18 digits)
   - No quotes or special characters
   - Copy it directly from Discord

2. **Check the .env file:**
   - Make sure it's named `.env` (not `env.txt` or `.env.example`)
   - No spaces around the `=` sign
   - File is in the `/root/recorder/` directory

3. **Restart the bot completely:**
   ```bash
   pkill -f "node src/bot.js"
   npm run bot1
   ```

4. **Check bot logs:**
   Look for the line showing authorized users count

### "How do I allow everyone again?"

Remove or comment out the `AUTHORIZED_USERS` line:

```env
# BOT1_AUTHORIZED_USERS=123456789012345678
```

Or set it to empty:
```env
BOT1_AUTHORIZED_USERS=
```

Then restart the bot.

### "Can I have different users for Bot 1 and Bot 2?"

Yes! Each bot has its own authorization list:

```env
# Bot 1 - Only Alice and Bob
BOT1_AUTHORIZED_USERS=111111111111111111,222222222222222222

# Bot 2 - Only Charlie and David
BOT2_AUTHORIZED_USERS=333333333333333333,444444444444444444
```

### "User says they didn't get their User ID in the error"

Make sure they:
1. Enabled Developer Mode in Discord
2. Tried using a bot command (they'll get denied but see their ID)
3. Are looking at the error message (it's ephemeral, only they can see it)

## Example Workflow

### Initial Setup (You as Admin)

1. Get your Discord User ID: `123456789012345678`
2. Add to `.env`:
   ```env
   BOT1_AUTHORIZED_USERS=123456789012345678
   ```
3. Start bot: `npm run bot1`
4. Test with `/record` - should work!

### Adding a Team Member

1. Team member tries `/record`
2. Gets denied with message showing: `Your User ID: 987654321098765432`
3. They send you that ID
4. Update `.env`:
   ```env
   BOT1_AUTHORIZED_USERS=123456789012345678,987654321098765432
   ```
5. Restart bot: `pm2 restart trayb-recorder-1`
6. Team member tries again - now works!

### Adding Multiple Team Members at Once

```env
BOT1_AUTHORIZED_USERS=123456789012345678,987654321098765432,456789012345678901,789012345678901234,012345678901234567
```

No limit on how many users you can add!

---

**Security Note:** The authorization only controls who can use bot commands. Users can still see the bot's messages and download the uploaded recordings if they have access to the upload channel. Use Discord's channel permissions to control who can see the uploads.


