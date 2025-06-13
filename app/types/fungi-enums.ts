// Enum types for Fungi model fields

export enum Himenio {
  APOTECIO = "APOTECIO",
  ARRUGADO = "ARRUGADO",
  CORAL = "CORAL",
  CORALOIDE = "CORALOIDE",
  DIENTES = "DIENTES",
  ESTROMA_CON_PERITECIOS = "ESTROMA_CON_PERITECIOS",
  ESTROMA_REDONDA = "ESTROMA_REDONDA",
  GASTEROIDE = "GASTEROIDE",
  GELATINOSO = "GELATINOSO",
  LAMINILLAS = "LAMINILLAS",
  LAMINAS = "LAMINAS",
  MASA_INTERNA_ESPORAS = "MASA_INTERNA_ESPORAS",
  MASA_LIQUIDA_ESPORAS = "MASA_LIQUIDA_ESPORAS",
  NIDO = "NIDO",
  POROS = "POROS",
  POROS_MICROSCOPICOS = "POROS_MICROSCOPICOS"
}

export enum Habito {
  SOLITARIO = "SOLITARIO",
  GREGARIO = "GREGARIO",
  CESPITOSO = "CESPITOSO",
  SOLITARIO_GREGARIO = "SOLITARIO_GREGARIO",
  SOLITARIO_CESPITOSO = "SOLITARIO_CESPITOSO",
  SOLITARIO_DISPERSO = "SOLITARIO_DISPERSO",
  GREGARIO_CESPITOSO = "GREGARIO_CESPITOSO",
  GREGARIO_DISPERSO = "GREGARIO_DISPERSO",
  GREGARIO_CESPITOSO_DISPERSO = "GREGARIO_CESPITOSO_DISPERSO"
}

export enum NativaExotica {
  NATIVA = "NATIVA",
  EXOTICA = "EXOTICA"
}

export enum SustratoTipo {
  PASTO = "PASTO",
  PINOCHA = "PINOCHA",
  HOJARASCA = "HOJARASCA",
  MADERA_MUERTA = "MADERA_MUERTA",
  MADERA_VIVA = "MADERA_VIVA",
  MUSGO = "MUSGO",
  ARENA = "ARENA",
  ESTIERCOL = "ESTIERCOL",
  EN_ANIMAL_PARASITO = "EN_ANIMAL_PARASITO",
  OTRO = "OTRO"
}

// Mapping functions to convert from old string values to enums
export const normalizeHimenio = (value: string | null | undefined): Himenio | null => {
  if (!value) return null;
  
  const normalized = value.trim().toUpperCase()
    .replace(/\.$/, '') // Remove trailing period
    .replace(/\?$/, '') // Remove trailing question mark
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[ÁÀÄÂ]/g, 'A')
    .replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I')
    .replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U');

  const mappings: Record<string, Himenio> = {
    'APOTECIO': Himenio.APOTECIO,
    'APOTHECIO': Himenio.APOTECIO,
    'ARRUGADO': Himenio.ARRUGADO,
    'CORAL': Himenio.CORAL,
    'CORALOIDE': Himenio.CORALOIDE,
    'DIENTES': Himenio.DIENTES,
    'ESTROMA_CON_PERITECIOS': Himenio.ESTROMA_CON_PERITECIOS,
    'STROMA_CON_PERITHECIA': Himenio.ESTROMA_CON_PERITECIOS,
    'ESTROMA_REDONDA': Himenio.ESTROMA_REDONDA,
    'GASTEROIDE': Himenio.GASTEROIDE,
    'GELATINOSO': Himenio.GELATINOSO,
    'LAMINILLAS': Himenio.LAMINILLAS,
    'LAMINAS': Himenio.LAMINAS,
    'MASA_INTERNA_DE_ESPORAS': Himenio.MASA_INTERNA_ESPORAS,
    'MASA_LIQUIDA_DE_ESPORAS': Himenio.MASA_LIQUIDA_ESPORAS,
    'NIDO': Himenio.NIDO,
    'POROS': Himenio.POROS,
    'POROS_(MICROSCOPICOS)': Himenio.POROS_MICROSCOPICOS
  };

  return mappings[normalized] || null;
};

export const normalizeHabito = (value: string | null | undefined): Habito | null => {
  if (!value) return null;
  
  const normalized = value.trim().toUpperCase()
    .replace(/\.$/, '') // Remove trailing period
    .replace(/\s*\/\s*/g, '_') // Replace slashes with underscores
    .replace(/,\s*/g, '_') // Replace commas with underscores
    .replace(/\s+Y\s+/g, '_') // Replace " y " with underscore
    .replace(/\s+/g, '_'); // Replace remaining spaces

  const mappings: Record<string, Habito> = {
    'SOLITARIO': Habito.SOLITARIO,
    'GREGARIO': Habito.GREGARIO,
    'GREGARIA': Habito.GREGARIO,
    'CESPITOSO': Habito.CESPITOSO,
    'SOLITARIO_GREGARIO': Habito.SOLITARIO_GREGARIO,
    'SOLITARIO_CESPITOSO': Habito.SOLITARIO_CESPITOSO,
    'SOLITARIO_DISPERSO': Habito.SOLITARIO_DISPERSO,
    'GREGARIO_CESPITOSO': Habito.GREGARIO_CESPITOSO,
    'GREGARIO_DISPERSOS': Habito.GREGARIO_DISPERSO,
    'GREGARIO_CESPITOSO_DISPERSOS': Habito.GREGARIO_CESPITOSO_DISPERSO
  };

  return mappings[normalized] || null;
};

export const normalizeNativaExotica = (value: string | null | undefined): NativaExotica | null => {
  if (!value) return null;
  
  const normalized = value.trim().toUpperCase().replace(/\.$/, '');
  
  if (normalized === 'NATIVA') return NativaExotica.NATIVA;
  if (normalized === 'EXOTICA') return NativaExotica.EXOTICA;
  
  return null;
};

export const normalizeSustratoTipo = (value: string | null | undefined): SustratoTipo | null => {
  if (!value) return null;
  
  const normalized = value.trim().toLowerCase();
  
  if (normalized.includes('madera muerta') || normalized.includes('rama') || 
      normalized.includes('tronco') || normalized.includes('palo') || 
      normalized.includes('bambú') || normalized.includes('liana') ||
      normalized.includes('ramita')) {
    return SustratoTipo.MADERA_MUERTA;
  }
  
  if (normalized.includes('madera viva')) {
    return SustratoTipo.MADERA_VIVA;
  }
  
  if (normalized.includes('hojarasca') || normalized.includes('hojas muertas') ||
      normalized.includes('hoja de') || normalized.includes('corteza')) {
    return SustratoTipo.HOJARASCA;
  }
  
  if (normalized.includes('arena')) {
    return SustratoTipo.ARENA;
  }
  
  if (normalized.includes('animal') || normalized.includes('hormiga') ||
      normalized.includes('larva') || normalized.includes('oruga') ||
      normalized.includes('grillo') || normalized.includes('saltamonte')) {
    return SustratoTipo.EN_ANIMAL_PARASITO;
  }
  
  // For now, map other soil types to OTRO since we don't have estiércol, pasto, etc. in current data
  return SustratoTipo.OTRO;
};