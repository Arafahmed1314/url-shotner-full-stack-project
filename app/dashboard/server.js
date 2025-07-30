import { connectToDatabase } from '../../lib/mongodb';

export async function fetchUrls() {
    try {
        const { db } = await connectToDatabase();
        const urls = await db.collection('urls').find({}, { projection: { shortCode: 1, originalUrl: 1, clicks: 1, expirationDate: 1, password: 1, _id: 0 } }).toArray();
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
            };
        });
        return serializedUrls;
    } catch (err) {
        console.error('Error fetching URLs:', err);
        throw new Error('Failed to load analytics');
    }
}