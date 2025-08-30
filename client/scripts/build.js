#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting production build...\n');

// Clean previous build
console.log('🧹 Cleaning previous build...');
if (fs.existsSync('build')) {
  execSync('rm -rf build', { stdio: 'inherit' });
}

// Environment setup
process.env.NODE_ENV = 'production';
process.env.GENERATE_SOURCEMAP = 'true';

try {
  // Build the application
  console.log('📦 Building React application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Optimize images (if imagemin is available)
  console.log('🖼️  Optimizing images...');
  try {
    execSync('npx imagemin build/static/media/*.{jpg,png,svg} --out-dir=build/static/media', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Image optimization skipped (imagemin not available)');
  }

  // Generate sitemap
  console.log('🗺️  Generating sitemap...');
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join('build', 'sitemap.xml'), sitemap);

  // Generate manifest and service worker
  console.log('📱 Generating PWA files...');
  generateManifest();
  generateServiceWorker();

  // Bundle analysis (optional)
  if (process.argv.includes('--analyze')) {
    console.log('📊 Analyzing bundle size...');
    execSync('npx webpack-bundle-analyzer build/static/js/*.js', { stdio: 'inherit' });
  }

  // Security headers for deployment
  console.log('🔒 Generating security headers...');
  generateSecurityHeaders();

  console.log('\n✅ Production build completed successfully!');
  console.log('\nBuild artifacts:');
  console.log('📂 build/ - Static files ready for deployment');
  console.log('📄 build/sitemap.xml - SEO sitemap');
  console.log('📱 build/manifest.json - PWA manifest');
  console.log('🔒 build/_headers - Security headers (Netlify)');
  console.log('🔒 build/.htaccess - Security headers (Apache)');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

function generateSitemap() {
  const baseUrl = process.env.REACT_APP_BASE_URL || 'https://panchroma.com';
  
  const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'weekly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/portfolio', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
</urlset>`;
}

function generateManifest() {
  const manifest = {
    "short_name": "Panchroma",
    "name": "Panchroma - Web Development & Digital Marketing",
    "description": "Premium web development and digital marketing solutions",
    "icons": [
      {
        "src": "/favicon-192x192.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/favicon-512x512.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ],
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#10B981",
    "background_color": "#050709",
    "orientation": "portrait-primary",
    "categories": ["business", "productivity"],
    "lang": "en",
    "dir": "ltr"
  };
  
  fs.writeFileSync(
    path.join('build', 'manifest.json'), 
    JSON.stringify(manifest, null, 2)
  );
}

function generateServiceWorker() {
  const sw = `
const CACHE_NAME = 'panchroma-v1.0.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
`;
  
  fs.writeFileSync(path.join('build', 'sw.js'), sw);
}

function generateSecurityHeaders() {
  // Netlify _headers file
  const netlifyHeaders = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; media-src 'self';
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  
/static/*
  Cache-Control: public, max-age=31536000, immutable`;

  fs.writeFileSync(path.join('build', '_headers'), netlifyHeaders);

  // Apache .htaccess file
  const htaccess = `# Security Headers
Header always set X-Frame-Options "DENY"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"

# Cache Control
<filesMatch "\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</filesMatch>

# Gzip Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE application/xhtml+xml
  AddOutputFilterByType DEFLATE application/rss+xml
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Rewrite Rules for SPA
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>`;

  fs.writeFileSync(path.join('build', '.htaccess'), htaccess);
}