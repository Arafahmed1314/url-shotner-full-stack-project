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
            // Remove any trailing slashes and protocol if present
            const cleanDomain = customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
            return `https://${cleanDomain}`;
        }
        
        // Use Vercel URL if available (Vercel sets this automatically)
        const vercelUrl = process.env.VERCEL_URL;
        if (vercelUrl) {
            const cleanUrl = vercelUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
            return `https://${cleanUrl}`;
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
            // Remove any trailing slashes and protocol if present
            return customDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
        }
        
        // Use Vercel URL if available
        const vercelUrl = process.env.VERCEL_URL;
        if (vercelUrl) {
            return vercelUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
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
