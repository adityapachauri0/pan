const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function debugLoginLayout() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Navigating to http://localhost:3000/login...');
        await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
        
        // Take full page screenshot
        console.log('📸 Taking full page screenshot...');
        await page.screenshot({ 
            path: '/Users/adityapachauri/Desktop/pan/scripts/login-page-screenshot.png', 
            fullPage: true 
        });
        
        // Get the page title
        const title = await page.title();
        console.log(`📄 Page title: ${title}`);
        
        // Check viewport size
        const viewport = page.viewportSize();
        console.log(`🖥️ Viewport: ${viewport.width}x${viewport.height}`);
        
        // Inspect DOM structure - look for layout elements
        console.log('\n🏗️ DOM Structure Analysis:');
        
        // Get body and its children
        const bodyStructure = await page.evaluate(() => {
            const body = document.body;
            const getElementInfo = (element, depth = 0) => {
                const indent = '  '.repeat(depth);
                const tag = element.tagName.toLowerCase();
                const classes = element.className ? `.${element.className.split(' ').join('.')}` : '';
                const id = element.id ? `#${element.id}` : '';
                const styles = window.getComputedStyle(element);
                
                let info = `${indent}<${tag}${id}${classes}>`;
                
                // Check for layout-affecting styles
                const layoutStyles = {
                    position: styles.position,
                    display: styles.display,
                    width: styles.width,
                    height: styles.height,
                    margin: styles.margin,
                    padding: styles.padding,
                    float: styles.float,
                    flexDirection: styles.flexDirection,
                    justifyContent: styles.justifyContent,
                    alignItems: styles.alignItems
                };
                
                // Only show non-default layout styles
                const relevantStyles = Object.entries(layoutStyles)
                    .filter(([key, value]) => value !== 'none' && value !== 'auto' && value !== '0px' && value !== 'normal' && value !== 'stretch')
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ');
                
                if (relevantStyles) {
                    info += ` [${relevantStyles}]`;
                }
                
                return info;
            };
            
            let result = [];
            result.push(getElementInfo(body));
            
            // Get all direct children of body
            Array.from(body.children).forEach(child => {
                result.push(getElementInfo(child, 1));
                
                // For React root, go one level deeper
                if (child.id === 'root' || child.classList.contains('App')) {
                    Array.from(child.children).forEach(grandchild => {
                        result.push(getElementInfo(grandchild, 2));
                    });
                }
            });
            
            return result.join('\n');
        });
        
        console.log(bodyStructure);
        
        // Look for specific layout elements
        console.log('\n🎯 Searching for layout elements:');
        
        const layoutElements = await page.evaluate(() => {
            const selectors = [
                '[class*="sidebar"]',
                '[class*="navigation"]', 
                '[class*="nav"]',
                '[class*="layout"]',
                '[class*="wrapper"]',
                '[class*="container"]',
                '[class*="main"]',
                '[class*="content"]'
            ];
            
            let found = [];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const styles = window.getComputedStyle(el);
                    found.push({
                        selector: selector,
                        element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ').join('.')}` : ''),
                        position: styles.position,
                        display: styles.display,
                        width: styles.width,
                        height: styles.height,
                        left: styles.left,
                        right: styles.right,
                        marginLeft: styles.marginLeft,
                        marginRight: styles.marginRight,
                        paddingLeft: styles.paddingLeft,
                        paddingRight: styles.paddingRight
                    });
                });
            });
            return found;
        });
        
        layoutElements.forEach(el => {
            console.log(`Found: ${el.element}`);
            console.log(`  Position: ${el.position}, Display: ${el.display}`);
            console.log(`  Width: ${el.width}, Height: ${el.height}`);
            console.log(`  Left: ${el.left}, Right: ${el.right}`);
            console.log(`  Margin L/R: ${el.marginLeft}/${el.marginRight}`);
            console.log(`  Padding L/R: ${el.paddingLeft}/${el.paddingRight}`);
            console.log('');
        });
        
        // Check specifically for login form and its positioning
        console.log('\n🔐 Login Form Analysis:');
        
        const loginFormInfo = await page.evaluate(() => {
            // Look for forms, login containers, etc.
            const selectors = [
                'form',
                '[class*="login"]',
                '[class*="auth"]',
                '[class*="signin"]',
                'input[type="email"]',
                'input[type="password"]',
                'input[type="text"]'
            ];
            
            let formElements = [];
            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const styles = window.getComputedStyle(el);
                    formElements.push({
                        selector: selector,
                        element: el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ').join('.')}` : ''),
                        position: {
                            left: rect.left,
                            top: rect.top,
                            width: rect.width,
                            height: rect.height
                        },
                        styles: {
                            position: styles.position,
                            display: styles.display,
                            marginLeft: styles.marginLeft,
                            marginRight: styles.marginRight,
                            textAlign: styles.textAlign,
                            justifyContent: styles.justifyContent,
                            alignItems: styles.alignItems
                        }
                    });
                });
            });
            
            return formElements;
        });
        
        loginFormInfo.forEach(el => {
            console.log(`${el.selector}: ${el.element}`);
            console.log(`  Screen Position: left=${el.position.left}px, top=${el.position.top}px`);
            console.log(`  Size: ${el.position.width}px x ${el.position.height}px`);
            console.log(`  CSS Position: ${el.styles.position}`);
            console.log(`  Display: ${el.styles.display}`);
            console.log(`  Text Align: ${el.styles.textAlign}`);
            console.log(`  Justify Content: ${el.styles.justifyContent}`);
            console.log(`  Align Items: ${el.styles.alignItems}`);
            console.log(`  Margin L/R: ${el.styles.marginLeft}/${el.styles.marginRight}`);
            console.log('');
        });
        
        // Get the HTML content for analysis
        console.log('\n📝 Saving page HTML for analysis...');
        const htmlContent = await page.content();
        fs.writeFileSync('/Users/adityapachauri/Desktop/pan/scripts/login-page-source.html', htmlContent);
        
        // Check computed styles on the main container
        console.log('\n🎨 Main Container Styles:');
        const mainContainerStyles = await page.evaluate(() => {
            // Look for the main app container
            const root = document.getElementById('root');
            const app = document.querySelector('.App') || document.querySelector('[class*="app"]');
            const main = document.querySelector('main') || document.querySelector('[class*="main"]');
            
            const containers = [root, app, main].filter(Boolean);
            
            return containers.map(container => {
                const styles = window.getComputedStyle(container);
                const rect = container.getBoundingClientRect();
                return {
                    element: container.tagName.toLowerCase() + (container.id ? `#${container.id}` : '') + (container.className ? `.${container.className.split(' ').join('.')}` : ''),
                    position: rect,
                    computedStyles: {
                        position: styles.position,
                        display: styles.display,
                        width: styles.width,
                        height: styles.height,
                        margin: styles.margin,
                        padding: styles.padding,
                        boxSizing: styles.boxSizing,
                        overflow: styles.overflow,
                        textAlign: styles.textAlign,
                        justifyContent: styles.justifyContent,
                        alignItems: styles.alignItems,
                        flexDirection: styles.flexDirection
                    }
                };
            });
        });
        
        mainContainerStyles.forEach(container => {
            console.log(`Container: ${container.element}`);
            console.log(`  Screen Position: ${container.position.left}, ${container.position.top}, ${container.position.width}x${container.position.height}`);
            Object.entries(container.computedStyles).forEach(([key, value]) => {
                console.log(`  ${key}: ${value}`);
            });
            console.log('');
        });
        
        console.log('\n✅ Analysis complete! Files saved:');
        console.log('  - Screenshot: /Users/adityapachauri/Desktop/pan/scripts/login-page-screenshot.png');
        console.log('  - HTML Source: /Users/adityapachauri/Desktop/pan/scripts/login-page-source.html');
        
    } catch (error) {
        console.error('❌ Error during analysis:', error);
    } finally {
        await browser.close();
    }
}

debugLoginLayout().catch(console.error);