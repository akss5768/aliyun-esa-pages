import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, BookmarkCheck, Search } from 'lucide-react';

const BookmarksPage = ({ bookmarks, toggleBookmark, sites, categories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 6; // 每页显示6个站点
  
  // 根据搜索词过滤收藏站点
  const filteredSites = bookmarks.filter(site => 
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // 计算分页数据
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = filteredSites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPages = Math.ceil(filteredSites.length / sitesPerPage);
  
  // 处理页面切换
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // 获取站点所属分类
  const getCategoryForSite = (siteId) => {
    const site = sites.find(s => s.id === siteId);
    if (site && site.classify && site.classify.length > 0) {
      // 返回第一个分类作为主要分类
      return categories.find(cat => cat.id === site.classify[0]);
    }
    return null;
  };
  
  // 获取分类图标
  const getCategoryIcon = (categoryId) => {
    switch (categoryId) {
      case 'ai-art': return '🎨';
      case 'ai-writing': return '✍️';
      case 'ai-video': return '🎬';
      default: return '⭐';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回首页</span>
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <BookmarkCheck className="w-8 h-8 text-yellow-400" />
          我的收藏
        </h1>
        <p className="text-gray-400">管理您收藏的AI工具站点</p>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkCheck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">暂无收藏</h3>
          <p className="text-gray-500 mb-6">您还没有收藏任何站点</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-lg transition-all duration-300"
          >
            去发现工具
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 重置到第一页
                }}
                placeholder="搜索收藏的站点..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              共收藏 {bookmarks.length} 个站点
            </div>
          </div>
          
          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              未找到匹配的收藏站点
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {currentSites.map((site) => {
                  const originalSite = sites.find(s => s.id === site.id);
                  const category = originalSite && originalSite.classify && originalSite.classify.length > 0 
                    ? categories.find(cat => cat.id === originalSite.classify[0]) 
                    : null;
                  return (
                    <div 
                      key={site.id}
                      className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-5 transition-all duration-300 hover:border-yellow-500/50 flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <a 
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-grow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">
                                  {category ? getCategoryIcon(category.id) : '⭐'}
                                </span>
                                <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                                  {category ? category.name : '未知分类'}
                                </span>
                              </div>
                              <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                                {site.name}
                                <ExternalLink className="w-4 h-4 text-gray-500" />
                              </h3>
                              <p className="text-gray-400 text-sm mb-3">{site.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {site.tags.map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </a>
                        <button 
                          onClick={() => toggleBookmark(site)}
                          className="p-2 rounded-full text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20"
                          aria-label="取消收藏"
                        >
                          <BookmarkCheck className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 分页控件 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-blue-400 hover:bg-blue-400/10'}`}
                  >
                    上一页
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-10 h-10 rounded-full ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-blue-400 hover:bg-blue-400/10'}`}
                  >
                    下一页
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookmarksPage;