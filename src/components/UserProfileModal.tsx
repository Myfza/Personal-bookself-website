import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X } from 'lucide-react';
import { getUserName, setUserName } from '../utils/localStorage';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNameUpdate: (newName: string) => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onNameUpdate 
}) => {
  const [currentName, setCurrentName] = useState('');
  const [editedName, setEditedName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const name = getUserName();
      setCurrentName(name);
      setEditedName(name);
      setIsEditing(false);
      setError('');
    }
  }, [isOpen]);

  const handleSave = () => {
    const trimmedName = editedName.trim();
    
    if (!trimmedName) {
      setError('Nama tidak boleh kosong');
      return;
    }
    
    if (trimmedName.length < 2) {
      setError('Nama minimal 2 karakter');
      return;
    }
    
    if (trimmedName.length > 50) {
      setError('Nama maksimal 50 karakter');
      return;
    }

    try {
      setUserName(trimmedName);
      setCurrentName(trimmedName);
      setIsEditing(false);
      setError('');
      onNameUpdate(trimmedName);
    } catch (error) {
      setError('Gagal menyimpan nama');
    }
  };

  const handleCancel = () => {
    setEditedName(currentName);
    setIsEditing(false);
    setError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Profil Pengguna</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
            aria-label="Tutup profil"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Nama Tampilan
            </label>
            
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className={`w-full px-3 py-3 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    error ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan nama tampilan Anda"
                  maxLength={50}
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Save className="h-4 w-4 mr-2 flex-shrink-0" />
                    Simpan
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                  >
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg min-w-0">
                <span className="text-gray-900 font-medium truncate flex-1 mr-3" title={currentName}>{currentName}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors flex-shrink-0"
                >
                  <Edit3 className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="hidden xs:inline">Edit</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-3">Informasi</h4>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-2">
              <li>• Nama ini akan ditampilkan pada buku yang Anda bagikan</li>
              <li>• Pengguna lain akan melihat nama ini di buku publik Anda</li>
              <li>• Anda dapat mengubah nama kapan saja</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;