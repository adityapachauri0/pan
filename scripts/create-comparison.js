const sharp = require('sharp');
const fs = require('fs').promises;

async function createSideBySideComparison() {
  try {
    // Load both images
    const click2leadsImage = sharp('/Users/adityapachauri/Desktop/pan/screenshots/click2leads-login.png');
    const panchromaImage = sharp('/Users/adityapachauri/Desktop/pan/screenshots/panchroma-login.png');
    
    // Get metadata to determine dimensions
    const click2leadsMetadata = await click2leadsImage.metadata();
    const panchromaMetadata = await panchromaImage.metadata();
    
    const maxHeight = Math.max(click2leadsMetadata.height, panchromaMetadata.height);
    const totalWidth = click2leadsMetadata.width + panchromaMetadata.width + 20; // 20px gap
    
    // Resize images to same height if needed
    const resizedClick2leads = click2leadsImage.resize({ height: maxHeight });
    const resizedPanchroma = panchromaImage.resize({ height: maxHeight });
    
    // Create a new image with both screenshots side by side
    const comparison = sharp({
      create: {
        width: totalWidth,
        height: maxHeight,
        channels: 4,
        background: { r: 30, g: 30, b: 30, alpha: 1 }
      }
    })
    .composite([
      {
        input: await resizedClick2leads.png().toBuffer(),
        left: 0,
        top: 0
      },
      {
        input: await resizedPanchroma.png().toBuffer(),
        left: click2leadsMetadata.width + 20,
        top: 0
      }
    ])
    .png();
    
    await comparison.toFile('/Users/adityapachauri/Desktop/pan/screenshots/login-comparison.png');
    console.log('✓ Side-by-side comparison created successfully');
    
  } catch (error) {
    console.error('Failed to create comparison:', error.message);
  }
}

createSideBySideComparison();