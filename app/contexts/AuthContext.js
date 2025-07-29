'use client';

import { createContext, useContext } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    return (
        <SessionProvider>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </SessionProvider>
    );
}

function AuthContextProvider({ children }) {
    const { data: session, status } = useSession();

    const login = async (provider = 'google') => {
        await signIn(provider);
    };

    const logout = async () => {
        await signOut();
    };

    const value = {
        user: session?.user || null,
        isAuthenticated: !!session,
        isLoading: status === 'loading',
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
