import { Fungi, NewFungi } from "~/types";
import { createCollectorFromName } from "./collectorHelpers";
import { uploadLocalImages } from "./imageProcessor";
import { db } from "~/firebase.client";
import { collection, query, where, getDocs } from "firebase/firestore";

export interface CSVRow {
  "Código Fungario": string;
  "Código Andres": string;
  "Género": string;
  "Especie": string;
  "¿Muestra conservada?": string;
  "ADN extraido?": string;
  "# Extracto ADN": string;
  "PCR": string;
  "Sustrato": string;
  "Árbol o planta cercana/asociada": string;
  "Árbol o planta nativa o exótica.": string;
  "Hábito": string;
  "Numero de Carpóforos": string;
  "Olor": string;
  "Sporeprint": string;
  "Esporada (color)": string;
  "Himenio": string;
  "Anillo": string;
  "Volva": string;
  "Textura": string;
  "Notas": string;
  "Color": string;
  "Largo Cuerpo (cm)": string;
  "Diámetro Sombrero (cm)": string;
  "Altitud": string;
  "X": string;
  "Y": string;
  "19L X_UTM": string;
  "Y_UTM": string;
  "Fecha": string;
  "Lugar": string;
  "Distrito": string;
  "Provincia": string;
  "Region": string;
  "Colector": string;
}

function parseDateFromDDMMYYYY(dateString: string): Date | undefined {
  if (!dateString || dateString.trim() === "") return undefined;
  
  // Handle DD/MM/YYYY format
  const parts = dateString.trim().split('/');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
    const year = parseInt(parts[2], 10);
    
    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  // Fallback to default parsing
  const fallbackDate = new Date(dateString);
  return isNaN(fallbackDate.getTime()) ? undefined : fallbackDate;
}

