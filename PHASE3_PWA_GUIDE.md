# Phase 3: PWA Features Guide

## What Was Added

### 1. PWA Manifest (`public/manifest.json`)
- App metadata (name, description, theme colors)
- Icons configuration
- Display mode (standalone - feels like native app)
- App shortcuts (quick access to Today and Habits)

### 2. Service Worker (`public/sw.js`)
- Offline support: caches app files
- Cache management: automatically updates when app changes
- Notification handling: manages notification clicks

### 3. Notification System
- Permission request flow
- Local notifications for habit reminders
- Settings page integration
- Automatic reminder checking

### 4. Install Prompt
- Detects when app can be installed
- Shows install banner on Today page
- One-click installation

### 5. Settings Page Enhancements
- Notification permission management
- Data export (backup to JSON file)
- Data import (restore from backup)
- Clear all data option

## Testing PWA Features

### 1. Install the App

**Chrome/Edge:**
1. Look for install icon in address bar
2. Or use the install prompt on the Today page
3. Click "Install"
4. App will open in standalone window

**Safari (iOS):**
1. Tap Share button
2. Select "Add to Home Screen"
3. App will appear on home screen

**Firefox:**
1. Look for install icon in address bar
2. Click to install

### 2. Test Offline Support

1. Install the app
2. Open DevTools → Network tab
3. Check "Offline" checkbox
4. Refresh the app
5. App should still work (cached files)

### 3. Test Notifications

1. Go to Settings page
2. Click "Enable Notifications"
3. Allow permission when prompted
4. Create a habit with a reminder time
5. Wait for the reminder time (or set it to current time + 1 minute)
6. Notification should appear

**Note:** Browser notifications have limitations:
- Can only schedule while app is open
- For true scheduled notifications, you'd need Web Push API with a backend
- Current implementation checks every minute while app is open

### 4. Test Data Export/Import

**Export:**
1. Go to Settings
2. Click "Export Data"
3. JSON file downloads with all your data

**Import:**
1. Go to Settings
2. Click "Choose File" under Import
3. Select previously exported JSON file
4. Data should restore and page reloads

### 5. Test Service Worker

1. Open DevTools → Application tab
2. Go to "Service Workers" section
3. Should see service worker registered
4. Check "Offline" to test caching
5. Check "Update on reload" to see updates

## Icon Requirements

The app needs PNG icons for proper PWA installation:
- `public/icon-192.png` (192x192)
- `public/icon-512.png` (512x512)

See `public/ICON_GENERATION.md` for instructions on creating icons.

## Limitations & Notes

### Notifications
- **Current:** Notifications work while app is open, checked every minute
- **Future:** For true scheduled notifications, implement Web Push API with backend service
- **Workaround:** Users can set reminder times and get notifications when app is open

### Offline Support
- **Current:** Basic caching of app files
- **Future:** Could add IndexedDB sync, background sync for data

### Browser Support
- **Full Support:** Chrome, Edge, Firefox (desktop)
- **Partial:** Safari (iOS - can install, limited PWA features)
- **Notifications:** Varies by browser and OS

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure you're using HTTPS (or localhost)
- Clear browser cache and reload

### Install Prompt Not Showing
- App must meet PWA criteria (manifest, service worker, HTTPS)
- Some browsers only show on certain conditions
- Try using the install button in Settings

### Notifications Not Working
- Check permission status in Settings
- Ensure browser supports notifications
- Some browsers block notifications on HTTP (need HTTPS)

### Icons Missing
- App will work but may not install properly
- Generate icons using instructions in `public/ICON_GENERATION.md`

## Next Steps (Phase 4)

- Enhanced design polish
- Better icon design
- Advanced notification scheduling (if backend added)
- Additional PWA features (share target, etc.)
