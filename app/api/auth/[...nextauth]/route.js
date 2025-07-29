import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { MongoClient } from 'mongodb';

// Create MongoDB client for NextAuth
const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user }) {
            // Add user ID to token when user signs in
            if (user) {
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Add user ID to session
            if (token?.userId) {
                session.user.id = token.userId;
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    // Fix for localhost development
    ...(process.env.NODE_ENV === 'development' && {
        url: 'http://localhost:3000',
    }),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
