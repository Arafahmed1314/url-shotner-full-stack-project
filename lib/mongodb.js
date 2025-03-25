import { MongoClient } from 'mongodb';

// Ensure this code only runs on the server
if (typeof window !== 'undefined') {
    throw new Error('This module should only be imported on the server');
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!uri) {
    throw new Error('Please add your MongoDB URI to .env.local');
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