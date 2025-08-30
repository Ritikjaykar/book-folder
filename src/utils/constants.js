export const BOOKS_PER_PAGE = 20;

export const LANGUAGE_OPTIONS = [
  { value: '', label: 'All Languages' },
  { value: 'eng', label: 'English' },
  { value: 'spa', label: 'Spanish' },
  { value: 'fre', label: 'French' },
  { value: 'ger', label: 'German' },
  { value: 'ita', label: 'Italian' },
  { value: 'por', label: 'Portuguese' },
  { value: 'rus', label: 'Russian' },
  { value: 'jpn', label: 'Japanese' },
  { value: 'chi', label: 'Chinese' }
];

export const COVER_SIZES = {
  SMALL: 'S',
  MEDIUM: 'M', 
  LARGE: 'L'
};

export const API_ENDPOINTS = {
  OPEN_LIBRARY_SEARCH: 'https://openlibrary.org/search.json',
  OPEN_LIBRARY_COVERS: 'https://covers.openlibrary.org/b/id'
};