# Deployment Guide - Vercel

This project is configured to deploy to **ha.kyle-schultz.com** using Vercel.

## 🚀 Quick Deployment

### Option 1: Deploy via CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `kschult4/family-hub`
4. Vercel will auto-detect Vite configuration
5. Click "Deploy"

## 🌐 Custom Domain Setup

### Connect ha.kyle-schultz.com to Vercel

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add domain: `ha.kyle-schultz.com`
   - Vercel will provide DNS records

2. **Update DNS Settings** (at your domain registrar):

   **For Root Domain (ha.kyle-schultz.com)**:
   - Type: `A`
   - Name: `ha` (or `@` if this is the root)
   - Value: `76.76.21.21` (Vercel's IP)

   **Or use CNAME (if subdomain)**:
   - Type: `CNAME`
   - Name: `ha`
   - Value: `cname.vercel-dns.com`

3. **SSL Certificate**: Automatically provisioned by Vercel (Let's Encrypt)

## 📝 Environment Variables

### Required Variables

In Vercel Dashboard → Settings → Environment Variables, add:

```bash
# Firebase Configuration (if using Firebase)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Calendar API (optional)
VITE_GOOGLE_CALENDAR_API_KEY=your_api_key
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_CALENDAR_ID=your_calendar_id

# Google Maps API (optional)
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### Setting Environment Variables via CLI

```bash
# Set production environment variable
vercel env add VITE_FIREBASE_API_KEY production

# Pull environment variables to local
vercel env pull
```

## 🔄 Automatic Deployments

Once connected to GitHub:

- **Production**: Push to `main` branch → Auto-deploys to ha.kyle-schultz.com
- **Preview**: Push to any other branch → Creates preview URL
- **Pull Requests**: Each PR gets a unique preview URL

## 🛠 Build Configuration

The project is already configured for Vercel deployment:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite (auto-detected)
- **Node Version**: 18.x (or latest LTS)

## 📊 Monitoring & Analytics

Vercel provides built-in:
- ✅ Performance monitoring
- ✅ Web Vitals tracking
- ✅ Real-time logs
- ✅ Deployment history
- ✅ Bandwidth usage

Access these in your Vercel dashboard.

## 🔧 Troubleshooting

### Build Fails
```bash
# Test build locally first
npm run build

# Preview production build
npm run preview
```

### Domain Not Working
- Verify DNS propagation: `dig ha.kyle-schultz.com`
- DNS changes can take up to 48 hours (usually much faster)
- Check Vercel domain settings for correct configuration

### Environment Variables Not Working
- Make sure variables are prefixed with `VITE_`
- Redeploy after adding new environment variables
- Check logs in Vercel dashboard

## 📱 PWA Configuration

The app is configured as a Progressive Web App:
- Service worker registered automatically
- Installable on mobile devices
- Offline support for cached pages
- Manifest configured for iOS and Android

## 🚦 Deployment Checklist

Before deploying to production:

- [ ] Build passes locally: `npm run build`
- [ ] Environment variables configured in Vercel
- [ ] Custom domain DNS configured
- [ ] Firebase credentials set (if using Firebase)
- [ ] Google API keys set (if using Calendar/Maps)
- [ ] Test preview deployment first
- [ ] Verify HTTPS is working
- [ ] Test on mobile devices
- [ ] Check PWA installation works

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Custom Domains on Vercel](https://vercel.com/docs/concepts/projects/domains)

## 🔐 Security Notes

- All API keys should be in Vercel environment variables (never in code)
- HTTPS is enforced automatically
- Environment variables are encrypted at rest
- Separate environments for development/preview/production
