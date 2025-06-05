# Fungarium Features

## Overview
The fungarium feature allows you to process CSV data containing fungi information and display it in a searchable, organized interface.

## New Features Added

### 1. CSV Processing (`/admin`)
- Import fungi data from CSV files
- Process CSV structure with all fungi metadata
- Automatic data validation and parsing
- Save processed data to Firestore database

### 2. Fungarium Display (`/fungarium`)
- Browse all fungi in a grid layout
- Search by code, genus, species, or location
- Filter and sort capabilities
- Card-based interface with preview images

### 3. Detailed Fungi View (`/fungarium/:id`)
- Complete fungi information display
- Taxonomic classification
- Ecological information
- Physical measurements
- Collection data
- GPS coordinates
- Sample preservation status
- Image gallery

## File Structure

### Types (`app/types.ts`)
- `Fungi` - Complete fungi data type
- `NewFungi` - For creating new fungi records

### Utilities
- `app/utils/csvProcessor.ts` - CSV parsing and data processing
- `app/utils/imageProcessor.ts` - Image handling and Firebase upload

### Components
- `app/components/CSVImport.tsx` - CSV import interface
- `app/components/FungiDetail.tsx` - Detailed fungi display
- `app/routes/admin.tsx` - Admin panel for CSV import
- `app/routes/fungarium.tsx` - Fungi catalog page
- `app/routes/fungarium.$id.tsx` - Individual fungi detail page

## CSV Structure Expected

The CSV should have the following columns:
- Código Fungario (required)
- Código Andres
- Género (required)
- Especie
- ¿Muestra conservada?
- ADN extraido?
- # Extracto ADN
- PCR
- Sustrato
- Árbol o planta cercana/asociada
- Árbol o planta nativa o exótica.
- Hábito
- Numero de Carpóforos
- Olor
- Sporeprint
- Esporada (color)
- Himenio
- Anillo
- Volva
- Textura
- Notas
- Color
- Largo Cuerpo (cm)
- Diámetro Sombrero (cm)
- Altitud
- X
- Y
- 19L X_UTM
- Y_UTM
- Fecha
- Lugar
- Distrito
- Provincia
- Region
- Colector

## Image Organization

Images should be organized in the following structure:
```
/2024/
  /2024/
    /FRFA-001/
      /Bajas_/
        - image1.jpg
        - image2.jpg
  /2025/
    /FRFA-060/
      /Bajas_/
        - image1.jpg
        - image2.jpg
```

The system automatically determines the year based on the fungi code:
- FRFA-001 to FRFA-059: 2024 folder
- FRFA-060 and above: 2025 folder

## Navigation Updates

Updated navigation includes:
- Home page now shows "Ver Fungarium" button
- Dashboard includes three main actions:
  - Ver Fungarium (browse all fungi)
  - Nuevo Registro (create new record)
  - Importar CSV (admin import function)

## Database Schema

Data is stored in Firestore under the `fungi` collection with document IDs matching the `codigoFungario` (e.g., "FRFA-001").

## Usage Instructions

1. **Import CSV Data:**
   - Go to `/admin`
   - Select your CSV file
   - Click "Procesar CSV" to validate data
   - Click "Guardar en Base de Datos" to save

2. **Browse Fungi:**
   - Go to `/fungarium`
   - Use the search box to filter results
   - Click on any fungi card to view details

3. **View Details:**
   - Click on individual fungi cards
   - View complete taxonomic and ecological information
   - See all associated images
   - Access GPS coordinates and collection data

## Notes

- The CSV processing handles empty fields and missing data gracefully
- Boolean fields accept "Si"/"No" values
- Date fields are automatically parsed
- Numeric fields are converted appropriately
- The system is designed for the specific CSV format used by the Revolución Fungi & Arbio project