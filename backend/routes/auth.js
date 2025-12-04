import express from 'express';
const router = express.Router();

// Mock database for users
const users = new Map();

/**
 * Register user
 */
router.post('/register', (req, res) => {
    try {
        const { walletAddress, email } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address required' });
        }

        if (users.has(walletAddress.toLowerCase())) {
            return res.status(400).json({ error: 'User already registered' });
        }

        const user = {
            walletAddress: walletAddress.toLowerCase(),
            email: email || null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        users.set(walletAddress.toLowerCase(), user);

        res.json({
            success: true,
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Login user
 */
router.post('/login', (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address required' });
        }

        const normalizedAddress = walletAddress.toLowerCase();
        let user = users.get(normalizedAddress);

        if (!user) {
            // Auto-create user on first login
            user = {
                walletAddress: normalizedAddress,
                email: null,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };
            users.set(normalizedAddress, user);
        } else {
            user.lastLogin = new Date().toISOString();
        }

        // Generate mock token
        const token = Buffer.from(walletAddress + Date.now()).toString('base64');

        res.json({
            success: true,
            message: 'Logged in successfully',
            user,
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Verify user
 */
router.post('/verify', (req, res) => {
    try {
        const { walletAddress } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address required' });
        }

        const user = users.get(walletAddress.toLowerCase());

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update user profile
 */
router.put('/profile', (req, res) => {
    try {
        const { walletAddress, email, displayName } = req.body;

        if (!walletAddress) {
            return res.status(400).json({ error: 'Wallet address required' });
        }

        const normalizedAddress = walletAddress.toLowerCase();
        let user = users.get(normalizedAddress);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (email) user.email = email;
        if (displayName) user.displayName = displayName;
        user.updatedAt = new Date().toISOString();

        users.set(normalizedAddress, user);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
