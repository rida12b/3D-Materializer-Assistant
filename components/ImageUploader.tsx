import React from 'react';
import { useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        alert('Please upload a valid image file.');
      }
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(<T,>(e: React.DragEvent<T>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageUpload(file);
      } else {
        alert('Please upload a valid image file.');
      }
      e.dataTransfer.clearData();
    }
  }, [onImageUpload]);

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full p-6 border-2 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'border-[#00ffff] bg-cyan-900/30' : 'border-gray-600 hover:border-gray-500'}`}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept="image/*"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
        <UploadIcon className="w-10 h-10 text-gray-500"/>
        <p className="text-gray-300 font-semibold">
          <span className="text-[#00ffff]">{`> Click to upload`}</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 font-mono-tech">PNG, JPG, GIF, WEBP</p>
      </label>
    </div>
  );
};

export default ImageUploader;