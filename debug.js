/**
 * Debug Script for URL Shortener Issues
 * Run this to test your configuration
 */

// Test the environment variables
console.log('🔍 Environment Variables Check:');
console.log('================================');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('NEXT_PUBLIC_DOMAIN:', process.env.NEXT_PUBLIC_DOMAIN || 'not set');
console.log('VERCEL_URL:', process.env.VERCEL_URL || 'not set');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'set ✅' : 'not set ❌');

// Test URL formation
if (typeof window === 'undefined') {
    // Node.js environment
    import('../lib/utils.js').then(({ getBaseUrl, getDomainName }) => {
        const mockRequest = {
            headers: {
                get: (key) => {
                    if (key === 'host') return 'urlify-4ea8fzx31-md-naimul-islams-projects.vercel.app';
                    return null;
                }
            }
        };

        console.log('\n🌐 URL Formation Test:');
        console.log('=====================');
        console.log('Base URL:', getBaseUrl(mockRequest));
        console.log('Domain Name:', getDomainName(mockRequest));

        console.log('\n✅ Expected Results:');
        console.log('- With NEXT_PUBLIC_DOMAIN: https://urlify-orcin.vercel.app');
        console.log('- Without: https://urlify-4ea8fzx31-md-naimul-islams-projects.vercel.app');
    });
}

// Test data to verify custom code handling
const testCases = [
    { customCode: '', expected: 'random code' },
    { customCode: 'test123', expected: 'test123' },
    { customCode: 'abc', expected: 'abc' },
    { customCode: 'toolongcodehere123456', expected: 'error' },
    { customCode: 'test@123', expected: 'error' }
];

console.log('\n🧪 Custom Code Test Cases:');
console.log('==========================');
testCases.forEach(({ customCode, expected }) => {
    const isValid = customCode === '' || customCode.match(/^[a-zA-Z0-9]{3,15}$/);
    console.log(`"${customCode}" -> ${isValid ? expected : 'invalid'} ${isValid ? '✅' : '❌'}`);
});

console.log('\n📝 Next Steps:');
console.log('==============');
console.log('1. Set NEXT_PUBLIC_DOMAIN=urlify-orcin.vercel.app in Vercel');
console.log('2. Redeploy your application');
console.log('3. Test with custom code and check browser network tab');
console.log('4. Check Vercel logs for console.log outputs');
