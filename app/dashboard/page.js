import { fetchUrls } from './server';
import DashboardClient from './DashboardClient';
import { headers } from 'next/headers';
import { getDomainName } from '../../lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    // If not authenticated, redirect to sign in page
    if (!session) {
        redirect('/auth/signin');
    }

    let initialUrls = [];
    let error = null;

    try {
        // Get user email for data filtering
        const userEmail = session?.user?.email || null;
        
        initialUrls = await fetchUrls(userEmail);
    } catch (err) {
        error = 'Failed to load analytics';
    }

    // Get the current host from the headers
    const headersList = headers();
    const request = { headers: headersList };
    const host = getDomainName(request);
    const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://';

    // Ensure all props are serializable
    error = error ? String(error) : null;

    return (
        <DashboardClient initialUrls={initialUrls} error={error} host={host} protocol={protocol} />
    );
}