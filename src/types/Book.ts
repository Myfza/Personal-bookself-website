export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  deadline: string;
  status: 'unread' | 'reading' | 'finished';
  createdAt: string;
  updatedAt: string;
}

export interface BookStats {
  totalBooks: number;
  finishedBooks: number;
  readingBooks: number;
  unreadBooks: number;
}

export type StatusFilter = 'all' | 'unread' | 'reading' | 'finished';