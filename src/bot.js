const { Client, GatewayIntentBits, Events, ChannelType, EmbedBuilder, AttachmentBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, EndBehaviorType } = require('@discordjs/voice');
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const RecordingManager = require('./recordingManager');
const AudioProcessor = require('./audioProcessor');
const CanvasGenerator = require('./canvasGenerator');
const { getInstance: getMatchManager } = require('./matchManager');

// Determine which bot instance to run
const botNumber = process.argv[2] || '1';
const TOKEN = process.env[`BOT${botNumber}_TOKEN`];
const UPLOAD_CHANNEL_ID = process.env[`BOT${botNumber}_UPLOAD_CHANNEL_ID`];
const AUTHORIZED_USERS = process.env[`BOT${botNumber}_AUTHORIZED_USERS`]
    ? process.env[`BOT${botNumber}_AUTHORIZED_USERS`].split(',').map(id => id.trim())
    : [];

if (!TOKEN) {
    console.error(`❌ Error: BOT${botNumber}_TOKEN not found in environment variables!`);
    console.error('Please create a .env file based on env.example');
    process.exit(1);
}

// Check if user is authorized to use commands
function isAuthorized(userId) {
    if (AUTHORIZED_USERS.length === 0) {
        console.warn('⚠️ Warning: No authorized users configured! Anyone can use the bot.');
        return true; // If no whitelist, allow everyone (for initial setup)
    }
    return AUTHORIZED_USERS.includes(userId);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const recordingManager = new RecordingManager();
const matchManager = getMatchManager();

// Define slash commands based on bot number
let recordCommand;
if (botNumber === '1') {
    // Bot 1: Full command with teamname and vsteam
    recordCommand = new SlashCommandBuilder()
        .setName('record')
        .setDescription('Start recording a voice channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel to record')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice))
        .addStringOption(option =>
            option.setName('teamname')
                .setDescription('Name of your team')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('vsteam')
                .setDescription('Name of the opposing team')
                .setRequired(false));
} else {
    // Bot 2: Simple command with only channel
    recordCommand = new SlashCommandBuilder()
        .setName('record')
        .setDescription('Join the active match recording')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The voice channel to record')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice));
}

const commands = [
    recordCommand,
    new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the current recording'),
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check recording status'),
].map(command => command.toJSON());

// Register slash commands
async function registerCommands(clientId) {
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    
    try {
        console.log('🔄 Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );
        console.log('✅ Slash commands registered successfully!');
    } catch (error) {
        console.error('❌ Error registering commands:', error);
    }
}

client.once(Events.ClientReady, async (c) => {
    console.log(`✅ Bot ${botNumber} logged in as ${c.user.tag}`);
    console.log(`📤 Upload channel ID: ${UPLOAD_CHANNEL_ID || 'Not set'}`);
    console.log(`🔒 Authorized users: ${AUTHORIZED_USERS.length > 0 ? AUTHORIZED_USERS.length : 'None (open to all)'}`);
    
    // Register slash commands
    await registerCommands(c.user.id);
});

// Handle slash command interactions
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'record') {
            await handleRecordCommand(interaction);
        } else if (commandName === 'stop') {
            await handleStopCommand(interaction);
        } else if (commandName === 'status') {
            await handleStatusCommand(interaction);
        }
    } else if (interaction.isButton()) {
        // Handle button interactions
        if (interaction.customId === 'stop_recording') {
            await handleStopCommand(interaction);
        } else if (interaction.customId === 'check_status') {
            await handleStatusCommand(interaction);
        }
    }
});

