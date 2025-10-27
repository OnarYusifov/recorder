const fs = require('fs');
const path = require('path');

class MatchManager {
    constructor() {
        this.matchesFile = path.join(__dirname, '..', 'data', 'matches.json');
        this.matchesDir = path.join(__dirname, '..', 'data');
        
        // Ensure data directory exists
        if (!fs.existsSync(this.matchesDir)) {
            fs.mkdirSync(this.matchesDir, { recursive: true });
        }
        
        // Load existing matches
        this.matches = this.loadMatches();
        
        // Active match coordination between bots
        this.activeMatch = null;
    }

    loadMatches() {
        if (fs.existsSync(this.matchesFile)) {
            try {
                const data = fs.readFileSync(this.matchesFile, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                console.error('Error loading matches:', error);
                return [];
            }
        }
        return [];
    }

    saveMatches() {
        try {
            fs.writeFileSync(this.matchesFile, JSON.stringify(this.matches, null, 2));
        } catch (error) {
            console.error('Error saving matches:', error);
        }
    }

    startMatch(team1, team2, channelName, startedBy) {
        const match = {
            id: Date.now(),
            team1: team1 || 'Team 1',
            team2: team2 || 'Team 2',
            channel: channelName,
            startTime: new Date().toISOString(),
            endTime: null,
            recordings: {
                bot1: null,
                bot2: null
            },
            startedBy,
            status: 'active'
        };
        
        this.activeMatch = match;
        
        // Save active match to file immediately for cross-container coordination
        this.matches.unshift(match);
        this.saveMatches();
        
        console.log(`📝 Match started and saved: ${match.team1} vs ${match.team2} (ID: ${match.id})`);
        return match;
    }

    finishMatch(botNumber, recordingData) {
        console.log(`🔧 Bot ${botNumber} finishing match...`);
        
        // Reload matches from file to get latest state (for cross-container coordination)
        this.matches = this.loadMatches();
        console.log(`📂 Loaded ${this.matches.length} matches from file`);
        
        // ALWAYS reload active match from file (critical for cross-container sync)
        this.activeMatch = this.matches.find(m => m.status === 'active');
        
        if (!this.activeMatch) {
            console.error('❌ No active match found in matches.json!');
            console.error(`Available matches: ${JSON.stringify(this.matches.map(m => ({ id: m.id, status: m.status })))}`);
            return null;
        }
        
        console.log(`✅ Found active match: ${this.activeMatch.team1} vs ${this.activeMatch.team2} (ID: ${this.activeMatch.id})`);

        // Add recording data
        this.activeMatch.recordings[`bot${botNumber}`] = {
            sessionId: recordingData.sessionId,
            teamName: recordingData.teamName,
            users: Array.from(recordingData.users.values()),
            talkTime: Object.fromEntries(recordingData.userTalkTime || new Map()),
            duration: recordingData.endTime - recordingData.startTime
        };
        
        console.log(`💾 Added bot${botNumber} recording data (${recordingData.users.size} users)`);

        // Update match in array
        const matchIndex = this.matches.findIndex(m => m.id === this.activeMatch.id);
        if (matchIndex === -1) {
            console.error(`❌ Match ${this.activeMatch.id} not found in matches array!`);
            return null;
        }
        
        this.matches[matchIndex] = this.activeMatch;
        console.log(`✅ Updated match at index ${matchIndex}`);

        // Check completion status
        const bot1Done = !!this.activeMatch.recordings.bot1;
        const bot2Done = !!this.activeMatch.recordings.bot2;
        console.log(`📊 Match status: Bot1=${bot1Done}, Bot2=${bot2Done}`);

        // If both bots have finished, mark as complete
        if (bot1Done && bot2Done) {
            this.activeMatch.endTime = new Date().toISOString();
            this.activeMatch.status = 'completed';
            this.matches[matchIndex] = this.activeMatch;
            this.saveMatches();
            
            console.log(`🏆 Match completed: ${this.activeMatch.team1} vs ${this.activeMatch.team2}`);
            
            const completedMatch = this.activeMatch;
            this.activeMatch = null;
            return completedMatch;
        } else {
            // Save partial progress
            this.saveMatches();
            console.log(`💾 Bot ${botNumber} recording saved, waiting for ${bot1Done ? 'Bot 2' : 'Bot 1'}...`);
        }

        return this.activeMatch;
    }

    getActiveMatch() {
        // Reload from file for cross-container coordination
        if (!this.activeMatch) {
            this.matches = this.loadMatches();
            this.activeMatch = this.matches.find(m => m.status === 'active');
        }
        return this.activeMatch;
    }

    getAllMatches() {
        // Always reload from file to get latest state
        this.matches = this.loadMatches();
        return this.matches;
    }

    getMatchById(id) {
        // Reload from file to get latest state
        this.matches = this.loadMatches();
        return this.matches.find(m => m.id === parseInt(id));
    }
}

// Singleton instance shared across bot instances
let instance = null;

module.exports = {
    getInstance: () => {
        if (!instance) {
            instance = new MatchManager();
        }
        return instance;
    }
};

