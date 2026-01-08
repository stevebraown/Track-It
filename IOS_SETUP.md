# iOS Setup & Testing Guide

## Quick Start: Get App on iPhone

### Step 1: Deploy Your App

Choose one deployment option (see `GITHUB_DEPLOYMENT.md`):

**Recommended: Vercel (Easiest)**
```bash
npm i -g vercel
vercel
```
Your app will be live at: `https://your-app.vercel.app`

### Step 2: Install on iPhone

1. **Open Safari on iPhone** (not Chrome - Safari only!)
2. **Navigate to your app URL** (e.g., `https://your-app.vercel.app`)
3. **Tap the Share button** (square icon with arrow pointing up)
4. **Scroll down** and tap **"Add to Home Screen"**
5. **Customize the name** if you want (default: "Track It")
6. **Tap "Add"** in top right
7. **Done!** App icon appears on your home screen

### Step 3: Test the Installation

1. **Tap the app icon** on home screen
2. **Should open full-screen** (no Safari UI)
3. **Should work offline** (after first load)
4. **Data persists** between sessions

---

## iOS-Specific Features

### What Works on iOS

✅ **Full-screen mode** - No browser UI when installed
✅ **Offline support** - Service worker caches files
✅ **Local storage** - All data stored locally
✅ **App icon** - Custom icon on home screen
✅ **Standalone mode** - Feels like native app
✅ **Theme colors** - Status bar matches app theme

### iOS Limitations

⚠️ **Notifications** - Limited support (only while app is open)
⚠️ **Background sync** - Not available
⚠️ **Push notifications** - Requires native app wrapper
⚠️ **Some PWA features** - Restricted by Apple

**For your use case:** These limitations are fine! The app works great as a PWA on iOS.

---

## Testing Checklist

### Basic Functionality
- [ ] App opens from home screen icon
- [ ] Opens in full-screen (no Safari UI)
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Theme toggle works

### Data Persistence
- [ ] Create a habit → Close app → Reopen → Habit still there
- [ ] Check off habits → Close app → Reopen → Status preserved
- [ ] Write reflection → Close app → Reopen → Reflection saved

### Offline Support
- [ ] Load app once (online)
- [ ] Turn on Airplane Mode
- [ ] App should still work
- [ ] Can view habits, check them off
- [ ] Data saves locally (syncs when back online)

### Visual
- [ ] App looks good on iPhone screen
- [ ] No layout issues on notched devices
- [ ] Touch targets are large enough
- [ ] Text is readable

---

## Troubleshooting

### "Add to Home Screen" Not Showing
- **Make sure you're using Safari** (not Chrome or other browsers)
- App must be served over HTTPS (Vercel/Netlify/GitHub Pages all provide this)
- Try refreshing the page

### App Opens in Safari Instead of Standalone
- Clear Safari cache
- Remove from home screen and re-add
- Check that manifest.json is accessible

### Offline Not Working
- Load the app at least once while online
- Service worker needs to register first
- Check browser console for service worker errors

### Icons Not Showing
- Ensure `icon-192.png` and `icon-512.png` exist in `public/` folder
- Icons must be PNG format
- See `public/ICON_GENERATION.md` for help creating icons

### Layout Issues on iPhone
- App should handle safe areas automatically
- If you see issues, check that viewport meta tag includes `viewport-fit=cover`

---

## Pro Tips

1. **Bookmark the URL** - Easy access if you need to re-add to home screen
2. **Test on different iPhones** - If possible, test on different screen sizes
3. **Clear cache if needed** - Settings → Safari → Clear History and Website Data
4. **Check iOS version** - PWA features work best on iOS 11.3+

---

## Next Steps

Once installed and working:
- ✅ Start using it daily!
- ✅ Export your data regularly (Settings → Export Data)
- ✅ Share with others if you want (they can install too)

**Android Packaging:** Only if you want to experiment later (see Phase 5 in `INSTALLATION_GUIDE.md`)
