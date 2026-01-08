# Track It - Habit Tracker PWA

A beautiful, client-side-only habit tracker Progressive Web App built with TypeScript, React, and modern web technologies.

## 🌐 Live App

**Try it now:** [https://track-it-omega-jet.vercel.app/](https://track-it-omega-jet.vercel.app/)

Install on your iPhone: Open the link in Safari → Share → "Add to Home Screen"

## ✨ Features

- ✅ **Habit Management** - Create, edit, and delete habits with custom cadences
- ✅ **Daily Tracking** - Check off habits and track your progress
- ✅ **History & Insights** - View streaks, statistics, and completion rates
- ✅ **Daily Reflections** - Write and save daily reflections
- ✅ **PWA Support** - Install on iOS/Android, works offline
- ✅ **Dark Mode** - Beautiful light/dark theme
- ✅ **Data Export/Import** - Backup and restore your data
- ✅ **100% Local** - All data stored on your device, no accounts needed

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy & Install on iPhone

**See `QUICK_START.md` for the fastest path!**

1. **Deploy to Vercel** (recommended):
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Install on iPhone**:
   - Open Safari → Navigate to your app URL
   - Tap Share → "Add to Home Screen"
   - Done! 🎉

**Full guides:**
- `QUICK_START.md` - Fastest path to get running
- `GITHUB_DEPLOYMENT.md` - Deployment options
- `IOS_SETUP.md` - iOS-specific setup and testing
- `INSTALLATION_GUIDE.md` - PWA vs Native app explanation

## 📱 Installation Paths

### Path 1: PWA Install (Recommended) ✅

**iOS:**
- Safari → Share → Add to Home Screen
- Full-screen experience, offline support, local data

**Android:**
- Chrome → Menu → Add to Home Screen / Install App
- Same great PWA experience

### Path 2: Native Wrapper (Optional - Phase 5)

- Android APK via PWABuilder/Bubblewrap
- iOS IPA via Capacitor (advanced, out of scope for now)
- See `INSTALLATION_GUIDE.md` for details

## 🏗️ Project Structure

```
src/
  components/     # Reusable UI components
  contexts/       # React contexts (Theme)
  pages/          # Route pages (Today, Habits, History, Settings)
  stores/         # Zustand state stores
  types/          # TypeScript type definitions
  utils/          # Utility functions (date, habit, storage, statistics)
  hooks/          # Custom React hooks
public/
  manifest.json   # PWA manifest
  sw.js          # Service worker
```

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router** for routing
- **Zustand** for state management
- **Tailwind CSS** with custom design tokens
- **Lucide React** for icons
- **localStorage** for data persistence
- **Service Worker** for offline support

## 📚 Documentation

- `QUICK_START.md` - Get started in 5 minutes
- `INSTALLATION_GUIDE.md` - PWA vs Native apps explained
- `GITHUB_DEPLOYMENT.md` - Deployment options (Vercel, Netlify, GitHub Pages)
- `IOS_SETUP.md` - iOS-specific setup and testing
- `PHASE3_PWA_GUIDE.md` - PWA features documentation
- `TESTING_CHECKLIST.md` - Testing guide
- `public/ICON_GENERATION.md` - How to create app icons

## 🎯 Phases Completed

- ✅ **Phase 1** - MVP Core (habits, tracking, reflections)
- ✅ **Phase 2** - History & Insights (streaks, statistics)
- ✅ **Phase 3** - PWA Features (install, offline, notifications)
- ✅ **Phase 4** - Design Polish (UI refinements, Lucide React icons)
- 🔜 **Phase 5** - Android APK Packaging (optional)

## 📝 Notes

- **Icons:** App works without icons, but proper PNG icons recommended (see `public/ICON_GENERATION.md`)
- **Notifications:** Work while app is open (true scheduled notifications require backend)
- **Data:** All stored locally - export regularly for backup
- **iOS:** Best experience via Safari "Add to Home Screen"

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

## 📄 License

MIT (or your preferred license)

---

**Built with ❤️ using React, TypeScript, and modern web standards.**