async function handleRecordCommand(interaction) {
    try {
        // Check authorization
        if (!isAuthorized(interaction.user.id)) {
            return interaction.reply({ 
                content: `🔒 **Access Denied**\n\nYou are not authorized to use this bot.\n\nYour User ID: \`${interaction.user.id}\`\n\nContact the bot administrator to request access.`, 
                flags: MessageFlags.Ephemeral
            });
        }

        const voiceChannel = interaction.options.getChannel('channel');
        const teamName = interaction.options.getString('teamname');
        const vsTeam = interaction.options.getString('vsteam');

        // Check if already recording in this guild
        if (recordingManager.hasActiveRecording(interaction.guild.id)) {
            return interaction.reply({ content: '❌ Already recording in this server! Use `/stop` first.', flags: MessageFlags.Ephemeral });
        }

        if (!voiceChannel || voiceChannel.type !== ChannelType.GuildVoice) {
            return interaction.reply({ content: '❌ Please select a valid voice channel!', flags: MessageFlags.Ephemeral });
        }

        // Match management
        let effectiveTeamName = teamName;
        const matchManager = getMatchManager();

        // Bot 1 starts a new match
        if (botNumber === '1') {
            if (!teamName) {
                return interaction.reply({
                    content: '❌ Bot 1 requires teamname parameter',
                    flags: MessageFlags.Ephemeral
                });
            }

            const match = matchManager.startMatch(
                teamName,
                vsTeam || 'Team 2',
                voiceChannel.name,
                interaction.user.tag
            );

            console.log(`🎮 Match started: ${match.team1} vs ${match.team2}`);
        }
        // Bot 2 joins the active match
        else if (botNumber === '2') {
            const activeMatch = matchManager.getActiveMatch();
            if (!activeMatch) {
                return interaction.reply({
                    content: '❌ No active match. Bot 1 must start the match first.',
                    flags: MessageFlags.Ephemeral
                });
            }
            effectiveTeamName = activeMatch.team2;
        }

        // Get upload channel
        let uploadChannel;
        if (UPLOAD_CHANNEL_ID) {
            uploadChannel = await client.channels.fetch(UPLOAD_CHANNEL_ID).catch(() => null);
        }
        if (!uploadChannel) {
            uploadChannel = interaction.channel;
        }

        // Check permissions
        const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({ content: '❌ I need permissions to connect and speak in that voice channel!', flags: MessageFlags.Ephemeral });
        }

        // Start recording
        await recordingManager.startRecording(
            voiceChannel,
            effectiveTeamName,
            interaction.channel,
            uploadChannel
        );

        // Create control buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('stop_recording')
                    .setLabel('⏹️ Stop Recording')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('check_status')
                    .setLabel('📊 Check Status')
                    .setStyle(ButtonStyle.Primary)
            );

        const match = matchManager.getActiveMatch();
        const matchInfo = match ? `\n🎮 Match: **${match.team1}** vs **${match.team2}**` : '';

        await interaction.reply({
            content: `✅ **Recording started!**\n📍 Channel: **${voiceChannel.name}**\n👥 Team: **${effectiveTeamName}**${matchInfo}`,
            components: [row]
        });

    } catch (error) {
        console.error('Error starting recording:', error);
        await interaction.reply({ content: '❌ Failed to start recording: ' + error.message, flags: MessageFlags.Ephemeral });
    }
}

async function handleStopCommand(interaction) {
    try {
        // Check authorization
        if (!isAuthorized(interaction.user.id)) {
            return interaction.reply({ 
                content: `🔒 **Access Denied**\n\nYou are not authorized to use this bot.\n\nYour User ID: \`${interaction.user.id}\``, 
                flags: MessageFlags.Ephemeral
            });
        }

        if (!recordingManager.hasActiveRecording(interaction.guild.id)) {
            return interaction.reply({ content: '❌ No active recording in this server!', flags: MessageFlags.Ephemeral });
        }

        await interaction.reply('⏹️ **Stopping recording and processing audio...**\nThis may take a moment...');

        const recordingData = await recordingManager.stopRecording(interaction.guild.id);
        
        // Register recording with match manager
        const matchManager = getMatchManager();
        const match = matchManager.finishMatch(botNumber, recordingData);
        
        // Process and upload
        await processAndUpload(recordingData, interaction.guild, match);

    } catch (error) {
        console.error('Error stopping recording:', error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: '❌ Failed to stop recording: ' + error.message, flags: MessageFlags.Ephemeral });
        } else {
            await interaction.reply({ content: '❌ Failed to stop recording: ' + error.message, flags: MessageFlags.Ephemeral });
        }
    }
}

