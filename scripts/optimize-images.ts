#!/usr/bin/env tsx
/**
 * Aggressive image optimization script using sharp
 * Target: ~200KB per image
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

async function optimizeImage(inputPath: string, targetSizeKB: number = 200) {
  const ext = path.extname(inputPath).toLowerCase();
  const outputPath = inputPath;

  try {
    // Start with quality 80 for JPEGs
    let quality = 80;
    let resized = false;

    while (quality >= 40) {
      const metadata = await sharp(inputPath).metadata();
      let pipeline = sharp(inputPath);

      // If still too large, resize the image
      if (quality <= 50 && !resized && metadata.width && metadata.width > 1920) {
        pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
        resized = true;
      }

      // Convert to JPEG with current quality
      await pipeline
        .jpeg({ quality, progressive: true, mozjpeg: true })
        .toFile(outputPath + '.tmp');

      const stats = fs.statSync(outputPath + '.tmp');
      const sizeKB = stats.size / 1024;

      console.log(`  Quality ${quality}: ${sizeKB.toFixed(0)}KB`);

      if (sizeKB <= targetSizeKB || quality <= 40) {
        // Accept this quality level
        fs.renameSync(outputPath + '.tmp', outputPath);
        return sizeKB;
      }

      // Try lower quality
      fs.unlinkSync(outputPath + '.tmp');
      quality -= 5;
    }

    return 0;
  } catch (error) {
    console.error(`  Error optimizing ${inputPath}:`, error);
    return 0;
  }
}

async function optimizeDirectory(dir: string, targetSizeKB: number = 200) {
  const files = fs.readdirSync(dir);
  let totalSaved = 0;
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const originalSize = fs.statSync(filePath).size / 1024;
      console.log(`\nOptimizing: ${file} (${originalSize.toFixed(0)}KB)`);

      const newSize = await optimizeImage(filePath, targetSizeKB);
      const saved = originalSize - newSize;
      totalSaved += saved;
      count++;

      console.log(`  ✓ Final: ${newSize.toFixed(0)}KB (saved ${saved.toFixed(0)}KB)`);
    }
  }

  return { count, totalSaved };
}

async function main() {
  console.log('🗜️  Aggressive image optimization starting...\n');
  console.log('Target: ~200KB per image\n');

  const dirs = [
    { path: 'public/activities/categories', target: 200 },
    { path: 'public/activities/masterclass', target: 200 },
    { path: 'public/activities/talleres', target: 200 }
  ];

  let grandTotal = 0;
  let grandCount = 0;

  for (const { path: dirPath, target } of dirs) {
    const fullPath = path.join(process.cwd(), dirPath);
    if (fs.existsSync(fullPath)) {
      console.log(`\n📁 Processing: ${dirPath}`);
      console.log('='.repeat(50));
      const { count, totalSaved } = await optimizeDirectory(fullPath, target);
      grandTotal += totalSaved;
      grandCount += count;
      console.log(`\n✅ ${count} images optimized, saved ${totalSaved.toFixed(0)}KB`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n✨ Complete! Optimized ${grandCount} images`);
  console.log(`💾 Total space saved: ${(grandTotal / 1024).toFixed(2)}MB\n`);
}

main();
