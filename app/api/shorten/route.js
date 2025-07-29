import { getBaseUrl } from '../../../lib/utils';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

function generateShortCode(length = 6) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function POST(request) {
    const { url, customCode, password, expirationDate } = await request.json();

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
        // Check if MongoDB is properly configured
        if (!process.env.MONGODB_URI || 
            process.env.MONGODB_URI === 'your_mongodb_connection_string_here' || 
            !process.env.MONGODB_URI.startsWith('mongodb')) {
            return NextResponse.json({ 
                message: 'Database not configured. Please set up MongoDB connection.' 
            }, { status: 500 });
        }

        // Import MongoDB connection
        const { connectToDatabase } = await import('../../../lib/mongodb');

        // Get user session
        const session = await getServerSession(authOptions);
        const { db } = await connectToDatabase();

        // Check if the long URL already exists in the database
        const existingUrl = await db.collection('urls').findOne({ originalUrl: formattedUrl });

        if (existingUrl) {
            // If the URL already exists, return the existing short URL
            const baseUrl = getBaseUrl(request);
            const shortUrl = `${baseUrl}/${existingUrl.shortCode}`;
            return NextResponse.json({ shortUrl, message: 'URL already shortened' });
        }

        // Determine the short code to use
        let shortCode;

        // If a custom code is provided, validate and use it
        if (customCode && customCode.trim() !== '') {
            // Validate the custom code: alphanumeric, 3-15 characters
            if (!customCode.match(/^[a-zA-Z0-9]{3,15}$/)) {
                return NextResponse.json(
                    { message: 'Custom code must be 3-15 characters long and contain only letters and numbers' },
                    { status: 400 }
                );
            }

            // Check if the custom code is already in use
            const existingCode = await db.collection('urls').findOne({ shortCode: customCode });
            if (existingCode) {
                return NextResponse.json({ message: 'Custom code is already in use' }, { status: 400 });
            }

            shortCode = customCode;
        } else {
            // If no custom code is provided, generate a random one
            do {
                shortCode = generateShortCode();
            } while (await db.collection('urls').findOne({ shortCode }));
        }

        // Hash password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

        // Set the expiration date
        let expiration;
        if (expirationDate) {
            // Use the user-specified expiration date
            expiration = new Date(expirationDate);
        } else {
            // Set default expiration to 30 days from now
            expiration = new Date();
            expiration.setDate(expiration.getDate() + 30);
        }

        // Save to MongoDB
        await db.collection('urls').insertOne({
            shortCode,
            originalUrl: formattedUrl,
            password: hashedPassword,
            createdAt: new Date(),
            expirationDate: expiration, // Store the expiration date
            clicks: 0,
            userId: session?.user?.email || null, // Associate with user if logged in
            userImage: session?.user?.image || null,
            userName: session?.user?.name || null,
        });

        // Return the short URL with the correct protocol
        const baseUrl = getBaseUrl(request);
        const shortUrl = `${baseUrl}/${shortCode}`;
        return NextResponse.json({ shortUrl });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}