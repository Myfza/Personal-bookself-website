export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  coverImage?: string;
  startDate: string;
  deadline: string;
  status: 'unread' | 'reading' | 'finished';
  isPublic: boolean;
  ownerId: string;
  ownerName: string;
  sharedAt?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookStats {
  totalBooks: number;
  finishedBooks: number;
  readingBooks: number;
  unreadBooks: number;
  publicBooks: number;
  sharedBooks: number;
}

export type StatusFilter = 'all' | 'unread' | 'reading' | 'finished';

export type ViewMode = 'my-books' | 'public-books';

export interface PublicBook extends Book {
  canEdit: boolean;
  canDelete: boolean;
  isOwner: boolean;
}

export interface BookPermissions {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  isOwner: boolean;
}