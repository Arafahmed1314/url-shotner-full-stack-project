/**
 * Domain Configuration Test
 * Run this to verify your domain setup
 */

import { getBaseUrl, getDomainName } from '../lib/utils.js';

// Mock request object for testing
const mockRequest = {
    headers: {
        get: (key) => {
            if (key === 'host') {
                return 'localhost:3000'; // Simulate development
            }
            return null;
        }
    }
};

console.log('🔧 Domain Configuration Test');
console.log('============================');

console.log('\n📍 Current Environment:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`VERCEL_URL: ${process.env.VERCEL_URL || 'not set'}`);
console.log(`NEXT_PUBLIC_DOMAIN: ${process.env.NEXT_PUBLIC_DOMAIN || 'not set'}`);

console.log('\n🌐 URL Generation:');
console.log(`Base URL: ${getBaseUrl(mockRequest)}`);
console.log(`Domain Name: ${getDomainName(mockRequest)}`);

console.log('\n✅ Expected Behavior:');
console.log('- Development: http://localhost:3000');
console.log('- Production with NEXT_PUBLIC_DOMAIN: https://yourdomain.com');
console.log('- Production with Vercel: https://your-app.vercel.app');

console.log('\n📝 To set custom domain:');
console.log('1. Add NEXT_PUBLIC_DOMAIN=yourdomain.com to .env.local');
console.log('2. Deploy to production');
console.log('3. Configure DNS to point to Vercel');
