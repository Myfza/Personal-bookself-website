import React from 'react';
import { Book } from '../types/Book';
import BookCard from './BookCard';
import { BookOpen } from 'lucide-react';

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  isFiltered: boolean;
}

const BookList: React.FC<BookListProps> = ({ books, onEdit, onDelete, isFiltered }) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {isFiltered ? 'Tidak ada buku yang cocok' : 'Belum ada buku'}
        </h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          {isFiltered 
            ? 'Coba ubah filter atau kata kunci pencarian untuk menemukan buku yang Anda cari.'
            : 'Mulai membangun perpustakaan pribadi Anda dengan menambahkan buku pertama.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Daftar Buku ({books.length})
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;