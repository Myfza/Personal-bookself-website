import { Book } from '../types/Book';

const STORAGE_KEY = 'bookshelf_books';
const PUBLIC_BOOKS_KEY = 'bookshelf_public_books';
const USER_ID_KEY = 'bookshelf_user_id';
const USER_NAME_KEY = 'bookshelf_user_name';
const DEMO_DATA_KEY = 'bookshelf_demo_loaded';

// Generate unique user ID for data isolation
export const getUserId = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

// Get or generate user name
export const getUserName = (): string => {
  let userName = localStorage.getItem(USER_NAME_KEY);
  if (!userName) {
    const userId = getUserId();
    userName = `Pengguna_${userId.split('_')[1]?.substring(0, 6) || 'Anonim'}`;
    localStorage.setItem(USER_NAME_KEY, userName);
  }
  return userName;
};

// Set custom user name
export const setUserName = (name: string): void => {
  const trimmedName = name.trim();
  if (trimmedName && trimmedName.length >= 2 && trimmedName.length <= 50) {
    localStorage.setItem(USER_NAME_KEY, trimmedName);
    
    // Update existing books with new owner name
    try {
      const books = loadBooks();
      const updatedBooks = books.map(book => ({
        ...book,
        ownerName: trimmedName,
        updatedAt: new Date().toISOString()
      }));
      saveBooks(updatedBooks);
    } catch (error) {
      console.error('Error updating books with new owner name:', error);
    }
  }
};
// Get user-specific storage key
const getUserStorageKey = (): string => {
  return `${STORAGE_KEY}_${getUserId()}`;
};

// Demo data for new users
const getDemoBooks = (): Book[] => {
  const userId = getUserId();
  const userName = getUserName();
  
  return [
    {
      id: 'demo_1',
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      description: 'Novel tentang perjuangan anak-anak Belitung untuk mendapatkan pendidikan.',
      startDate: '2024-01-01',
      deadline: '2024-02-15',
      status: 'finished',
      isPublic: false,
      ownerId: userId,
      ownerName: userName,
      viewCount: 0,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: 'demo_2',
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      description: 'Novel sejarah tentang kehidupan di masa kolonial Belanda.',
      startDate: '2024-01-15',
      deadline: '2024-03-01',
      status: 'reading',
      isPublic: true,
      ownerId: userId,
      ownerName: userName,
      viewCount: 0,
      sharedAt: new Date('2024-01-15').toISOString(),
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString(),
    },
    {
      id: 'demo_3',
      title: 'Negeri 5 Menara',
      author: 'Ahmad Fuadi',
      description: 'Kisah inspiratif tentang pendidikan dan persahabatan.',
      startDate: '2024-02-01',
      deadline: '2024-03-15',
      status: 'unread',
      isPublic: false,
      ownerId: userId,
      ownerName: userName,
      viewCount: 0,
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString(),
    },
  ];
};

