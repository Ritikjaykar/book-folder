import { useState, useEffect } from 'react';
import { searchBooksAPI } from '../services/api';
import { demoBooks } from '../services/demoData';

export const useBooks = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  const booksPerPage = 20;

  const searchBooks = async (resetPage = true) => {
    if (!searchQuery.trim()) return;
    
    if (resetPage) {
      setCurrentPage(1);
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { books: apiBooks, total } = await searchBooksAPI({
        query: searchQuery,
        searchType,
        page: currentPage,
        limit: booksPerPage,
        yearFilter,
        languageFilter
      });
      
      setBooks(apiBooks);
      setTotalResults(total);
      
      if (apiBooks.length === 0) {
        setError('No books found. Try different search terms.');
      }
    } catch (err) {
      // Fallback to demo data
      const filteredDemoBooks = demoBooks.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author_name[0].toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.subject && book.subject.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      
      if (filteredDemoBooks.length > 0) {
        setBooks(filteredDemoBooks);
        setTotalResults(filteredDemoBooks.length);
        setError('⚠️ API temporarily unavailable - showing demo data. Try: Harry Potter, Great Gatsby, 1984, Dune');
      } else {
        setError('No books found. Try: Harry Potter, Great Gatsby, 1984, Dune, or Lord of the Rings');
        setBooks([]);
        setTotalResults(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage > 1 && searchQuery) {
      searchBooks(false);
    }
  }, [currentPage]);

  const totalPages = Math.ceil(totalResults / booksPerPage);

  return {
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
  };
};