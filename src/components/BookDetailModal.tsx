import React from 'react';
import { Book, BookPermissions } from '../types/Book';
import { X, Calendar, User, Eye, Globe, Lock } from 'lucide-react';
import { formatDate, getBookPermissions } from '../utils/localStorage';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (book: Book) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ 
  book, 
  isOpen, 
  onClose, 
  onEdit 
}) => {
  if (!isOpen || !book) return null;

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Detail Buku</h3>
            {!permissions.isOwner && (
              <div className="flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                <Lock className="h-3 w-3 mr-1" />
                Read-Only
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Tutup detail"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="md:col-span-1">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`Cover buku ${book.title}`}
                  className="w-full aspect-[3/4] object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <Globe className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600">{book.author}</p>
              </div>

              {/* Status */}
              <div>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(book.status)}`}>
                  {getStatusText(book.status)}
                </span>
              </div>

              {/* Owner and Sharing Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                    <span>Pemilik: <span className="font-medium">{book.ownerName}</span></span>
                  </div>
                  {permissions.isOwner && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      Anda
                    </span>
                  )}
                </div>
                
                {book.isPublic && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Dibagikan ke publik</span>
                    </div>
                    {book.viewCount > 0 && (
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="font-medium">{book.viewCount} views</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Mulai: {formatDate(book.startDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Deadline: {formatDate(book.deadline)}</span>
                </div>
                {book.sharedAt && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>Dibagikan: {formatDate(book.sharedAt)}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Deskripsi:</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
            {permissions.canEdit && onEdit && (
              <button
                onClick={() => onEdit(book)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Buku
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailModal;