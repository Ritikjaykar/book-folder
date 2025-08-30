import React from "react";
import { X } from "lucide-react";
import { LANGUAGE_OPTIONS } from "../../utils/constants";

const SearchFilters = ({
  showFilters,
  setShowFilters,
  yearFilter,
  setYearFilter,
  languageFilter,
  setLanguageFilter,
}) => {
  if (!showFilters) return null;

  const clearFilters = () => {
    setYearFilter("");
    setLanguageFilter("");
  };

  return (
    <div className="bg-white shadow-lg border rounded-lg p-6 max-w-md mx-auto mt-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="grid gap-4">
        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Year
          </label>
          <input
            type="number"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            placeholder="e.g., 2020"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {LANGUAGE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6">
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
