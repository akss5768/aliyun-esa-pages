import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, DownloadIcon } from 'lucide-react';

const Header = ({ title, showNewButton = false, onExport }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#FFB7C5] flex items-center justify-center">
            <PencilIcon className="text-white" size={18} />
          </div>
          <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center space-x-1 bg-[#FF6B8C] text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-all duration-200 hover:scale-105 shadow-sm"
              title="导出笔记"
            >
              <DownloadIcon size={16} />
              <span>导出</span>
            </button>
          )}
          
          {showNewButton && (
            <Link 
              to="/note/new"
              className="flex items-center space-x-1 bg-[#FFB7C5] text-white px-4 py-2 rounded-full hover:bg-pink-400 transition-all duration-200 hover:scale-105 shadow-sm"
            >
              <PlusIcon size={16} />
              <span>新建</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;