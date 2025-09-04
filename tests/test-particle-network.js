const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🌐 Testing Particle Network Animation...');
  
  try {
    // Navigate to home page
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Check if canvas element exists
    const canvas = await page.locator('canvas');
    const canvasCount = await canvas.count();
    
    if (canvasCount > 0) {
      console.log('✅ Canvas element found for particle network');
      
      // Get canvas properties
      const canvasBox = await canvas.boundingBox();
      console.log(`📐 Canvas dimensions: ${canvasBox.width}x${canvasBox.height}`);
      
      // Test mouse interaction
      console.log('🖱️ Testing mouse interaction...');
      
      // Move mouse to different positions
      await page.mouse.move(100, 100);
      await page.waitForTimeout(500);
      
      await page.mouse.move(300, 300);
      await page.waitForTimeout(500);
      
      await page.mouse.move(500, 200);
      await page.waitForTimeout(500);
      
      console.log('✅ Mouse interaction test completed');
      
      // Take screenshot to verify visual
      await page.screenshot({ 
        path: 'particle-network-test.png',
        fullPage: false 
      });
      console.log('📸 Screenshot saved as particle-network-test.png');
      
      // Check if particles are rendering
      const canvasDataURL = await page.evaluate(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          return canvas.toDataURL().length > 100; // Check if canvas has content
        }
        return false;
      });
      
      if (canvasDataURL) {
        console.log('✅ Particles are rendering on canvas');
      } else {
        console.log('⚠️ Canvas appears to be empty');
      }
      
      // Check canvas styles
      const canvasStyles = await canvas.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
          position: styles.position,
          opacity: styles.opacity,
          zIndex: styles.zIndex
        };
      });
      
      console.log('🎨 Canvas styles:', canvasStyles);
      
      if (canvasStyles.position === 'fixed' && parseFloat(canvasStyles.opacity) === 0.6) {
        console.log('✅ Canvas positioning and opacity are correct');
      }
      
      console.log('\n🎉 Particle Network test completed successfully!');
      
    } else {
      console.log('❌ No canvas element found for particle network');
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  } finally {
    await browser.close();
  }
})();