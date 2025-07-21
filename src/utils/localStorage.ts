import { Book } from '../types/Book';

const STORAGE_KEY = 'bookshelf_books';
const USER_ID_KEY = 'bookshelf_user_id';
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

// Get user-specific storage key
const getUserStorageKey = (): string => {
  return `${STORAGE_KEY}_${getUserId()}`;
};

// Demo data for new users
const getDemoBooks = (): Book[] => {
  return [
    {
      id: 'demo_1',
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      description: 'Novel tentang perjuangan anak-anak Belitung untuk mendapatkan pendidikan.',
      startDate: '2024-01-01',
      deadline: '2024-02-15',
      status: 'finished',
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
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString(),
    },
  ];
};

export const saveBooks = (books: Book[]): void => {
  try {
    const userStorageKey = getUserStorageKey();
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

export const loadBooks = (): Book[] => {
  try {
    const userStorageKey = getUserStorageKey();
    const stored = localStorage.getItem(userStorageKey);
    
    if (stored) {
      const books = JSON.parse(stored);
      return Array.isArray(books) ? books : [];
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
    const userStorageKey = getUserStorageKey();
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