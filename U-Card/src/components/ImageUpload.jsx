import React, { useState } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

const ImageUpload = ({ 
  value, 
  onChange, 
  label, 
  placeholder = "图片URL", 
  onUpload 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value || '');
  
  // 当value改变时更新预览
  React.useEffect(() => {
    setPreviewUrl(value || '');
  }, [value]);
  
  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreviewUrl(url);
    onChange(url);
  };
  
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    
    // 检查文件大小 (最大5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 如果有自定义上传函数，使用它
      if (onUpload) {
        const uploadedUrl = await onUpload(file);
        setPreviewUrl(uploadedUrl);
        onChange(uploadedUrl);
      } else {
        // 默认使用FileReader预览本地文件
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            setPreviewUrl(result);
            onChange(result);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    setPreviewUrl('');
    onChange('');
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      
      <div className="flex items-start space-x-2">
        {/* URL输入框 */}
        <div className="flex-grow">
          <input
            type="text"
            value={previewUrl}
            onChange={handleUrlChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder={placeholder}
          />
        </div>
        
        {/* 上传按钮 */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <button
            type="button"
            className={`flex items-center px-3 py-2 border rounded-md ${isUploading ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'} border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="h-4 w-4 border-t-2 border-indigo-600 rounded-full animate-spin" />
            ) : (
              <Upload className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* 清除按钮 */}
        {previewUrl && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="flex items-center px-2 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        )}
      </div>
      
      {/* 图片预览 */}
      <div className="mt-2">
        {previewUrl ? (
          <div className="relative inline-block">
            <img 
              src={previewUrl} 
              alt="预览" 
              className="h-16 w-16 object-cover rounded-md border border-gray-300"
              onError={(e) => {
                e.currentTarget.src = '';
                setPreviewUrl('');
              }}
            />
          </div>
        ) : (
          <div className="h-16 w-16 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;