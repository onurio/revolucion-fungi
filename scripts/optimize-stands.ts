#!/usr/bin/env tsx
import sharp from 'sharp';
import * as fs from 'fs';

async function optimizeImage(inputPath: string, targetSizeKB: number = 200) {
  const outputPath = inputPath.replace('.png', '.jpg');

  let quality = 80;
  let resized = false;

  while (quality >= 40) {
    const metadata = await sharp(inputPath).metadata();
    let pipeline = sharp(inputPath);

    if (quality <= 50 && !resized && metadata.width && metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
      resized = true;
    }

    await pipeline
      .jpeg({ quality, progressive: true, mozjpeg: true })
      .toFile(outputPath + '.tmp');

    const stats = fs.statSync(outputPath + '.tmp');
    const sizeKB = stats.size / 1024;

    console.log(`  Quality ${quality}: ${sizeKB.toFixed(0)}KB`);

    if (sizeKB <= targetSizeKB || quality <= 40) {
      fs.renameSync(outputPath + '.tmp', outputPath);
      console.log(`  ✓ Saved as: ${outputPath} (${sizeKB.toFixed(0)}KB)`);
      return sizeKB;
    }

    fs.unlinkSync(outputPath + '.tmp');
    quality -= 5;
  }

  return 0;
}

async function main() {
  const images = [
    'public/activities/feria/stands-01.png',
    'public/activities/feria/stands-02.png',
    'public/activities/feria/stands-03.png'
  ];

  for (const img of images) {
    console.log(`\nOptimizing: ${img}`);
    await optimizeImage(img);
  }

  console.log('\n✨ Done!');
}

main();
