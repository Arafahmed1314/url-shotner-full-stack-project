import { connectToDatabase } from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { code } = params;

    try {
        const { db } = await connectToDatabase();
        const urlDoc = await db.collection('urls').findOne({ shortCode: code });

        if (!urlDoc) {
            return NextResponse.json({ message: 'URL not found' }, { status: 404 });
        }

        if (!urlDoc.password) {
            // Redirect to password entry page if password exists
            return NextResponse.redirect(urlDoc.originalUrl);
        } else {
            return NextResponse.redirect(new URL(`/${code}`, request.url));
            // Direct redirect if no password
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}