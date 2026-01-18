import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

const SearchPage = ({ sites, categories, bookmarks, toggleBookmark, isBookmarked }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 6; // 每页显示6个站点
  
  // 根据搜索词过滤站点
  const filteredSites = sites.filter(site => 
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
  
  // 获取站点所属分类名称
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '未知分类';
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
        
        <h1 className="text-3xl font-bold mb-6">搜索站点</h1>
        
        <div className="relative mb-8">
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
            placeholder="输入站点名称、描述或标签..."
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {searchTerm && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            搜索结果 {filteredSites.length > 0 ? `(${filteredSites.length})` : ''}
          </h2>
          
          {filteredSites.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              未找到匹配的站点
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {currentSites.map((site) => (
                  <div 
                    key={site.id}
                    className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-5 transition-all duration-300 hover:border-blue-500/50 flex flex-col"
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
                            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                              {site.name}
                              <ExternalLink className="w-4 h-4 text-gray-500" />
                            </h3>
                            <p className="text-gray-400 text-sm mb-3">{site.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {site.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs"
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
                        className={`p-2 rounded-full ml-2 ${isBookmarked(site.id) ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
                        aria-label={isBookmarked(site.id) ? "取消收藏" : "收藏"}
                      >
                        {isBookmarked(site.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      分类: {site.classify && site.classify.map(catId => getCategoryName(catId)).join(', ')}
                    </div>
                  </div>
                ))}
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
        </div>
      )}

      {!searchTerm && (
        <div className="text-center py-12 text-gray-500">
          输入关键词开始搜索
        </div>
      )}
    </div>
  );
};

export default SearchPage;