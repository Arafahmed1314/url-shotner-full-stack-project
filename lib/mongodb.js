import { MongoClient } from 'mongodb';

// Ensure this code only runs on the server
if (typeof window !== 'undefined') {
    throw new Error('This module should only be imported on the server');
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri || uri === 'your_mongodb_connection_string_here' || !uri.startsWith('mongodb')) {
    console.error('❌ MongoDB URI is not properly configured. Please set MONGODB_URI in your environment variables.');
    throw new Error('Please add your MongoDB URI to .env.local. It should start with "mongodb://" or "mongodb+srv://"');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {
            // Disable client-side encryption to avoid 'net' dependency
            autoEncryption: undefined,
        });
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(uri, {
        // Disable client-side encryption to avoid 'net' dependency
        autoEncryption: undefined,
    });
    clientPromise = client.connect();
}

export async function connectToDatabase() {
    const client = await clientPromise;
    const db = client.db('urlshortener');
    return { db, client };
}