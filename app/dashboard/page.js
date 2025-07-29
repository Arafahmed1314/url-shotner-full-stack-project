import { fetchUrls } from './server';
import DashboardClient from './DashboardClient';
import { headers } from 'next/headers';
import { getDomainName } from '../../lib/utils';

export default async function DashboardPage() {
    let initialUrls = [];
    let error = null;

    try {
        initialUrls = await fetchUrls();
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
    // console.log('Props passed to DashboardClient:', { initialUrls, error, host, protocol });

    return (
        <DashboardClient initialUrls={initialUrls} error={error} host={host} protocol={protocol} />
    );
}