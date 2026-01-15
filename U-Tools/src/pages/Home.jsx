import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Code, Calendar, FileText, Key, Timer, Regex, Hash, Link as LinkIcon, Globe } from 'lucide-react';

const Home = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const tools = [
    { 
      id: 'json', 
      name: 'JSON校验与格式化', 
      description: '校验JSON语法并美化格式化显示', 
      icon: Code,
      category: '开发工具'
    },
    { 
      id: 'timestamp', 
      name: '时间戳转换', 
      description: 'Unix时间戳与日期时间相互转换', 
      icon: Timer,
      category: '时间工具'
    },
    { 
      id: 'crontab', 
      name: 'Crontab解析', 
      description: '解析和计算定时任务执行时间', 
      icon: Calendar,
      category: '运维工具'
    },
    { 
      id: 'regex', 
      name: '正则表达式测试', 
      description: '实时测试正则表达式的匹配结果', 
      icon: Regex,
      category: '开发工具'
    },
    { 
      id: 'uuid', 
      name: 'UUID生成', 
      description: '生成标准格式的UUID字符串', 
      icon: Key,
      category: '开发工具'
    },
    { 
      id: 'jwt', 
      name: 'JWT解析', 
      description: '解析和验证JWT Token内容', 
      icon: FileText,
      category: '安全工具'
    },
    { 
      id: 'diff', 
      name: '文本对比', 
      description: '高亮显示两段文本的差异', 
      icon: FileText,
      category: '文本工具'
    },
    { 
      id: 'md5', 
      name: 'MD5生成', 
      description: '生成文本的MD5哈希值', 
      icon: Hash,
      category: '安全工具'
    },
    { 
      id: 'url', 
      name: 'URL格式化', 
      description: 'URL编码、解码和规范化处理', 
      icon: LinkIcon,
      category: '开发工具'
    },
    { 
      id: 'unicode', 
      name: 'Unicode转换', 
      description: 'Unicode编码与解码转换', 
      icon: Globe,
      category: '开发工具'
    }
  ];

  const toggleFavorite = (toolId) => {
    let newFavorites;
    if (favorites.includes(toolId)) {
      newFavorites = favorites.filter(id => id !== toolId);
    } else {
      newFavorites = [...favorites, toolId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">U-Tools 开发者工具箱</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          一站式的开发者工具平台，提供多种实用工具，免安装、免注册，即开即用
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tools.map((tool) => {
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

export default Home;