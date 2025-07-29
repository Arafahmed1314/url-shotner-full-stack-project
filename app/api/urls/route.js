import { connectToDatabase } from '../../../lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const { db } = await connectToDatabase();
        
        // If user is logged in, show only their URLs, otherwise show all URLs
        const query = session?.user?.email ? { userId: session.user.email } : {};
        
        const urls = await db.collection('urls').find(query, { 
            projection: { 
                shortCode: 1, 
                originalUrl: 1, 
                clicks: 1, 
                expirationDate: 1, 
                password: 1, 
                userId: 1,
                userName: 1,
                _id: 0 
            } 
        }).toArray();
        
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
                userId: plainUrl.userId || null,
                userName: plainUrl.userName || null,
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