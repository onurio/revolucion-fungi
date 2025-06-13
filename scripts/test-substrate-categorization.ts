import { normalizeSustratoTipo } from '../app/types/fungi-enums';

// Test data from the database
const testSubstrates = [
  "Animal (hormiga Isula).",
  "Animal (supuestamente).",
  "Barro al pie de un árbol.",
  "Cáscara de semilla de lupuna.",
  "En animal: grillo/saltamonte.",
  "En rama caída de bambú o paca.",
  "Fruto.",
  "Hoja de Shapaja, Attalea sp.",
  "Hoja de pona, Iryanthera sp.",
  "Hojarasca (hoja de palmera).",
  "Hojarasca (rocopa de pona, Iryanthera sp.).",
  "Hojarasca (rocopa de shapaja, Attalea sp.).",
  "Hojarasca.",
  "Hojas muertas.",
  "Hojas y corteza de Anacaspi, Apuleia leiocarpa.",
  "Hormiga bala (isula).",
  "Hormiga isula dentro de un tronco.",
  "Hormiga pequeña en hoja de helecho.",
  "Larva de Coleoptero en madera muerta.",
  "Madera muerta (cáscara del fruto de liana).",
  "Madera muerta (cáscara).",
  "Madera muerta (hoja de Shapaja, Attalea sp.).",
  "Madera muerta (hojas de bambú)",
  "Madera muerta (liana).",
  "Madera muerta (palmera seca).",
  "Madera muerta (palo en pie).",
  "Madera muerta (palo).",
  "Madera muerta (rama de bambú en pie).",
  "Madera muerta (rama gruesa).",
  "Madera muerta (rama mediana caída).",
  "Madera muerta (rama mediana).",
  "Madera muerta (rama pequeña)",
  "Madera muerta (rama pequeña).",
  "Madera muerta (rama).",
  "Madera muerta (ramas medianas).",
  "Madera muerta (ramas pequeñas caídas)",
  "Madera muerta (ramita).",
  "Madera muerta (rocopa de Shapaja, Attalea sp.).",
  "Madera muerta (sin contacto con el suelo).",
  "Madera muerta (tronco)",
  "Madera muerta (tronco).",
  "Madera muerta.",
  "Madera viva.",
  "Oruga dentro de un tronco descompuesto.",
  "Semilla de Shapaja, Attalea sp.",
  "Semilla de fariña seca.",
  "Suelo (arena).",
  "Suelo.",
  "Tierra."
];

console.log("=== TESTING SUBSTRATE CATEGORIZATION ===\n");

// Track categorization stats
const categoryStats: Record<string, number> = {};
const uncategorized: string[] = [];

testSubstrates.forEach(substrate => {
  const category = normalizeSustratoTipo(substrate);
  
  if (category) {
    categoryStats[category] = (categoryStats[category] || 0) + 1;
    console.log(`"${substrate}" → ${category}`);
  } else {
    uncategorized.push(substrate);
    console.log(`"${substrate}" → ❌ UNCATEGORIZED`);
  }
});

console.log("\n=== CATEGORIZATION SUMMARY ===");
console.log(`Total substrates: ${testSubstrates.length}`);
console.log(`Successfully categorized: ${testSubstrates.length - uncategorized.length}`);
console.log(`Uncategorized: ${uncategorized.length}`);

console.log("\n=== CATEGORY DISTRIBUTION ===");
Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`${category}: ${count} items`);
  });

if (uncategorized.length > 0) {
  console.log("\n=== UNCATEGORIZED ITEMS ===");
  uncategorized.forEach(item => {
    console.log(`- "${item}"`);
  });
}