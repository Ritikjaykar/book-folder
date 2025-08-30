import axios from 'axios';

const BASE_URL = 'https://openlibrary.org/search.json';

// CORS proxy alternatives (if needed)
const CORS_PROXIES = [
  'https://cors-anywhere.herokuapp.com/',
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?'
];

export const searchBooksAPI = async ({
  query,
  searchType = 'title',
  page = 1,
  limit = 20,
  yearFilter = '',
  languageFilter = ''
}) => {
  const params = new URLSearchParams();
  
  // Build search parameters
  if (searchType === 'title') {
    params.append('title', query);
  } else if (searchType === 'author') {
    params.append('author', query);
  } else if (searchType === 'subject') {
    params.append('subject', query);
  }
  
  if (yearFilter) {
    params.append('first_publish_year', yearFilter);
  }
  
  if (languageFilter) {
    params.append('language', languageFilter);
  }
  
  params.append('limit', limit.toString());
  params.append('offset', ((page - 1) * limit).toString());
  params.append('fields', 'key,title,author_name,first_publish_year,isbn,cover_i,subject,language,publisher,number_of_pages_median,ratings_average,ratings_count');
  
  const url = `${BASE_URL}?${params.toString()}`;
  
  try {
    // Try direct API call first
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    return {
      books: response.data.docs || [],
      total: response.data.numFound || 0
    };
  } catch (error) {
    // If direct call fails due to CORS, try with proxy
    for (const proxy of CORS_PROXIES) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        const response = await axios.get(proxyUrl, { timeout: 15000 });
        
        const data = proxy.includes('allorigins') ? 
          JSON.parse(response.data.contents) : response.data;
        
        return {
          books: data.docs || [],
          total: data.numFound || 0
        };
      } catch (proxyError) {
        continue; // Try next proxy
      }
    }
    
    throw new Error('All API attempts failed - CORS restrictions');
  }
};

export const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};