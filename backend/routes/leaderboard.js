import express from 'express';
const router = express.Router();

// Mock leaderboard data
const leaderboardData = new Map();

/**
 * Get global leaderboard
 */
router.get('/global', (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;

        // Mock leaderboard data
        const leaderboard = [
            {
                rank: 1,
                walletAddress: '0x1234567890123456789012345678901234567890',
                displayName: 'EarlyBird',
                successfulChallenges: 15,
                totalWakeUps: 105,
                successRate: 100,
                totalDeposited: 5.0,
                totalBurned: 0,
                score: 1500
            },
            {
                rank: 2,
                walletAddress: '0x0987654321098765432109876543210987654321',
                displayName: 'MorningPerson',
                successfulChallenges: 12,
                totalWakeUps: 84,
                successRate: 93,
                totalDeposited: 4.0,
                totalBurned: 0.3,
                score: 1260
            },
            {
                rank: 3,
                walletAddress: '0x5555555555555555555555555555555555555555',
                displayName: 'DawnChampion',
                successfulChallenges: 10,
                totalWakeUps: 70,
                successRate: 87,
                totalDeposited: 3.5,
                totalBurned: 0.5,
                score: 1050
            }
        ];

        const paginatedLeaderboard = leaderboard.slice(offset, offset + parseInt(limit));

        res.json({
            success: true,
            total: leaderboard.length,
            count: paginatedLeaderboard.length,
            leaderboard: paginatedLeaderboard
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get user rank
 */
router.get('/rank/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;

        // Mock user rank data
        const userRank = {
            walletAddress,
            rank: Math.floor(Math.random() * 100) + 1,
            displayName: 'User_' + walletAddress.slice(0, 6),
            successfulChallenges: Math.floor(Math.random() * 20),
            totalWakeUps: Math.floor(Math.random() * 150),
            successRate: (Math.random() * 30 + 70).toFixed(2),
            totalDeposited: (Math.random() * 10).toFixed(2),
            totalBurned: (Math.random() * 2).toFixed(2),
            score: Math.floor(Math.random() * 1500)
        };

        res.json({
            success: true,
            userRank
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get leaderboard by category
 */
router.get('/category/:category', (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 10 } = req.query;

        const categories = {
            'most-successful': 'Most Successful Challenges',
            'highest-score': 'Highest Score',
            'most-active': 'Most Active Users',
            'highest-streak': 'Longest Streak'
        };

        if (!categories[category]) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        // Mock category leaderboard
        const leaderboard = Array.from({ length: parseInt(limit) }, (_, i) => ({
            rank: i + 1,
            walletAddress: `0x${Math.random().toString(16).slice(2).padEnd(40, '0')}`,
            displayName: `User_${i + 1}`,
            value: Math.floor(Math.random() * 1000),
            timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
        }));

        res.json({
            success: true,
            category: categories[category],
            count: leaderboard.length,
            leaderboard
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get social challenge leaderboard
 */
router.get('/social-challenges/:socialChallengeId', (req, res) => {
    try {
        const { socialChallengeId } = req.params;

        // Mock social challenge leaderboard
        const participants = [
            {
                walletAddress: '0x1111111111111111111111111111111111111111',
                displayName: 'Player1',
                successDays: 7,
                status: 'winner'
            },
            {
                walletAddress: '0x2222222222222222222222222222222222222222',
                displayName: 'Player2',
                successDays: 5,
                status: 'active'
            },
            {
                walletAddress: '0x3333333333333333333333333333333333333333',
                displayName: 'Player3',
                successDays: 2,
                status: 'failed'
            }
        ];

        res.json({
            success: true,
            socialChallengeId,
            participants
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
