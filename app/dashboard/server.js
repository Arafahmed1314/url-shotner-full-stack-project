import { connectToDatabase } from '../../lib/mongodb';

const ADMIN_EMAIL = 'nayemhasan1314@gmail.com';

export async function fetchUrls(userEmail = null) {
    try {
        const { db } = await connectToDatabase();
        
        let query = {};
        let projection = { 
            shortCode: 1, 
            originalUrl: 1, 
            clicks: 1, 
            expirationDate: 1, 
            password: 1, 
            userId: 1,
            userName: 1,
            _id: 0 
        };

        // If user is admin, show all URLs with user information
        // If regular user, filter by their email
        if (userEmail && userEmail !== ADMIN_EMAIL) {
            query = { userId: userEmail };
        }

        const urls = await db.collection('urls').find(query, { projection }).toArray();
        
        // Serialize MongoDB documents to plain objects
        const serializedUrls = urls.map((url) => {
            const plainUrl = { ...url }; // Create a shallow copy
            return {
                shortCode: String(plainUrl.shortCode),
                originalUrl: String(plainUrl.originalUrl),
                clicks: Number(plainUrl.clicks || 0),
                expirationDate: plainUrl.expirationDate
                    ? new Date(plainUrl.expirationDate).toISOString()
                    : null,
                password: Boolean(plainUrl.password),
                userId: plainUrl.userId || null,
                userName: plainUrl.userName || null,
                isAdmin: userEmail === ADMIN_EMAIL
            };
        });
        
        return serializedUrls;
    } catch (err) {
        console.error('Error fetching URLs:', err);
        throw new Error('Failed to load analytics');
    }
}