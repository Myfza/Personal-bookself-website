import React from 'react';
import { User, Shield, Database } from 'lucide-react';
import { getUserId } from '../utils/localStorage';

interface UserInfoProps {
  totalBooks: number;
}

const UserInfo: React.FC<UserInfoProps> = ({ totalBooks }) => {
  const userId = getUserId();
  const shortUserId = userId.split('_')[1]?.substring(0, 8) || 'unknown';

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">Sesi Pengguna</h3>
          <p className="text-sm text-gray-600">ID: {shortUserId}</p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Database className="h-4 w-4 mr-1" />
            <span>{totalBooks} buku</span>
          </div>
          <div className="flex items-center text-xs text-green-600">
            <Shield className="h-3 w-3 mr-1" />
            <span>Data Terlindungi</span>
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 bg-white bg-opacity-50 rounded p-2">
        <p>
          <strong>Privasi:</strong> Data Anda tersimpan lokal di browser dan tidak dapat diakses pengguna lain. 
          Setiap pengunjung memiliki data terpisah dan aman.
        </p>
      </div>
    </div>
  );
};

export default UserInfo;