# Deployment Guide - Netlify

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it: `casino-strategy-calculator` (or your preferred name)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **Create repository**

## Step 2: Push to GitHub

Run these commands in your terminal (from the `casino-strategy-calculator` directory):

```bash
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/casino-strategy-calculator.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note:** You may need to authenticate. GitHub may prompt for:
- Personal Access Token (recommended)
- Or use GitHub CLI: `gh auth login`

## Step 3: Deploy to Netlify

### Option A: Connect via GitHub (Recommended)

1. Go to [Netlify](https://www.netlify.com) and sign in (or create account)
2. Click **Add new site** → **Import an existing project**
3. Click **Deploy with GitHub**
4. Authorize Netlify to access your GitHub account
5. Select the `casino-strategy-calculator` repository
6. Netlify will auto-detect settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Click **Deploy site**
8. Wait 2-3 minutes for build to complete
9. Your site will be live at: `https://random-name-123.netlify.app`

**✅ Successfully Deployed!**

Live site: **[https://casino-strategy-app.netlify.app/](https://casino-strategy-app.netlify.app/)**

### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy (from casino-strategy-calculator directory)
netlify deploy --prod
```

### Option C: Drag & Drop

1. Build the project first:
   ```bash
   npm run build
   ```
2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag the `dist` folder onto the page
4. Your site is live instantly!

## Step 4: Custom Domain (Optional)

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions

## Step 5: Environment Variables (If Needed)

If you add any API keys or secrets later:
1. Go to **Site settings** → **Environment variables**
2. Add your variables
3. Redeploy the site

## Continuous Deployment

Once connected to GitHub, Netlify will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Show preview deployments for pull requests
- ✅ Run build checks before deploying

## Troubleshooting

**Build fails?**
- Check Netlify build logs
- Ensure `package.json` has correct build script
- Verify Node.js version (Netlify uses Node 18 by default)

**Site not loading?**
- Check that `netlify.toml` redirects are correct
- Verify `dist` folder contains `index.html`

**Need to change build settings?**
- Edit `netlify.toml` in your repo
- Or go to **Site settings** → **Build & deploy**

## Quick Commands Reference

```bash
# Build locally
npm run build

# Preview production build
npm run preview

# Deploy to Netlify (if using CLI)
netlify deploy --prod

# View Netlify status
netlify status
```

---

## ✅ Deployment Status

**Live Site:** [https://casino-strategy-app.netlify.app/](https://casino-strategy-app.netlify.app/)

**Repository:** [https://github.com/Cradcliff187/casino-strategy-calculator](https://github.com/Cradcliff187/casino-strategy-calculator)

**Status:** ✅ Successfully deployed and live!

---

**Your app is now live! 🎉**

Share the Netlify URL with anyone to use your casino calculator.

