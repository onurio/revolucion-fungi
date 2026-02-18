#!/usr/bin/env tsx
/**
 * Main build script for static landing pages
 * Orchestrates CSS building, React pre-rendering, and HTML injection
 */

import { buildCSS } from './build-static-css';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('🚀 Building static landing pages...\n');

  try {
    // Step 1: Build CSS with Tailwind
    console.log('Step 1: Building CSS...');
    const cssPath = await buildCSS();
    console.log(`✅ CSS built: ${cssPath}\n`);

    // Step 2: Copy public assets to build directory
    console.log('Step 2: Copying public assets...');
    const publicDir = path.join(process.cwd(), 'public');
    const buildClientDir = path.join(process.cwd(), 'build', 'client');

    // Copy info-bg.jpg if it exists
    const infoBgPath = path.join(publicDir, 'info-bg.jpg');
    if (fs.existsSync(infoBgPath)) {
      fs.copyFileSync(infoBgPath, path.join(buildClientDir, 'info-bg.jpg'));
      console.log('   ✓ Copied: info-bg.jpg');
    }

    // Copy info-bg-new.jpg if it exists
    const infoBgNewPath = path.join(publicDir, 'info-bg-new.jpg');
    if (fs.existsSync(infoBgNewPath)) {
      fs.copyFileSync(infoBgNewPath, path.join(buildClientDir, 'info-bg-new.jpg'));
      console.log('   ✓ Copied: info-bg-new.jpg');
    }

    // Copy contact-bg.jpg if it exists
    const contactBgPath = path.join(publicDir, 'contact-bg.jpg');
    if (fs.existsSync(contactBgPath)) {
      fs.copyFileSync(contactBgPath, path.join(buildClientDir, 'contact-bg.jpg'));
      console.log('   ✓ Copied: contact-bg.jpg');
    }

    // Copy og-image.jpg if it exists
    const ogImagePath = path.join(publicDir, 'og-image.jpg');
    if (fs.existsSync(ogImagePath)) {
      fs.copyFileSync(ogImagePath, path.join(buildClientDir, 'og-image.jpg'));
      console.log('   ✓ Copied: og-image.jpg');
    }

    // Copy partner_logos/clean folder
    const partnerLogosDir = path.join(publicDir, 'partner_logos', 'clean');
    if (fs.existsSync(partnerLogosDir)) {
      const buildPartnerDir = path.join(buildClientDir, 'partner_logos', 'clean');
      if (!fs.existsSync(buildPartnerDir)) {
        fs.mkdirSync(buildPartnerDir, { recursive: true });
      }
      const logoFiles = fs.readdirSync(partnerLogosDir);
      logoFiles.forEach(file => {
        fs.copyFileSync(path.join(partnerLogosDir, file), path.join(buildPartnerDir, file));
      });
      console.log(`   ✓ Copied: partner_logos/clean/ (${logoFiles.length} files)`);
    }

    // Copy festival-poster.jpg if it exists
    const festivalPosterPath = path.join(publicDir, 'festival-poster.jpg');
    if (fs.existsSync(festivalPosterPath)) {
      fs.copyFileSync(festivalPosterPath, path.join(buildClientDir, 'festival-poster.jpg'));
      console.log('   ✓ Copied: festival-poster.jpg');
    }

    // Copy fonts folder if it exists
    const fontsDir = path.join(publicDir, 'fonts');
    if (fs.existsSync(fontsDir)) {
      const buildFontsDir = path.join(buildClientDir, 'fonts');
      if (!fs.existsSync(buildFontsDir)) {
        fs.mkdirSync(buildFontsDir, { recursive: true });
      }
      const fontFiles = fs.readdirSync(fontsDir);
      fontFiles.forEach(file => {
        fs.copyFileSync(path.join(fontsDir, file), path.join(buildFontsDir, file));
      });
      console.log(`   ✓ Copied: fonts/ (${fontFiles.length} files)`);
    }

    // Copy activities folder recursively
    const activitiesDir = path.join(publicDir, 'activities');
    if (fs.existsSync(activitiesDir)) {
      const buildActivitiesDir = path.join(buildClientDir, 'activities');

      function copyRecursiveSync(src: string, dest: string): number {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const entries = fs.readdirSync(src, { withFileTypes: true });
        let fileCount = 0;
        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);
          if (entry.isDirectory()) {
            fileCount += copyRecursiveSync(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
            fileCount++;
          }
        }
        return fileCount;
      }

      const fileCount = copyRecursiveSync(activitiesDir, buildActivitiesDir);
      console.log(`   ✓ Copied: activities/ (${fileCount} files)`);
    }
    console.log('✅ Public assets copied\n');

    // Step 3: Pre-render React components to HTML
    console.log('Step 3: Pre-rendering React components...');
    execSync('tsx scripts/prerender.tsx', { stdio: 'inherit' });
    console.log('✅ React components pre-rendered\n');

    // Step 4: Inject CSS path into generated HTML files
    console.log('Step 4: Injecting CSS paths into HTML...');
    const landingDir = path.join(process.cwd(), 'build', 'client', 'landing');
    const htmlFiles = fs.readdirSync(landingDir).filter(f => f.endsWith('.html'));

    for (const file of htmlFiles) {
      const filePath = path.join(landingDir, file);
      let html = fs.readFileSync(filePath, 'utf-8');

      // Replace placeholder CSS path with actual hashed CSS path
      html = html.replace('/assets/landing.css', cssPath);

      fs.writeFileSync(filePath, html);
      console.log(`   ✓ Updated: ${file}`);
    }

    console.log('\n✨ Static pages built successfully!');
    console.log(`📦 Output: build/client/landing/\n`);

    // Summary
    console.log('📊 Build Summary:');
    console.log(`   CSS: ${cssPath}`);
    htmlFiles.forEach(file => {
      const size = (fs.statSync(path.join(landingDir, file)).size / 1024).toFixed(2);
      console.log(`   HTML: ${file} (${size} KB)`);
    });
    console.log();

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

main();
