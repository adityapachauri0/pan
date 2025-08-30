#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  environment: process.env.DEPLOY_ENV || 'production',
  branch: process.env.DEPLOY_BRANCH || 'main',
  buildDir: 'build',
  backupDir: 'backup',
  healthCheckUrl: process.env.HEALTH_CHECK_URL || 'https://panchroma.com',
  rollbackEnabled: process.env.ROLLBACK_ENABLED === 'true'
};

console.log(`🚀 Starting deployment to ${config.environment}...\n`);

async function deploy() {
  try {
    // Pre-deployment checks
    await preDeploymentChecks();
    
    // Backup current deployment (if exists)
    if (config.rollbackEnabled) {
      await createBackup();
    }
    
    // Build the application
    await buildApplication();
    
    // Run tests
    await runTests();
    
    // Deploy based on platform
    await deployToTarget();
    
    // Post-deployment verification
    await postDeploymentChecks();
    
    console.log('\n✅ Deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    if (config.rollbackEnabled) {
      console.log('🔄 Starting rollback...');
      await rollback();
    }
    
    process.exit(1);
  }
}

async function preDeploymentChecks() {
  console.log('🔍 Running pre-deployment checks...');
  
  // Check if build directory exists
  if (!fs.existsSync(config.buildDir)) {
    throw new Error(`Build directory ${config.buildDir} does not exist`);
  }
  
  // Check environment variables
  const requiredEnvVars = ['REACT_APP_BASE_URL'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
  
  // Check Git status
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim() && config.environment === 'production') {
      console.log('⚠️  Warning: Uncommitted changes detected');
    }
  } catch (error) {
    console.log('⚠️  Warning: Git not available or not a git repository');
  }
  
  console.log('✅ Pre-deployment checks passed');
}

async function createBackup() {
  console.log('💾 Creating backup...');
  
  if (fs.existsSync(config.backupDir)) {
    execSync(`rm -rf ${config.backupDir}`, { stdio: 'inherit' });
  }
  
  if (fs.existsSync(config.buildDir)) {
    execSync(`cp -r ${config.buildDir} ${config.backupDir}`, { stdio: 'inherit' });
    console.log('✅ Backup created');
  }
}

async function buildApplication() {
  console.log('🔨 Building application...');
  execSync('node scripts/build.js', { stdio: 'inherit' });
  console.log('✅ Build completed');
}

async function runTests() {
  console.log('🧪 Running tests...');
  try {
    execSync('npm run test -- --coverage --watchAll=false', { stdio: 'inherit' });
    console.log('✅ All tests passed');
  } catch (error) {
    throw new Error('Tests failed - deployment aborted');
  }
}

async function deployToTarget() {
  console.log(`🌐 Deploying to ${config.environment}...`);
  
  // Detect deployment target
  if (process.env.NETLIFY_SITE_ID) {
    await deployToNetlify();
  } else if (process.env.VERCEL_TOKEN) {
    await deployToVercel();
  } else if (process.env.AWS_ACCESS_KEY_ID) {
    await deployToS3();
  } else if (process.env.FTP_HOST) {
    await deployViaFTP();
  } else {
    console.log('📦 Build ready for manual deployment');
    console.log(`Deploy the contents of ${config.buildDir}/ to your web server`);
  }
}

async function deployToNetlify() {
  console.log('🌐 Deploying to Netlify...');
  
  if (!process.env.NETLIFY_AUTH_TOKEN || !process.env.NETLIFY_SITE_ID) {
    throw new Error('Missing Netlify credentials (NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID)');
  }
  
  execSync(`npx netlify-cli deploy --prod --dir=${config.buildDir} --site=${process.env.NETLIFY_SITE_ID}`, {
    stdio: 'inherit',
    env: { ...process.env, NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN }
  });
  
  console.log('✅ Deployed to Netlify');
}

async function deployToVercel() {
  console.log('🌐 Deploying to Vercel...');
  
  execSync(`npx vercel --prod --token=${process.env.VERCEL_TOKEN}`, {
    stdio: 'inherit'
  });
  
  console.log('✅ Deployed to Vercel');
}

async function deployToS3() {
  console.log('☁️  Deploying to AWS S3...');
  
  if (!process.env.AWS_S3_BUCKET) {
    throw new Error('Missing AWS_S3_BUCKET environment variable');
  }
  
  execSync(`aws s3 sync ${config.buildDir}/ s3://${process.env.AWS_S3_BUCKET} --delete`, {
    stdio: 'inherit'
  });
  
  // Invalidate CloudFront cache if configured
  if (process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID) {
    execSync(`aws cloudfront create-invalidation --distribution-id ${process.env.AWS_CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"`, {
      stdio: 'inherit'
    });
  }
  
  console.log('✅ Deployed to AWS S3');
}

async function deployViaFTP() {
  console.log('📁 Deploying via FTP...');
  
  const ftpScript = `
const ftp = require('basic-ftp');
const path = require('path');

async function deployFTP() {
  const client = new ftp.Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: process.env.FTP_SECURE === 'true'
    });
    
    await client.clearWorkingDir();
    await client.uploadFromDir('${config.buildDir}');
    console.log('✅ FTP deployment completed');
  } catch (error) {
    throw error;
  } finally {
    client.close();
  }
}

deployFTP().catch(console.error);
`;
  
  fs.writeFileSync('deploy-ftp.js', ftpScript);
  execSync('node deploy-ftp.js', { stdio: 'inherit' });
  fs.unlinkSync('deploy-ftp.js');
}

async function postDeploymentChecks() {
  console.log('🔍 Running post-deployment checks...');
  
  // Health check
  if (config.healthCheckUrl) {
    try {
      console.log(`🏥 Health check: ${config.healthCheckUrl}`);
      execSync(`curl -f -s --max-time 10 "${config.healthCheckUrl}" > /dev/null`, { stdio: 'inherit' });
      console.log('✅ Health check passed');
    } catch (error) {
      throw new Error(`Health check failed for ${config.healthCheckUrl}`);
    }
  }
  
  // Performance audit (optional)
  if (process.argv.includes('--audit')) {
    try {
      console.log('🔍 Running Lighthouse audit...');
      execSync(`npx lighthouse ${config.healthCheckUrl} --output=json --output-path=lighthouse-report.json --chrome-flags="--headless"`, {
        stdio: 'inherit'
      });
      console.log('✅ Performance audit completed (see lighthouse-report.json)');
    } catch (error) {
      console.log('⚠️  Performance audit failed (continuing anyway)');
    }
  }
}

async function rollback() {
  console.log('🔄 Rolling back to previous version...');
  
  if (!fs.existsSync(config.backupDir)) {
    throw new Error('No backup found for rollback');
  }
  
  if (fs.existsSync(config.buildDir)) {
    execSync(`rm -rf ${config.buildDir}`, { stdio: 'inherit' });
  }
  
  execSync(`mv ${config.backupDir} ${config.buildDir}`, { stdio: 'inherit' });
  
  // Re-deploy the backup
  await deployToTarget();
  
  console.log('✅ Rollback completed');
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Deployment interrupted');
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deployment terminated');
  process.exit(1);
});

// Start deployment
deploy();