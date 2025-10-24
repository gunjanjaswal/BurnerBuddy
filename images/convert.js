const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Sizes for the icons
const sizes = [16, 48, 128];
const types = ['', '_waiting', '_new'];

// Load the SVG file
const svgPath = path.join(__dirname, 'icon.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Convert SVG to data URL
const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

async function generateIcons() {
  try {
    const img = await loadImage(svgDataUrl);
    
    for (const size of sizes) {
      for (const type of types) {
        const canvas = createCanvas(size, size);
        const ctx = canvas.getContext('2d');
        
        // Draw the base icon
        ctx.drawImage(img, 0, 0, size, size);
        
        if (type === '_waiting') {
          // Add a clock overlay for waiting icons
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.beginPath();
          ctx.arc(size * 0.75, size * 0.75, size * 0.25, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = '#4a6cf7';
          ctx.lineWidth = size * 0.05;
          ctx.beginPath();
          ctx.arc(size * 0.75, size * 0.75, size * 0.2, 0, Math.PI * 2);
          ctx.stroke();
          
          // Clock hands
          ctx.beginPath();
          ctx.moveTo(size * 0.75, size * 0.75);
          ctx.lineTo(size * 0.75, size * 0.6);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.moveTo(size * 0.75, size * 0.75);
          ctx.lineTo(size * 0.85, size * 0.75);
          ctx.stroke();
        } else if (type === '_new') {
          // Add a notification badge for new icons
          ctx.fillStyle = '#ff4d4d';
          ctx.beginPath();
          ctx.arc(size * 0.8, size * 0.2, size * 0.2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = 'white';
          ctx.font = `bold ${size * 0.25}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('1', size * 0.8, size * 0.2);
        }
        
        // Save the PNG file
        const buffer = canvas.toBuffer('image/png');
        const outputPath = path.join(__dirname, `icon${size}${type}.png`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`Generated: icon${size}${type}.png`);
      }
    }
    
    console.log('All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
