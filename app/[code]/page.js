import { connectToDatabase } from '../../lib/mongodb';
import PasswordForm from './PasswordForm';

// Server Component: Fetch data on the server
export default async function PasswordPage({ params }) {
    const { code } = params;

    let originalUrl = null;
    let error = null;

    try {
        const { db } = await connectToDatabase();
        const urlDoc = await db.collection('urls').findOne({ shortCode: code });

        if (!urlDoc) {
            error = 'URL not found';
        } else {
            originalUrl = urlDoc.originalUrl;
        }
    } catch (err) {
        error = 'Server error';
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h1 className="text-2xl font-bold text-white text-center mb-6">Enter Password</h1>
                <PasswordForm code={code} originalUrl={originalUrl} initialError={error} />
            </div>
        </div>
    );
}