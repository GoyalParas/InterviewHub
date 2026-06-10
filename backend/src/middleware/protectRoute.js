import {requireAuth} from '@clerk/express';

export const protectRoute = [
    requireAuth(), 
    async (req, res, next) => {
        try {
            const clerkId = req.auth.userId;
            if (!clerkId) {
                return res.status(401).json({ message: 'Unauthorized: No user ID found' });
            }
            const user = await User.findOne({ clerkId });

            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }

            req.user = user; // Attach user to request object 
            next();
        }
        catch (error) {
            console.error('Error in protectRoute middleware:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
];