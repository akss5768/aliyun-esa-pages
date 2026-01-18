import React, { useState } from 'react';

const ImagePlaceholder = ({ type, alt, className = "", src, fallbackText }) => {
  const [imgError, setImgError] = useState(false);
  
  const getPlaceholderClass = () => {
    switch(type) {
      case 'dynasty':
        return 'tang-dynasty-placeholder';
      case 'region':
        return 'song-dynasty-placeholder';
      case 'item':
        return 'item-image-placeholder';
      case 'event':
        return 'ming-dynasty-placeholder';
      case 'profession':
        return 'qing-dynasty-placeholder';
      default:
        return 'image-placeholder';
    }
  };

  if (src && !imgError) {
    return (
      <img 
        src={src}
        alt={alt}
        className={className}
        onError={() => setImgError(true)}
      />
    );
  }
  
  return (
    <div className={`${getPlaceholderClass()} ${className}`}>
      <span>{fallbackText || alt}</span>
    </div>
  );
};

export { ImagePlaceholder };