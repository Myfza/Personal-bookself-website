import React, { useRef } from 'react';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { Book } from '../types/Book';
import { exportBooks, importBooks, clearAllData } from '../utils/localStorage';

interface DataManagementProps {
  books: Book[];
  onImport: (books: Book[]) => void;
  onShowNotification: (message: string, type: 'success' | 'error') => void;
}

const DataManagement: React.FC<DataManagementProps> = ({ 
  books, 
  onImport, 
  onShowNotification 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonData = exportBooks();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookshelf-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      onShowNotification('Data berhasil diekspor!', 'success');
    } catch (error) {
      onShowNotification('Gagal mengekspor data.', 'error');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const importedBooks = importBooks(jsonData);
        onImport(importedBooks);
        onShowNotification(`Berhasil mengimpor ${importedBooks.length} buku!`, 'success');
      } catch (error) {
        onShowNotification('Gagal mengimpor data. Periksa format file.', 'error');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin menghapus SEMUA data? Tindakan ini tidak dapat dibatalkan. Pastikan Anda sudah mengekspor data terlebih dahulu.'
    );
    
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'Konfirmasi sekali lagi: Semua data akan dihapus permanen!'
      );
      
      if (doubleConfirm) {
        try {
          clearAllData();
          window.location.reload(); // Reload to reset state
        } catch (error) {
          onShowNotification('Gagal menghapus data.', 'error');
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
        Manajemen Data
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleExport}
            disabled={books.length === 0}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor Data
          </button>
          
          <button
            onClick={handleImportClick}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Impor Data
          </button>
          
          <button
            onClick={handleClearData}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Hapus Semua
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">Informasi Penting:</p>
          <ul className="space-y-1 text-xs">
            <li>• Data Anda tersimpan lokal di browser dan tidak dapat diakses orang lain</li>
            <li>• Ekspor data secara berkala untuk backup</li>
            <li>• File impor harus dalam format JSON yang valid</li>
            <li>• Hapus cache browser akan menghilangkan data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;