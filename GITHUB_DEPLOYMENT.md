# GitHub Deployment Guide

## Quick Start: Push to GitHub

### Step 1: Initialize Git (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Track It PWA - Habit Tracker"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `track-it` or `habit-tracker`)
3. **Don't** initialize with README (we already have files)
4. Copy the repository URL

### Step 3: Connect and Push

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Deploy to GitHub Pages (Free Hosting)

### Option 1: GitHub Pages (Simple)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Install gh-pages package:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Add deploy script to package.json:**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages:**
   - Go to your repo → Settings → Pages
   - Source: `gh-pages` branch
   - Your app will be at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Option 2: Vercel (Recommended - Better for PWAs)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   - Follow prompts (defaults are fine)
   - Your app will be at: `https://YOUR_REPO_NAME.vercel.app`

3. **Auto-deploy from GitHub:**
   - Connect GitHub repo to Vercel
   - Every push auto-deploys

### Option 3: Netlify (Also Great for PWAs)

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Or use Netlify web UI:**
   - Connect GitHub repo
   - Build command: `npm run build`
   - Publish directory: `dist`

---

## Important: Update Base Path for GitHub Pages

If using GitHub Pages (not Vercel/Netlify), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/YOUR_REPO_NAME/', // Add this line
  plugins: [react()],
  // ... rest of config
})
```

**Vercel and Netlify don't need this** - they handle routing automatically.

---

## After Deployment: Install on iPhone

1. **Get your deployed URL** (e.g., `https://your-app.vercel.app`)

2. **On iPhone:**
   - Open Safari (not Chrome!)
   - Navigate to your URL
   - Tap Share button (square with arrow)
   - Scroll down → "Add to Home Screen"
   - Customize name → "Add"
   - App icon appears on home screen

3. **Test:**
   - Tap the icon
   - Should open full-screen
   - Should work offline (after first load)
   - Data persists locally

---

## Troubleshooting

### Service Worker Not Working
- Must be served over HTTPS (GitHub Pages, Vercel, Netlify all provide this)
- Check browser console for errors

### Icons Not Showing
- Ensure `icon-192.png` and `icon-512.png` exist in `public/` folder
- See `public/ICON_GENERATION.md` for help

### Routing Not Working (404s)
- GitHub Pages: Need base path in vite.config.ts
- Vercel/Netlify: Should work automatically

---

## Recommended: Vercel

**Why Vercel:**
- ✅ Free HTTPS
- ✅ Automatic deployments
- ✅ Great PWA support
- ✅ No base path issues
- ✅ Fast CDN
- ✅ Easy custom domain

**Quick Deploy:**
```bash
npm i -g vercel
vercel
```

That's it! Your app is live.
