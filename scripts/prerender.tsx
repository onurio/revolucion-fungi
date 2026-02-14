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

  <!-- Facebook Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '1644328133228276');
  fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=1644328133228276&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Facebook Pixel Code -->

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
  const submitButton = document.getElementById('submit-button');
  const buttonText = document.getElementById('button-text');
  const buttonSpinner = document.getElementById('button-spinner');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombres = document.getElementById('nombres').value;
    const email = document.getElementById('email').value;
    const codigo_pais = document.getElementById('codigo_pais').value;
    const telefono = document.getElementById('telefono').value;

    // Show loading state
    submitButton.disabled = true;
    buttonText.textContent = 'Enviando...';
    buttonSpinner.classList.remove('hidden');

    try {
      await addDoc(collection(db, 'festival-contacts'), {
        nombres,
        email,
        codigo_pais,
        telefono,
        timestamp: new Date(),
        source: 'festival-page',
        // Trigger Email extension fields
        to: 'info@revolucionfungifest.com',
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

      // Show success alert
      alert('¡Gracias por tu interés! Te contactaremos pronto.');
      form.reset();

      // Reset button state
      submitButton.disabled = false;
      buttonText.textContent = 'Enviar';
      buttonSpinner.classList.add('hidden');
    } catch (error) {
      console.error('Error:', error);

      // Show error alert
      alert('Error al enviar el formulario. Por favor intenta de nuevo.');

      // Reset button state
      submitButton.disabled = false;
      buttonText.textContent = 'Enviar';
      buttonSpinner.classList.add('hidden');
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