export async function parseCSVRowWithCollectorMap(row: CSVRow, collectorMap: Map<string, string>, uploadPhotos: boolean = false): Promise<NewFungi | null> {
  // Skip empty rows, header rows, or rows without fungario codes
  if (!row["Código Fungario"] || 
      row["Código Fungario"].includes("Código") ||
      row["Código Fungario"].trim() === "") {
    return null;
  }

  try {
    const fecha = parseDateFromDDMMYYYY(row["Fecha"]);
    
    // Get collector IDs from pre-created map (handle multiple collectors)
    const collectorIds: string[] = [];
    if (row["Colector"] && row["Colector"].trim() !== "") {
      const collectors = row["Colector"].split(',').map(name => name.trim()).filter(name => name !== "");
      collectors.forEach(collectorName => {
        const collectorId = collectorMap.get(collectorName);
        if (collectorId) {
          collectorIds.push(collectorId);
        }
      });
    }
    
    // Handle photo uploads if requested
    let imageUrls: string[] = [];
    if (uploadPhotos) {
      try {
        console.log(`Uploading photos for ${row["Código Fungario"]}...`);
        imageUrls = await uploadLocalImages(row["Código Fungario"]);
        console.log(`Uploaded ${imageUrls.length} photos for ${row["Código Fungario"]}`);
      } catch (error) {
        console.error(`Error uploading photos for ${row["Código Fungario"]}:`, error);
      }
    }
    
    return {
      codigoFungario: row["Código Fungario"],
      codigoAndres: row["Código Andres"] || undefined,
      genero: row["Género"],
      especie: row["Especie"] && row["Especie"] !== "-" ? row["Especie"] : undefined,
      muestraConservada: row["¿Muestra conservada?"]?.toLowerCase() === "si",
      adnExtraido: row["ADN extraido?"]?.toLowerCase() === "si",
      numeroExtractoAdn: row["# Extracto ADN"] || undefined,
      pcr: row["PCR"] || undefined,
      sustrato: row["Sustrato"] || undefined,
      arbolAsociado: row["Árbol o planta cercana/asociada"] || undefined,
      nativaExotica: row["Árbol o planta nativa o exótica."] || undefined,
      habito: row["Hábito"] || undefined,
      numeroCarpoforos: row["Numero de Carpóforos"] ? parseInt(row["Numero de Carpóforos"]) : undefined,
      olor: row["Olor"] && row["Olor"] !== "-" ? row["Olor"] : undefined,
      sporeprint: row["Sporeprint"] && row["Sporeprint"] !== "-" ? row["Sporeprint"] : undefined,
      esporadaColor: row["Esporada (color)"] && row["Esporada (color)"] !== "-" ? row["Esporada (color)"] : undefined,
      himenio: row["Himenio"] && row["Himenio"] !== "-" ? row["Himenio"] : undefined,
      anillo: row["Anillo"]?.toLowerCase() === "si",
      volva: row["Volva"]?.toLowerCase() === "si",
      textura: row["Textura"] || undefined,
      notas: row["Notas"] || undefined,
      color: row["Color"] || undefined,
      largoCuerpo: row["Largo Cuerpo (cm)"] ? parseFloat(row["Largo Cuerpo (cm)"]) : undefined,
      diametroSombrero: row["Diámetro Sombrero (cm)"] ? parseFloat(row["Diámetro Sombrero (cm)"]) : undefined,
      altitud: row["Altitud"] ? parseFloat(row["Altitud"]) : undefined,
      coordenadaX: row["X"] ? parseFloat(row["X"]) : undefined,
      coordenadaY: row["Y"] ? parseFloat(row["Y"]) : undefined,
      utmX: row["19L X_UTM"] ? parseFloat(row["19L X_UTM"]) : undefined,
      utmY: row["Y_UTM"] ? parseFloat(row["Y_UTM"]) : undefined,
      fecha: fecha,
      lugar: row["Lugar"] || undefined,
      distrito: row["Distrito"] || undefined,
      provincia: row["Provincia"] || undefined,
      region: row["Region"] || undefined,
      collectorIds: collectorIds,
      images: imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error parsing CSV row:", error, row);
    return null;
  }
}

export async function parseCSVRow(row: CSVRow, uploadPhotos: boolean = false): Promise<NewFungi | null> {
  // Skip empty rows, header rows, or rows without fungario codes
  if (!row["Código Fungario"] || 
      row["Código Fungario"].includes("Código") ||
      row["Código Fungario"].trim() === "") {
    return null;
  }

  try {
    const fecha = parseDateFromDDMMYYYY(row["Fecha"]);
    
    // Create or get collector IDs (handle multiple collectors)
    const collectorIds: string[] = [];
    if (row["Colector"] && row["Colector"].trim() !== "") {
      const collectors = row["Colector"].split(',').map(name => name.trim()).filter(name => name !== "");
      for (const collectorName of collectors) {
        try {
          const collectorId = await createCollectorFromName(collectorName);
          collectorIds.push(collectorId);
        } catch (error) {
          console.error("Error creating collector:", error);
        }
      }
    }
    
    // Handle photo uploads if requested
    let imageUrls: string[] = [];
    if (uploadPhotos) {
      try {
        console.log(`Uploading photos for ${row["Código Fungario"]}...`);
        imageUrls = await uploadLocalImages(row["Código Fungario"]);
        console.log(`Uploaded ${imageUrls.length} photos for ${row["Código Fungario"]}`);
      } catch (error) {
        console.error(`Error uploading photos for ${row["Código Fungario"]}:`, error);
      }
    }
    
    return {
      codigoFungario: row["Código Fungario"],
      codigoAndres: row["Código Andres"] || undefined,
      genero: row["Género"],
      especie: row["Especie"] && row["Especie"] !== "-" ? row["Especie"] : undefined,
      muestraConservada: row["¿Muestra conservada?"]?.toLowerCase() === "si",
      adnExtraido: row["ADN extraido?"]?.toLowerCase() === "si",
      numeroExtractoAdn: row["# Extracto ADN"] || undefined,
      pcr: row["PCR"] || undefined,
      sustrato: row["Sustrato"] || undefined,
      arbolAsociado: row["Árbol o planta cercana/asociada"] || undefined,
      nativaExotica: row["Árbol o planta nativa o exótica."] || undefined,
      habito: row["Hábito"] || undefined,
      numeroCarpoforos: row["Numero de Carpóforos"] ? parseInt(row["Numero de Carpóforos"]) : undefined,
      olor: row["Olor"] && row["Olor"] !== "-" ? row["Olor"] : undefined,
      sporeprint: row["Sporeprint"] && row["Sporeprint"] !== "-" ? row["Sporeprint"] : undefined,
      esporadaColor: row["Esporada (color)"] && row["Esporada (color)"] !== "-" ? row["Esporada (color)"] : undefined,
      himenio: row["Himenio"] && row["Himenio"] !== "-" ? row["Himenio"] : undefined,
      anillo: row["Anillo"]?.toLowerCase() === "si",
      volva: row["Volva"]?.toLowerCase() === "si",
      textura: row["Textura"] || undefined,
      notas: row["Notas"] || undefined,
      color: row["Color"] || undefined,
      largoCuerpo: row["Largo Cuerpo (cm)"] ? parseFloat(row["Largo Cuerpo (cm)"]) : undefined,
      diametroSombrero: row["Diámetro Sombrero (cm)"] ? parseFloat(row["Diámetro Sombrero (cm)"]) : undefined,
      altitud: row["Altitud"] ? parseFloat(row["Altitud"]) : undefined,
      coordenadaX: row["X"] ? parseFloat(row["X"]) : undefined,
      coordenadaY: row["Y"] ? parseFloat(row["Y"]) : undefined,
      utmX: row["19L X_UTM"] ? parseFloat(row["19L X_UTM"]) : undefined,
      utmY: row["Y_UTM"] ? parseFloat(row["Y_UTM"]) : undefined,
      fecha: fecha,
      lugar: row["Lugar"] || undefined,
      distrito: row["Distrito"] || undefined,
      provincia: row["Provincia"] || undefined,
      region: row["Region"] || undefined,
      collectorIds: collectorIds,
      images: imageUrls,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("Error parsing CSV row:", error, row);
    return null;
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Handle escaped quotes
        current += '"';
        i += 2;
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
}


export async function processCSVContent(csvContent: string, uploadPhotos: boolean = false): Promise<NewFungi[]> {
  const lines = csvContent.split('\n');
  const header = lines[2]; // Header is on line 3 (index 2) based on the CSV structure
  
  if (!header) {
    throw new Error("Invalid CSV format: header not found");
  }
  
  const headerColumns = parseCSVLine(header);
  const fungi: NewFungi[] = [];
  
  console.log(`Starting to process CSV with ${lines.length - 3} potential records...`);
  
  // First pass: collect all unique collector names
  const collectorNames = new Set<string>();
  const rowsData: any[] = [];
  
  console.log("First pass: parsing CSV rows...");
  
  // Start from line 4 (index 3) to skip the header and metadata rows
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    const row: any = {};
    
    // Map values to header columns
    headerColumns.forEach((col, index) => {
      row[col.trim()] = values[index]?.trim() || "";
    });
    
    // Skip empty rows, header rows, or rows without fungario codes
    if (!row["Código Fungario"] || 
        row["Código Fungario"].includes("Código") ||
        row["Código Fungario"].trim() === "") {
      continue;
    }
    
    rowsData.push(row);
    
    // Collect unique collector names (handle multiple collectors separated by commas)
    if (row["Colector"] && row["Colector"].trim() !== "") {
      const collectors = row["Colector"].split(',').map(name => name.trim()).filter(name => name !== "");
      collectors.forEach(collectorName => {
        collectorNames.add(collectorName);
      });
    }
  }
  
  console.log(`Parsed ${rowsData.length} valid rows, found ${collectorNames.size} unique collectors`);
  
  // Second pass: create all collectors in batch
  console.log("Creating collectors...");
  const collectorMap = new Map<string, string>();
  const createdCollectors: string[] = [];
  
  for (const collectorName of collectorNames) {
    try {
      const collectorId = await createCollectorFromName(collectorName);
      collectorMap.set(collectorName, collectorId);
      createdCollectors.push(collectorName);
      console.log(`Created collector: ${collectorName} (ID: ${collectorId})`);
    } catch (error) {
      console.error(`Error creating collector ${collectorName}:`, error);
    }
  }
  
  console.log(`Created ${collectorMap.size} collectors:`, createdCollectors);
  
  // Third pass: process all fungi records (check for existing records later at save time)
  console.log("Processing fungi records...");
  
  for (let i = 0; i < rowsData.length; i++) {
    const row = rowsData[i];
    
    try {
      const parsedFungi = await parseCSVRowWithCollectorMap(row as CSVRow, collectorMap, uploadPhotos);
      if (parsedFungi) {
        fungi.push(parsedFungi);
        if ((i + 1) % 10 === 0) {
          console.log(`Processed ${i + 1}/${rowsData.length} records`);
        }
      }
    } catch (error) {
      console.error(`Error processing record ${i + 1}:`, error);
    }
  }
  
  console.log(`Finished processing CSV. Total records processed: ${fungi.length}`);
  return fungi;
}

export async function getImagesForFungi(codigoFungario: string): Promise<string[]> {
  // Extract the year from the codigo (e.g., FRFA-001 -> look in 2024 folder)
  const code = codigoFungario.replace("FRFA-", "");
  const codeNumber = parseInt(code);
  
  // Determine year based on code number
  let year = "2024";
  if (codeNumber >= 60) {
    year = "2025";
  }
  
  const imagePath = `/2024/${year}/${codigoFungario}/Bajas_/`;
  
  try {
    // This would need to be implemented based on your file system access
    // For now, returning empty array as placeholder
    return [];
  } catch (error) {
    console.error(`Error finding images for ${codigoFungario}:`, error);
    return [];
  }
}