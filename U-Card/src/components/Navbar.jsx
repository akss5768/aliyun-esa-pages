import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Menu, X, Home, Plus, FolderOpen, Sparkles, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const navItems = [
    { name: '首页', path: '/', icon: Home },
    { name: '我的卡牌', path: '/cards', icon: LayoutGrid },
    { name: '创建卡牌', path: '/cards/new', icon: Plus },
    { name: '卡牌组', path: '/groups', icon: FolderOpen },
    { name: 'AI生成', path: '/ai-generator', icon: Sparkles },
  ];
  
  return (
    <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <LayoutGrid className="h-8 w-8 text-yellow-400" />
            <span className="ml-2 text-xl font-bold">卡牌收藏家</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-800 transition-colors duration-200"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          {/* User Menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-3">
                <span className="text-sm">用户</span>
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 focus:ring-white"
            >
              <span className="sr-only">打开主菜单</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-800 transition-colors duration-200"
                  onClick={toggleMenu}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
            
            {/* Mobile User Menu */}
            <div className="mt-4 pt-4 border-t border-indigo-700">
              <div className="flex items-center px-3">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="h-6 w-6" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium">用户</div>
                  <div className="text-sm text-indigo-200">免费账户</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;