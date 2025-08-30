import React from "react";
import { X, Star, ExternalLink, Book } from "lucide-react";
import { getCoverUrl } from "../../services/api";
import { formatAuthors, formatSubjects } from "../../utils/formatters";

const BookModal = ({ book, onClose }) => {
  if (!book) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row p-6 gap-6">
          {/* Cover */}
          <div className="w-full md:w-1/3 flex justify-center">
            {book.cover_i ? (
              <img
                src={getCoverUrl(book.cover_i, "L")}
                alt={book.title}
                className="w-48 h-72 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-48 h-72 flex items-center justify-center bg-blue-500 rounded-lg shadow-md">
                <Book className="h-20 w-20 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            {/* Authors */}
            <div>
              <h3 className="text-lg font-semibold">Authors</h3>
              <p className="text-gray-700">
                {formatAuthors(book.author_name)}
              </p>
            </div>

            {/* First published */}
            {book.first_publish_year && (
              <div>
                <h3 className="text-lg font-semibold">First Published</h3>
                <p className="text-gray-700">{book.first_publish_year}</p>
              </div>
            )}

            {/* Publishers */}
            {book.publisher && (
              <div>
                <h3 className="text-lg font-semibold">Publishers</h3>
                <p className="text-gray-700">
                  {book.publisher.slice(0, 3).join(", ")}
                </p>
              </div>
            )}

            {/* Subjects */}
            {book.subject && (
              <div>
                <h3 className="text-lg font-semibold">Subjects</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formatSubjects(book.subject).map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings */}
            {book.ratings_average && (
              <div>
                <h3 className="text-lg font-semibold">Rating</h3>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">
                    {book.ratings_average.toFixed(1)}
                  </span>
                  {book.ratings_count && (
                    <span className="text-gray-500 text-sm">
                      ({book.ratings_count} ratings)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6">
              <a
                href={`https://openlibrary.org${book.key}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View on Open Library</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
