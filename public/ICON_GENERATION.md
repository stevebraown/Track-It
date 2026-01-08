# Icon Generation

The PWA requires PNG icons at 192x192 and 512x512 pixels.

## Quick Option: Use an Online Tool

1. Create or find a 512x512 icon image
2. Use an online tool like https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
3. Download the generated icons
4. Place them in the `public/` folder as:
   - `icon-192.png` (192x192)
   - `icon-512.png` (512x512)

## Manual Creation

You can use any image editor to create icons:
- Recommended size: 512x512 (square)
- Format: PNG with transparency
- Design: Simple, recognizable icon representing habit tracking
- The app will scale down to 192x192 automatically

## Using the HTML Generator

1. Open `scripts/generate-icons.html` in a browser
2. Click the generate buttons
3. Icons will download automatically
4. Move them to the `public/` folder

## Current Status

For development, the app will work without icons, but for production/PWA installation, you'll need proper PNG icons.
