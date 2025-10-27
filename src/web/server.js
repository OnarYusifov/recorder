const express = require('express');
const path = require('path');
const fs = require('fs');
const { getInstance } = require('../matchManager');

const app = express();
const PORT = process.env.WEB_PORT || 8080;

// Serve static files
app.use('/output', express.static(path.join(__dirname, '../../output')));
app.use(express.static(path.join(__dirname, 'public')));

// Get all matches
app.get('/api/matches', (req, res) => {
    const matchManager = getInstance();
    const matches = matchManager.getAllMatches();
    console.log(`📊 API request: Found ${matches.length} matches`);
    res.json(matches);
});

// Get specific match
app.get('/api/matches/:id', (req, res) => {
    const matchManager = getInstance();
    const match = matchManager.getMatchById(req.params.id);
    if (match) {
        res.json(match);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`\n🌐 Web interface running at http://localhost:${PORT}`);
    console.log(`📊 View recordings at http://localhost:${PORT}\n`);
});

