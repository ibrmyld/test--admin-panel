import React, { useState, useRef } from 'react';
import { Upload, X, Image, AlertCircle } from 'lucide-react';

const ImageUpload = ({ 
  onUpload, 
  onRemove, 
  multiple = false, 
  maxFiles = 5,
  currentImages = [],
  className = "",
  buttonText = "Görsel Yükle"
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFiles = (files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const errors = [];

    Array.from(files).forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Desteklenmeyen dosya türü`);
      }
      if (file.size > maxSize) {
        errors.push(`${file.name}: Dosya boyutu 5MB'dan büyük`);
      }
    });

    if (multiple && currentImages.length + files.length > maxFiles) {
      errors.push(`En fazla ${maxFiles} görsel yükleyebilirsiniz`);
    }

    return errors;
  };

  const handleFileSelect = async (files) => {
    const errors = validateFiles(files);
    
    if (errors.length > 0) {
      alert('Dosya hataları:\n' + errors.join('\n'));
      return;
    }

    setUploading(true);
    
    try {
      if (multiple) {
        await onUpload(Array.from(files));
      } else {
        await onUpload(files[0]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Yükleme sırasında hata oluştu: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      await onRemove(imageUrl);
    } catch (error) {
      console.error('Remove error:', error);
      alert('Silme sırasında hata oluştu: ' + error.message);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600">Yükleniyor...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="text-sm text-gray-600">
              Görselleri buraya sürükleyin veya seçmek için tıklayın
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, WebP, GIF - Max 5MB
              {multiple && ` - En fazla ${maxFiles} dosya`}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {buttonText}
            </button>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Current Images Display */}
      {currentImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Mevcut Görseller ({currentImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Görsel ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDJIM0MxLjkgMiAxIDIuOSAxIDRWMjBDMSAyMS4xIDEuOSAyMiAzIDIySDE5TDIxIDIwVjRDMjEgMi45IDIwLjEgMiAyMSAyWk0xNSAxMkwxMy41IDEwLjVMMTEgMTRMOC41IDExLjVMNSAxNkgxOUwxNSAxMloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                    }}
                  />
                </div>
                {onRemove && (
                  <button
                    onClick={() => handleRemoveImage(imageUrl)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Görseli Sil"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
