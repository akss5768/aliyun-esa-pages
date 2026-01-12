import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const navItems = [
    { name: '直播', path: '/' },
    { name: '频道管理', path: '/channels' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // 搜索功能实现
    console.log('搜索:', searchQuery);
    // 这里应该通知ChannelList组件进行搜索
    // 为了简化，我们使用URL参数传递搜索词
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    setSearchQuery('');
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-blue-500">IPTV Player</h1>
        </div>

        <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block absolute md:static top-16 left-0 right-0 bg-gray-800 md:bg-transparent z-10`}>
          <ul className="flex flex-col md:flex-row md:space-x-6 p-4 md:p-0">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className="block py-2 md:py-0 hover:text-blue-400 transition-colors text-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索频道..."
                className="bg-gray-700 text-gray-100 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;