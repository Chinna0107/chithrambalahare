import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload, X, Loader2, Image as ImageIcon, Check } from 'lucide-react';

const ImageUpload = ({ value, onChange, multiple = false, placeholder = "Upload image...", allowWatermark = false, returnArray = false, hidePreview = false }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [useWatermark, setUseWatermark] = useState(false);
  const fileInputRef = useRef(null);

  const processFiles = async (files) => {
    if (!files.length) return;
    setIsUploading(true);

    try {
      const endpoint = multiple ? '/api/upload/multiple' : '/api/upload';
      const url = useWatermark ? `${endpoint}?watermark=true` : endpoint;

      let uploadedUrls = [];

      if (multiple) {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        
        const response = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedUrls = response.data.files.map(f => f.url);
      } else {
        const formData = new FormData();
        formData.append('image', files[0]);
        
        const response = await axios.post(url, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadedUrls = [response.data.url];
      }

      if (multiple) {
        let currentUrls = [];
        if (returnArray) {
          currentUrls = Array.isArray(value) ? value : [];
        } else {
          currentUrls = value ? String(value).split('\n').filter(Boolean) : [];
        }
        
        const newUrls = [...currentUrls, ...uploadedUrls];
        onChange(returnArray ? newUrls : newUrls.join('\n'));
      } else {
        onChange(uploadedUrls[0]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setIsDragActive(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      processFiles(files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isUploading) setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleRemove = (urlToRemove, e) => {
    e.stopPropagation();
    if (multiple) {
      let currentUrls = returnArray 
        ? (Array.isArray(value) ? value : []) 
        : String(value).split('\n').filter(Boolean);
        
      const newUrls = currentUrls.filter(u => u !== urlToRemove);
      onChange(returnArray ? newUrls : newUrls.join('\n'));
    } else {
      onChange('');
    }
  };

  const currentUrls = multiple 
    ? (returnArray ? (Array.isArray(value) ? value : []) : (value ? String(value).split('\n').filter(Boolean) : [])) 
    : (value ? [String(value)] : []);

  return (
    <div className="space-y-3">
      {allowWatermark && (
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer w-fit">
          <input type="checkbox" className="hidden" checked={useWatermark} onChange={() => setUseWatermark(!useWatermark)} />
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${useWatermark ? 'bg-brand-red border-brand-red' : 'border-gray-600'}`}>
            {useWatermark && <Check className="w-3 h-3 text-white" />}
          </div>
          Apply Watermark
        </label>
      )}

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex items-center justify-center w-full px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all
          ${isUploading ? 'border-gray-700 bg-black/50 cursor-not-allowed' : 
            isDragActive ? 'border-brand-red bg-brand-red/10' : 'border-gray-600 bg-black/30 hover:border-brand-red hover:bg-black/50'}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className={`w-8 h-8 transition-colors ${isDragActive ? 'text-brand-red' : 'group-hover:text-brand-red'}`} />
              <span className="font-semibold">{isDragActive ? 'Drop images here' : placeholder}</span>
              {multiple && <span className="text-xs text-gray-500 font-normal">Drag and drop supported</span>}
            </>
          )}
        </div>
      </div>

      {!hidePreview && currentUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
          {currentUrls.map((url, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-800 bg-gray-900 aspect-video">
              <img src={url} alt="Uploaded preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={(e) => handleRemove(url, e)}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
