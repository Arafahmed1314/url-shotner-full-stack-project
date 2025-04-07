import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        const urls = await db.collection('urls').find({}, { projection: { shortCode: 1, originalUrl: 1, clicks: 1, expirationDate: 1, password: 1, _id: 0 } }).toArray();
        console.log('Raw URLs from MongoDB (API):', urls);
        // Serialize MongoDB documents to plain objects
        const serializedUrls = urls.map((url) => {
            const plainUrl = { ...url };
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
        console.log('Serialized URLs (API):', serializedUrls);
        return new Response(JSON.stringify(serializedUrls), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        console.error('Error fetching URLs:', err);
        return new Response(JSON.stringify({ message: 'Failed to fetch URLs' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}