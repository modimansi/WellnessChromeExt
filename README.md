# 🌿 Wellness Break Assistant

A comprehensive Chrome extension designed to promote mental wellness through nature connection, mindful journaling, and smart break reminders.

## Features

### 🌳 Nature Connection & Journaling
- **Find Nature Nearby**: Enter your city and discover real parks, trails, gardens, and green spaces
- **Multiple Location Types**: Parks, gardens, trails, forests, lakes, rivers, beaches, botanical gardens
- **Real-time Search**: Uses OpenStreetMap API to find actual nearby locations
- **Google Maps Integration**: Click "View on Map" to open locations in Google Maps
- **Mindful Journaling**: Write reflective entries with thoughtful prompts like:
  - "Write about your childhood tree"
  - "How do you feel connected to this land?"
  - "What in nature speaks to you today?"

### ⏰ Smart Break Reminders
- **Customizable Intervals**: Pomodoro-style (25 min) or custom intervals (30 min - 2 hours)
- **Multiple Break Types**: Stretch, breathe, hydrate, move, rest eyes, gratitude
- **Intelligent Notifications**: Random activity suggestions with snooze options

### 🧘 Wellness Activities

#### Breathing Exercises
- **4-7-8 Technique**: Inhale for 4, hold for 7, exhale for 8
- **Box Breathing**: 4-4-4-4 pattern for balanced breathing
- **Animated Visual Guide**: Breathing circle that guides your rhythm

#### Desk Stretches
- **Quick 1-minute stretches**: Neck rolls, shoulder shrugs, wrist circles
- **Illustrated instructions**: Clear, simple guidance for each stretch
- **Perfect for desk workers**: Designed for office environments

#### Hydration Tracker
- **Daily water logging**: Click to track glasses of water
- **Goal tracking**: 8 glasses daily target
- **Gentle reminders**: Stay hydrated throughout the day

#### Gratitude Prompts
- **Random prompts**: "What's one good thing right now?"
- **Reflection journaling**: Save your gratitude moments
- **Mood boosting**: Regular positive thinking practice

## Installation

### Method 1: Developer Mode (Recommended for now)

1. **Download the extension files**:
   - Download all files from this repository
   - Ensure you have: `manifest.json`, `popup.html`, `popup.js`, `background.js`, `content.js`, `styles.css`

2. **Create PNG icons** (required):
   
   **Method A - HTML Canvas (Recommended):**
   - Open `create-icons-canvas.html` in your browser
   - Click "Generate Icons" 
   - Right-click each icon and "Save image as..." with correct names:
     - `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
   - Place all PNG files in the `icons/` folder
   
   **Method B - Node.js (if you have Node installed):**
   ```bash
   npm install
   npm run create-icons
   ```
   
   **Method C - Online converters:**
   - Use the `icons/icon-simple.svg` file
   - Convert to PNG at: https://convertio.co/svg-png/
   - Create sizes: 16x16, 32x32, 48x48, 128x128 pixels

3. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

4. **Pin the extension**:
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "Wellness Break Assistant" and click the pin icon
   - The extension icon will now appear in your toolbar

## Usage

### Getting Started

1. **Click the extension icon** in your Chrome toolbar
2. **Choose your feature**:
   - **Nature & Journal**: Find nearby nature spots and write mindful entries
   - **Smart Breaks**: Set up break reminders and access wellness activities

### Nature Connection

1. Enter your city in the text field (e.g., "New York, NY" or "Los Angeles, CA")
2. Click "Find Nature Nearby" to discover local parks, trails, and green spaces
3. Browse real nearby locations with distances and descriptions
4. **View on Map**: Click "🗺️ View on Map" to open the location in Google Maps
5. **Journal**: Click "📝 Journal Here" to receive a mindful journaling prompt
6. Write your reflection and save it for future reference

### Smart Break Reminders

1. **Set up reminders**:
   - Choose your preferred interval (25 min - 2 hours)
   - Click "Enable Reminders" to start
   - Receive notifications at your chosen intervals

2. **Take breaks**:
   - Click on any activity icon (breathe, stretch, hydrate, etc.)
   - Follow the guided instructions
   - Return to work refreshed and focused

### Breathing Exercises

1. Click the "Breathe" activity
2. Choose your technique (4-7-8 or Box Breathing)
3. Click "Start" and follow the animated circle
4. Breathe in sync with the visual guide

### Hydration Tracking

1. Click the "Hydrate" activity
2. Log water by clicking "💧 Log Water"
3. Track your progress toward the daily goal
4. Receive gentle reminders throughout the day

## Privacy & Data

- **City searches**: Used only to find nearby nature spots (not stored)
- **Journal entries**: Stored locally in your browser
- **Water tracking**: Stored locally in your browser
- **API calls**: Made to OpenStreetMap (free, open-source mapping service)
- **No data sharing**: All personal information stays on your device

## Permissions Explained

- **Storage**: Save your journal entries and preferences
- **Notifications**: Send break reminders and wellness tips
- **Alarms**: Schedule break reminders
- **Tabs**: Open Google Maps in new tabs when viewing locations
- **Host permissions**: Access OpenStreetMap API to find nearby nature spots
- **Active Tab**: Future enhancement for smart suggestions

## Troubleshooting

### Extension not working?
1. Check that all files are in the correct folder
2. Ensure PNG icons are created and in the `icons/` folder
3. Refresh the extension in `chrome://extensions/`
4. Check the browser console for any errors

