import React, { useState } from 'react';
import { FilterState } from '../types';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface FiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
}

const Filters: React.FC<FiltersProps> = ({ filters, setFilters, categories }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const activeFiltersCount = [
    filters.category, 
    filters.modality, 
    filters.shift, 
    filters.priceRange
  ].filter(Boolean).length;

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-8 sticky top-4 z-20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4 md:mb-4">
        <div className="flex items-center gap-2 text-senai-blue font-semibold">
          <Filter className="w-5 h-5" />
          <span>Filtrar Cursos</span>
          {activeFiltersCount > 0 && !isExpanded && (
            <span className="md:hidden ml-2 bg-senai-orange text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        
        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden flex items-center gap-1 text-sm text-senai-blue hover:underline focus:outline-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <>
              Menos Filtros <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Mais Filtros <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Search Input - Always Visible */}
        <div className="lg:col-span-4 md:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleInputChange}
            placeholder="Buscar por nome ou unidade..."
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue focus:ring-opacity-50 h-10 border px-3 text-sm bg-gray-50 focus:bg-white transition-colors"
          />
        </div>

        {/* Collapsible Section for Mobile */}
        <div className={`
          contents
          ${isExpanded ? 'block' : 'hidden md:contents'}
        `}>
          {/* Category Select */}
          <div className="lg:col-span-2">
            <select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue focus:ring-opacity-50 h-10 border px-3 text-sm cursor-pointer hover:bg-gray-50"
            >
              <option value="">Todas as Áreas</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Modality Select */}
          <div className="lg:col-span-2">
             <select
              name="modality"
              value={filters.modality}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue focus:ring-opacity-50 h-10 border px-3 text-sm cursor-pointer hover:bg-gray-50"
            >
              <option value="">Todas Modalidades</option>
              <option value="presencial">Presencial</option>
              <option value="online">Online / EAD</option>
            </select>
          </div>

          {/* Shift Select */}
          <div className="lg:col-span-2">
            <select
              name="shift"
              value={filters.shift}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue focus:ring-opacity-50 h-10 border px-3 text-sm cursor-pointer hover:bg-gray-50"
            >
              <option value="">Todos os Turnos</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
              <option value="Integral">Integral</option>
            </select>
          </div>

          {/* Price Range Select */}
           <div className="lg:col-span-2">
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-senai-blue focus:ring focus:ring-senai-blue focus:ring-opacity-50 h-10 border px-3 text-sm cursor-pointer hover:bg-gray-50"
            >
              <option value="">Qualquer Preço</option>
              <option value="free">Gratuito</option>
              <option value="up_to_500">Até R$ 500,00</option>
              <option value="500_1000">R$ 500 a R$ 1.000</option>
              <option value="over_1000">Acima de R$ 1.000</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filters;