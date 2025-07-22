import React from 'react';
import { User, Shield, Database, Edit3 } from 'lucide-react';
import { getUserId, getUserName } from '../utils/localStorage';

interface UserInfoProps {
  totalBooks: number;
  onEditProfile: () => void;
  userName: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ totalBooks, onEditProfile, userName }) => {
  const userId = getUserId();
  const shortUserId = userId.split('_')[1]?.substring(0, 8) || 'unknown';

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 sm:p-6 mb-8 shadow-sm">
      {/* Mobile-first layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* User Avatar and Info */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
        <div className="p-2 sm:p-3 bg-blue-100 rounded-full flex-shrink-0">
          <User className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
        </div>
        
        <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate" title={userName}>
              {userName}
            </h3>
            <div className="flex flex-col xs:flex-row xs:items-center xs:space-x-2 text-xs sm:text-sm text-gray-600">
              <span className="truncate">ID: {shortUserId}</span>
              <span className="hidden xs:inline">•</span>
              <div className="flex items-center mt-1 xs:mt-0">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                <span className="whitespace-nowrap">{totalBooks} buku</span>
              </div>
            </div>
        </div>
        </div>
        
        {/* Status and Edit Button */}
        <div className="flex items-center justify-between sm:flex-col sm:items-end sm:text-right space-x-3 sm:space-x-0 sm:space-y-2">
          <div className="flex items-center text-xs sm:text-sm text-green-600 bg-green-50 px-2 py-1 rounded-full">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
            <span className="font-medium whitespace-nowrap">Data Terlindungi</span>
          </div>
          
          <button
            onClick={onEditProfile}
            className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
            title="Edit profil"
          >
            <Edit3 className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>
      </div>
      
      {/* Privacy Notice - Collapsible on mobile */}
      <div className="mt-4 text-xs sm:text-sm text-gray-500 bg-white bg-opacity-50 rounded-lg p-3">
        <p>
          <strong className="text-gray-700">Privasi & Keamanan:</strong> 
          <span className="block sm:inline sm:ml-1">
            Data tersimpan lokal di browser Anda dan tidak dapat diakses pengguna lain. 
            Nama tampilan akan terlihat pada buku yang Anda bagikan ke publik.
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserInfo;