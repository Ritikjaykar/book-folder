// src/App.jsx
import React from "react";
import Header from "./components/Layout/Header";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchFilters from "./components/SearchFilters/SearchFilters";
import BookCard from "./components/BookCard/BookCard";
import BookModal from "./components/BookModal/BookModal";
import Pagination from "./components/Pagination/Pagination";
import SmartSearchHelper from "./components/AI/SmartSearchHelper";
import { useBooks } from "./hooks/useBooks";
import "./index.css";

function App() {
  const {
    searchQuery,
    setSearchQuery,
    searchType,
    setSearchType,
    books,
    loading,
    error,
    currentPage,
    setCurrentPage,
    totalResults,
    showFilters,
    setShowFilters,
    yearFilter,
    setYearFilter,
    languageFilter,
    setLanguageFilter,
    selectedBook,
    setSelectedBook,
    searchBooks,
    totalPages
  } = useBooks();

  // State to show/hide SmartSearchHelper
  const [showHelper, setShowHelper] = React.useState(true);

  // Re-open helper whenever search query changes
  React.useEffect(() => {
    if (searchQuery.length > 2) setShowHelper(true);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header showFilters={showFilters} setShowFilters={setShowFilters} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
          loading={loading}
          onSearch={searchBooks}
        />

        {/* Smart Search Helper */}
        {showHelper && searchQuery.length > 2 && (
          <SmartSearchHelper
            searchQuery={searchQuery}
            searchType={searchType}
            onApplySuggestion={(suggestion) => setSearchQuery(suggestion)}
            onClose={() => setShowHelper(false)}
          />
        )}

        <SearchFilters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          languageFilter={languageFilter}
          setLanguageFilter={setLanguageFilter}
        />

        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800">{error}</p>
          </div>
        )}

        {totalResults > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Found {totalResults.toLocaleString()} results for "{searchQuery}"
            </p>
            <div className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Searching books...</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book, index) => (
                <BookCard
                  key={book.key || index}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      </div>
    </div>
  );
}

export default App;
