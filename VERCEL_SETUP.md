# Production Environment Variables for Vercel

## Required Environment Variables:

Add these to your Vercel project dashboard:

### 1. Database

```
MONGODB_URI=your_mongodb_connection_string_here
```

### 2. Domain Configuration

```
NEXT_PUBLIC_DOMAIN=urlify-orcin.vercel.app
```

### 3. Authentication (if using NextAuth)

```
JWT_SECRET=your_jwt_secret_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://urlify-orcin.vercel.app
```

### 4. Google OAuth (if using)

```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## How to set these in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with its value
5. Select "Production", "Preview", and "Development" for each
6. Redeploy your application

## Important Notes:

- Remove any trailing slashes from URLs
- NEXT_PUBLIC_DOMAIN should be just the domain name (no https://)
- Vercel automatically sets VERCEL_URL, so our code will use NEXT_PUBLIC_DOMAIN first
- After setting environment variables, you must redeploy for changes to take effect
- **NEVER commit actual credentials to Git - use placeholder values in documentation**

## Testing:

After deployment, test with a short URL like:

- Input: https://google.com
- Custom code: test123
- Expected output: https://urlify-orcin.vercel.app/test123
