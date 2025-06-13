import React from "react";
import { Himenio, Habito, NativaExotica, SustratoTipo } from "~/types/fungi-enums";

interface EnumFiltersProps {
  filters: {
    himenio: string;
    habito: string;
    nativaExotica: string;
    sustratoTipo: string;
    adnExtraido: string;
    muestraConservada: string;
    anillo: string;
    volva: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  showAdvanced?: boolean;
}

// Helper functions for emoji display (reused from Listings)
const getHimenioEmoji = (value: string): string => {
  switch (value) {
    case Himenio.APOTECIO: return "🥣";
    case Himenio.ARRUGADO: return "🌊";
    case Himenio.CORAL: return "🪸";
    case Himenio.CORALOIDE: return "🪸";
    case Himenio.DIENTES: return "🦷";
    case Himenio.ESTROMA_CON_PERITECIOS: return "⚫";
    case Himenio.ESTROMA_REDONDA: return "⭕";
    case Himenio.GASTEROIDE: return "🎈";
    case Himenio.GELATINOSO: return "🟦";
    case Himenio.LAMINILLAS: return "📄";
    case Himenio.LAMINAS: return "📋";
    case Himenio.MASA_INTERNA_ESPORAS: return "🔵";
    case Himenio.MASA_LIQUIDA_ESPORAS: return "💧";
    case Himenio.NIDO: return "🪺";
    case Himenio.POROS: return "🧽";
    case Himenio.POROS_MICROSCOPICOS: return "🔍";
    default: return "";
  }
};

const getHabitoEmoji = (value: string): string => {
  switch (value) {
    case Habito.SOLITARIO: return "🍄";
    case Habito.GREGARIO: return "🍄🍄";
    case Habito.CESPITOSO: return "🍄🍄🍄";
    default: return "🍄";
  }
};

const getSustratoTipoEmoji = (value: string): string => {
  switch (value) {
    case SustratoTipo.PASTO: return "🌱";
    case SustratoTipo.PINOCHA: return "🌲";
    case SustratoTipo.HOJARASCA: return "🍂";
    case SustratoTipo.MADERA_MUERTA: return "🪵";
    case SustratoTipo.MADERA_VIVA: return "🌳";
    case SustratoTipo.MUSGO: return "🌿";
    case SustratoTipo.ARENA: return "🏖️";
    case SustratoTipo.ESTIERCOL: return "💩";
    case SustratoTipo.EN_ANIMAL_PARASITO: return "🐛";
    case SustratoTipo.OTRO: return "❓";
    default: return "";
  }
};

const getNativaExoticaEmoji = (value: string): string => {
  switch (value) {
    case NativaExotica.NATIVA: return "🌿";
    case NativaExotica.EXOTICA: return "🌍";
    default: return "";
  }
};

const formatEnumLabel = (value: string, getEmoji: (v: string) => string): string => {
  const emoji = getEmoji(value);
  const formatted = value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  return `${emoji} ${formatted}`;
};

const EnumFilters: React.FC<EnumFiltersProps> = ({
  filters,
  onFilterChange,
  showAdvanced = false
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const clearAllFilters = () => {
    onFilterChange('himenio', '');
    onFilterChange('habito', '');
    onFilterChange('nativaExotica', '');
    onFilterChange('sustratoTipo', '');
    onFilterChange('adnExtraido', '');
    onFilterChange('muestraConservada', '');
    onFilterChange('anillo', '');
    onFilterChange('volva', '');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-gray-700"
          >
            <span>Filtros</span>
            <svg 
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {Object.values(filters).filter(v => v !== '').length} activo{Object.values(filters).filter(v => v !== '').length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="space-y-6">{/* Filter content container */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hábito Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Hábito
          </label>
          <select
            value={filters.habito}
            onChange={(e) => onFilterChange('habito', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos</option>
            {Object.values(Habito).map((value) => (
              <option key={value} value={value}>
                {formatEnumLabel(value, getHabitoEmoji)}
              </option>
            ))}
          </select>
        </div>

        {/* Sustrato Tipo Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Sustrato
          </label>
          <select
            value={filters.sustratoTipo}
            onChange={(e) => onFilterChange('sustratoTipo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos</option>
            {Object.values(SustratoTipo).map((value) => (
              <option key={value} value={value}>
                {formatEnumLabel(value, getSustratoTipoEmoji)}
              </option>
            ))}
          </select>
        </div>

        {/* Nativa/Exótica Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Origen
          </label>
          <select
            value={filters.nativaExotica}
            onChange={(e) => onFilterChange('nativaExotica', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos</option>
            {Object.values(NativaExotica).map((value) => (
              <option key={value} value={value}>
                {formatEnumLabel(value, getNativaExoticaEmoji)}
              </option>
            ))}
          </select>
        </div>

        {/* Himenio Filter - Only show in advanced mode or admin view */}
        {showAdvanced && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Himenio
            </label>
            <select
              value={filters.himenio}
              onChange={(e) => onFilterChange('himenio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Todos</option>
              {Object.values(Himenio).map((value) => (
                <option key={value} value={value}>
                  {formatEnumLabel(value, getHimenioEmoji)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Boolean Filters */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-800">Características</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ADN Extraído */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              🧬 ADN Extraído
            </label>
            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="adnExtraido"
                  value=""
                  checked={filters.adnExtraido === ''}
                  onChange={(e) => onFilterChange('adnExtraido', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Todos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="adnExtraido"
                  value="true"
                  checked={filters.adnExtraido === 'true'}
                  onChange={(e) => onFilterChange('adnExtraido', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Con ADN</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="adnExtraido"
                  value="false"
                  checked={filters.adnExtraido === 'false'}
                  onChange={(e) => onFilterChange('adnExtraido', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Sin ADN</span>
              </label>
            </div>
          </div>

          {/* Muestra Conservada */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              🏺 Muestra Conservada
            </label>
            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="muestraConservada"
                  value=""
                  checked={filters.muestraConservada === ''}
                  onChange={(e) => onFilterChange('muestraConservada', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Todos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="muestraConservada"
                  value="true"
                  checked={filters.muestraConservada === 'true'}
                  onChange={(e) => onFilterChange('muestraConservada', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Conservada</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="muestraConservada"
                  value="false"
                  checked={filters.muestraConservada === 'false'}
                  onChange={(e) => onFilterChange('muestraConservada', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">No conservada</span>
              </label>
            </div>
          </div>

          {/* Anillo - Only show in advanced mode */}
          {showAdvanced && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                💍 Anillo
              </label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="anillo"
                    value=""
                    checked={filters.anillo === ''}
                    onChange={(e) => onFilterChange('anillo', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Todos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="anillo"
                    value="true"
                    checked={filters.anillo === 'true'}
                    onChange={(e) => onFilterChange('anillo', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Con anillo</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="anillo"
                    value="false"
                    checked={filters.anillo === 'false'}
                    onChange={(e) => onFilterChange('anillo', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Sin anillo</span>
                </label>
              </div>
            </div>
          )}

          {/* Volva - Only show in advanced mode */}
          {showAdvanced && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                🫙 Volva
              </label>
              <div className="space-y-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="volva"
                    value=""
                    checked={filters.volva === ''}
                    onChange={(e) => onFilterChange('volva', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Todos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="volva"
                    value="true"
                    checked={filters.volva === 'true'}
                    onChange={(e) => onFilterChange('volva', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Con volva</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="volva"
                    value="false"
                    checked={filters.volva === 'false'}
                    onChange={(e) => onFilterChange('volva', e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">Sin volva</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-sm text-gray-600">Filtros activos:</span>
          {filters.habito && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Hábito: {formatEnumLabel(filters.habito, getHabitoEmoji)}
              <button
                onClick={() => onFilterChange('habito', '')}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.sustratoTipo && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Sustrato: {formatEnumLabel(filters.sustratoTipo, getSustratoTipoEmoji)}
              <button
                onClick={() => onFilterChange('sustratoTipo', '')}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.nativaExotica && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Origen: {formatEnumLabel(filters.nativaExotica, getNativaExoticaEmoji)}
              <button
                onClick={() => onFilterChange('nativaExotica', '')}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.himenio && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Himenio: {formatEnumLabel(filters.himenio, getHimenioEmoji)}
              <button
                onClick={() => onFilterChange('himenio', '')}
                className="ml-1 text-orange-600 hover:text-orange-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.adnExtraido && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
              ADN: {filters.adnExtraido === 'true' ? 'Con ADN 🧬' : 'Sin ADN'}
              <button
                onClick={() => onFilterChange('adnExtraido', '')}
                className="ml-1 text-cyan-600 hover:text-cyan-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.muestraConservada && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Muestra: {filters.muestraConservada === 'true' ? 'Conservada 🏺' : 'No conservada'}
              <button
                onClick={() => onFilterChange('muestraConservada', '')}
                className="ml-1 text-amber-600 hover:text-amber-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.anillo && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
              Anillo: {filters.anillo === 'true' ? 'Con anillo 💍' : 'Sin anillo'}
              <button
                onClick={() => onFilterChange('anillo', '')}
                className="ml-1 text-pink-600 hover:text-pink-800"
              >
                ×
              </button>
            </span>
          )}
          {filters.volva && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Volva: {filters.volva === 'true' ? 'Con volva 🫙' : 'Sin volva'}
              <button
                onClick={() => onFilterChange('volva', '')}
                className="ml-1 text-emerald-600 hover:text-emerald-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
};

export default EnumFilters;