import React, { useState, useMemo } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Book, StatusFilter } from './types/Book';
import { useBooks } from './hooks/useBooks';
import { useNotification } from './hooks/useNotification';
import { importBooks } from './utils/localStorage';

// Components
import Header from './components/Header';
import UserInfo from './components/UserInfo';
import Dashboard from './components/Dashboard';
import SearchAndFilter from './components/SearchAndFilter';
import BookList from './components/BookList';
import BookFormWithUpload from './components/BookFormWithUpload';
import DataManagement from './components/DataManagement';
import Notification from './components/Notification';
import Footer from './components/Footer';

function App() {
  const { books, addBook, updateBook, deleteBook, getStats } = useBooks();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Filter and search books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = searchQuery.toLowerCase() === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || book.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [books, searchQuery, statusFilter]);

  const stats = useMemo(() => getStats(), [getStats]);

  // Form handlers
  const handleAddClick = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (book: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleFormSave = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingBook) {
        updateBook(editingBook.id, bookData);
        showSuccess('Buku berhasil diperbarui!');
      } else {
        addBook(bookData);
        showSuccess('Buku berhasil ditambahkan!');
      }
      setIsFormOpen(false);
      setEditingBook(null);
    } catch (error) {
      showError('Gagal menyimpan buku. Silakan coba lagi.');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingBook(null);
  };

  const handleDeleteClick = (id: string) => {
    const book = books.find(b => b.id === id);
    if (book && window.confirm(`Apakah Anda yakin ingin menghapus buku "${book.title}"?`)) {
      try {
        deleteBook(id);
        showSuccess('Buku berhasil dihapus!');
      } catch (error) {
        showError('Gagal menghapus buku. Silakan coba lagi.');
      }
    }
  };

  const handleImportBooks = (importedBooks: Book[]) => {
    try {
      importedBooks.forEach(book => {
        addBook({
          title: book.title,
          author: book.author,
          description: book.description,
          coverImage: book.coverImage,
          startDate: book.startDate,
          deadline: book.deadline,
          status: book.status,
        });
      });
    } catch (error) {
      showError('Gagal mengimpor beberapa buku.');
    }
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserInfo totalBooks={books.length} />
        
        <Dashboard stats={stats} />
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <button
            onClick={() => setIsDataManagementOpen(!isDataManagementOpen)}
            className="inline-flex items-center px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors shadow-sm"
          >
            <Settings className="h-5 w-5 mr-2" />
            Kelola Data
          </button>
          
          <button
            onClick={handleAddClick}
            className="inline-flex items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
            aria-label="Tambah buku baru"
          >
            <Plus className="h-5 w-5 mr-2" />
            Tambah Buku
          </button>
        </div>

        {isDataManagementOpen && (
          <div className="mb-6">
            <DataManagement
              books={books}
              onImport={handleImportBooks}
              onShowNotification={(message, type) => {
                if (type === 'success') showSuccess(message);
                else showError(message);
              }}
            />
          </div>
        )}

        <BookList
          books={filteredBooks}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          isFiltered={isFiltered}
        />
      </main>

      <BookFormWithUpload
        book={editingBook}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <Footer />
    </div>
  );
}

export default App;