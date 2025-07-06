# Quick Setup Guide

## 1. Environment Variables

Create a `.env.local` file in the root directory with:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/art-portfolio?retryWrites=true&w=majority

# Email Configuration (for existing contact forms)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Seed Database

```bash
npm run seed
```

## 4. Start Development

```bash
npm run dev
```

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create database user with read/write permissions
4. Add network access: `0.0.0.0/0`
5. Get connection string from cluster → Connect → Connect your application
6. Replace `your-username`, `your-password`, and `your-cluster` in the connection string

## Vercel Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

See README.md for detailed instructions.
