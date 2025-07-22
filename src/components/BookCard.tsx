import React from 'react';
import { Book } from '../types/Book';
import { Edit, Trash2, Calendar, AlertTriangle, BookOpen } from 'lucide-react';
import { formatDate, isDeadlineNear } from '../utils/localStorage';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const getStatusBadge = (status: Book['status']) => {
    switch (status) {
      case 'unread':
        return 'bg-gray-100 text-gray-800';
      case 'reading':
        return 'bg-yellow-100 text-yellow-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Book['status']) => {
    switch (status) {
      case 'unread':
        return 'Belum Dibaca';
      case 'reading':
        return 'Sedang Dibaca';
      case 'finished':
        return 'Selesai';
      default:
        return status;
    }
  };

  const nearDeadline = isDeadlineNear(book.deadline);

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
      nearDeadline && book.status !== 'finished' ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200'
    }`}>
      {/* Book Cover */}
      {book.coverImage && (
        <div className="aspect-[3/4] w-full overflow-hidden rounded-t-lg">
          <img
            src={book.coverImage}
            alt={`Cover buku ${book.title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {!book.coverImage && (
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={book.title}>
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          </div>
          {nearDeadline && book.status !== 'finished' && (
            <div className="ml-2 p-1 bg-red-100 rounded-full" title="Deadline dalam 3 hari">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
          )}
        </div>

        {/* Description */}
        {book.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              {book.description}
            </p>
          </div>
        )}

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Mulai: {formatDate(book.startDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className={nearDeadline && book.status !== 'finished' ? 'text-red-600 font-medium' : ''}>
              Deadline: {formatDate(book.deadline)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(book.status)}`}>
            {getStatusText(book.status)}
          </span>
          
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(book)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
              title="Edit buku"
              aria-label={`Edit buku ${book.title}`}
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
              title="Hapus buku"
              aria-label={`Hapus buku ${book.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;