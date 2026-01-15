import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Code, Calendar, FileText, Key, Timer, Regex } from 'lucide-react';

// 将allTools数组提取到组件外部，使其在toggleFavorite函数中可访问
const allTools = [
  { 
    id: 'json', 
    name: 'JSON校验与格式化', 
    description: '校验JSON语法并格式化显示', 
    icon: Code,
    category: '开发工具'
  },
  { 
    id: 'timestamp', 
    name: '时间戳转换', 
    description: 'Unix时间戳与日期相互转换', 
    icon: Timer,
    category: '时间工具'
  },
  { 
    id: 'crontab', 
    name: 'Crontab计算', 
    description: '计算定时任务执行时间', 
    icon: Calendar,
    category: '运维工具'
  },
  { 
    id: 'regex', 
    name: '正则表达式测试', 
    description: '测试正则表达式的匹配结果', 
    icon: Regex,
    category: '开发工具'
  },
  { 
    id: 'uuid', 
    name: 'UUID生成', 
    description: '生成随机UUID字符串', 
    icon: Key,
    category: '开发工具'
  },
  { 
    id: 'jwt', 
    name: 'JWT解析', 
    description: '解析JWT Token内容', 
    icon: FileText,
    category: '安全工具'
  },
  { 
    id: 'diff', 
    name: '文本对比', 
    description: '对比两段文本的差异', 
    icon: FileText,
    category: '文本工具'
  }
];

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteTools, setFavoriteTools] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
    
    const favTools = allTools.filter(tool => savedFavorites.includes(tool.id));
    setFavoriteTools(favTools);
  }, []);

  const toggleFavorite = (toolId) => {
    let newFavorites;
    if (favorites.includes(toolId)) {
      newFavorites = favorites.filter(id => id !== toolId);
    } else {
      newFavorites = [...favorites, toolId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // 更新显示的工具列表
    setFavoriteTools(prev => 
      newFavorites.includes(toolId) 
        ? [...prev, allTools.find(t => t.id === toolId)]
        : prev.filter(t => t.id !== toolId)
    );
  };

  if (favoriteTools.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">您还没有收藏任何工具</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          快去首页看看吧，找到您喜欢的工具并添加到收藏夹中
        </p>
        <Link 
          to="/" 
          className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          浏览工具
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">我的收藏</h1>
        <p className="text-gray-600 dark:text-gray-400">
          您收藏的U-Tools开发者工具
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteTools.map((tool) => {
          const IconComponent = tool.icon;
          const isFavorite = favorites.includes(tool.id);
          
          return (
            <div 
              key={tool.id} 
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <button 
                  onClick={() => toggleFavorite(tool.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label={isFavorite ? '取消收藏' : '添加收藏'}
                >
                  <Heart 
                    className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </button>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{tool.description}</p>
              
              <Link 
                to={`/tools/${tool.id}`}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center rounded-lg transition-colors"
              >
                使用工具
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;