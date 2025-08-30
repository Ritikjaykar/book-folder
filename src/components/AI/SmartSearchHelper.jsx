// src/components/AI/SmartSearchHelper.jsx
import React, { useState, useEffect } from 'react';
import { Sparkles, Lightbulb, Zap, X } from 'lucide-react';
import { llmService } from '../../services/llmService';

const SmartSearchHelper = ({ 
  searchQuery, 
  searchType, 
  onApplySuggestion,
  onClose 
}) => {
  const [suggestions, setSuggestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get AI suggestions when search query changes
  useEffect(() => {
    if (searchQuery && searchQuery.length > 2) {
      getSuggestions();
    } else {
      setSuggestions(null);
    }
  }, [searchQuery, searchType]);

  const getSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await llmService.enhanceSearchQuery(searchQuery, searchType);
      setSuggestions(result);
    } catch (err) {
      console.error('Smart search failed:', err);
      setError('AI suggestions temporarily unavailable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onApplySuggestion(suggestion);
  };

  // Don't show if no query or very short query
  if (!searchQuery || searchQuery.length <= 2) {
    return null;
  }

  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-blue-100 rounded-lg">
            <Sparkles className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="font-semibold text-blue-900 text-sm">
            AI Search Assistant
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center space-x-2 py-3">
          <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
          <span className="text-sm text-blue-700">
            AI is analyzing your search...
          </span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-3">
          <p className="text-sm text-orange-600">⚠️ {error}</p>
        </div>
      )}

      {/* Suggestions */}
      {suggestions && !isLoading && (
        <div className="space-y-3">
          {/* Enhanced Query */}
          {suggestions.enhanced_query !== searchQuery && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Enhanced Search:
              </p>
              <button
                onClick={() => handleSuggestionClick(suggestions.enhanced_query)}
                className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium transition-colors"
              >
                "{suggestions.enhanced_query}"
              </button>
            </div>
          )}

          {/* Alternative Suggestions */}
          {suggestions.suggestions && suggestions.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2 flex items-center">
                <Lightbulb className="h-3 w-3 mr-1" />
                Try these alternatives:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-all hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spelling Correction */}
          {suggestions.corrections && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
              <p className="text-sm text-orange-800">
                <span className="font-medium">Did you mean:</span>{' '}
                <button
                  onClick={() => handleSuggestionClick(suggestions.corrections)}
                  className="underline hover:no-underline font-medium"
                >
                  {suggestions.corrections}
                </button>
                ?
              </p>
            </div>
          )}

          {/* Search Tip */}
          {suggestions.search_tips && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
              <p className="text-xs text-indigo-700">
                <span className="font-medium">💡 Tip:</span> {suggestions.search_tips}
              </p>
            </div>
          )}

          {/* Source indicator */}
          {suggestions.source && (
            <div className="text-xs text-gray-500 pt-1">
              {suggestions.source === 'ai' && '🤖 AI-powered (Hugging Face)'}
              {suggestions.source === 'smart-rules' && '🧠 Smart rule-based'}
              {suggestions.source === 'fallback' && '🔄 Offline suggestions'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SmartSearchHelper;