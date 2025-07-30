import { getServerSession } from 'next-auth';

const ADMIN_EMAIL = 'nayemhasan1314@gmail.com';

export async function GET() {
    try {
        // Check if MongoDB is properly configured
        if (!process.env.MONGODB_URI || 
            process.env.MONGODB_URI === 'your_mongodb_connection_string_here' || 
            !process.env.MONGODB_URI.startsWith('mongodb')) {
            console.warn('⚠️ MongoDB not configured, returning empty array');
            return new Response(JSON.stringify([]), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Dynamic import to avoid loading MongoDB when not configured
        const [
            { connectToDatabase },
            { authOptions }
        ] = await Promise.all([
            import('../../../lib/mongodb'),
            import('../auth/[...nextauth]/route')
        ]);

        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated
        if (!session) {
            return new Response(JSON.stringify({ message: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { db } = await connectToDatabase();

        // Admin can see all URLs, regular users see only their URLs
        let query = {};
        if (session?.user?.email && session.user.email !== ADMIN_EMAIL) {
            query = { userId: session.user.email };
        }

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