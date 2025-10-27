const { joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType, getVoiceConnection } = require('@discordjs/voice');
const prism = require('prism-media');
const fs = require('fs');
const path = require('path');

class RecordingManager {
    constructor() {
        this.recordings = new Map();
        this.recordingsDir = path.join(__dirname, '..', 'recordings');
        
        // Create recordings directory if it doesn't exist
        if (!fs.existsSync(this.recordingsDir)) {
            fs.mkdirSync(this.recordingsDir, { recursive: true });
        }
    }

    hasActiveRecording(guildId) {
        return this.recordings.has(guildId);
    }

    getRecording(guildId) {
        return this.recordings.get(guildId);
    }

    async startRecording(voiceChannel, teamName, statusChannel, uploadChannel) {
        const guildId = voiceChannel.guild.id;

        if (this.recordings.has(guildId)) {
            throw new Error('Already recording in this guild');
        }

        // Create session directory
        const sessionId = `${Date.now()}_${teamName.replace(/[^a-zA-Z0-9]/g, '_')}`;
        const sessionDir = path.join(this.recordingsDir, sessionId);
        fs.mkdirSync(sessionDir, { recursive: true });

        // Join voice channel
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });

        const recording = {
            guildId,
            voiceChannel,
            connection,
            teamName,
            channelName: voiceChannel.name,
            statusChannel,
            uploadChannel,
            startTime: Date.now(),
            sessionDir,
            sessionId,
            users: new Map(), // userId -> username
            userStreams: new Map(), // userId -> write stream
            userAudioFiles: new Map(), // userId -> file path
            userTalkTime: new Map(), // userId -> milliseconds
            userLastSpoke: new Map(), // userId -> timestamp
            isPaused: false,
            receiver: null,
        };

        // Wait for connection to be ready
        await new Promise((resolve, reject) => {
            connection.on(VoiceConnectionStatus.Ready, resolve);
            connection.on(VoiceConnectionStatus.Destroyed, () => reject(new Error('Connection destroyed')));
            connection.on(VoiceConnectionStatus.Disconnected, () => reject(new Error('Connection disconnected')));
            setTimeout(() => reject(new Error('Connection timeout')), 10000);
        });

        // Start receiving audio
        this.setupAudioReceiver(recording);

        this.recordings.set(guildId, recording);
        return recording;
    }

    setupAudioReceiver(recording) {
        const receiver = recording.connection.receiver;
        recording.receiver = receiver;

        // Log all users currently in the voice channel
        const membersInChannel = recording.voiceChannel.members.filter(m => !m.user.bot);
        console.log(`👥 Users in voice channel: ${membersInChannel.map(m => m.user.username).join(', ')}`);
        
        // Pre-subscribe to all users in the channel to ensure we catch their audio
        membersInChannel.forEach(member => {
            if (!recording.userStreams.has(member.id)) {
                console.log(`📡 Pre-subscribing to: ${member.user.username}`);
                this.createUserStream(recording, member.id);
            }
        });

        receiver.speaking.on('start', (userId) => {
            // Create stream if not already created
            if (!recording.userStreams.has(userId)) {
                console.log(`🎤 User started speaking (late subscribe): ${userId}`);
                this.createUserStream(recording, userId);
            }

            // Track talk time
            recording.userLastSpoke.set(userId, Date.now());
        });

        receiver.speaking.on('end', (userId) => {
            // Calculate talk time
            const lastSpoke = recording.userLastSpoke.get(userId);
            if (lastSpoke) {
                const duration = Date.now() - lastSpoke;
                const currentTalkTime = recording.userTalkTime.get(userId) || 0;
                recording.userTalkTime.set(userId, currentTalkTime + duration);
            }
        });
    }

    createUserStream(recording, userId) {
        const member = recording.voiceChannel.guild.members.cache.get(userId);
        if (!member || member.user.bot) {
            console.log(`⏭️ Skipping user ${userId}: ${!member ? 'not found' : 'is bot'}`);
            return; // Skip bots or invalid users
        }

        const user = member.user;
        
        // Store username
        recording.users.set(userId, user.username);

        // Create audio file for this user
        const fileName = `${userId}.pcm`;
        const filePath = path.join(recording.sessionDir, fileName);
        const writeStream = fs.createWriteStream(filePath);

        recording.userStreams.set(userId, writeStream);
        recording.userAudioFiles.set(userId, filePath);

        // Subscribe to user's audio
        const audioStream = recording.receiver.subscribe(userId, {
            end: {
                behavior: EndBehaviorType.Manual,
            },
        });

        // Decode opus to PCM
        const decoder = new prism.opus.Decoder({
            rate: 48000,
            channels: 2,
            frameSize: 960,
        });

        // Safe timeline sync: Write audio when it arrives, write silence when it doesn't
        // Using Transform stream to avoid interval stuttering
        const { Transform } = require('stream');
        let lastPacketTime = Date.now();
        
        const syncStream = new Transform({
            transform(chunk, encoding, callback) {
                lastPacketTime = Date.now();
                callback(null, chunk);
            }
        });
        
        // Background silence writer - runs independently, no stuttering
        const silenceWriter = setInterval(() => {
            const timeSinceLast = Date.now() - lastPacketTime;
            // If no audio for 40ms, write one silence frame
            if (timeSinceLast > 40) {
                const silenceFrame = Buffer.alloc(3840, 0); // 20ms of silence
                writeStream.write(silenceFrame);
                lastPacketTime = Date.now(); // Prevent flooding
            }
        }, 20);
        
        // Store for cleanup
        if (!recording.silenceWriters) recording.silenceWriters = new Map();
        recording.silenceWriters.set(userId, silenceWriter);

        // Pipe: audio → decoder → sync → file
        audioStream.pipe(decoder).pipe(syncStream).pipe(writeStream);

        // Log first audio packet
        let hasReceivedAudio = false;
        decoder.once('data', () => {
            if (!hasReceivedAudio) {
                hasReceivedAudio = true;
                console.log(`🎵 Recording ${user.username}`);
            }
        });

        // Silently handle errors
        decoder.on('error', () => {});
        audioStream.on('error', () => {});

        console.log(`📼 Started recording: ${user.username}`);
    }

    async stopRecording(guildId) {
        const recording = this.recordings.get(guildId);
        if (!recording) {
            throw new Error('No active recording for this guild');
        }

        recording.endTime = Date.now();

        // Clear all silence writers
        if (recording.silenceWriters) {
            for (const interval of recording.silenceWriters.values()) {
                clearInterval(interval);
            }
        }

        // Close all user streams
        for (const [userId, stream] of recording.userStreams.entries()) {
            stream.end();
        }

        // Leave voice channel
        recording.connection.destroy();

        // Prepare recording data
        const recordingData = {
            teamName: recording.teamName,
            channelName: recording.channelName,
            startTime: recording.startTime,
            endTime: recording.endTime,
            sessionDir: recording.sessionDir,
            sessionId: recording.sessionId,
            users: recording.users,
            userAudioFiles: recording.userAudioFiles,
            userTalkTime: recording.userTalkTime,
            uploadChannel: recording.uploadChannel,
        };

        this.recordings.delete(guildId);

        console.log(`✅ Recording stopped for guild ${guildId}`);
        return recordingData;
    }

    handleVoiceStateUpdate(oldState, newState) {
        // Check if someone left or joined a voice channel where we're recording
        const guildId = newState.guild.id;
        const recording = this.recordings.get(guildId);

        if (!recording) return;

        const voiceChannel = recording.voiceChannel;
        
        // Check if someone joined our recording channel
        if (newState.channelId === voiceChannel.id && oldState.channelId !== voiceChannel.id) {
            const userId = newState.id;
            const member = newState.member;
            
            if (!member.user.bot && !recording.userStreams.has(userId)) {
                console.log(`➕ ${member.user.username} joined voice channel, starting recording...`);
                this.createUserStream(recording, userId);
            }
        }
        
        // Check pause/resume based on member count
        const memberCount = voiceChannel.members.filter(m => !m.user.bot).size;

        if (memberCount === 0 && !recording.isPaused) {
            // Pause recording
            recording.isPaused = true;
            console.log(`⏸️ Recording paused in ${voiceChannel.name} (no members)`);
            
            if (recording.statusChannel) {
                recording.statusChannel.send(`⏸️ Recording paused (no one in voice channel)`);
            }
        } else if (memberCount > 0 && recording.isPaused) {
            // Resume recording
            recording.isPaused = false;
            console.log(`▶️ Recording resumed in ${voiceChannel.name}`);
            
            if (recording.statusChannel) {
                recording.statusChannel.send(`▶️ Recording resumed`);
            }
        }
    }

    cleanup() {
        for (const [guildId, recording] of this.recordings.entries()) {
            console.log(`Cleaning up recording for guild ${guildId}`);
            
            // Clear silence writers
            if (recording.silenceWriters) {
                for (const interval of recording.silenceWriters.values()) {
                    clearInterval(interval);
                }
            }
            
            // Close all streams
            for (const stream of recording.userStreams.values()) {
                stream.end();
            }
            
            // Destroy connection
            if (recording.connection) {
                recording.connection.destroy();
            }
        }
        
        this.recordings.clear();
    }
}

module.exports = RecordingManager;

