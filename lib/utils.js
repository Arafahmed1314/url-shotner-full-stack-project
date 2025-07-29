/**
 * Get the base URL for the application
 * In production, use the VERCEL_URL or custom domain
 * In development, use localhost
 */
export function getBaseUrl(request) {
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
        // Use custom domain if set, otherwise use Vercel URL
        const customDomain = process.env.NEXT_PUBLIC_DOMAIN;
        if (customDomain) {
            return `https://${customDomain}`;
        }
        
        // Use Vercel URL if available
        const vercelUrl = process.env.VERCEL_URL;
        if (vercelUrl) {
            return `https://${vercelUrl}`;
        }

        // Fallback to request host with https
        const host = request?.headers.get('host');
        if (host) {
            return `https://${host}`;
        }
    }
    
    // Development fallback
    const host = request?.headers.get('host') || 'localhost:3000';
    return `http://${host}`;
}

/**
 * Get the domain name only (without protocol)
 */
export function getDomainName(request) {
    if (process.env.NODE_ENV === 'production') {
        // Use custom domain if set
        const customDomain = process.env.NEXT_PUBLIC_DOMAIN;
        if (customDomain) {
            return customDomain;
        }
        
        // Use Vercel URL if available
        const vercelUrl = process.env.VERCEL_URL;
        if (vercelUrl) {
            return vercelUrl;
        }

        // Fallback to request host
        const host = request?.headers.get('host');
        if (host) {
            return host;
        }
    }
    
    // Development fallback
    return request?.headers.get('host') || 'localhost:3000';
}
