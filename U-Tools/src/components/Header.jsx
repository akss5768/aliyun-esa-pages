import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Heart, Clock, Search } from 'lucide-react';

const Header = ({ darkMode, toggleDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg mr-2 flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            U-Tools
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">首页</Link>
            <Link to="/favorites" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              收藏夹
            </Link>
            <Link to="/history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              历史记录
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="搜索工具..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 md:w-64"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? '切换到浅色模式' : '切换到深色模式'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;