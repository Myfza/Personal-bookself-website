import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
            <img 
              src="/Logo-vizart.png" 
              alt="VizArt Logo" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              BookSelf
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;