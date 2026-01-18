import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Plus } from 'lucide-react';

const Header = ({ title, showAddButton = false, showNotificationButton = false }) => {
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex space-x-3">
        {showNotificationButton && (
          <Link to="/notifications" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="text-gray-600" size={20} />
          </Link>
        )}
        {showAddButton && (
          <Link 
            to="/upload" 
            className="p-2 rounded-full bg-pink-300 hover:bg-pink-400 transition-colors"
          >
            <Plus className="text-white" size={20} />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;