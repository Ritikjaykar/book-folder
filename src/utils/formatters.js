export const formatAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    
    if (authors.length === 1) return authors[0];
    if (authors.length <= 3) return authors.join(', ');
    
    return `${authors.slice(0, 2).join(', ')} & ${authors.length - 2} others`;
  };
  
  export const formatSubjects = (subjects, maxCount = 6) => {
    if (!subjects) return [];
    return subjects.slice(0, maxCount);
  };
  
  export const formatPublishYear = (year) => {
    if (!year) return 'Unknown';
    return year.toString();
  };
  
  export const formatRating = (rating) => {
    if (!rating) return null;
    return parseFloat(rating).toFixed(1);
  };
  
  export const formatPageCount = (pages) => {
    if (!pages) return null;
    return `${pages} pages`;
  };