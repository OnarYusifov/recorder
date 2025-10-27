const express = require('express');
const path = require('path');
const fs = require('fs');
const { getInstance } = require('../matchManager');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.WEB_PORT || 8080;

// Passwords from environment
const ACCESS_PASSWORD = process.env.WEB_ACCESS_PASSWORD || 'change_me_access';
const ADMIN_PASSWORD = process.env.WEB_ADMIN_PASSWORD || 'change_me_admin';

// Debug: Show if passwords are loaded (don't show actual passwords!)
console.log(`🔐 Access password set: ${ACCESS_PASSWORD !== 'change_me_access' ? 'YES' : 'NO (using default)'}`);
console.log(`🔐 Admin password set: ${ADMIN_PASSWORD !== 'change_me_admin' ? 'YES' : 'NO (using default)'}`);
if (ACCESS_PASSWORD === 'change_me_access' || ADMIN_PASSWORD === 'change_me_admin') {
    console.warn('⚠️  WARNING: Using default passwords! Set WEB_ACCESS_PASSWORD and WEB_ADMIN_PASSWORD in environment variables!');
}

// Session storage (in-memory, resets on restart)
const sessions = new Map();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Authentication middleware
function requireAuth(req, res, next) {
    const sessionId = req.cookies.session;
    
    if (sessionId && sessions.has(sessionId)) {
        req.session = sessions.get(sessionId);
        return next();
    }
    
    res.status(401).json({ error: 'Unauthorized' });
}

function requireAdmin(req, res, next) {
    const sessionId = req.cookies.session;
    
    if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId);
        if (session.isAdmin) {
            req.session = session;
            return next();
        }
    }
    
    res.status(403).json({ error: 'Admin access required' });
}

// Login endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }
    
    let isAdmin = false;
    
    // Check if it's admin password
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
    } else if (password !== ACCESS_PASSWORD) {
        return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    sessions.set(sessionId, {
        isAdmin,
        createdAt: Date.now()
    });
    
    res.cookie('session', sessionId, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'strict'
    });
    
    res.json({ 
        success: true,
        isAdmin 
    });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
    const sessionId = req.cookies.session;
    if (sessionId) {
        sessions.delete(sessionId);
    }
    res.clearCookie('session');
    res.json({ success: true });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
    const sessionId = req.cookies.session;
    
    if (sessionId && sessions.has(sessionId)) {
        const session = sessions.get(sessionId);
        res.json({
            authenticated: true,
            isAdmin: session.isAdmin || false
        });
    } else {
        res.json({
            authenticated: false,
            isAdmin: false
        });
    }
});

// Serve static files (protected)
app.use('/output', requireAuth, express.static(path.join(__dirname, '../../output')));

// Get all matches (protected)
app.get('/api/matches', requireAuth, (req, res) => {
    const matchManager = getInstance();
    const matches = matchManager.getAllMatches();
    console.log(`📊 API request: Found ${matches.length} matches`);
    res.json(matches);
});

// Get specific match (protected)
app.get('/api/matches/:id', requireAuth, (req, res) => {
    const matchManager = getInstance();
    const match = matchManager.getMatchById(req.params.id);
    if (match) {
        res.json(match);
    } else {
        res.status(404).json({ error: 'Match not found' });
    }
});

// Delete match (admin only)
app.delete('/api/matches/:id', requireAdmin, (req, res) => {
    const matchManager = getInstance();
    const matchId = parseInt(req.params.id);
    
    const matches = matchManager.getAllMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);
    
    if (matchIndex === -1) {
        return res.status(404).json({ error: 'Match not found' });
    }
    
    const match = matches[matchIndex];
    
    // Delete associated files
    try {
        if (match.recordings.bot1) {
            const outputDir1 = path.join(__dirname, '../../output', match.recordings.bot1.sessionId);
            if (fs.existsSync(outputDir1)) {
                fs.rmSync(outputDir1, { recursive: true, force: true });
                console.log(`🗑️ Deleted bot1 files: ${outputDir1}`);
            }
        }
        
        if (match.recordings.bot2) {
            const outputDir2 = path.join(__dirname, '../../output', match.recordings.bot2.sessionId);
            if (fs.existsSync(outputDir2)) {
                fs.rmSync(outputDir2, { recursive: true, force: true });
                console.log(`🗑️ Deleted bot2 files: ${outputDir2}`);
            }
        }
        
        // Remove from matches array
        matches.splice(matchIndex, 1);
        
        // Save updated matches
        matchManager.matches = matches;
        matchManager.saveMatches();
        
        console.log(`✅ Match ${matchId} deleted successfully`);
        res.json({ success: true, message: 'Match deleted' });
        
    } catch (error) {
        console.error('Error deleting match:', error);
        res.status(500).json({ error: 'Failed to delete match: ' + error.message });
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

