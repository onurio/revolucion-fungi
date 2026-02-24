#!/usr/bin/env tsx
/**
 * Process partner logos: find best image file, optimize, and organize by category
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const SOURCE_DIR = '/Users/omrinuri/Downloads/LOGOS PARA WEB-OMRI/LOGOS COMPLETOS ORDENADOS INDIVIDUALES';
const OUTPUT_DIR = 'public/partner_logos';

interface LogoInfo {
  category: string;
  name: string;
  sourcePath: string;
  outputPath: string;
}

function findBestImageFile(dir: string): string | null {
  const files = fs.readdirSync(dir);

  // Prefer PNG, then JPG/JPEG, skip PDF/DOCX
  const pngFiles = files.filter(f => f.toLowerCase().endsWith('.png'));
  if (pngFiles.length > 0) {
    // Prefer files without "background" or "marco" in name
    const cleanPngs = pngFiles.filter(f => !f.toLowerCase().includes('background') && !f.toLowerCase().includes('marco'));
    return path.join(dir, cleanPngs.length > 0 ? cleanPngs[0] : pngFiles[0]);
  }

  const jpgFiles = files.filter(f => f.toLowerCase().match(/\.(jpg|jpeg)$/));
  if (jpgFiles.length > 0) {
    const cleanJpgs = jpgFiles.filter(f => !f.toLowerCase().includes('background'));
    return path.join(dir, cleanJpgs.length > 0 ? cleanJpgs[0] : jpgFiles[0]);
  }

  return null;
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

async function optimizeLogo(inputPath: string, outputPath: string): Promise<void> {
  const ext = path.extname(outputPath).toLowerCase();

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    // Resize if too large (max width 800px)
    let pipeline = image;
    if (metadata.width && metadata.width > 800) {
      pipeline = pipeline.resize(800, null, { withoutEnlargement: true });
    }

    // If the image has transparency or is PNG, keep as PNG
    // Otherwise flatten to white background and convert to PNG
    if (metadata.hasAlpha) {
      // Has transparency - keep it
      await pipeline
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
    } else {
      // No transparency - flatten to white background to avoid checkerboard
      await pipeline
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
    }

    const stats = fs.statSync(outputPath);
    console.log(`  ✓ ${path.basename(outputPath)} (${(stats.size / 1024).toFixed(0)}KB)`);
  } catch (error) {
    console.error(`  ✗ Error processing ${inputPath}:`, error);
  }
}

async function processCategory(categoryName: string): Promise<LogoInfo[]> {
  const categoryDir = path.join(SOURCE_DIR, categoryName);
  const logos: LogoInfo[] = [];

  if (!fs.existsSync(categoryDir)) {
    console.log(`⚠️  Category not found: ${categoryName}`);
    return logos;
  }

  console.log(`\n📁 Processing: ${categoryName}`);
  console.log('='.repeat(50));

  const entries = fs.readdirSync(categoryDir);

  for (const entry of entries) {
    const entryPath = path.join(categoryDir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Find best image file in this directory
      const imagePath = findBestImageFile(entryPath);
      if (imagePath) {
        const filename = sanitizeFilename(entry) + '.png';
        const outputPath = path.join(OUTPUT_DIR, categoryName.toLowerCase(), filename);

        logos.push({
          category: categoryName,
          name: entry,
          sourcePath: imagePath,
          outputPath
        });
      } else {
        console.log(`  ⚠️  No suitable image found for: ${entry}`);
      }
    }
  }

  return logos;
}

async function main() {
  console.log('🎨 Processing partner logos...\n');

  const categories = ['ORGANIZA', 'AUSPICIAN', 'COLABORAN', 'PRODUCE'];
  const allLogos: LogoInfo[] = [];

  // Create output directories
  for (const category of categories) {
    const dir = path.join(OUTPUT_DIR, category.toLowerCase());
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Process each category
  for (const category of categories) {
    const logos = await processCategory(category);
    allLogos.push(...logos);
  }

  console.log('\n📦 Optimizing images...\n');

  // Optimize all logos
  for (const logo of allLogos) {
    await optimizeLogo(logo.sourcePath, logo.outputPath);
  }

  console.log('\n✨ Done!');
  console.log(`📊 Total logos processed: ${allLogos.length}`);

  // Generate summary
  console.log('\n📋 Summary by category:');
  for (const category of categories) {
    const count = allLogos.filter(l => l.category === category).length;
    console.log(`  ${category}: ${count} logos`);
  }
}

main();
