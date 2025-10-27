# 🎵 Audio Synchronization Guide

## The Problem (Before)

Previously, the bot only recorded when someone was actively speaking. This saved space but created a **major problem for editing**:

### Example Issue:

**Timeline:**
- 0:00-0:10: Alice talks
- 0:10-0:20: Silence (no one talks)
- 0:20-0:30: Bob talks
- 0:30-0:40: Silence
- 0:40-0:50: Alice talks again

**Old Behavior:**
- `Alice.mp3`: 20 seconds (0:00-0:10 + 0:40-0:50, no silence)
- `Bob.mp3`: 10 seconds (0:20-0:30, no silence)
- `combined.mp3`: 50 seconds (everything)

**Problem:**
When you import these into your video editor (Premiere, DaVinci, etc.), the tracks don't line up! Alice's second speech at 0:40 in the combined track appears at 0:10 in her individual track.

## The Solution (Now)

The bot now records **continuously** with **silence padding**, ensuring all tracks have the same duration and timeline.

### How It Works

1. **Recording starts** at time 0:00
2. **Each user gets a continuous track** from the moment they join until recording stops
3. **Silence is written** when they're not speaking
4. **All tracks end at the same time** when you stop the recording

### New Behavior:

**Timeline (same as above):**
- 0:00-0:10: Alice talks
- 0:10-0:20: Silence (no one talks)
- 0:20-0:30: Bob talks
- 0:30-0:40: Silence
- 0:40-0:50: Alice talks again

**New Audio Files:**
- `Alice.mp3`: **50 seconds** (voice at 0:00-0:10 and 0:40-0:50, silence elsewhere)
- `Bob.mp3`: **50 seconds** (voice at 0:20-0:30, silence elsewhere)
- `combined.mp3`: **50 seconds** (everything mixed)

**Result:**
✅ All tracks are the same length
✅ Timeline synchronization is perfect
✅ Import into any video editor and they align automatically
✅ No need to manually sync or adjust timing

## Technical Details

### Continuous Recording

The bot now:
- **Writes audio data** when Discord sends voice packets (when someone is speaking)
- **Writes silence frames** (zeros) when no audio is received
- **Maintains 48kHz stereo 16-bit PCM** format throughout
- **Uses 20ms frames** to match Discord's audio frame rate

### Late Joiners

If someone joins the voice channel **after recording has started**, the bot automatically:
1. Calculates how much time passed since recording started
2. Writes that amount of silence to the beginning of their track
3. Then starts recording their audio
4. Result: Their track still matches the timeline!

**Example:**
- Recording starts at 0:00
- Alice is in the channel from the start
- Bob joins at 1:30

**Result:**
- `Alice.mp3`: Starts at 0:00
- `Bob.mp3`: 1:30 seconds of silence, then Bob's audio
- Both tracks end at the same time

## File Sizes

### Before (Without Silence):
- Only audio when speaking
- Smaller files
- Example: 5 minutes of talking = ~9 MB per person

### Now (With Silence):
- Continuous audio including silence
- Larger files (but silence compresses well in MP3)
- Example: 30 minute recording = ~50-70 MB per person

**Why This Is Worth It:**
- Perfect timeline sync saves hours of manual editing
- Silence compresses very well in MP3 format
- Disk space is cheap, your time is valuable!

## Using in Your Video Editor

### Adobe Premiere Pro / DaVinci Resolve / Final Cut Pro

1. **Import all tracks** (combined.mp3 + individual tracks)
2. **Place them on separate audio tracks** in your timeline
3. **Align to start at 0:00** - they will sync perfectly!
4. **Mute/unmute** individual tracks as needed
5. **Edit with confidence** - timeline positions are accurate

### Example Workflow:

```
Timeline:
Track 1: combined.mp3    (reference/backup)
Track 2: Alice.mp3       (individual)
Track 3: Bob.mp3         (individual)
Track 4: Charlie.mp3     (individual)
Track 5: David.mp3       (individual)
```

All tracks start at the same time and end at the same time. Perfect sync!

