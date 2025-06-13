import { normalizeHimenio, normalizeHabito, normalizeNativaExotica } from '../app/types/fungi-enums';

// Test data from your logs
const testHimenios = [
    "Apotecio",
    "Apotecio.",
    "Apothecio",
    "Apothecio.",
    "Arrugado",
    "Coral.",
    "Coraloide",
    "Dientes.",
    "Estroma con peritecios.",
    "Estroma redonda",
    "Gasteroide.",
    "Gelatinoso",
    "Gelatinoso.",
    "Laminillas.",
    "Láminas.",
    "Masa interna de esporas.",
    "Masa líquida de esporas.",
    "Nido.",
    "Poros (microscópicos).",
    "Poros.",
    "Poros?",
    "Stroma con perithecia."
];

const testHabitos = [
    "Cespitoso.",
    "Gregaria",
    "Gregario",
    "Gregario, cespitoso",
    "Gregario, cespitoso y dispersos.",
    "Gregario, cespitoso.",
    "Gregario, dispersos.",
    "Gregario.",
    "Gregario/Cespitoso.",
    "Solitario",
    "Solitario, cespitoso.",
    "Solitario, disperso.",
    "Solitario.",
    "Solitario/Gregario."
];

const testNativaExotica = ["Nativa."];

console.log("=== TESTING ENUM CONVERSIONS ===\n");

console.log("HIMENIO CONVERSIONS:");
console.log("-".repeat(50));
testHimenios.forEach(value => {
    const converted = normalizeHimenio(value);
    console.log(`"${value}" → ${converted || 'NULL'}`);
});

console.log("\n\nHABITO CONVERSIONS:");
console.log("-".repeat(50));
testHabitos.forEach(value => {
    const converted = normalizeHabito(value);
    console.log(`"${value}" → ${converted || 'NULL'}`);
});

console.log("\n\nNATIVA/EXOTICA CONVERSIONS:");
console.log("-".repeat(50));
testNativaExotica.forEach(value => {
    const converted = normalizeNativaExotica(value);
    console.log(`"${value}" → ${converted || 'NULL'}`);
});

// Summary of conversions
console.log("\n=== CONVERSION SUMMARY ===");
const himenioFailed = testHimenios.filter(v => !normalizeHimenio(v));
const habitoFailed = testHabitos.filter(v => !normalizeHabito(v));
const nativaExoticaFailed = testNativaExotica.filter(v => !normalizeNativaExotica(v));

console.log(`Himenio: ${testHimenios.length - himenioFailed.length}/${testHimenios.length} converted successfully`);
if (himenioFailed.length > 0) {
    console.log("Failed:", himenioFailed);
}

console.log(`Habito: ${testHabitos.length - habitoFailed.length}/${testHabitos.length} converted successfully`);
if (habitoFailed.length > 0) {
    console.log("Failed:", habitoFailed);
}

console.log(`NativaExotica: ${testNativaExotica.length - nativaExoticaFailed.length}/${testNativaExotica.length} converted successfully`);
if (nativaExoticaFailed.length > 0) {
    console.log("Failed:", nativaExoticaFailed);
}