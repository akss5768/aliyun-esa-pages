import React from 'react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays - 1}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // 生成预览内容
  const getPreview = (content) => {
    // 移除markdown标记
    const cleanContent = content.replace(/[#*`\[\]\(\)]/g, '');
    return cleanContent.length > 100 
      ? cleanContent.substring(0, 100) + '...'
      : cleanContent;
  };

  return (
    <Link 
      to={`/note/${note.id}`}
      className="block bg-white rounded-xl shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-pink-50"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-800 truncate flex-1 mr-2">{note.title || '未命名笔记'}</h3>
        <div className="text-xs text-pink-400 whitespace-nowrap">{formatDate(note.updatedAt)}</div>
      </div>
      
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
        {getPreview(note.content) || '暂无内容'}
      </p>
      
      <div className="mt-3 flex justify-end">
        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-pink-300"></div>
        </div>
      </div>
      
      {/* 装饰性元素 */}
      <div className="absolute bottom-2 right-2 text-pink-100 opacity-20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z" fill="currentColor"/>
          <path d="M21 9V7L15 13L13.5 7.5C13.1 6.4 12 5.8 10.9 6.2L7.1 7.8C6 8.2 5.4 9.3 5.8 10.4L9 18H11L8.5 12L10 11L12 17H14L15.5 11.5L18.5 10L21 9Z" fill="currentColor"/>
        </svg>
      </div>
    </Link>
  );
};

export default NoteCard;