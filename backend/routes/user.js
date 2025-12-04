import express from 'express';
const router = express.Router();

// Mock user profiles
const userProfiles = new Map();

/**
 * Get user profile
 */
router.get('/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const normalizedAddress = walletAddress.toLowerCase();

        let profile = userProfiles.get(normalizedAddress);

        if (!profile) {
            profile = {
                walletAddress: normalizedAddress,
                displayName: `User_${walletAddress.slice(0, 6)}`,
                email: null,
                profileImage: null,
                bio: '',
                createdAt: new Date().toISOString(),
                stats: {
                    totalChallenges: 0,
                    successfulChallenges: 0,
                    failedChallenges: 0,
                    totalDeposited: '0',
                    totalBurned: '0',
                    totalReturned: '0'
                }
            };
        }

        res.json({
            success: true,
            profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Update user profile
 */
router.put('/:walletAddress', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { displayName, email, bio, profileImage } = req.body;
        const normalizedAddress = walletAddress.toLowerCase();

        let profile = userProfiles.get(normalizedAddress);

        if (!profile) {
            profile = {
                walletAddress: normalizedAddress,
                displayName: `User_${walletAddress.slice(0, 6)}`,
                email: null,
                profileImage: null,
                bio: '',
                createdAt: new Date().toISOString(),
                stats: {
                    totalChallenges: 0,
                    successfulChallenges: 0,
                    failedChallenges: 0,
                    totalDeposited: '0',
                    totalBurned: '0',
                    totalReturned: '0'
                }
            };
        }

        if (displayName) profile.displayName = displayName;
        if (email) profile.email = email;
        if (bio) profile.bio = bio;
        if (profileImage) profile.profileImage = profileImage;
        profile.updatedAt = new Date().toISOString();

        userProfiles.set(normalizedAddress, profile);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            profile
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Get user friends
 */
router.get('/:walletAddress/friends', (req, res) => {
    try {
        const { walletAddress } = req.params;

        const friends = [
            {
                walletAddress: '0x1234567890123456789012345678901234567890',
                displayName: 'Friend1',
                status: 'active'
            },
            {
                walletAddress: '0x0987654321098765432109876543210987654321',
                displayName: 'Friend2',
                status: 'inactive'
            }
        ];

        res.json({
            success: true,
            count: friends.length,
            friends
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Add friend
 */
router.post('/:walletAddress/friends/add', (req, res) => {
    try {
        const { walletAddress } = req.params;
        const { friendAddress } = req.body;

        if (!friendAddress) {
            return res.status(400).json({ error: 'Friend address required' });
        }

        res.json({
            success: true,
            message: 'Friend added successfully',
            friend: {
                walletAddress: friendAddress,
                status: 'pending'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
