# Netlify Deployment Guide for Metaverse Directory

## Overview
This Next.js 14 application has been configured for deployment on Netlify with optimized build settings and proper configuration.

## Configuration Files Added/Modified

### 1. `netlify.toml`
- Main Netlify configuration file
- Specifies build command, publish directory, and Node.js version
- Includes security headers and caching rules for optimal performance
- Configures Next.js plugin for ISR and SSR support

### 2. `.env.example`
- Template for environment variables
- Copy to `.env.local` for local development
- Set production values in Netlify Dashboard

### 3. `package.json`
- Added `@netlify/plugin-nextjs` for Next.js compatibility

### 4. `next.config.mjs`
- Added `output: 'standalone'` for optimized Netlify builds
- Enabled React strict mode and SWC minification
- Security improvements with `poweredByHeader: false`

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Configure project for Netlify deployment"
git push origin main
```

### 2. Deploy on Netlify

#### Option A: Via Netlify Dashboard
1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select this repository
4. Build settings will be auto-detected from `netlify.toml`
5. Click "Deploy site"

#### Option B: Via Netlify CLI
```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize and link the site
netlify init

# Deploy to production
netlify deploy --prod
```

### 3. Configure Environment Variables
In Netlify Dashboard → Site Settings → Environment Variables, add:
- `NEXT_PUBLIC_SUPABASE_URL` (if using Supabase)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using Supabase)
- Any other environment variables your app needs

## Build Configuration

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node.js version**: 20.x
- **Functions directory**: `netlify/functions` (for serverless functions if needed)

## Features Enabled

### Security Headers
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

### Caching Strategy
- Static assets: 1 year cache
- Images: 1 week cache
- Dynamic content: No cache (handled by Next.js)

### Next.js Features
- ✅ Static Site Generation (SSG)
- ✅ Server-Side Rendering (SSR)
- ✅ Incremental Static Regeneration (ISR)
- ✅ API Routes
- ✅ Image Optimization (unoptimized mode for faster builds)
- ✅ Middleware support

## Performance Optimizations

1. **SWC Minification**: Faster builds and smaller bundles
2. **Standalone Output**: Reduced deployment size
3. **Smart Caching**: Aggressive caching for static assets
4. **Next.js Plugin**: Automatic optimization for Netlify's infrastructure

## Monitoring Deployment

### Build Logs
- Available in Netlify Dashboard → Deploys → [Select Deploy]
- Check for any build errors or warnings

### Deploy Previews
- Automatically created for pull requests
- Unique URL for each PR to test changes

### Production URL
- After successful deployment, your site will be available at:
  - `https://[your-site-name].netlify.app`
  - Or your custom domain if configured

## Common Issues & Solutions

### Build Failures
- Check Node.js version matches local development
- Ensure all dependencies are in `package.json`
- Review build logs for specific errors

### Environment Variables
- Make sure all required env vars are set in Netlify
- Use `NEXT_PUBLIC_` prefix for client-side variables

### 404 on Dynamic Routes
- The Next.js plugin handles this automatically
- If issues persist, check `netlify.toml` configuration

## Local Testing

Test the Netlify build locally:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build locally with Netlify settings
netlify build

# Serve the built site locally
netlify dev
```

## Support

- [Netlify Documentation](https://docs.netlify.com)
- [Next.js on Netlify](https://docs.netlify.com/frameworks/next-js)
- [Netlify Support](https://www.netlify.com/support)