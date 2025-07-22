import React from 'react';
import { User, Globe } from 'lucide-react';
import { ViewMode } from '../types/Book';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  myBooksCount: number;
  publicBooksCount: number;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  myBooksCount,
  publicBooksCount,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex shadow-sm">
      <button
        onClick={() => onViewModeChange('my-books')}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === 'my-books'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <User className="h-4 w-4 mr-2" />
        Buku Saya
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
          viewMode === 'my-books'
            ? 'bg-blue-500 text-blue-100'
            : 'bg-gray-200 text-gray-700'
        }`}>
          {myBooksCount}
        </span>
      </button>
      
      <button
        onClick={() => onViewModeChange('public-books')}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
          viewMode === 'public-books'
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        <Globe className="h-4 w-6 mr-2" />
        Buku Publik
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
          viewMode === 'public-books'
            ? 'bg-blue-500 text-blue-100'
            : 'bg-gray-200 text-gray-700'
        }`}>
          {publicBooksCount}
        </span>
      </button>
    </div>
  );
};

export default ViewModeToggle;