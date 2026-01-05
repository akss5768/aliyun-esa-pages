import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, FolderOpen, Sparkles, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <LayoutGrid className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">卡牌收藏</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Home className="h-4 w-4 mr-1" />
              首页
            </Link>
            <Link
              to="/cards"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/cards') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              卡牌库
            </Link>
            <Link
              to="/groups"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/groups') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FolderOpen className="h-4 w-4 mr-1" />
              卡牌组
            </Link>
            <Link
              to="/ai-generator"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/ai-generator') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              AI生成
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                本地模式
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;