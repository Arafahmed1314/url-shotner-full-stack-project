This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## 🔗 URL Shortener with Dark Mode

A modern, full-stack URL shortener built with Next.js 15, featuring password protection, analytics, expiration dates, and a beautiful dark mode.

### Features

- ⚡ **Fast URL Shortening** with custom codes
- 🔒 **Password Protection** for sensitive links
- 📊 **Analytics Dashboard** with sorting and filtering
- ⏰ **Expiration Dates** for temporary links
- 🌙 **Dark Mode** with smooth transitions
- 📱 **Responsive Design** for all devices
- 🚀 **Production Ready** with proper domain handling

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd url-shortner
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Configure your environment variables:

```env
# Required: MongoDB connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlshortener

# Optional: Custom domain for production (without protocol)
# If not set, will use Vercel URL automatically
NEXT_PUBLIC_DOMAIN=yourdomain.com
```

### 3. Development

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Production Deployment

#### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set your environment variables in the Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NEXT_PUBLIC_DOMAIN`: Your custom domain (optional)
4. Deploy!

#### Custom Domain Setup

If you want to use a custom domain instead of the Vercel-provided domain:

1. Set `NEXT_PUBLIC_DOMAIN=yourdomain.com` in your environment variables
2. Configure your domain's DNS to point to Vercel
3. Add the domain in your Vercel project settings

## Project Structure

```
app/
├── api/
│   ├── shorten/          # URL shortening endpoint
│   ├── urls/             # Analytics data endpoint
│   └── verify-password/  # Password verification
├── components/
│   ├── Features.jsx      # Feature showcase
│   └── ThemeToggle.jsx   # Dark mode toggle
├── contexts/
│   └── ThemeContext.js   # Theme management
├── dashboard/            # Analytics dashboard
├── [code]/              # Dynamic short URL routes
├── layout.js            # Root layout with theme provider
└── page.js              # Main landing page

lib/
├── mongodb.js           # Database connection
└── utils.js             # Domain utilities

public/                  # Static assets
```

## Technologies Used

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: bcrypt for password hashing
- **Deployment**: Vercel-ready with automatic domain detection

## Features in Detail

### URL Shortening

- Custom short codes (3-15 characters)
- Automatic random code generation
- Duplicate URL detection
- URL validation and formatting

### Security

- Password protection with bcrypt hashing
- Input validation and sanitization
- Secure environment variable handling

### Analytics

- Click tracking
- Sortable by clicks, date, or code
- Filterable by password protection and expiration
- Real-time data refresh

### Dark Mode

- System preference detection
- Persistent user preference
- Smooth animations and transitions
- Consistent design across all pages

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📧 Contact

Built with ❤️ by **Naimul**

- 🌐 Website: [naimul.me](https://naimul.me)
- 💼 Portfolio: Check out my work and projects

Have questions, suggestions, or want to collaborate? Feel free to reach out!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
