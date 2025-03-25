import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const { code, password } = await request.json();

    try {
        const { db } = await connectToDatabase();
        const urlDoc = await db.collection('urls').findOne({ shortCode: code });

        if (!urlDoc) {
            return NextResponse.json({ message: 'URL not found' }, { status: 404 });
        }

        if (urlDoc.password) {
            const isMatch = await bcrypt.compare(password, urlDoc.password);
            if (isMatch) {
                return NextResponse.json({ originalUrl: urlDoc.originalUrl });
            } else {
                return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
            }
        } else {
            return NextResponse.json({ message: 'No password required' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}