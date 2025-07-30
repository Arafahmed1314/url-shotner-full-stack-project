import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === 'google') {
                try {
                    const { connectToDatabase } = await import('../../../../lib/mongodb');
                    const { db } = await connectToDatabase();
                    
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
                    return true;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
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
    url: process.env.NEXTAUTH_URL,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
