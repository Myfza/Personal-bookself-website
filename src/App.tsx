import React, { useState, useMemo } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Book, StatusFilter, ViewMode } from './types/Book';
import { useBooks } from './hooks/useBooks';
import { useNotification } from './hooks/useNotification';
import { importBooks, loadPublicBooks, getUserName } from './utils/localStorage';

// Components
import Header from './components/Header';
import UserInfo from './components/UserInfo';
import Dashboard from './components/Dashboard';
import ViewModeToggle from './components/ViewModeToggle';
import SearchAndFilter from './components/SearchAndFilter';
import BookList from './components/BookList';
import PublicBookList from './components/PublicBookList';
import BookFormWithUpload from './components/BookFormWithUpload';
import BookDetailModal from './components/BookDetailModal';
import DataManagement from './components/DataManagement';
import Notification from './components/Notification';
import UserProfileModal from './components/UserProfileModal';
import Footer from './components/Footer';

function App() {
  const { books, addBook, updateBook, deleteBook, getStats } = useBooks();
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>('my-books');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDataManagementOpen, setIsDataManagementOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentUserName, setCurrentUserName] = useState(getUserName());

  // Load public books
  const publicBooks = useMemo(() => loadPublicBooks(), [books, currentUserName]);

  // Filter and search books
  const filteredBooks = useMemo(() => {
    const booksToFilter = viewMode === 'my-books' ? books : publicBooks;
    
    return booksToFilter.filter(book => {
      const matchesSearch = searchQuery.toLowerCase() === '' || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = viewMode === 'public-books' || statusFilter === 'all' || book.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [books, publicBooks, viewMode, searchQuery, statusFilter]);

  const stats = useMemo(() => getStats(), [getStats]);

  // Form handlers
  const handleAddClick = () => {
    if (viewMode === 'public-books') {
      showError('Tidak dapat menambah buku dalam mode publik. Beralih ke "Buku Saya" terlebih dahulu.');
      return;
    }
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (book: Book) => {
    if (viewMode === 'public-books' && book.ownerId !== books[0]?.ownerId) {
      showError('Anda tidak memiliki izin untuk mengedit buku ini.');
      return;
    }
    setEditingBook(book);
    setIsFormOpen(true);
    setIsDetailModalOpen(false);
  };

  const handleViewClick = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
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
    if (viewMode === 'public-books') {
      showError('Tidak dapat menghapus buku dalam mode publik.');
      return;
    }
    
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
          isPublic: false, // Reset public status for imported books
        });
      });
    } catch (error) {
      showError('Gagal mengimpor beberapa buku.');
    }
  };

  const handleProfileUpdate = (newName: string) => {
    setCurrentUserName(newName);
    showSuccess('Profil berhasil diperbarui!');
  };

  const isFiltered = searchQuery !== '' || statusFilter !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserInfo 
          totalBooks={books.length} 
          onEditProfile={() => setIsProfileModalOpen(true)}
          userName={currentUserName}
        />
        
        <Dashboard stats={stats} />
        
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <ViewModeToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            myBooksCount={books.length}
            publicBooksCount={publicBooks.length}
          />
        </div>

        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              showStatusFilter={viewMode === 'my-books'}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          {viewMode === 'my-books' && (
            <button
              onClick={() => setIsDataManagementOpen(!isDataManagementOpen)}
              className="inline-flex items-center px-4 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <Settings className="h-5 w-5 mr-2" />
              Kelola Data
            </button>
          )}
          
          {viewMode === 'my-books' && (
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 shadow-sm"
              aria-label="Tambah buku baru"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Buku
            </button>
          )}
        </div>

        {isDataManagementOpen && viewMode === 'my-books' && (
          <div className="mb-8">
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

        {viewMode === 'my-books' ? (
          <BookList
            books={filteredBooks}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            isFiltered={isFiltered}
          />
        ) : (
          <PublicBookList
            books={filteredBooks}
            onView={handleViewClick}
            searchQuery={searchQuery}
            isFiltered={isFiltered}
          />
        )}
      </main>

      <BookFormWithUpload
        book={editingBook}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
        isOpen={isFormOpen}
      />

      <BookDetailModal
        book={selectedBook}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBook(null);
        }}
        onEdit={handleEditClick}
      />

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
      
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onNameUpdate={handleProfileUpdate}
      />
      
      <Footer />
    </div>
  );
}

export default App;