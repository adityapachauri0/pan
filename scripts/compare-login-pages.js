const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function captureLoginPages() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('Capturing Click2leads login page (port 3006)...');
    try {
      await page.goto('http://localhost:3006/login', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await page.screenshot({
        path: '/Users/adityapachauri/Desktop/pan/screenshots/click2leads-login.png',
        fullPage: false
      });
      console.log('✓ Click2leads screenshot saved');
    } catch (error) {
      console.error('Failed to capture Click2leads:', error.message);
    }
    
    console.log('Capturing Panchroma login page (port 3000)...');
    try {
      await page.goto('http://localhost:3000/login', { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      // Wait for content to load
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await page.screenshot({
        path: '/Users/adityapachauri/Desktop/pan/screenshots/panchroma-login.png',
        fullPage: false
      });
      console.log('✓ Panchroma screenshot saved');
    } catch (error) {
      console.error('Failed to capture Panchroma:', error.message);
    }
    
  } finally {
    await browser.close();
  }
}

// Run the capture function
captureLoginPages().catch(console.error);