# Noorvi Shayari - Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Ready
- All UI text updated to poetic, user-friendly English
- Technical jargon removed from user-facing pages
- Admin panel simplified with clear language
- Animations and styling optimized
- Nested ternary operations fixed

### 📋 Required Environment Variables

You'll need to set these in Vercel:

1. **MONGODB_URI** - Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/noorvi_shayari?retryWrites=true&w=majority`
   - Get this from MongoDB Atlas

2. **MONGODB_DB** - Database name
   - Value: `noorvi_shayari`

3. **ADMIN_SESSION_SECRET** - Secret key for admin sessions
   - Generate a random 32+ character string
   - Example: Use `openssl rand -base64 32` in terminal

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all three variables listed above
   - Make sure to add them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Add environment variables when asked

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Setup

### 1. Create Admin User
After deployment, create your first admin user:

```bash
# Locally with production database
MONGODB_URI="your-production-uri" npm run auth:create-user -- --email admin@example.com --password YourSecurePassword --role admin
```

Or use Vercel CLI:
```bash
vercel env pull .env.production.local
npm run auth:create-user -- --email admin@example.com --password YourSecurePassword --role admin
```

### 2. Seed Initial Content (Optional)
If you want to populate with sample data:

```bash
npm run db:seed
```

### 3. Test Your Deployment
- Visit your Vercel URL
- Test the homepage
- Try browsing categories
- Test admin login at `/admin/login`
- Create a test post

## MongoDB Atlas Setup (If Needed)

1. **Create Cluster**
   - Go to https://cloud.mongodb.com
   - Create a free M0 cluster
   - Choose a region close to your users

2. **Configure Network Access**
   - Database Access → Add Database User
   - Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Vercel Configuration

The project is already configured for Vercel with:
- ✅ Next.js 16 (auto-detected)
- ✅ Node.js 20.x runtime
- ✅ Automatic builds on git push
- ✅ Edge-optimized static assets

## Build Command
```bash
npm run build
```

## Start Command
```bash
npm start
```

## Framework Preset
Next.js

## Root Directory
`./` (project root)

## Troubleshooting

### Build Fails
- Check environment variables are set correctly
- Ensure MongoDB URI is accessible from Vercel's servers
- Check build logs in Vercel dashboard

### Can't Connect to Database
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check connection string format
- Ensure database user has read/write permissions

### Admin Login Not Working
- Verify ADMIN_SESSION_SECRET is set
- Create admin user using the auth script
- Check MongoDB connection

### Images Not Loading
- Ensure all image paths in `/public` are correct
- Check Next.js Image optimization settings
- Verify file names match exactly (case-sensitive)

## Performance Optimization

Already implemented:
- ✅ Image optimization with Next.js Image component
- ✅ Static generation where possible
- ✅ Efficient MongoDB queries
- ✅ Minimal client-side JavaScript
- ✅ Optimized CSS with Tailwind

## Security Notes

- ✅ Admin routes protected with session authentication
- ✅ HMAC-SHA256 signed cookies
- ✅ Role-based permissions (admin vs editor)
- ✅ Environment variables for secrets
- ⚠️ Remember to use strong passwords
- ⚠️ Keep ADMIN_SESSION_SECRET secure

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

## Monitoring

- View analytics in Vercel dashboard
- Check function logs for errors
- Monitor MongoDB Atlas for database performance

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with permissions
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string copied
- [ ] Vercel project created
- [ ] Environment variables added to Vercel
- [ ] First deployment successful
- [ ] Admin user created
- [ ] Admin login tested
- [ ] Homepage loads correctly
- [ ] Categories work
- [ ] Posts display properly
- [ ] Audio/video playback works
- [ ] Download buttons functional

---

**Your app is ready to deploy! 🚀**

For support, check:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
