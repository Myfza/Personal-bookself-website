import React from 'react';
import { Book, BookPermissions } from '../types/Book';
import { Eye, Calendar, User, Globe } from 'lucide-react';
import { formatDate, getBookPermissions, incrementViewCount } from '../utils/localStorage';

interface PublicBookCardProps {
  book: Book;
  onView: (book: Book) => void;
}

const PublicBookCard: React.FC<PublicBookCardProps> = ({ book, onView }) => {
  const permissions = getBookPermissions(book);

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

  const handleView = () => {
    if (!permissions.isOwner) {
      incrementViewCount(book.id);
    }
    onView(book);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={book.title}>
              {book.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          </div>
          {permissions.isOwner && (
            <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Milik Anda
            </div>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
          <User className="h-3 w-3 mr-1" />
            <span className="font-medium">Oleh: {book.ownerName}</span>
          </div>
          {book.viewCount > 0 && (
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              <span className="font-medium">{book.viewCount} views</span>
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

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Deadline: {formatDate(book.deadline)}</span>
          </div>
          {book.sharedAt && (
            <div className="flex items-center text-xs text-gray-500">
              <Globe className="h-3 w-3 mr-1" />
              <span>Dibagikan: {formatDate(book.sharedAt)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(book.status)}`}>
            {getStatusText(book.status)}
          </span>
          
          <button
            onClick={handleView}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-105"
            title="Lihat detail buku"
          >
            <Eye className="h-4 w-4 mr-1" />
            Lihat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicBookCard;