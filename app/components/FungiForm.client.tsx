import React, { useState, useEffect } from "react";
import { Fungi, NewFungi, Collector, FungiField, FungiWithDynamicFields } from "~/types";
import { Himenio, Habito, NativaExotica, SustratoTipo } from "~/types/fungi-enums";
import { db } from "~/firebase.client";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "@remix-run/react";
import ImageManagement from "./ImageManagement";
import { getDynamicFields, validateFieldValue, convertFieldValue } from "~/services/dynamicFields";

interface FungiFormProps {
  fungi?: Fungi;
  onSave?: () => void;
  onCancel?: () => void;
}

const FungiForm: React.FC<FungiFormProps> = ({ fungi, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [dynamicFields, setDynamicFields] = useState<FungiField[]>([]);
  const [formData, setFormData] = useState<FungiWithDynamicFields>({
    codigoFungario: "",
    genero: "",
    especie: "",
    muestraConservada: false,
    adnExtraido: false,
    numeroExtractoAdn: "",
    pcr: "",
    sustrato: "",
    sustratoTipo: "",
    arbolAsociado: "",
    nativaExotica: "",
    habito: "",
    numeroCarpoforos: undefined,
    olor: "",
    sporeprint: "",
    esporadaColor: "",
    himenio: "",
    anillo: false,
    volva: false,
    textura: "",
    notas: "",
    color: "",
    largoCuerpo: undefined,
    diametroSombrero: undefined,
    altitud: undefined,
    coordenadaX: undefined,
    coordenadaY: undefined,
    utmX: undefined,
    utmY: undefined,
    fecha: undefined,
    lugar: "",
    distrito: "",
    provincia: "",
    region: "",
    collectorIds: [],
    images: [],
    thumbnailUrl: undefined,
    imageOrder: undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  useEffect(() => {
    fetchCollectors();
    fetchDynamicFields();
    if (fungi) {
      setFormData({
        ...fungi,
        updatedAt: new Date(),
      });
    }
  }, [fungi]);

  const fetchDynamicFields = async () => {
    try {
      const fields = await getDynamicFields();
      setDynamicFields(fields.filter(f => f.visible));
    } catch (error) {
      console.error("Error fetching dynamic fields:", error);
    }
  };

  const fetchCollectors = async () => {
    try {
      const collectorsCollection = collection(db, "collectors");
      const querySnapshot = await getDocs(collectorsCollection);
      const collectorsData: Collector[] = [];

      querySnapshot.forEach((doc) => {
        collectorsData.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as Collector);
      });

      setCollectors(collectorsData);
    } catch (error) {
      console.error("Error fetching collectors:", error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImagesChange = (imageUrls: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: imageUrls,
    }));
  };

  const handleThumbnailChange = (thumbnailUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: thumbnailUrl || undefined,
    }));
  };

  const handleImageOrderChange = (newOrder: number[]) => {
    setFormData((prev) => ({
      ...prev,
      imageOrder: newOrder,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate dynamic fields
    for (const field of dynamicFields) {
      if (!validateFieldValue(field, formData[field.key])) {
        alert(`Invalid value for ${field.label}`);
        setLoading(false);
        return;
      }
    }

    try {
      const fungiCollection = collection(db, "fungi");

      // Clean up undefined values - Firebase doesn't accept undefined
      const cleanFormData = Object.fromEntries(
        Object.entries({
          ...formData,
          updatedAt: new Date(),
        }).filter(([key, value]) => value !== undefined)
      );

      if (fungi?.id) {
        // Update existing fungi
        const fungiDoc = doc(db, "fungi", fungi.id);
        await updateDoc(fungiDoc, cleanFormData);
      } else {
        // Create new fungi
        await addDoc(fungiCollection, {
          ...cleanFormData,
          createdAt: new Date(),
        });
      }

      if (onSave) {
        onSave();
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Error saving fungi:", error);
      alert("Error al guardar el hongo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Identification Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Identificación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Fungario *
              </label>
              <input
                type="text"
                required
                value={formData.codigoFungario}
                onChange={(e) =>
                  handleInputChange("codigoFungario", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género *
              </label>
              <input
                type="text"
                required
                value={formData.genero}
                onChange={(e) => handleInputChange("genero", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Especie
              </label>
              <input
                type="text"
                value={formData.especie || ""}
                onChange={(e) => handleInputChange("especie", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Sample Status Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Estado de Muestra
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="muestraConservada"
                  checked={formData.muestraConservada}
                  onChange={(e) =>
                    handleInputChange("muestraConservada", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="muestraConservada"
                  className="ml-2 text-sm text-gray-700"
                >
                  Muestra conservada
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="adnExtraido"
                  checked={formData.adnExtraido}
                  onChange={(e) =>
                    handleInputChange("adnExtraido", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="adnExtraido"
                  className="ml-2 text-sm text-gray-700"
                >
                  ADN extraído
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número extracto ADN
                </label>
                <input
                  type="text"
                  value={formData.numeroExtractoAdn || ""}
                  onChange={(e) =>
                    handleInputChange("numeroExtractoAdn", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PCR
                </label>
                <input
                  type="text"
                  value={formData.pcr || ""}
                  onChange={(e) => handleInputChange("pcr", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ecological Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información Ecológica
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Sustrato
              </label>
              <select
                value={formData.sustratoTipo || ""}
                onChange={(e) => handleInputChange("sustratoTipo", e.target.value as SustratoTipo || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value={SustratoTipo.PASTO}>🌱 Pasto</option>
                <option value={SustratoTipo.PINOCHA}>🌲 Pinocha (Pinos)</option>
                <option value={SustratoTipo.HOJARASCA}>🍂 Hojarasca</option>
                <option value={SustratoTipo.MADERA_MUERTA}>🪵 Madera muerta</option>
                <option value={SustratoTipo.MADERA_VIVA}>🌳 Madera viva</option>
                <option value={SustratoTipo.MUSGO}>🌿 Musgo</option>
                <option value={SustratoTipo.ARENA}>🏖️ Arena</option>
                <option value={SustratoTipo.ESTIERCOL}>💩 Estiércol</option>
                <option value={SustratoTipo.EN_ANIMAL_PARASITO}>🐛 En animal (parásito)</option>
                <option value={SustratoTipo.OTRO}>❓ Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Sustrato
              </label>
              <input
                type="text"
                value={formData.sustrato || ""}
                onChange={(e) => handleInputChange("sustrato", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Detalles específicos del sustrato..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Árbol o planta asociada
              </label>
              <input
                type="text"
                value={formData.arbolAsociado || ""}
                onChange={(e) =>
                  handleInputChange("arbolAsociado", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nativa/Exótica
              </label>
              <select
                value={formData.nativaExotica || ""}
                onChange={(e) =>
                  handleInputChange("nativaExotica", e.target.value as NativaExotica || null)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value={NativaExotica.NATIVA}>🌿 Nativa</option>
                <option value={NativaExotica.EXOTICA}>🌍 Exótica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hábito
              </label>
              <select
                value={formData.habito || ""}
                onChange={(e) => handleInputChange("habito", e.target.value as Habito || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value={Habito.SOLITARIO}>🍄 Solitario</option>
                <option value={Habito.GREGARIO}>🍄🍄 Gregario</option>
                <option value={Habito.CESPITOSO}>🍄🍄🍄 Cespitoso</option>
                <option value={Habito.SOLITARIO_GREGARIO}>🍄/🍄🍄 Solitario/Gregario</option>
                <option value={Habito.SOLITARIO_CESPITOSO}>🍄🍄🍄 Solitario, Cespitoso</option>
                <option value={Habito.SOLITARIO_DISPERSO}>🍄💨 Solitario, Disperso</option>
                <option value={Habito.GREGARIO_CESPITOSO}>🍄🍄🍄 Gregario, Cespitoso</option>
                <option value={Habito.GREGARIO_DISPERSO}>🍄🍄💨 Gregario, Disperso</option>
                <option value={Habito.GREGARIO_CESPITOSO_DISPERSO}>🍄🍄🍄💨 Gregario, Cespitoso y Disperso</option>
              </select>
            </div>
          </div>
        </div>

        {/* Morphological Characteristics Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Características Morfológicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de carpóforos
              </label>
              <input
                type="number"
                value={formData.numeroCarpoforos || ""}
                onChange={(e) =>
                  handleInputChange(
                    "numeroCarpoforos",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Olor
              </label>
              <input
                type="text"
                value={formData.olor || ""}
                onChange={(e) => handleInputChange("olor", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Himenio
              </label>
              <select
                value={formData.himenio || ""}
                onChange={(e) => handleInputChange("himenio", e.target.value as Himenio || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option value={Himenio.APOTECIO}>🥣 Apotecio</option>
                <option value={Himenio.ARRUGADO}>🌊 Arrugado</option>
                <option value={Himenio.CORAL}>🪸 Coral</option>
                <option value={Himenio.CORALOIDE}>🪸 Coraloide</option>
                <option value={Himenio.DIENTES}>🦷 Dientes</option>
                <option value={Himenio.ESTROMA_CON_PERITECIOS}>⚫ Estroma con peritecios</option>
                <option value={Himenio.ESTROMA_REDONDA}>⭕ Estroma redonda</option>
                <option value={Himenio.GASTEROIDE}>🎈 Gasteroide</option>
                <option value={Himenio.GELATINOSO}>🟦 Gelatinoso</option>
                <option value={Himenio.LAMINILLAS}>📄 Laminillas</option>
                <option value={Himenio.LAMINAS}>📋 Láminas</option>
                <option value={Himenio.MASA_INTERNA_ESPORAS}>🔵 Masa interna de esporas</option>
                <option value={Himenio.MASA_LIQUIDA_ESPORAS}>💧 Masa líquida de esporas</option>
                <option value={Himenio.NIDO}>🪺 Nido</option>
                <option value={Himenio.POROS}>🧽 Poros</option>
                <option value={Himenio.POROS_MICROSCOPICOS}>🔍 Poros (microscópicos)</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="anillo"
                checked={formData.anillo}
                onChange={(e) => handleInputChange("anillo", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="anillo" className="ml-2 text-sm text-gray-700">
                Anillo
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="volva"
                checked={formData.volva}
                onChange={(e) => handleInputChange("volva", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="volva" className="ml-2 text-sm text-gray-700">
                Volva
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Textura
              </label>
              <input
                type="text"
                value={formData.textura || ""}
                onChange={(e) => handleInputChange("textura", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                value={formData.color || ""}
                onChange={(e) => handleInputChange("color", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Physical Measurements Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Medidas Físicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Largo del cuerpo (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.largoCuerpo || ""}
                onChange={(e) =>
                  handleInputChange(
                    "largoCuerpo",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diámetro del sombrero (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.diametroSombrero || ""}
                onChange={(e) =>
                  handleInputChange(
                    "diametroSombrero",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altitud (m)
              </label>
              <input
                type="number"
                value={formData.altitud || ""}
                onChange={(e) =>
                  handleInputChange(
                    "altitud",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Location Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Ubicación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={
                  formData.fecha
                    ? formData.fecha.toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "fecha",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lugar
              </label>
              <input
                type="text"
                value={formData.lugar || ""}
                onChange={(e) => handleInputChange("lugar", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distrito
              </label>
              <input
                type="text"
                value={formData.distrito || ""}
                onChange={(e) => handleInputChange("distrito", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia
              </label>
              <input
                type="text"
                value={formData.provincia || ""}
                onChange={(e) => handleInputChange("provincia", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Región
              </label>
              <input
                type="text"
                value={formData.region || ""}
                onChange={(e) => handleInputChange("region", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Colectores
              </label>
              <select
                multiple
                value={formData.collectorIds || []}
                onChange={(e) => {
                  const selectedOptions = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  handleInputChange("collectorIds", selectedOptions);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                size={4}
              >
                {collectors.map((collector) => (
                  <option key={collector.id} value={collector.id}>
                    {collector.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Coordinates Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Coordenadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordenada X
              </label>
              <input
                type="number"
                step="any"
                value={formData.coordenadaX || ""}
                onChange={(e) =>
                  handleInputChange(
                    "coordenadaX",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordenada Y
              </label>
              <input
                type="number"
                step="any"
                value={formData.coordenadaY || ""}
                onChange={(e) =>
                  handleInputChange(
                    "coordenadaY",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UTM X
              </label>
              <input
                type="number"
                step="any"
                value={formData.utmX || ""}
                onChange={(e) =>
                  handleInputChange(
                    "utmX",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UTM Y
              </label>
              <input
                type="number"
                step="any"
                value={formData.utmY || ""}
                onChange={(e) =>
                  handleInputChange(
                    "utmY",
                    e.target.value ? parseFloat(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Spore Information Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Información de Esporas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sporeprint
              </label>
              <input
                type="text"
                value={formData.sporeprint || ""}
                onChange={(e) =>
                  handleInputChange("sporeprint", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color de esporada
              </label>
              <input
                type="text"
                value={formData.esporadaColor || ""}
                onChange={(e) =>
                  handleInputChange("esporadaColor", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas</h3>
          <textarea
            value={formData.notas || ""}
            onChange={(e) => handleInputChange("notas", e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Notas adicionales sobre el hongo..."
          />
        </div>

        {/* Dynamic Fields Sections */}
        {dynamicFields.length > 0 && (
          <>
            {/* Group fields by category */}
            {Object.entries(
              dynamicFields.reduce((acc, field) => {
                const category = field.category || 'Otros';
                if (!acc[category]) acc[category] = [];
                acc[category].push(field);
                return acc;
              }, {} as Record<string, FungiField[]>)
            ).map(([category, fields]) => (
              <div key={category} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {field.type === 'string' && (
                        <input
                          type="text"
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value ? Number(e.target.value) : null)}
                          min={field.min}
                          max={field.max}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                      {field.type === 'boolean' && (
                        <div className="flex items-center mt-2">
                          <input
                            type="checkbox"
                            id={field.key}
                            checked={formData[field.key] || false}
                            onChange={(e) => handleInputChange(field.key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={field.key} className="ml-2 text-sm text-gray-700">
                            {field.description || 'Sí'}
                          </label>
                        </div>
                      )}
                      {field.type === 'enum' && (
                        <select
                          value={formData[field.key] || ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Seleccionar...</option>
                          {field.enumOptions?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}
                      {field.type === 'date' && (
                        <input
                          type="date"
                          value={formData[field.key] ? new Date(formData[field.key]).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleInputChange(field.key, e.target.value ? new Date(e.target.value) : null)}
                          required={field.required}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                      {field.description && (
                        <p className="text-xs text-gray-500 mt-1">{field.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Imágenes</h3>
          <ImageManagement
            codigoFungario={formData.codigoFungario}
            existingImages={formData.images || []}
            selectedThumbnail={formData.thumbnailUrl}
            imageOrder={formData.imageOrder}
            onImagesChange={handleImagesChange}
            onThumbnailChange={handleThumbnailChange}
            onImageOrderChange={handleImageOrderChange}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : fungi ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FungiForm;
