const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

class AudioProcessor {
    constructor() {
        this.outputDir = path.join(__dirname, '..', 'output');
        
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    async processRecording(recordingData) {
        const { sessionId, sessionDir, userAudioFiles, users } = recordingData;
        const outputSessionDir = path.join(this.outputDir, sessionId);

        if (!fs.existsSync(outputSessionDir)) {
            fs.mkdirSync(outputSessionDir, { recursive: true });
        }

        const processedFiles = {
            individual: {},
            combined: null,
        };

        // Process individual user audio files
        const individualFiles = [];
        
        for (const [userId, pcmFilePath] of userAudioFiles.entries()) {
            if (!fs.existsSync(pcmFilePath)) continue;

            const stats = fs.statSync(pcmFilePath);
            if (stats.size === 0) continue; // Skip empty files

            const username = users.get(userId) || userId;
            const sanitizedName = username.replace(/[^a-zA-Z0-9]/g, '_');
            const outputPath = path.join(outputSessionDir, `${sanitizedName}.mp3`);

            try {
                await this.convertPCMtoMP3(pcmFilePath, outputPath);
                processedFiles.individual[userId] = outputPath;
                individualFiles.push(outputPath);
                console.log(`✅ Processed audio for ${username}`);
            } catch (error) {
                console.error(`❌ Failed to process audio for ${username}:`, error.message);
            }
        }

        // Create combined audio file
        if (individualFiles.length > 0) {
            const combinedPath = path.join(outputSessionDir, 'combined.mp3');
            try {
                await this.mergeAudioFiles(individualFiles, combinedPath);
                processedFiles.combined = combinedPath;
                console.log(`✅ Created combined audio file`);
            } catch (error) {
                console.error(`❌ Failed to create combined audio:`, error.message);
            }
        }

        return processedFiles;
    }

    convertPCMtoMP3(inputPath, outputPath) {
        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(inputPath)
                .inputFormat('s16le')  // signed 16-bit little-endian
                .inputOptions([
                    '-ar 48000',       // sample rate
                    '-ac 2',           // channels
                ])
                .audioCodec('libmp3lame')
                .audioBitrate('128k')
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    }

    mergeAudioFiles(inputFiles, outputPath) {
        return new Promise((resolve, reject) => {
            const command = ffmpeg();

            // Add all input files
            inputFiles.forEach(file => {
                command.input(file);
            });

            // Create filter complex for mixing
            const filterInputs = inputFiles.map((_, i) => `[${i}:a]`).join('');
            const filterComplex = `${filterInputs}amix=inputs=${inputFiles.length}:duration=longest:dropout_transition=2`;

            command
                .complexFilter([filterComplex])
                .audioCodec('libmp3lame')
                .audioBitrate('192k')
                .on('end', () => resolve(outputPath))
                .on('error', (err) => reject(err))
                .save(outputPath);
        });
    }

    cleanup(processedFiles) {
        // Optional: Clean up temporary files
        // For now, we'll keep them for reference
        console.log('📁 Audio files saved in output directory');
    }
}

module.exports = AudioProcessor;

