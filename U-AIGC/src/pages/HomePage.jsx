import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Palette, PenTool, Video, Sparkles, Bookmark } from 'lucide-react';

const HomePage = ({ sites, categories, bookmarks, toggleBookmark, isBookmarked }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'ai-art': return <Palette className="w-8 h-8" />;
      case 'ai-writing': return <PenTool className="w-8 h-8" />;
      case 'ai-video': return <Video className="w-8 h-8" />;
      default: return <Palette className="w-8 h-8" />;
    }
  };
  
  // 获取每个分类的站点数量
  const getCategorySiteCount = (categoryId) => {
    return sites.filter(site => site.classify && site.classify.includes(categoryId)).length;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative z-10 flex flex-col h-full">
      <header className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4 animate-fade-in">
          AI创作者导航
        </h1>
        <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto transition-all duration-700 delay-150" style={{ opacity: isVisible ? 1 : 0, transform: `translateY(${isVisible ? 0 : 10}px)` }}>
          探索前沿AI工具，释放无限创作潜能
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/20"
          >
            <Search className="w-5 h-5" />
            <span className="font-medium">发现AI工具</span>
          </Link>
          
          <Link 
            to="/bookmarks" 
            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl transition-all duration-300 border border-gray-700"
          >
            <Bookmark className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">我的收藏 ({bookmarks.length})</span>
          </Link>
        </div>
      </header>

      <section className={`transition-all duration-700 delay-300 flex-grow ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 justify-center">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">站点分类</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/category/${category.id}`}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 transition-all duration-500 hover:scale-[1.03] hover:border-blue-500/50 hover:shadow-xl group ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl text-blue-400 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  {getCategoryIcon(category.id)}
                </div>
                <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">{category.name}</h3>
              </div>
              <p className="text-gray-400 mb-4">{category.description}</p>
              <div className="mt-2 text-sm text-blue-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                <span>探索 {getCategorySiteCount(category.id)} 个工具</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;