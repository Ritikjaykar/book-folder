import React from "react";
import { Search, Book, User, Filter } from "lucide-react";
import { searchSuggestions, searchTypes } from "../../services/demoData";

const iconMap = { title: Book, author: User, subject: Filter };

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchType,
  setSearchType,
  loading,
  onSearch,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch(true);
  };

  return (
    <div className="mb-8">
      {/* Search Types */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {searchTypes.map(({ value, label }) => {
          const Icon = iconMap[value];
          return (
            <button
              key={value}
              type="button"
              onClick={() => setSearchType(value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                searchType === value
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="flex max-w-4xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Search by ${searchType}...`}
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-l-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => onSearch(true)}
          disabled={loading || !searchQuery.trim()}
          className="px-8 py-4 bg-blue-600 text-white rounded-r-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Suggestions */}
      {!searchQuery && (
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSearchType("title");
                }}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
