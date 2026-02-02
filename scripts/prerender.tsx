#!/usr/bin/env tsx
/**
 * Pre-render React components to static HTML
 * Converts React components to pure HTML/CSS with zero JavaScript
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as fs from 'fs';
import * as path from 'path';

// Import the Festival component
import Festival from '../static/components/Festival';

interface PageConfig {
  component: React.FC;
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

const pages: PageConfig[] = [
  {
    component: Festival,
    path: 'festival.html',
    title: 'Revolución Fungi Fest Oxapampa 2026',
    description: 'El primer festival en la historia del Perú dedicado íntegramente al Reino Fungi. 26 de febrero al 01 de marzo de 2026 en Oxapampa.',
    canonical: 'https://revolucionfungifest.com',
    ogImage: 'https://revolucionfungifest.com/og-image.jpg'
  }
];

function generateHTML(config: PageConfig, cssPath: string): string {
  const { component: Component, title, description, canonical, ogImage } = config;

  // Render React component to static HTML
  const bodyContent = renderToStaticMarkup(<Component />);

  return `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>

  <!-- SEO Meta Tags -->
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  ${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}
  ${ogImage ? `<meta property="og:image:alt" content="Revolución Fungi Fest Oxapampa">` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonical}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  ${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ''}
  ${ogImage ? `<meta name="twitter:image:alt" content="Revolución Fungi Fest Oxapampa">` : ''}

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">

  <!-- Tailwind CSS -->
  <link rel="stylesheet" href="${cssPath}">

  <!-- Event Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Revolución Fungi Fest Oxapampa 2026",
    "startDate": "2026-02-26",
    "endDate": "2026-03-01",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": "Oxapampa",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Oxapampa",
        "addressRegion": "Pasco",
        "addressCountry": "PE"
      }
    },
    "image": [
      "${ogImage || '/hero-mushroom.jpg'}"
    ],
    "description": "${description}",
    "organizer": {
      "@type": "Organization",
      "name": "Revolución Fungi",
      "url": "https://revolucionfungi.com"
    }
  }
  </script>
</head>
<body>
${bodyContent}

<!-- Firebase for contact form -->
<script type="module">
  import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
  import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

  const firebaseConfig = {
    apiKey: "AIzaSyASLK8CmR6N1EcLbKCwqVj8jmSjl8chHUw",
    authDomain: "fungarium-peru-a0638.firebaseapp.com",
    projectId: "fungarium-peru-a0638",
    storageBucket: "fungarium-peru-a0638.firebasestorage.app",
    messagingSenderId: "631668777074",
    appId: "1:631668777074:web:fc56e72f88f4a5d03ef86a"
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const form = document.getElementById('contact-form');
  const messageDiv = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombres = document.getElementById('nombres').value;
    const email = document.getElementById('email').value;
    const codigo_pais = document.getElementById('codigo_pais').value;
    const telefono = document.getElementById('telefono').value;

    messageDiv.textContent = 'Enviando...';
    messageDiv.className = 'text-center text-sm text-gray-600';

    try {
      await addDoc(collection(db, 'festival-contacts'), {
        nombres,
        email,
        codigo_pais,
        telefono,
        timestamp: new Date(),
        source: 'festival-page',
        // Trigger Email extension fields
        to: 'micelio@revolucionfungi.com',
        message: {
          subject: 'Nuevo contacto del Festival - Revolución Fungi Fest',
          html: \`
            <h2>Nuevo contacto del Festival</h2>
            <p><strong>Nombre:</strong> \${nombres}</p>
            <p><strong>Email:</strong> \${email}</p>
            <p><strong>Teléfono:</strong> \${codigo_pais} \${telefono}</p>
            <p><strong>Fecha:</strong> \${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}</p>
            <p><strong>Fuente:</strong> Página del Festival</p>
          \`
        }
      });

      messageDiv.textContent = '¡Gracias! Te contactaremos pronto.';
      messageDiv.className = 'text-center text-sm text-green-600 font-bold';
      form.reset();

      setTimeout(() => {
        messageDiv.textContent = '';
      }, 5000);
    } catch (error) {
      console.error('Error:', error);
      messageDiv.textContent = 'Error al enviar. Por favor intenta de nuevo.';
      messageDiv.className = 'text-center text-sm text-red-600 font-bold';
    }
  });
</script>
</body>
</html>`;
}

async function main() {
  console.log('🎨 Starting pre-rendering process...\n');

  const outputDir = path.join(process.cwd(), 'build', 'client', 'landing');

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}\n`);
  }

  // For now, use a placeholder CSS path - will be replaced during build
  const cssPath = '/assets/landing.css';

  // Pre-render each page
  for (const pageConfig of pages) {
    try {
      console.log(`🔨 Rendering: ${pageConfig.path}`);
      const html = generateHTML(pageConfig, cssPath);

      const outputPath = path.join(outputDir, pageConfig.path);
      fs.writeFileSync(outputPath, html, 'utf-8');

      const fileSize = (fs.statSync(outputPath).size / 1024).toFixed(2);
      console.log(`✅ Generated: ${outputPath} (${fileSize} KB)`);
      console.log(`   Title: ${pageConfig.title}`);
      console.log(`   Canonical: ${pageConfig.canonical}\n`);
    } catch (error) {
      console.error(`❌ Error rendering ${pageConfig.path}:`, error);
      process.exit(1);
    }
  }

  console.log('✨ Pre-rendering completed successfully!');
  console.log(`📦 Output: ${outputDir}\n`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
