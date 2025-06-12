"use client";

import React, { useState, useEffect } from 'react';
import { getDynamicFields, saveDynamicField, deleteDynamicField } from '~/services/dynamicFields';
import type { FungiField, FieldType, FieldCategory } from '~/types';

// Available categories for dynamic fields
const FIELD_CATEGORIES = [
  { id: 'taxonomic', label: 'Información Taxonómica' },
  { id: 'sample_status', label: 'Estado de Muestra' },
  { id: 'ecological', label: 'Información Ecológica' },
  { id: 'morphological', label: 'Características Morfológicas' },
  { id: 'physical', label: 'Medidas Físicas' },
  { id: 'collection', label: 'Información de Recolección' },
  { id: 'coordinates', label: 'Coordenadas' },
  { id: 'spores', label: 'Información de Esporas' },
  { id: 'dna_processing', label: 'Procesamiento de ADN' },
  { id: 'molecular_analysis', label: 'Análisis Molecular' },
  { id: 'quality_control', label: 'Control de Calidad' },
  { id: 'research_notes', label: 'Notas de Investigación' },
  { id: 'other', label: 'Otros' }
] as const;

// Simple toast replacement - you can replace with a proper toast library later
const useToast = () => ({
  showToast: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const prefix = type === 'error' ? '❌ ' : type === 'success' ? '✅ ' : 'ℹ️ ';
    alert(prefix + message);
  }
});

// Icon components to replace lucide-react
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const SaveIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 0V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3m1 0h4m0 0v6m-4-6v6" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function DynamicFieldManager() {
  const [fields, setFields] = useState<FungiField[]>([]);
  const [editingField, setEditingField] = useState<Partial<FungiField> | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    try {
      const loadedFields = await getDynamicFields();
      setFields(loadedFields);
    } catch (error) {
      showToast('Error loading fields', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editingField) return;
    
    if (!editingField.key || !editingField.label || !editingField.type) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await saveDynamicField({
        ...editingField,
        key: editingField.key.replace(/\s+/g, '_').toLowerCase(),
        order: editingField.order ?? fields.length,
        visible: editingField.visible ?? true,
      });
      
      showToast(isAddingNew ? 'Field added successfully' : 'Field updated successfully', 'success');
      setEditingField(null);
      setIsAddingNew(false);
      await loadFields();
    } catch (error) {
      showToast('Error saving field', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field? This will not remove existing data.')) {
      return;
    }

    try {
      await deleteDynamicField(id);
      showToast('Field deleted successfully', 'success');
      await loadFields();
    } catch (error) {
      showToast('Error deleting field', 'error');
    }
  };

  const moveField = async (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= fields.length) return;
    
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
    
    // Update order for both fields
    try {
      await Promise.all([
        saveDynamicField({ ...newFields[index], order: index }),
        saveDynamicField({ ...newFields[newIndex], order: newIndex })
      ]);
      await loadFields();
    } catch (error) {
      showToast('Error reordering fields', 'error');
    }
  };

  const startAddNew = () => {
    setEditingField({
      key: '',
      label: '',
      type: 'string' as FieldType,
      required: false,
      visible: true,
      order: fields.length,
      enumOptions: [],
    });
    setIsAddingNew(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dynamic Fields Manager</h2>
        <button
          onClick={startAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <PlusIcon />
          Add Field
        </button>
      </div>

      {/* Field Editor */}
      {editingField && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">
            {isAddingNew ? 'Add New Field' : 'Edit Field'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Field Key</label>
              <input
                type="text"
                value={editingField.key || ''}
                onChange={(e) => setEditingField({ ...editingField, key: e.target.value })}
                placeholder="e.g., dna_processing_pass"
                className="w-full px-3 py-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Lowercase, no spaces (will be auto-formatted)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Display Label</label>
              <input
                type="text"
                value={editingField.label || ''}
                onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                placeholder="e.g., DNA Processing Pass"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Field Type</label>
              <select
                value={editingField.type || 'string'}
                onChange={(e) => setEditingField({ ...editingField, type: e.target.value as FieldType })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="string">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Yes/No</option>
                <option value="enum">Dropdown</option>
                <option value="date">Date</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={editingField.category || ''}
                onChange={(e) => setEditingField({ ...editingField, category: e.target.value as FieldCategory })}
                required
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Select category...</option>
                {FIELD_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.label}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {editingField.type === 'enum' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Options (one per line)</label>
                <textarea
                  value={(editingField.enumOptions || []).join('\n')}
                  onChange={(e) => setEditingField({ 
                    ...editingField, 
                    enumOptions: e.target.value.split('\n').filter(o => o.trim()) 
                  })}
                  placeholder="Poor&#10;Fair&#10;Good&#10;Excellent"
                  className="w-full px-3 py-2 border rounded h-24"
                />
              </div>
            )}

            {editingField.type === 'number' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Value</label>
                  <input
                    type="number"
                    value={editingField.min || ''}
                    onChange={(e) => setEditingField({ ...editingField, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Value</label>
                  <input
                    type="number"
                    value={editingField.max || ''}
                    onChange={(e) => setEditingField({ ...editingField, max: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={editingField.description || ''}
                onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
                placeholder="Optional field description"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingField.required || false}
                  onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                />
                <span className="text-sm">Required</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingField.visible ?? true}
                  onChange={(e) => setEditingField({ ...editingField, visible: e.target.checked })}
                />
                <span className="text-sm">Visible</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <SaveIcon />
              Save
            </button>
            <button
              onClick={() => {
                setEditingField(null);
                setIsAddingNew(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              <XIcon />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Fields List */}
      <div className="space-y-2">
        {fields.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No dynamic fields created yet.</p>
        ) : (
          fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div>
                    <h4 className="font-medium">{field.label}</h4>
                    <p className="text-sm text-gray-500">
                      Key: {field.key} | Type: {field.type}
                      {field.category && ` | Category: ${field.category}`}
                      {field.required && ' | Required'}
                      {!field.visible && ' | Hidden'}
                    </p>
                    {field.description && (
                      <p className="text-sm text-gray-600 mt-1">{field.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => moveField(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <ChevronUpIcon />
                </button>
                <button
                  onClick={() => moveField(index, 'down')}
                  disabled={index === fields.length - 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  <ChevronDownIcon />
                </button>
                <button
                  onClick={() => {
                    setEditingField(field);
                    setIsAddingNew(false);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(field.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}