import { useState, useEffect, useCallback } from 'react';
import { Book, BookStats } from '../types/Book';
import { saveBooks, loadBooks, generateId, getUserId, getUserName } from '../utils/localStorage';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);

  // Load books from localStorage on mount
  useEffect(() => {
    try {
      const loadedBooks = loadBooks();
      setBooks(loadedBooks);
    } catch (error) {
      console.error('Failed to load books:', error);
    }
  }, []);

  // Save books to localStorage whenever books change
  useEffect(() => {
    try {
      saveBooks(books);
    } catch (error) {
      console.error('Failed to save books:', error);
    }
  }, [books]);

  const addBook = useCallback((bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    const userId = getUserId();
    const userName = getUserName();
    
    const newBook: Book = {
      ...bookData,
      id: generateId(),
      ownerId: userId,
      ownerName: userName,
      isPublic: bookData.isPublic ?? false,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setBooks(prev => [...prev, newBook]);
    return newBook;
  }, []);

  const updateBook = useCallback((id: string, bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => {
    setBooks(prev => prev.map(book => 
      book.id === id 
        ? { ...book, ...bookData, updatedAt: new Date().toISOString() }
        : book
    ));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id));
  }, []);

  const getStats = useCallback((): BookStats => {
    const publicBooks = books.filter(book => book.isPublic);
    const sharedBooks = books.filter(book => book.viewCount > 0);
    
    return {
      totalBooks: books.length,
      finishedBooks: books.filter(book => book.status === 'finished').length,
      readingBooks: books.filter(book => book.status === 'reading').length,
      unreadBooks: books.filter(book => book.status === 'unread').length,
      publicBooks: publicBooks.length,
      sharedBooks: sharedBooks.length,
    };
  }, [books]);

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    getStats,
  };
};