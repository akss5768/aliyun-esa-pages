import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Heart, Code, Calendar, FileText, Key, Timer, Regex, Hash, Link as LinkIcon, Globe } from 'lucide-react';

const SearchResults = () => {
  const [favorites, setFavorites] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // 获取所有工具列表
  const allTools = [
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

  // 从 URL 参数获取搜索查询
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);

    // 执行搜索
    if (query) {
      const filteredTools = allTools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredTools);
    } else {
      setSearchResults([]);
    }
  }, [query]);

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

  const handleSearchChange = (e) => {
    const newQuery = e.target.value;
    if (newQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">搜索结果</h1>
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="再次搜索..." 
              defaultValue={query}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
        
        {query && (
          <p className="text-gray-600 dark:text-gray-400">
            找到 {searchResults.length} 个与 "{query}" 相关的结果
          </p>
        )}
      </div>
      
      {query && searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map((tool) => {
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
      ) : query ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">未找到相关工具</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            很抱歉，我们找不到与 "{query}" 相关的工具，请尝试其他关键词。
          </p>
          <Link 
            to="/" 
            className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            返回首页
          </Link>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">请输入搜索关键词</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            在上方的搜索框中输入关键词以搜索工具
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;