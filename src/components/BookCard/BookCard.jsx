import React from "react";
import { Book, Calendar, Star } from "lucide-react";
import { getCoverUrl } from "../../services/api";
import { formatAuthors } from "../../utils/formatters";

const BookCard = ({ book, onClick }) => {
  const handleImageError = (e) => {
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "flex";
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
    >
      {/* Cover Section */}
      <div className="relative aspect-[3/4] bg-gray-200">
        {book.cover_i ? (
          <img
            src={getCoverUrl(book.cover_i)}
            alt={book.title}
            className="w-full h-64 object-cover"
            onError={handleImageError}
          />
        ) : null}

        {/* Placeholder when image is missing */}
        <div
          className={`w-full h-64 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center ${
            book.cover_i ? "hidden" : ""
          }`}
        >
          <Book className="h-16 w-16 text-white opacity-50" />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          by {formatAuthors(book.author_name)}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {book.first_publish_year && (
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {book.first_publish_year}
            </span>
          )}
          {book.ratings_average && (
            <span className="flex items-center">
              <Star className="h-3 w-3 mr-1 fill-current text-yellow-400" />
              {book.ratings_average.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
