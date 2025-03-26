import { connectToDatabase } from '../../lib/mongodb';
import PasswordForm from './PasswordForm';
import { redirect } from 'next/navigation';

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
    if (urlDoc) {
        console.log('urlDoc:', urlDoc);
        console.log('urlDoc.password:', urlDoc.password);
        console.log('urlDoc.password === null:', urlDoc.password === null);

        if (!urlDoc) {
            error = 'URL not found';
        } else {
            originalUrl = urlDoc.originalUrl;

            // If no password, redirect directly to the original URL
            if (urlDoc.password === null || urlDoc.password === undefined) {
                console.log('No password set, redirecting to:', urlDoc.originalUrl);

                // Validate the URL before redirecting
                if (!urlDoc.originalUrl || !urlDoc.originalUrl.match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)) {
                    console.log('Invalid original URL:', urlDoc.originalUrl);
                    error = 'Invalid original URL';
                } else {
                    redirect(urlDoc.originalUrl); // This will throw NEXT_REDIRECT
                }
            }
        }
    }

    // If there's an error or a password is required, render the password entry page
    console.log('Rendering password entry page with error:', error);
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                {error ? (
                    <>
                        <h1 className="text-2xl font-bold text-white text-center mb-6">Error</h1>
                        <p className="text-pink-200 text-center">{error}</p>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-white text-center mb-6">Enter Password</h1>
                        <PasswordForm code={code} originalUrl={originalUrl} initialError={error} />
                    </>
                )}
            </div>
        </div>
    );
}