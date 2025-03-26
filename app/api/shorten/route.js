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

    // Ensure the URL has a protocol (http:// or https://)
    let formattedUrl = url;
    if (!formattedUrl.match(/^(http|https):\/\//)) {
        formattedUrl = `https://${formattedUrl}`; // Default to https if no protocol is provided
    }

    // Validate the URL
    if (!formattedUrl.match(/^(http|https):\/\/[^\s$.?#].[^\s]*$/)) {
        return NextResponse.json({ message: 'Invalid URL' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();

        // Check if the long URL already exists in the database
        const existingUrl = await db.collection('urls').findOne({ originalUrl: formattedUrl });

        if (existingUrl) {
            // If the URL already exists, return the existing short URL
            const shortUrl = `${request.headers.get('host')}/${existingUrl.shortCode}`;
            return NextResponse.json({ shortUrl, message: 'URL already shortened' });
        }

        // If the URL doesn't exist, generate a new short code
        let shortCode;

        // Ensure short code is unique
        do {
            shortCode = generateShortCode();
        } while (await db.collection('urls').findOne({ shortCode }));

        // Hash password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        // Save to MongoDB with a clicks field initialized to 0
        await db.collection('urls').insertOne({
            shortCode,
            originalUrl: formattedUrl,
            password: hashedPassword,
            createdAt: new Date(),
            clicks: 0, // Initialize clicks to 0
        });

        // Return the short URL
        const shortUrl = `${request.headers.get('host')}/${shortCode}`;
        return NextResponse.json({ shortUrl });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}