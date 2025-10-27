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
            startedBy
        };
        
        this.activeMatch = match;
        return match;
    }

    finishMatch(botNumber, recordingData) {
        if (!this.activeMatch) return null;

        // Add recording data
        this.activeMatch.recordings[`bot${botNumber}`] = {
            sessionId: recordingData.sessionId,
            teamName: recordingData.teamName,
            users: Array.from(recordingData.users.values()),
            talkTime: Object.fromEntries(recordingData.userTalkTime || new Map()),
            duration: recordingData.endTime - recordingData.startTime
        };

        // If both bots have finished, save the match
        if (this.activeMatch.recordings.bot1 && this.activeMatch.recordings.bot2) {
            this.activeMatch.endTime = new Date().toISOString();
            this.matches.unshift(this.activeMatch); // Add to beginning
            this.saveMatches();
            
            const completedMatch = this.activeMatch;
            this.activeMatch = null;
            return completedMatch;
        }

        return this.activeMatch;
    }

    getActiveMatch() {
        return this.activeMatch;
    }

    getAllMatches() {
        return this.matches;
    }

    getMatchById(id) {
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

