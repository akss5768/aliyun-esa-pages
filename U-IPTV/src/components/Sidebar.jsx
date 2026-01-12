import React, { useState, useEffect } from 'react';
import { ChevronRight, Tv, Film, Star } from 'lucide-react';

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [categoriesWithCount, setCategoriesWithCount] = useState([
    { id: 'all', name: '全部频道', icon: Tv, count: 0 },
    { id: 'news', name: '新闻', icon: Tv, count: 0 },
    { id: 'sports', name: '体育', icon: Tv, count: 0 },
    { id: 'movies', name: '电影', icon: Film, count: 0 },
    { id: 'kids', name: '少儿', icon: Tv, count: 0 },
    { id: 'music', name: '音乐', icon: Tv, count: 0 },
    { id: 'other', name: '其他', icon: Tv, count: 0 }
  ]);
  
  // 从localStorage加载频道数据并计算各分类数量
  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      const channels = JSON.parse(savedChannels);
      
      // 计算各分类的频道数量
      const newsCount = channels.filter(c => c.category === 'news').length;
      const sportsCount = channels.filter(c => c.category === 'sports').length;
      const moviesCount = channels.filter(c => c.category === 'movies').length;
      const kidsCount = channels.filter(c => c.category === 'kids').length;
      const musicCount = channels.filter(c => c.category === 'music').length;
      const otherCount = channels.filter(c => c.category === 'other').length;
      
      // 更新分类计数
      setCategoriesWithCount(prev => [
        { id: 'all', name: '全部频道', icon: Tv, count: channels.length },
        { id: 'news', name: '新闻', icon: Tv, count: newsCount },
        { id: 'sports', name: '体育', icon: Tv, count: sportsCount },
        { id: 'movies', name: '电影', icon: Film, count: moviesCount },
        { id: 'kids', name: '少儿', icon: Tv, count: kidsCount },
        { id: 'music', name: '音乐', icon: Tv, count: musicCount },
        { id: 'other', name: '其他', icon: Tv, count: otherCount }
      ]);
    }
  }, []);

  return (
    <aside className="hidden md:block w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
      <div className="p-4">

        <ul className="space-y-1">
          {categoriesWithCount.map((category) => {
            const Icon = category.icon;
            return (
              <li key={category.id}>
                <button
                  className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeCategory === category.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                  onClick={() => {
                    setActiveCategory(category.id);
                    // 发送事件通知ChannelList组件进行筛选
                    window.dispatchEvent(new CustomEvent('categoryChange', { detail: category.id }));
                  }}
                >
                  <Icon size={18} className="mr-3" />
                  <span className="flex-1 text-left">{category.name}</span>
                  <span className="text-xs bg-gray-700 text-white rounded-full px-2 py-1 min-w-[24px] text-center">
                    {category.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;