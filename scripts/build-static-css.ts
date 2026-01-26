#!/usr/bin/env tsx
/**
 * Build Tailwind CSS for static landing pages
 */

import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

async function buildCSS() {
  console.log('🎨 Building Tailwind CSS for static pages...\n');

  const inputPath = path.join(process.cwd(), 'static', 'shared', 'landing.css');
  const outputDir = path.join(process.cwd(), 'build', 'client', 'assets');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Read input CSS
  const css = fs.readFileSync(inputPath, 'utf-8');

  try {
    // Process CSS with PostCSS
    const result = await postcss([
      tailwindcss({
        content: [
          './static/**/*.{tsx,ts,jsx,js,html}',
        ],
      }),
      autoprefixer(),
      cssnano({
        preset: 'default',
      }),
    ]).process(css, {
      from: inputPath,
      to: path.join(outputDir, 'landing.css'),
    });

    // Generate hash for cache busting
    const hash = crypto
      .createHash('md5')
      .update(result.css)
      .digest('hex')
      .substring(0, 8);

    const outputFilename = `landing-${hash}.css`;
    const outputPath = path.join(outputDir, outputFilename);

    // Write output file
    fs.writeFileSync(outputPath, result.css);

    const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
    console.log(`✅ CSS built successfully: ${outputFilename} (${fileSize} KB)`);

    // Return the filename for use in HTML injection
    return `/assets/${outputFilename}`;
  } catch (error) {
    console.error('❌ Error building CSS:', error);
    throw error;
  }
}

export { buildCSS };
