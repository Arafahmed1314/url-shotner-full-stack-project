import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Function to create auth options dynamically
function createAuthOptions() {
    const authOptions = {
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            }),
        ],
        session: {
            strategy: 'jwt',
            maxAge: 30 * 24 * 60 * 60, // 30 days
        },
        callbacks: {
            async signIn({ user, account, profile }) {
                if (account.provider === 'google') {
                    try {
                        // Check if MongoDB is properly configured
                        if (!process.env.MONGODB_URI || 
                            process.env.MONGODB_URI === 'your_mongodb_connection_string_here' || 
                            !process.env.MONGODB_URI.startsWith('mongodb')) {
                            console.warn('⚠️ MongoDB not configured, skipping user storage');
                            return true; // Allow sign-in without database storage
                        }
                        
                        // Only import MongoDB when properly configured
                        const { connectToDatabase } = await import('../../../../lib/mongodb');
                        const { db } = await connectToDatabase();
                        
                        // Check if user exists, if not create them
                        const existingUser = await db.collection('users').findOne({ email: user.email });
                        
                        if (!existingUser) {
                            await db.collection('users').insertOne({
                                email: user.email,
                                name: user.name,
                                image: user.image,
                                provider: account.provider,
                                createdAt: new Date(),
                            });
                        } else {
                            // Update user info if needed
                            await db.collection('users').updateOne(
                                { email: user.email },
                                { 
                                    $set: { 
                                        name: user.name,
                                        image: user.image,
                                        lastLogin: new Date()
                                    }
                                }
                            );
                        }
                        
                        return true;
                    } catch (error) {
                        console.error('Error saving user:', error);
                        console.warn('⚠️ Continuing without database storage');
                        return true; // Allow sign-in even if database fails
                    }
                }
                return true;
            },
            async jwt({ token, user, account }) {
                // Add user info to token when user signs in
                if (user) {
                    token.email = user.email;
                    token.name = user.name;
                    token.image = user.image;
                }
                return token;
            },
            async session({ session, token }) {
                // Send properties to the client
                if (token) {
                    session.user.email = token.email;
                    session.user.name = token.name;
                    session.user.image = token.image;
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
        // Dynamic URL configuration based on environment
        url: process.env.NEXTAUTH_URL || (
            process.env.NODE_ENV === 'development' 
                ? 'http://localhost:3000' 
                : 'https://urlify-orcin.vercel.app'
        ),
    };

    return authOptions;
}

const authOptions = createAuthOptions();

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
