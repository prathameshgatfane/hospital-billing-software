// SearchFilters.jsx
import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';

const SearchFilters = ({ 
  filters = [], 
  onFilterChange,
  showReset = true 
}) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterSelect = (key, value) => {
    const newFilters = { ...activeFilters };
    
    if (value) {
      newFilters[key] = value;
    } else {
      delete newFilters[key];
    }
    
    setActiveFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleReset = () => {
    setActiveFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  const getActiveFilterCount = () => {
    return Object.keys(activeFilters).length;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4 mr-2" />
        <span>Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="ml-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {getActiveFilterCount()}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Filter Panel */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {showReset && getActiveFilterCount() > 0 && (
                  <button
                    onClick={handleReset}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Reset All
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {filter.label}
                    </label>
                    <select
                      value={activeFilters[filter.key] || ''}
                      onChange={(e) => handleFilterSelect(filter.key, e.target.value || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">All</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {/* Active Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters).map(([key, value]) => {
                      const filter = filters.find(f => f.key === key);
                      const option = filter?.options.find(opt => opt.value === value);
                      return (
                        <div
                          key={key}
                          className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"
                        >
                          <span className="mr-2">{filter?.label}: {option?.label || value}</span>
                          <button
                            onClick={() => handleFilterSelect(key, null)}
                            className="hover:text-red-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchFilters;