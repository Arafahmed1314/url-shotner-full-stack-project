# 🚀 Environment Variables Setup

## Required Environment Variables

To run this application, you need to set up the following environment variables in your `.env.local` file:

### 1. MongoDB Database
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener?retryWrites=true&w=majority
```
Replace with your actual MongoDB connection string from MongoDB Atlas or your local MongoDB instance.

### 2. NextAuth Configuration
```
NEXTAUTH_SECRET=your-super-secret-jwt-key-here
NEXTAUTH_URL=http://localhost:3000
```
- `NEXTAUTH_SECRET`: Generate a random secret key (at least 32 characters)
- `NEXTAUTH_URL`: Use `http://localhost:3000` for development

### 3. Google OAuth
```
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```
Get these from Google Cloud Console > APIs & Services > Credentials

### 4. Other Configuration
```
NEXT_PUBLIC_DOMAIN=http://localhost:3000
JWT_SECRET=your-jwt-secret-key
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-domain.vercel.app/api/auth/callback/google` (for production)

## Environment File Example

Create `.env.local` in your project root:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster.mongodb.net/urlshortener

# NextAuth
NEXTAUTH_SECRET=your-super-secret-32-character-key-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth  
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_actual_secret_here

# Domain Configuration
NEXT_PUBLIC_DOMAIN=http://localhost:3000

# JWT
JWT_SECRET=another-secret-key-for-jwt
```

## 🔧 Quick Start

1. Copy `.env.local.example` to `.env.local`
2. Fill in your actual values
3. Restart the development server: `npm run dev`

---

**Note**: Never commit `.env.local` to version control. It's already in `.gitignore`.
