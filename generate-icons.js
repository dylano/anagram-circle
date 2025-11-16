import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG to PNG approach - create SVG files that can be converted
// Or we'll use a canvas library if available

// Colors from the app
const bgColor = '#c8e6c9';
const circleColor = '#81c784';
const textColor = '#2c3e50';
const borderColor = '#34495e';

function createSVGIcon(size) {
  const fontSize = size * 0.5;
  const radius = size * 0.35;
  const center = size / 2;
  const strokeWidth = size * 0.02;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  
  <!-- Circle -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="${circleColor}" stroke="${borderColor}" stroke-width="${strokeWidth}"/>
  
  <!-- Letter A -->
  <text x="${center}" y="${center}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="${fontSize}" font-weight="bold" fill="${textColor}" text-anchor="middle" dominant-baseline="central">A</text>
</svg>`;
}

// Create SVG files
const publicDir = path.join(__dirname, 'public');

// Create 192x192 SVG
fs.writeFileSync(
  path.join(publicDir, 'icon-192.svg'),
  createSVGIcon(192)
);

// Create 512x512 SVG
fs.writeFileSync(
  path.join(publicDir, 'icon-512.svg'),
  createSVGIcon(512)
);

console.log('SVG icons created! Converting to PNG...');

// Convert SVG to PNG using sharp
import sharp from 'sharp';

async function generateIcons() {
  try {
    // Convert 192x192 SVG to PNG
    await sharp(path.join(publicDir, 'icon-192.svg'))
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));
    console.log('✓ icon-192.png created');
    
    // Convert 512x512 SVG to PNG
    await sharp(path.join(publicDir, 'icon-512.svg'))
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));
    console.log('✓ icon-512.png created');
    
    console.log('\n✓ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();

