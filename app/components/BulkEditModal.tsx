import React, { useState, useEffect } from "react";
import { FungiField } from "~/types";
import { db } from "~/firebase.client";
import { writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { getDynamicFields } from "~/services/dynamicFields";

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFungiIds: Set<string>;
  onSuccess: () => void;
}

interface BulkEditData {
  [key: string]: {
    value: any;
    enabled: boolean;
  };
}

const BulkEditModal: React.FC<BulkEditModalProps> = ({
  isOpen,
  onClose,
  selectedFungiIds,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [dynamicFields, setDynamicFields] = useState<FungiField[]>([]);
  
  // Static field data
  const [staticBulkEditData, setStaticBulkEditData] = useState<BulkEditData>({
    // Sample Status
    muestraConservada: { value: null, enabled: false },
    adnExtraido: { value: null, enabled: false },
    numeroExtractoAdn: { value: "", enabled: false },
    pcr: { value: "", enabled: false },
    
    // Ecological Information
    sustrato: { value: "", enabled: false },
    arbolAsociado: { value: "", enabled: false },
    nativaExotica: { value: "", enabled: false },
    habito: { value: "", enabled: false },
    
    // Morphological
    anillo: { value: null, enabled: false },
    volva: { value: null, enabled: false },
    textura: { value: "", enabled: false },
    color: { value: "", enabled: false },
    olor: { value: "", enabled: false },
    sporeprint: { value: "", enabled: false },
    esporadaColor: { value: "", enabled: false },
    himenio: { value: "", enabled: false },
    
    // Location
    lugar: { value: "", enabled: false },
    distrito: { value: "", enabled: false },
    provincia: { value: "", enabled: false },
    region: { value: "", enabled: false },
    
    // Notes
    notas: { value: "", enabled: false },
  });

  // Dynamic field data
  const [dynamicBulkEditData, setDynamicBulkEditData] = useState<BulkEditData>({});

  const fetchDynamicFields = async () => {
    try {
      const fields = await getDynamicFields();
      const visibleFields = fields.filter(field => field.visible);
      setDynamicFields(visibleFields);
      
      // Initialize dynamic bulk edit data
      const dynamicState: BulkEditData = {};
      visibleFields.forEach(field => {
        dynamicState[field.key] = {
          value: field.type === 'boolean' ? null : (field.type === 'number' ? '' : ''),
          enabled: false
        };
      });
      setDynamicBulkEditData(dynamicState);
    } catch (error) {
      console.error("Error fetching dynamic fields:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDynamicFields();
    }
  }, [isOpen]);

  const resetFormData = () => {
    // Reset static bulk edit data
    setStaticBulkEditData(prev => {
      const reset = { ...prev };
      Object.keys(reset).forEach(key => {
        reset[key] = {
          value: typeof reset[key].value === 'boolean' ? null : "",
          enabled: false
        };
      });
      return reset;
    });
    
    // Reset dynamic bulk edit data
    setDynamicBulkEditData(prev => {
      const reset = { ...prev };
      Object.keys(reset).forEach(key => {
        const field = dynamicFields.find(f => f.key === key);
        reset[key] = {
          value: field?.type === 'boolean' ? null : (field?.type === 'number' ? '' : ''),
          enabled: false
        };
      });
      return reset;
    });
  };

  const handleClose = () => {
    if (!loading) {
      resetFormData();
      onClose();
    }
  };

  const handleBulkEdit = async () => {
    if (selectedFungiIds.size === 0) return;

    setLoading(true);
    
    try {
      const batch = writeBatch(db);
      const updates: any = {};
      
      // Add all enabled static fields to updates
      Object.entries(staticBulkEditData).forEach(([field, data]) => {
        if (data.enabled && data.value !== null && data.value !== "") {
          updates[field] = data.value;
        }
      });
      
      // Add all enabled dynamic fields to updates
      Object.entries(dynamicBulkEditData).forEach(([field, data]) => {
        if (data.enabled && data.value !== null && data.value !== "") {
          const fieldDef = dynamicFields.find(f => f.key === field);
          let value = data.value;
          
          // Convert value based on field type
          if (fieldDef?.type === 'number') {
            value = parseFloat(data.value);
          } else if (fieldDef?.type === 'date') {
            value = new Date(data.value);
          }
          
          updates[field] = value;
        }
      });
      
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = serverTimestamp();
        
        selectedFungiIds.forEach(id => {
          const docRef = doc(db, 'fungi', id);
          batch.update(docRef, updates);
        });
        
        await batch.commit();
        
        // Reset form data and close modal
        resetFormData();
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error performing bulk edit:", error);
      alert("Error al actualizar los registros");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return Object.values(staticBulkEditData).some(field => field.enabled) || 
           Object.values(dynamicBulkEditData).some(field => field.enabled);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Editar {selectedFungiIds.size} registro{selectedFungiIds.size !== 1 ? 's' : ''}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          Selecciona los campos que deseas actualizar. Solo los campos marcados serán modificados.
        </p>
        
        <div className={`space-y-6 ${loading ? 'opacity-75 pointer-events-none' : ''}`}>
          {/* Sample Status Section */}
          <div className="border-b pb-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Estado de la Muestra</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ADN Extraído */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={staticBulkEditData.adnExtraido.enabled}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    adnExtraido: { ...staticBulkEditData.adnExtraido, enabled: e.target.checked }
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">ADN Extraído</label>
                  <select
                    disabled={!staticBulkEditData.adnExtraido.enabled}
                    value={staticBulkEditData.adnExtraido.value === null ? '' : staticBulkEditData.adnExtraido.value.toString()}
                    onChange={(e) => setStaticBulkEditData({
                      ...staticBulkEditData,
                      adnExtraido: { ...staticBulkEditData.adnExtraido, value: e.target.value === '' ? null : e.target.value === 'true' }
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>

              {/* Número Extracto ADN */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={staticBulkEditData.numeroExtractoAdn.enabled}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    numeroExtractoAdn: { ...staticBulkEditData.numeroExtractoAdn, enabled: e.target.checked }
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Número Extracto ADN</label>
                  <input
                    type="text"
                    disabled={!staticBulkEditData.numeroExtractoAdn.enabled}
                    value={staticBulkEditData.numeroExtractoAdn.value}
                    onChange={(e) => setStaticBulkEditData({
                      ...staticBulkEditData,
                      numeroExtractoAdn: { ...staticBulkEditData.numeroExtractoAdn, value: e.target.value }
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ecological Information Section */}
          <div className="border-b pb-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Información Ecológica</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sustrato */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={staticBulkEditData.sustrato.enabled}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    sustrato: { ...staticBulkEditData.sustrato, enabled: e.target.checked }
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Sustrato</label>
                  <input
                    type="text"
                    disabled={!staticBulkEditData.sustrato.enabled}
                    value={staticBulkEditData.sustrato.value}
                    onChange={(e) => setStaticBulkEditData({
                      ...staticBulkEditData,
                      sustrato: { ...staticBulkEditData.sustrato, value: e.target.value }
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Árbol Asociado */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={staticBulkEditData.arbolAsociado.enabled}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    arbolAsociado: { ...staticBulkEditData.arbolAsociado, enabled: e.target.checked }
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Árbol Asociado</label>
                  <input
                    type="text"
                    disabled={!staticBulkEditData.arbolAsociado.enabled}
                    value={staticBulkEditData.arbolAsociado.value}
                    onChange={(e) => setStaticBulkEditData({
                      ...staticBulkEditData,
                      arbolAsociado: { ...staticBulkEditData.arbolAsociado, value: e.target.value }
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="border-b pb-4">
            <h4 className="text-md font-medium text-gray-800 mb-3">Ubicación</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lugar */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={staticBulkEditData.lugar.enabled}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    lugar: { ...staticBulkEditData.lugar, enabled: e.target.checked }
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Lugar</label>
                  <input
                    type="text"
                    disabled={!staticBulkEditData.lugar.enabled}
                    value={staticBulkEditData.lugar.value}
                    onChange={(e) => setStaticBulkEditData({
                      ...staticBulkEditData,
                      lugar: { ...staticBulkEditData.lugar, value: e.target.value }
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Distrito */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={staticBulkEditData.distrito.enabled}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    distrito: { ...staticBulkEditData.distrito, enabled: e.target.checked }
                  })}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Distrito</label>
                  <input
                    type="text"
                    disabled={!staticBulkEditData.distrito.enabled}
                    value={staticBulkEditData.distrito.value}
                    onChange={(e) => setStaticBulkEditData({
                      ...staticBulkEditData,
                      distrito: { ...staticBulkEditData.distrito, value: e.target.value }
                    })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Fields Section */}
          {dynamicFields.length > 0 && (
            <div className="border-b pb-4">
              <h4 className="text-md font-medium text-gray-800 mb-3">Campos Personalizados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicFields.map((field) => (
                  <div key={field.key} className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={dynamicBulkEditData[field.key]?.enabled || false}
                      onChange={(e) => setDynamicBulkEditData({
                        ...dynamicBulkEditData,
                        [field.key]: { 
                          ...dynamicBulkEditData[field.key], 
                          enabled: e.target.checked 
                        }
                      })}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                      {field.type === 'boolean' ? (
                        <select
                          disabled={!dynamicBulkEditData[field.key]?.enabled}
                          value={dynamicBulkEditData[field.key]?.value === null ? '' : dynamicBulkEditData[field.key]?.value?.toString()}
                          onChange={(e) => setDynamicBulkEditData({
                            ...dynamicBulkEditData,
                            [field.key]: { 
                              ...dynamicBulkEditData[field.key], 
                              value: e.target.value === '' ? null : e.target.value === 'true' 
                            }
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Seleccionar...</option>
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      ) : field.type === 'enum' ? (
                        <select
                          disabled={!dynamicBulkEditData[field.key]?.enabled}
                          value={dynamicBulkEditData[field.key]?.value || ''}
                          onChange={(e) => setDynamicBulkEditData({
                            ...dynamicBulkEditData,
                            [field.key]: { 
                              ...dynamicBulkEditData[field.key], 
                              value: e.target.value 
                            }
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        >
                          <option value="">Seleccionar...</option>
                          {field.enumOptions?.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : field.type === 'number' ? (
                        <input
                          type="number"
                          disabled={!dynamicBulkEditData[field.key]?.enabled}
                          value={dynamicBulkEditData[field.key]?.value || ''}
                          onChange={(e) => setDynamicBulkEditData({
                            ...dynamicBulkEditData,
                            [field.key]: { 
                              ...dynamicBulkEditData[field.key], 
                              value: e.target.value 
                            }
                          })}
                          min={field.min}
                          max={field.max}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      ) : field.type === 'date' ? (
                        <input
                          type="date"
                          disabled={!dynamicBulkEditData[field.key]?.enabled}
                          value={dynamicBulkEditData[field.key]?.value || ''}
                          onChange={(e) => setDynamicBulkEditData({
                            ...dynamicBulkEditData,
                            [field.key]: { 
                              ...dynamicBulkEditData[field.key], 
                              value: e.target.value 
                            }
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      ) : (
                        <input
                          type="text"
                          disabled={!dynamicBulkEditData[field.key]?.enabled}
                          value={dynamicBulkEditData[field.key]?.value || ''}
                          onChange={(e) => setDynamicBulkEditData({
                            ...dynamicBulkEditData,
                            [field.key]: { 
                              ...dynamicBulkEditData[field.key], 
                              value: e.target.value 
                            }
                          })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">Notas</h4>
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={staticBulkEditData.notas.enabled}
                onChange={(e) => setStaticBulkEditData({
                  ...staticBulkEditData,
                  notas: { ...staticBulkEditData.notas, enabled: e.target.checked }
                })}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea
                  disabled={!staticBulkEditData.notas.enabled}
                  value={staticBulkEditData.notas.value}
                  onChange={(e) => setStaticBulkEditData({
                    ...staticBulkEditData,
                    notas: { ...staticBulkEditData.notas, value: e.target.value }
                  })}
                  rows={3}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex space-x-3 sticky bottom-0 bg-white pt-4 border-t">
          <button
            onClick={handleBulkEdit}
            disabled={loading || !isFormValid()}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Aplicando Cambios...
              </>
            ) : (
              'Aplicar Cambios'
            )}
          </button>
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;