// Node.js script to convert SVG to PNG icons
// Run with: node create-icons.js
// Requires: npm install sharp

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (error) {
    console.log('Sharp not found. Install with: npm install sharp');
    console.log('Alternative: Use online SVG to PNG converters');
    process.exit(1);
}

const svgPath = path.join(__dirname, 'icons', 'icon-simple.svg');
const outputDir = path.join(__dirname, 'icons');

// Icon sizes needed for Chrome extension
const sizes = [16, 32, 48, 128];

async function createIcons() {
    try {
        // Read the SVG file
        const svgBuffer = fs.readFileSync(svgPath);
        
        console.log('Creating PNG icons from SVG...');
        
        // Create PNG icons for each size
        for (const size of sizes) {
            const outputPath = path.join(outputDir, `icon${size}.png`);
            
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            
            console.log(`✓ Created icon${size}.png`);
        }
        
        console.log('All icons created successfully!');
        console.log('You can now load the extension in Chrome.');
        
    } catch (error) {
        console.error('Error creating icons:', error);
        console.log('\nAlternative methods:');
        console.log('1. Use online SVG to PNG converters');
        console.log('2. Use image editing software like GIMP, Photoshop, or Inkscape');
        console.log('3. Use browser developer tools to export the SVG as PNG');
    }
}

// Manual instructions if sharp fails
function showManualInstructions() {
    console.log('\n=== Manual Icon Creation Instructions ===');
    console.log('1. Open icons/icon.svg in a web browser');
    console.log('2. Take a screenshot or use browser dev tools to save as PNG');
    console.log('3. Resize to create these files in the icons/ folder:');
    console.log('   - icon16.png (16x16 pixels)');
    console.log('   - icon32.png (32x32 pixels)');
    console.log('   - icon48.png (48x48 pixels)');
    console.log('   - icon128.png (128x128 pixels)');
    console.log('\nOnline converters:');
    console.log('- https://convertio.co/svg-png/');
    console.log('- https://cloudconvert.com/svg-to-png');
    console.log('- https://svg2png.com/');
}

// Run the script
if (require.main === module) {
    createIcons().catch(() => {
        showManualInstructions();
    });
} 