export const saveBooks = (books: Book[]): void => {
  try {
    const userStorageKey = getUserStorageKey();
    
    // Update public books when saving
    updatePublicBooks(books);
    
    localStorage.setItem(userStorageKey, JSON.stringify(books));
    localStorage.setItem(`${userStorageKey}_backup`, JSON.stringify({
      books,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
  } catch (error) {
    console.error('Error saving books to localStorage:', error);
    throw new Error('Failed to save books. Storage might be full.');
  }
};

// Update public books collection
const updatePublicBooks = (userBooks: Book[]): void => {
  try {
    const currentUserId = getUserId();
    const publicBooks = loadPublicBooks();
    
    // Remove old public books from this user
    const filteredPublicBooks = publicBooks.filter(book => book.ownerId !== currentUserId);
    
    // Add new public books from this user
    const newPublicBooks = userBooks
      .filter(book => book.isPublic)
      .map(book => ({
        ...book,
        sharedAt: book.sharedAt || new Date().toISOString()
      }));
    
    const updatedPublicBooks = [...filteredPublicBooks, ...newPublicBooks];
    localStorage.setItem(PUBLIC_BOOKS_KEY, JSON.stringify(updatedPublicBooks));
  } catch (error) {
    console.error('Error updating public books:', error);
  }
};

// Load all public books
export const loadPublicBooks = (): Book[] => {
  try {
    const stored = localStorage.getItem(PUBLIC_BOOKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading public books:', error);
    return [];
  }
};

// Get book permissions for current user
export const getBookPermissions = (book: Book): BookPermissions => {
  const currentUserId = getUserId();
  const isOwner = book.ownerId === currentUserId;
  
  return {
    canView: true,
    canEdit: isOwner,
    canDelete: isOwner,
    canShare: isOwner,
    isOwner
  };
};

// Increment view count for public books
export const incrementViewCount = (bookId: string): void => {
  try {
    const publicBooks = loadPublicBooks();
    const updatedBooks = publicBooks.map(book => 
      book.id === bookId 
        ? { ...book, viewCount: (book.viewCount || 0) + 1 }
        : book
    );
    localStorage.setItem(PUBLIC_BOOKS_KEY, JSON.stringify(updatedBooks));
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
};
export const loadBooks = (): Book[] => {
  try {
    const userStorageKey = getUserStorageKey();
    const stored = localStorage.getItem(userStorageKey);
    
    if (stored) {
      const books = JSON.parse(stored);
      // Ensure backward compatibility by adding missing fields
      const updatedBooks = Array.isArray(books) ? books.map(book => ({
        ...book,
        isPublic: book.isPublic ?? false,
        ownerId: book.ownerId ?? getUserId(),
        ownerName: book.ownerName ?? getUserName(),
        viewCount: book.viewCount ?? 0
      })) : [];
      
      // Save updated books to ensure consistency
      if (updatedBooks.length > 0) {
        saveBooks(updatedBooks);
      }
      
      return updatedBooks;
    }
    
    // Load demo data for new users
    const demoLoaded = localStorage.getItem(DEMO_DATA_KEY);
    if (!demoLoaded) {
      const demoBooks = getDemoBooks();
      saveBooks(demoBooks);
      localStorage.setItem(DEMO_DATA_KEY, 'true');
      return demoBooks;
    }
    
    return [];
  } catch (error) {
    console.error('Error loading books from localStorage:', error);
    // Try to load from backup
    try {
      const backupKey = `${getUserStorageKey()}_backup`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        const backupData = JSON.parse(backup);
        return Array.isArray(backupData.books) ? backupData.books : [];
      }
    } catch (backupError) {
      console.error('Error loading backup:', backupError);
    }
    return getDemoBooks();
  }
};

export const exportBooks = (): string => {
  try {
    const books = loadBooks();
    const exportData = {
      books,
      exportDate: new Date().toISOString(),
      version: '1.0',
      appName: 'BookSelf'
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting books:', error);
    throw new Error('Failed to export books data.');
  }
};

export const importBooks = (jsonData: string): Book[] => {
  try {
    const currentUserId = getUserId();
    const currentUserName = getUserName();
    const importData = JSON.parse(jsonData);
    
    // Validate import data structure
    if (!importData.books || !Array.isArray(importData.books)) {
      throw new Error('Invalid data format. Expected books array.');
    }
    
    // Validate each book object
    const validBooks = importData.books.filter((book: any) => {
      return book.id && book.title && book.author && book.startDate && book.deadline && book.status;
    });
    
    if (validBooks.length === 0) {
      throw new Error('No valid books found in import data.');
    }
    
    // Generate new IDs to avoid conflicts
    const booksWithNewIds = validBooks.map((book: Book) => ({
      ...book,
      id: generateId(),
      ownerId: currentUserId,
      ownerName: currentUserName,
      isPublic: false, // Reset public status for imported books
      viewCount: 0,
      updatedAt: new Date().toISOString()
    }));
    
    return booksWithNewIds;
  } catch (error) {
    console.error('Error importing books:', error);
    throw new Error('Failed to import books. Please check the file format.');
  }
};

export const clearAllData = (): void => {
  try {
    const currentUserId = getUserId();
    const userStorageKey = getUserStorageKey();
    
    // Remove user's public books from global collection
    const publicBooks = loadPublicBooks();
    const filteredPublicBooks = publicBooks.filter(book => book.ownerId !== currentUserId);
    localStorage.setItem(PUBLIC_BOOKS_KEY, JSON.stringify(filteredPublicBooks));
    
    // Clear user's personal data
    localStorage.removeItem(userStorageKey);
    localStorage.removeItem(`${userStorageKey}_backup`);
    localStorage.removeItem(DEMO_DATA_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
    throw new Error('Failed to clear data.');
  }
};

export const generateId = (): string => {
  return `book_${getUserId()}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isDeadlineNear = (deadline: string): boolean => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3 && diffDays >= 0;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};