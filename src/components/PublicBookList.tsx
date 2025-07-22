import React from 'react';
import { Book } from '../types/Book';
import PublicBookCard from './PublicBookCard';
import { Globe, Search } from 'lucide-react';

interface PublicBookListProps {
  books: Book[];
  onView: (book: Book) => void;
  searchQuery: string;
  isFiltered: boolean;
}

const PublicBookList: React.FC<PublicBookListProps> = ({ 
  books, 
  onView, 
  searchQuery,
  isFiltered 
}) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {isFiltered ? (
            <Search className="h-12 w-12 text-gray-400" />
          ) : (
            <Globe className="h-12 w-12 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isFiltered ? 'Tidak ada buku yang cocok' : 'Belum ada buku publik'}
        </h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          {isFiltered 
            ? 'Coba ubah kata kunci pencarian untuk menemukan buku yang Anda cari.'
            : 'Belum ada pengguna yang membagikan buku mereka ke publik. Jadilah yang pertama!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="h-5 w-5 mr-2 text-blue-600" />
          Buku Publik ({books.length})
        </h2>
        {searchQuery && (
          <p className="text-sm text-gray-500">
            Hasil pencarian: "{searchQuery}"
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <PublicBookCard
            key={book.id}
            book={book}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicBookList;