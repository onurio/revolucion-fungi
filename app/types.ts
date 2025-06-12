export type Registry = {
  id: string;
  images: File[];
  createdAt: Date;
  updatedAt: Date;
};

// NewRegistry is same as Registry but an optional id field
export type NewRegistry = Omit<Registry, "id"> & { id?: string };

export type Fungi = {
  id: string;
  codigoFungario: string;
  genero: string;
  especie?: string;
  muestraConservada: boolean;
  adnExtraido: boolean;
  numeroExtractoAdn?: string;
  pcr?: string;
  sustrato?: string;
  arbolAsociado?: string;
  nativaExotica?: string;
  habito?: string;
  numeroCarpoforos?: number;
  olor?: string;
  sporeprint?: string;
  esporadaColor?: string;
  himenio?: string;
  anillo: boolean;
  volva: boolean;
  textura?: string;
  notas?: string;
  color?: string;
  largoCuerpo?: number;
  diametroSombrero?: number;
  altitud?: number;
  coordenadaX?: number;
  coordenadaY?: number;
  utmX?: number;
  utmY?: number;
  fecha?: Date;
  lugar?: string;
  distrito?: string;
  provincia?: string;
  region?: string;
  collectorId?: string;
  collectorIds?: string[];
  images: string[];
  thumbnailUrl?: string; // URL of the selected thumbnail image
  imageOrder?: number[]; // Array of indices to define custom image order
  createdAt: Date;
  updatedAt: Date;
};

export type NewFungi = Omit<Fungi, "id"> & { id?: string };

export type Collector = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  institution?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NewCollector = Omit<Collector, "id"> & { id?: string };

// Dynamic field system for Fungi
export type FieldType = 'string' | 'number' | 'boolean' | 'enum' | 'date';

export type FieldCategory = 
  | 'Información Taxonómica'
  | 'Estado de Muestra'
  | 'Información Ecológica' 
  | 'Características Morfológicas'
  | 'Medidas Físicas'
  | 'Información de Recolección'
  | 'Coordenadas'
  | 'Información de Esporas'
  | 'Procesamiento de ADN'
  | 'Análisis Molecular'
  | 'Control de Calidad'
  | 'Notas de Investigación'
  | 'Otros';

export type FungiField = {
  id: string;
  key: string; // The field key in the Fungi object
  label: string; // Display name
  type: FieldType;
  category: FieldCategory; // Required category to group fields
  description?: string;
  required?: boolean;
  enumOptions?: string[]; // For enum type fields
  min?: number; // For number type validation
  max?: number; // For number type validation
  placeholder?: string;
  order: number; // Display order in forms/views
  visible: boolean; // Show/hide in UI
  createdAt: Date;
  updatedAt: Date;
};

// Extended Fungi type that includes dynamic fields
export type FungiWithDynamicFields = Fungi & {
  [key: string]: any; // Allow any additional fields
};
