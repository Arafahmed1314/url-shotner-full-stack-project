import { connectToDatabase } from '../../../lib/mongodb';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

function generateShortCode(length = 6) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function POST(request) {
    const { url, password } = await request.json();

    if (!url || !url.match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)) {
        return NextResponse.json({ message: 'Invalid URL' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        let shortCode;

        // Ensure short code is unique
        do {
            shortCode = generateShortCode();
        } while (await db.collection('urls').findOne({ shortCode }));

        // Hash password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        // Save to MongoDB
        await db.collection('urls').insertOne({
            shortCode,
            originalUrl: url,
            password: hashedPassword,
            createdAt: new Date(),
        });

        const shortUrl = `${request.headers.get('host')}/${shortCode}`;
        return NextResponse.json({ shortUrl });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}