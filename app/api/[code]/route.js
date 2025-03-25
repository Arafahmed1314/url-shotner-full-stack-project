import { connectToDatabase } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { code } = await params;

    try {
        const { db } = await connectToDatabase();
        const urlDoc = await db.collection('urls').findOne({ shortCode: code });

        if (!urlDoc) {
            return NextResponse.json({ message: 'URL not found' }, { status: 404 });
        }

        // Add logging to debug the password value
        console.log('urlDoc:', urlDoc);
        console.log('urlDoc.password:', urlDoc.password);
        console.log('typeof urlDoc.password:', typeof urlDoc.password);
        console.log('urlDoc.password !== null:', urlDoc.password !== null);

        if (urlDoc.password !== null && urlDoc.password !== undefined) {
            console.log('Redirecting to password entry page');
            return NextResponse.redirect(new URL(`/${code}`, request.url));
        } else {
            console.log('Redirecting directly to original URL:', urlDoc.originalUrl);
            return NextResponse.redirect(urlDoc.originalUrl);
        }
    } catch (error) {
        console.error('Error in /api/[code]:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}