### Google Maps not opening?
1. Make sure you've reloaded the extension after adding the new code
2. Check that the extension has "tabs" permission
3. Ensure your browser allows pop-ups for the extension
4. Try clicking "View on Map" again after a few seconds

### Icon creation failing?
1. **Use the HTML method**: Open `create-icons-canvas.html` in your browser
2. **Sharp issues**: Try `npm install sharp@latest` or use online converters
3. **SVG problems**: Use the simplified `icon-simple.svg` file
4. **Manual creation**: Create 16x16, 32x32, 48x48, and 128x128 PNG files from any SVG

### Can't find nature spots?
1. Try entering a more specific city name (e.g., "Boston, MA" instead of just "Boston")
2. Check your internet connection
3. Try a nearby larger city if your town is very small
4. Make sure you're using the correct city name spelling

### Break reminders not working?
1. Ensure notifications are enabled in Chrome
2. Check that the extension has notification permissions
3. Try disabling and re-enabling reminders

## API Configuration

The extension currently uses **OpenStreetMap Nominatim** (free, no API key required) for finding nature spots. You can upgrade to more powerful APIs:

### Current Setup (OpenStreetMap)
- ✅ **Free and works immediately**
- ✅ **No API key required**
- ✅ **Good coverage of parks and natural areas**
- ⚠️ **Rate limited to 1 request per second**

### Upgrade Options

**Google Places API** (Most Comprehensive):
- More accurate results and detailed information
- Requires API key (~$17 per 1000 requests)
- Best for production use
- Setup instructions in `api-config.js`

**Foursquare API** (Good Free Tier):
- 1000 free requests per day
- Good for business-focused locations
- Requires API key
- Setup instructions in `api-config.js`

To upgrade: Edit `api-config.js` and follow the setup instructions for your chosen provider.

## Future Enhancements

- **Stress detection**: Monitor browsing patterns for stress indicators
- **Progress tracking**: Long-term wellness analytics
- **Community features**: Share favorite nature spots
- **Accessibility improvements**: Screen reader support and keyboard navigation
- **Offline caching**: Save frequently searched locations

## Contributing

We welcome contributions! Areas for improvement:
- Better nature spot discovery (Google Places API, OpenStreetMap)
- Enhanced breathing animations
- More stretch illustrations
- Accessibility features
- Mobile responsiveness

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues or suggestions:
1. Check the troubleshooting section above
2. Review the browser console for error messages
3. Create an issue with detailed steps to reproduce

---

**Stay mindful, stay healthy! 🌿** 