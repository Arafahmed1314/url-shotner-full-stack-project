import { connectToDatabase } from '../../lib/mongodb';
import PasswordForm from './PasswordForm';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Server Component: Fetch data on the server and handle redirection
export default async function PasswordPage({ params }) {
    // Await params to resolve the Promise
    const resolvedParams = await params;
    const { code } = resolvedParams;

    let originalUrl = null;
    let error = null;
    let urlDoc = null;

    // Fetch the URL document with error handling
    try {
        const { db } = await connectToDatabase();
        urlDoc = await db.collection('urls').findOne(
            { shortCode: code },
            { projection: { shortCode: 1, originalUrl: 1, password: 1 } }
        );

        // If the URL exists, increment the clicks counter
        if (urlDoc) {
            await db.collection('urls').updateOne(
                { shortCode: code },
                { $inc: { clicks: 1 } } // Increment clicks by 1
            );
        }
    } catch (err) {
        console.error('Error fetching URL document:', err);
        error = 'Server error';
    }

    // Process the result after the try/catch
    if (!urlDoc) {
        // URL not found - show error page
        error = 'URL not found or has expired';
    } else {
        originalUrl = urlDoc.originalUrl;

        // If no password, redirect directly to the original URL
        if (urlDoc.password === null || urlDoc.password === undefined) {
            // Validate the URL before redirecting
            if (!urlDoc.originalUrl || !urlDoc.originalUrl.match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)) {
                error = 'Invalid original URL';
            } else {
                redirect(urlDoc.originalUrl); // This will throw NEXT_REDIRECT
            }
        }
        // If password exists, continue to show password form
    }

    // If there's an error or a password is required, render the password entry page
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
            <div className="backdrop-blur-lg bg-white/90 border border-slate-200 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                {error ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">🔍</div>
                            <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h1>
                            <p className="text-red-600 mb-6">{error}</p>
                            <p className="text-slate-600 text-sm mb-6">
                                The short URL you&apos;re looking for doesn&apos;t exist or may have expired.
                            </p>
                            <Link
                                href="/"
                                className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 shadow-md"
                            >
                                ← Go Back Home
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-slate-800 text-center mb-6">Enter Password</h1>
                        <PasswordForm code={code} originalUrl={originalUrl} initialError={error} />
                    </>
                )}
            </div>
        </div>
    );
}