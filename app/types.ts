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
  codigoAndres?: string;
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