async function handleStatusCommand(interaction) {
    const recording = recordingManager.getRecording(interaction.guild.id);
    
    if (!recording) {
        return interaction.reply({ content: 'ℹ️ No active recording in this server.', flags: MessageFlags.Ephemeral });
    }

    const duration = Math.floor((Date.now() - recording.startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('📊 Recording Status')
        .addFields(
            { name: 'Team', value: recording.teamName, inline: true },
            { name: 'Channel', value: recording.voiceChannel.name, inline: true },
            { name: 'Duration', value: `${minutes}m ${seconds}s`, inline: true },
            { name: 'Participants', value: recording.users.size > 0 ? recording.users.size.toString() : 'None yet', inline: true },
            { name: 'Status', value: recording.isPaused ? '⏸️ Paused (no one in VC)' : '🔴 Recording', inline: true }
        );

    // Add control buttons
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('stop_recording')
                .setLabel('⏹️ Stop Recording')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('check_status')
                .setLabel('🔄 Refresh Status')
                .setStyle(ButtonStyle.Primary)
        );

    await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
}

async function processAndUpload(recordingData, guild, match = null) {
    try {
        const { teamName, channelName, startTime, endTime, users, userAudioFiles, uploadChannel } = recordingData;

        // Process audio files
        const audioProcessor = new AudioProcessor();
        const processedFiles = await audioProcessor.processRecording(recordingData);

        // Generate canvas with talk time statistics
        const canvasGenerator = new CanvasGenerator();
        const canvasBuffer = await canvasGenerator.generateTalkTimeCanvas(recordingData);

        // Create embed
        const duration = Math.floor((endTime - startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;

        const webUrl = process.env.WEB_URL || 'http://localhost:8080';
        const matchInfo = match ? `**Match:** ${match.team1} vs ${match.team2}\n` : '';
        const webLink = match && match.recordings.bot1 && match.recordings.bot2 
            ? `\n\n🌐 **[View Match Online](${webUrl})**`
            : '';

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎙️ Recording Complete')
            .setDescription(`Team: **${teamName}**\n${matchInfo}`)
            .addFields(
                { name: '📅 Date', value: new Date(startTime).toLocaleString(), inline: true },
                { name: '⏱️ Duration', value: `${minutes}m ${seconds}s`, inline: true },
                { name: '🔊 Channel', value: channelName, inline: true },
                { name: '👥 Participants', value: Array.from(users.values()).join('\n') || 'None', inline: false }
            )
            .setImage('attachment://stats.png')
            .setTimestamp();

        if (webLink) {
            embed.setFooter({ text: 'Match complete! View all recordings in the web interface.' });
        }

        // Prepare attachments
        const attachments = [
            new AttachmentBuilder(canvasBuffer, { name: 'stats.png' })
        ];

        // Add audio files
        if (processedFiles.combined && fs.existsSync(processedFiles.combined)) {
            attachments.push(new AttachmentBuilder(processedFiles.combined, { name: `${teamName}_combined.mp3` }));
        }

        for (const [userId, audioPath] of Object.entries(processedFiles.individual)) {
            if (fs.existsSync(audioPath)) {
                const username = users.get(userId) || userId;
                const sanitizedName = username.replace(/[^a-zA-Z0-9]/g, '_');
                attachments.push(new AttachmentBuilder(audioPath, { name: `${sanitizedName}.mp3` }));
            }
        }

        // Send to upload channel
        await uploadChannel.send({
            content: webLink || undefined,
            embeds: [embed],
            files: attachments
        });

        // If match is complete, send summary
        if (match && match.recordings.bot1 && match.recordings.bot2) {
            const webUrl = process.env.WEB_URL || 'http://localhost:8080';
            await uploadChannel.send({
                content: `## 🏆 MATCH COMPLETE: ${match.team1} vs ${match.team2}\n\n` +
                    `**${match.team1}:** ${match.recordings.bot1.users.join(', ')}\n` +
                    `**${match.team2}:** ${match.recordings.bot2.users.join(', ')}\n\n` +
                    `📊 **View full match:** ${webUrl}`,
            });
        }

        // Cleanup
        audioProcessor.cleanup(processedFiles);

    } catch (error) {
        console.error('Error processing and uploading:', error);
        if (recordingData.uploadChannel) {
            recordingData.uploadChannel.send('❌ Failed to process recording: ' + error.message);
        }
    }
}

// Handle voice state updates (pause when empty)
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    recordingManager.handleVoiceStateUpdate(oldState, newState);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏹️ Shutting down gracefully...');
    recordingManager.cleanup();
    await client.destroy();
    process.exit(0);
});

client.login(TOKEN);

