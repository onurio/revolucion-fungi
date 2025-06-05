import React, { useState } from "react";
import { processCSVContent } from "~/utils/csvProcessor";
import { NewFungi } from "~/types";
import { db, storage } from "~/firebase.client";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import DirectoryPhotoUpload from "./DirectoryPhotoUpload.client";

interface CSVImportProps {
  onImportComplete?: (fungi: NewFungi[]) => void;
}

const CSVImport: React.FC<CSVImportProps> = ({ onImportComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [importedFungi, setImportedFungi] = useState<NewFungi[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadPhotos, setUploadPhotos] = useState(false);
  const [photoResults, setPhotoResults] = useState<{ [codigoFungario: string]: string[] }>({});
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setErrors([]);
    } else {
      setErrors(["Por favor selecciona un archivo CSV válido."]);
    }
  };

  const processCSV = async () => {
    if (!file) {
      setErrors(["No se ha seleccionado ningún archivo."]);
      return;
    }

    setIsProcessing(true);
    setProcessingStatus("Leyendo archivo CSV...");
    setErrors([]);

    try {
      const text = await file.text();
      setProcessingStatus("Procesando datos de hongos...");
      
      const fungiData = await processCSVContent(text, false); // Don't upload photos during CSV processing
      setImportedFungi(fungiData);
      
      setProcessingStatus(`Procesados ${fungiData.length} registros de hongos.`);
      
      if (onImportComplete) {
        onImportComplete(fungiData);
      }
    } catch (error) {
      console.error("Error processing CSV:", error);
      setErrors([`Error procesando CSV: ${error instanceof Error ? error.message : 'Error desconocido'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveToFirestore = async (uploadPhotosFirst: boolean = false) => {
    if (importedFungi.length === 0) {
      setErrors(["No hay datos para guardar."]);
      return;
    }

    setIsProcessing(true);
    
    try {
      const fungiCollection = collection(db, "fungi");
      let savedCount = 0;
      
      // Process each fungi individually: upload images then save complete record
      for (const fungi of importedFungi) {
        try {
          setProcessingStatus(`Procesando ${fungi.codigoFungario} (${savedCount + 1}/${importedFungi.length})...`);
          
          // Step 1: Check if fungi record already exists in Firestore
          const fungiDoc = doc(fungiCollection, fungi.codigoFungario);
          const existingDoc = await getDoc(fungiDoc);
          
          if (existingDoc.exists()) {
            setProcessingStatus(`🔄 ${fungi.codigoFungario} ya existe, actualizando...`);
          } else {
            setProcessingStatus(`🆕 Creando nuevo registro ${fungi.codigoFungario}...`);
          }
          
          // Step 2: Get all images for this fungi from Firebase Storage
          setProcessingStatus(`Obteniendo imágenes de Storage para ${fungi.codigoFungario}...`);
          let imageUrls: string[] = [];
          
          try {
            // Check Firebase Storage for all images of this fungi
            const storageRef = ref(storage, `fungi/${fungi.codigoFungario}/`);
            const listResult = await listAll(storageRef);
            
            // Get download URLs for all images found in storage
            const urlPromises = listResult.items.map(async (itemRef) => {
              try {
                return await getDownloadURL(itemRef);
              } catch (error) {
                console.error(`Error getting URL for ${itemRef.name}:`, error);
                return null;
              }
            });
            
            const urls = await Promise.all(urlPromises);
            imageUrls = urls.filter(url => url !== null) as string[];
            
            console.log(`Found ${imageUrls.length} images in Storage for ${fungi.codigoFungario}`);
            
          } catch (error) {
            console.log(`No images found in Storage for ${fungi.codigoFungario}, using fallback`);
            
            // Fallback to photo results or CSV data
            if (photoResults[fungi.codigoFungario]) {
              imageUrls = photoResults[fungi.codigoFungario];
              console.log(`Using ${imageUrls.length} images from photo results for ${fungi.codigoFungario}`);
            } else {
              imageUrls = fungi.images || [];
              console.log(`Using ${imageUrls.length} images from CSV for ${fungi.codigoFungario}`);
            }
          }
          
          // Step 3: Create complete fungi record with all data
          const completeFungiRecord = {
            ...fungi,
            images: imageUrls,
          };
          
          // Remove undefined values for Firestore compatibility
          const cleanFungiData = Object.fromEntries(
            Object.entries({
              ...completeFungiRecord,
              id: fungi.codigoFungario,
            }).filter(([key, value]) => value !== undefined)
          );
          
          // Step 4: Save/Update complete record to Firestore
          const isUpdate = existingDoc.exists();
          setProcessingStatus(`${isUpdate ? 'Actualizando' : 'Guardando'} ${fungi.codigoFungario} completo en base de datos...`);
          console.log(`${isUpdate ? 'Updating' : 'Creating'} fungi ${fungi.codigoFungario} in Firestore with ${imageUrls.length} images`);
          
          // Merge with existing data if updating (preserve any fields not in CSV)
          if (isUpdate) {
            const existingData = existingDoc.data();
            const mergedData = {
              ...existingData,  // Keep existing data
              ...cleanFungiData,  // Override with new CSV data
              updatedAt: new Date(),  // Always update timestamp
            };
            await setDoc(fungiDoc, mergedData);
          } else {
            await setDoc(fungiDoc, cleanFungiData);
          }
          
          savedCount++;
          console.log(`✅ Successfully ${isUpdate ? 'updated' : 'created'} ${fungi.codigoFungario} in Firestore`);
          setProcessingStatus(`✅ ${isUpdate ? 'Actualizado' : 'Creado'} ${fungi.codigoFungario} (${savedCount}/${importedFungi.length})`);
          
          // Small delay to show progress
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`Error processing fungi ${fungi.codigoFungario}:`, error);
          setProcessingStatus(`❌ Error con ${fungi.codigoFungario}, continuando...`);
        }
      }
      
      setProcessingStatus(`✅ Completados ${savedCount}/${importedFungi.length} registros en la base de datos.`);
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      setErrors([`Error guardando en base de datos: ${error instanceof Error ? error.message : 'Error desconocido'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhotosProcessed = async (results: { [codigoFungario: string]: string[] }) => {
    setPhotoResults(results);
    setShowPhotoUpload(false);
    
    const totalImages = Object.values(results).reduce((sum, urls) => sum + urls.length, 0);
    setProcessingStatus(`✅ Fotos procesadas: ${totalImages} imágenes para ${Object.keys(results).length} hongos. Guardando en base de datos...`);
    
    // Automatically save to database after photos are processed
    await saveToFirestore();
  };

  const getFungiCodes = () => {
    return importedFungi.map(fungi => fungi.codigoFungario);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Importar Datos de Hongos desde CSV
      </h2>
      
      <div className="space-y-6">
        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar archivo CSV
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>


        {/* Actions */}
        <div className="flex space-x-4">
          <button
            onClick={processCSV}
            disabled={!file || isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Procesando..." : "Procesar CSV"}
          </button>
          
          {importedFungi.length > 0 && (
            <>
              <button
                onClick={() => setShowPhotoUpload(!showPhotoUpload)}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {showPhotoUpload ? "Ocultar" : "Procesar Fotos y Guardar Todo"}
              </button>
              
              <button
                onClick={() => saveToFirestore()}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Guardando..." : "Solo Guardar Datos (sin fotos)"}
              </button>
            </>
          )}
        </div>

        {/* Status */}
        {processingStatus && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-blue-800">{processingStatus}</p>
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-red-800 font-medium mb-2">Errores:</h3>
            <ul className="list-disc list-inside text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Photo Upload Section */}
        {showPhotoUpload && importedFungi.length > 0 && (
          <div className="mt-6">
            <DirectoryPhotoUpload
              fungiCodes={getFungiCodes()}
              onPhotosProcessed={handlePhotosProcessed}
            />
          </div>
        )}

        {/* Photo Results Summary */}
        {Object.keys(photoResults).length > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-green-800 font-medium mb-2">Fotos Procesadas:</h3>
            <div className="text-green-700 text-sm space-y-1">
              {Object.entries(photoResults).map(([code, urls]) => (
                <div key={code} className="flex justify-between">
                  <span>{code}</span>
                  <span>{urls.length} fotos</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        {importedFungi.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Vista previa ({importedFungi.length} registros)
            </h3>
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Género
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especie
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lugar
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importedFungi.slice(0, 10).map((fungi, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {fungi.codigoFungario}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {fungi.genero}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {fungi.especie || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {fungi.lugar || "-"}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {fungi.fecha ? fungi.fecha.toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {importedFungi.length > 10 && (
                <div className="p-4 text-center text-gray-500 bg-gray-50">
                  Y {importedFungi.length - 10} registros más...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVImport;