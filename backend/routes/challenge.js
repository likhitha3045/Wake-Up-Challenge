import express from 'express';
const router = express.Router();

// Mock database for challenges
const challenges = new Map();
let challengeCounter = 0;

/**
 * Get all challenges for a user
 */
router.get('/user/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const normalizedAddress = walletAddress.toLowerCase();

        const userChallenges = Array.from(challenges.values())
            .filter(challenge => challenge.user.toLowerCase() === normalizedAddress);

        res.json({
            success: true,
            count: userChallenges.length,
            challenges: userChallenges
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get challenge details
 */
router.get('/:challengeId', (req, res) => {
    try {
        const { challengeId } = req.params;
        const challenge = challenges.get(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        res.json({
            success: true,
            challenge
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Create challenge (called from frontend after blockchain transaction)
 */
router.post('/create', (req, res) => {
    try {
        const {
            walletAddress,
            transactionHash,
            depositAmount,
            wakeUpTime,
            durationDays,
            blockchainChallengeId
        } = req.body;

        if (!walletAddress || !transactionHash) {
            return res.status(400).json({ error: 'Missing required fields: walletAddress and transactionHash' });
        }

        // Use blockchainChallengeId if provided, otherwise use transaction hash as ID
        const challengeId = blockchainChallengeId ? String(blockchainChallengeId) : transactionHash;
        
        const challenge = {
            id: challengeId,
            user: walletAddress,
            transactionHash,
            depositAmount: depositAmount || 0,
            wakeUpTime: wakeUpTime || 0,
            durationDays: durationDays || 0,
            createdAt: new Date().toISOString(),
            status: 'ACTIVE',
            wakeUpDays: [],
            completedDays: 0
        };

        challenges.set(challengeId, challenge);

        res.json({
            success: true,
            message: 'Challenge created successfully',
            challenge
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Confirm wake-up for today
 */
router.post('/:challengeId/wakeup', (req, res) => {
    try {
        const { challengeId } = req.params;
        const { walletAddress, transactionHash } = req.body;

        const challenge = challenges.get(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        if (challenge.user.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Check if already confirmed today
        const today = new Date().toDateString();
        if (challenge.wakeUpDays.some(day => day.date === today)) {
            return res.status(400).json({ error: 'Already confirmed for today' });
        }

        challenge.wakeUpDays.push({
            date: today,
            confirmedAt: new Date().toISOString(),
            transactionHash
        });
        challenge.completedDays++;

        res.json({
            success: true,
            message: 'Wake-up confirmed',
            challenge
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Finalize challenge (called after blockchain finalization)
 */
router.post('/:challengeId/finalize', (req, res) => {
    try {
        const { challengeId } = req.params;
        const { walletAddress, transactionHash, status } = req.body;

        const challenge = challenges.get(challengeId);

        if (!challenge) {
            return res.status(404).json({ error: 'Challenge not found' });
        }

        if (challenge.user.toLowerCase() !== walletAddress.toLowerCase()) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        challenge.status = status; // 'COMPLETED' or 'FAILED'
        challenge.finalizedAt = new Date().toISOString();
        challenge.finalizationTxHash = transactionHash;

        res.json({
            success: true,
            message: 'Challenge finalized',
            challenge
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get statistics for user
 */
router.get('/stats/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const normalizedAddress = walletAddress.toLowerCase();

        const userChallenges = Array.from(challenges.values())
            .filter(challenge => challenge.user.toLowerCase() === normalizedAddress);

        const completed = userChallenges.filter(c => c.status === 'COMPLETED').length;
        const failed = userChallenges.filter(c => c.status === 'FAILED').length;
        const active = userChallenges.filter(c => c.status === 'ACTIVE').length;

        const totalWakeUps = userChallenges.reduce((sum, c) => sum + c.completedDays, 0);
        const totalDeposited = userChallenges.reduce((sum, c) => sum + parseFloat(c.depositAmount || 0), 0);

        res.json({
            success: true,
            stats: {
                totalChallenges: userChallenges.length,
                completedChallenges: completed,
                failedChallenges: failed,
                activeChallenges: active,
                totalWakeUps,
                totalDeposited,
                successRate: userChallenges.length > 0 ? ((completed / userChallenges.length) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