## Verifying Sync

### Check in Audacity (Free):

1. **Import all audio files**:
   - File → Import → Audio
   - Select all MP3 files

2. **They should align automatically**:
   - All tracks start at 0:00
   - All tracks end at the same time
   - Waveforms line up

3. **Zoom in to verify**:
   - Look at a specific moment when multiple people talk
   - The waveforms should match across tracks

### Check File Duration:

```bash
# Linux/Mac
ffprobe -i Alice.mp3 -show_entries format=duration -v quiet -of csv="p=0"
ffprobe -i Bob.mp3 -show_entries format=duration -v quiet -of csv="p=0"
ffprobe -i combined.mp3 -show_entries format=duration -v quiet -of csv="p=0"
```

All three should show the **same duration**!

## Best Practices

### For Best Results:

1. **Start recording BEFORE people join** the voice channel
   - This ensures everyone starts from 0:00

2. **Don't stop and restart mid-session**
   - If you need a break, let it record through the silence
   - Or clearly mark where you stopped and started again

3. **Keep everyone in the channel**
   - If someone leaves and rejoins, their track will have a gap
   - The gap will be filled with silence (which is correct!)

4. **Use the combined track as reference**
   - When editing, keep the combined track as a backup
   - It has everyone mixed together for context

### For Editing:

1. **Import all tracks into your editor**

2. **Place them at the same start time** (0:00 in your timeline)

3. **Use individual tracks for:**
   - Adjusting individual volume levels
   - Applying effects to specific people
   - Removing background noise from one person
   - Isolating specific conversations

4. **Use combined track for:**
   - Quick reference
   - Backup if individual tracks have issues
   - Checking overall audio quality

## Troubleshooting

### "Tracks don't seem to align in my editor"

**Possible causes:**

1. **Different import settings:**
   - Make sure all tracks are imported at the same sample rate
   - Check they're all starting at the same timeline position

2. **Re-encoding during import:**
   - Some editors re-encode audio on import
   - Use "Link" instead of "Import" if available

3. **Variable bit rate MP3:**
   - This shouldn't happen with our bot, but can cause sync drift
   - Solution: Convert to WAV before importing

### "One track is shorter than others"

**Possible causes:**

1. **Person joined late:**
   - Check if they joined after recording started
   - Their track should have silence at the start

2. **Recording stopped while processing:**
   - Make sure recording finished completely
   - Check for errors in bot logs

3. **Corruption during processing:**
   - Re-record if possible
   - Check disk space on server

### "There's a delay/offset in the tracks"

**This should NOT happen** with the new sync system.

If it does:
1. Check bot version (make sure you have the latest code)
2. Verify all tracks have the same sample rate (48kHz)
3. Check for system lag during recording (high CPU usage)

## Performance Impact

### CPU Usage:

- **Slightly higher** than before due to continuous writing
- **Still very manageable** on modern servers
- Each silence interval check happens every 20ms

### Memory Usage:

- **Same as before**
- Silence frames are generated on-the-fly, not stored in memory

### Disk I/O:

- **Higher** due to continuous writing
- **Worth it** for perfect sync
- Use SSD for best performance

### Network:

- **No change** - we still only receive audio from Discord when people speak
- Silence is generated locally

## Technical Implementation

For the curious:

```javascript
// Silence frame for 20ms at 48kHz stereo 16-bit
// 48000 samples/sec * 0.02 sec * 2 channels * 2 bytes = 3840 bytes
const silenceFrame = Buffer.alloc(3840, 0);

// Written every 20ms when no audio is received
setInterval(() => {
    if (timeSinceLastAudio > 40ms) {
        writeStream.write(silenceFrame);
    }
}, 20);
```

This ensures:
- ✅ Continuous timeline
- ✅ Proper sample alignment
- ✅ No gaps or jumps
- ✅ Perfect sync across all tracks

---

**Your audio tracks will now sync perfectly in any editor!** 🎵✨

No more manual alignment, no more time shifting, just drop them in and start editing!


