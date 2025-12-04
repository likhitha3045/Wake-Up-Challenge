import express from 'express';
const router = express.Router();

// Mock database for oracle data
const oracleData = new Map();

/**
 * Verify user activity via oracle (mock implementation)
 * In real implementation, this would connect to fitness apps, location services, etc.
 */
router.post('/verify-activity', (req, res) => {
    try {
        const { walletAddress, activityType, timestamp } = req.body;

        if (!walletAddress || !activityType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Mock verification - in real implementation, check with actual oracle service
        const verification = {
            walletAddress,
            activityType,
            timestamp: timestamp || new Date().toISOString(),
            verified: true,
            confidence: 0.95, // Mock confidence score
            provider: 'mock-oracle' // In production: FitBit, Strava, GPS provider, etc.
        };

        oracleData.set(`${walletAddress}-${timestamp}`, verification);

        res.json({
            success: true,
            message: 'Activity verified',
            verification
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get activity verification history
 */
router.get('/activity/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const normalizedAddress = walletAddress.toLowerCase();

        const activities = Array.from(oracleData.values())
            .filter(data => data.walletAddress.toLowerCase() === normalizedAddress);

        res.json({
            success: true,
            count: activities.length,
            activities
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Link fitness app (Fitbit, Strava, etc.)
 */
router.post('/link-fitness-app', (req, res) => {
    try {
        const { walletAddress, provider, accessToken } = req.body;

        if (!walletAddress || !provider || !accessToken) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In real implementation, verify and store the access token securely
        const linkedApp = {
            walletAddress,
            provider,
            linkedAt: new Date().toISOString(),
            lastSynced: null,
            status: 'connected'
        };

        res.json({
            success: true,
            message: `${provider} linked successfully`,
            linkedApp
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Sync activity from fitness app
 */
router.post('/sync-activity', (req, res) => {
    try {
        const { walletAddress, provider } = req.body;

        if (!walletAddress || !provider) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // In real implementation, fetch from actual fitness app API
        const syncResult = {
            walletAddress,
            provider,
            synced: true,
            activitiesCount: Math.floor(Math.random() * 10),
            lastSyncTime: new Date().toISOString(),
            nextSyncTime: new Date(Date.now() + 3600000).toISOString()
        };

        res.json({
            success: true,
            message: 'Activities synced successfully',
            syncResult
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get oracle configuration
 */
router.get('/config', (req, res) => {
    try {
        const config = {
            supportedProviders: [
                'fitbit',
                'strava',
                'apple-health',
                'google-fit',
                'oura-ring',
                'garmin'
            ],
            activityTypes: [
                'wake-up-confirmation',
                'morning-walk',
                'morning-run',
                'morning-exercise',
                'location-verification'
            ],
            verificationWindow: 3600, // seconds
            confidenceThreshold: 0.8
        };

        res.json({
            success: true,
            config
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
