# 📝 Changelog

## Version 2.0.0 - Major Update (October 27, 2025)

### 🆕 New Features

#### 🔒 User Authorization System
- **Added user whitelist** to control who can use bot commands
- Only authorized Discord User IDs can use `/record`, `/stop`, `/status`
- Unauthorized users receive a friendly denial message with their User ID
- Easy to add/remove users via `.env` file configuration
- No authorization = open to all (useful for testing)

**Configuration:**
```env
BOT1_AUTHORIZED_USERS=user_id_1,user_id_2,user_id_3
```

**See:** `AUTHORIZATION.md` for complete guide

---

#### 🎵 Perfect Audio Synchronization
- **All audio tracks now have identical duration**
- Silence is recorded between speech segments
- Individual tracks align perfectly with combined track
- No more manual timeline adjustment in video editors!

**How it works:**
- Continuously writes audio data when speaking
- Writes silence frames when not speaking
- All tracks start and end at the same time
- Late joiners get silence padding from recording start

**Benefits for Editing:**
- Import all tracks into editor
- They sync automatically (same start/end time)
- Edit with confidence - timeline positions are accurate
- Perfect for multi-track editing in Premiere, DaVinci, Final Cut, etc.

**See:** `AUDIO_SYNC.md` for technical details and editing guide

---

### 🔄 Changes from Version 1.0

#### Command System
- **Changed:** Prefix commands (`!record`) → Slash commands (`/record`)
- **Added:** Interactive buttons for Stop and Status
- **Reason:** Modern Discord best practices

#### Audio Recording
- **Changed:** Record only when speaking → Continuous recording with silence
- **Impact:** Larger file sizes, but perfect sync
- **Benefit:** Massive time savings during editing

#### Node.js Requirement
- **Changed:** Node.js v16+ → Node.js v22+
- **Reason:** Required for latest Discord voice encryption (DAVE protocol)
- **Packages:** `@discordjs/voice@0.19.0`, `@snazzah/davey@0.1.7`

---

## Version 1.0.0 - Initial Release

### Features

#### Core Recording
- ✅ Voice channel recording
- ✅ Individual audio tracks per user
- ✅ Combined audio track
- ✅ Talk time statistics with canvas visualization
- ✅ Auto-pause when voice channel is empty
- ✅ Automatic upload to designated channel

#### Commands
- `!record #channel teamname` - Start recording
- `!stop` - Stop recording
- `!status` - Check status

#### Deployment
- ✅ Two independent bot instances
- ✅ PM2 configuration for production
- ✅ Docker support
- ✅ Comprehensive documentation

#### Audio Processing
- ✅ PCM to MP3 conversion
- ✅ Multiple track merging
- ✅ FFmpeg integration

---

## Migration Guide: v1.0 → v2.0

### Breaking Changes

1. **Commands are now slash commands**
   - Old: `!record #channel TRAYB`
   - New: `/record channel:#channel teamname:TRAYB`
   - **Action Required:** Educate users about new command format

2. **Node.js 22 required**
   - Old: Node.js v16+
   - New: Node.js v22+
   - **Action Required:** Upgrade Node.js
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install nodejs -y
   ```

3. **New dependencies**
   - Added: `@snazzah/davey` (DAVE protocol)
   - Updated: `@discordjs/voice@0.19.0`
   - **Action Required:** Run `npm install`

4. **Audio files are larger**
   - Silence is now recorded
   - Files are ~2-3x larger
   - **Action Required:** Monitor disk space

### New Configuration

Add to your `.env` file:

```env
# Optional but recommended
BOT1_AUTHORIZED_USERS=your_user_id,team_member_id

# Optional but recommended
BOT2_AUTHORIZED_USERS=your_user_id,team_member_id
```

### Step-by-Step Migration

1. **Backup current setup**
   ```bash
   cp -r /root/recorder /root/recorder-backup
   ```

2. **Update Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt install nodejs -y
   node --version  # Should show v22.x.x
   ```

3. **Update dependencies**
   ```bash
   cd /root/recorder
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Update .env file**
   ```bash
   # Add authorization (optional)
   echo "BOT1_AUTHORIZED_USERS=your_user_id" >> .env
   ```

5. **Restart bots**
   ```bash
   # If using PM2
   pm2 restart all
   
   # If running manually
   npm run bot1
   ```

6. **Test new features**
   - Try `/record` command
   - Check authorization works
   - Verify audio sync in editor

---

## Deprecations

### ❌ Removed in v2.0

1. **Prefix commands** - Use slash commands instead
2. **`PREFIX` environment variable** - No longer needed
3. **Old encryption modes** - Updated to DAVE protocol

### ⚠️ Deprecated (still works but will be removed)

None currently.

---

## Known Issues

### v2.0.0

1. **"ephemeral" deprecation warning**
   - **Impact:** Warning in console, no functional impact
   - **Status:** Will be fixed in discord.js update
   - **Workaround:** None needed, just ignore the warning

2. **Large file sizes**
   - **Impact:** Recordings with silence are 2-3x larger
   - **Status:** By design for perfect sync
   - **Workaround:** Regularly clean old recordings

3. **Node.js engine warning**
   - **Impact:** Warning during npm install on old Node versions
   - **Status:** Expected, upgrade to Node.js 22
   - **Workaround:** Upgrade Node.js

---

## Upgrade Benefits

### Why Upgrade to v2.0?

✅ **Perfect audio sync** - Save hours of manual editing  
✅ **User authorization** - Control who uses your bots  
✅ **Modern Discord interface** - Slash commands & buttons  
✅ **Latest encryption** - DAVE protocol support  
✅ **Better user experience** - Cleaner, more professional  
✅ **Future-proof** - Built on latest Discord standards  

### What You'll Need

- 30 minutes for upgrade
- Node.js 22 installation
- Updated `.env` configuration
- User education about new commands

### What You'll Gain

- Professional slash command interface
- Interactive buttons for easy control
- Perfect timeline sync for all recordings
- Secure access control
- Peace of mind with latest security

---

## Support & Documentation

### New Documentation (v2.0)

- **AUTHORIZATION.md** - User whitelist setup & management
- **AUDIO_SYNC.md** - Timeline sync explained & editing guide
- **TROUBLESHOOTING.md** - Comprehensive problem solving
- **UPGRADE_NOTES.md** - Slash commands vs prefix info
- **CHANGELOG.md** - This file

### Updated Documentation

- **README.md** - Complete technical reference
- **QUICK_START.md** - Updated for slash commands
- **START_HERE.md** - Updated getting started guide
- **COMMANDS.md** - New slash command reference

### Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Review **AUDIO_SYNC.md** for editing questions
3. See **AUTHORIZATION.md** for access control
4. Read **README.md** for technical details

---

## Future Roadmap

### Planned Features (v2.1)

- [ ] Web dashboard for bot management
- [ ] Recording scheduling/automation
- [ ] Multiple upload channel support
- [ ] Audio quality selection (bitrate options)
- [ ] Recording templates/presets

### Planned Features (v3.0)

- [ ] Video recording support
- [ ] Real-time transcription
- [ ] Cloud storage integration (S3, Google Drive)
- [ ] Advanced audio processing (noise reduction, EQ)
- [ ] Mobile app for remote control

### Community Requests

- [ ] Role-based authorization (not just user IDs)
- [ ] Recording analytics dashboard
- [ ] Automated highlights extraction
- [ ] Multi-language support

---

**Thank you for using TRAYB Discord Recorder! 🎉**

Report issues or suggest features by updating this changelog!


