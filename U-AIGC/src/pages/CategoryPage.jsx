import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react';

const CategoryPage = ({ sites, categories, bookmarks, toggleBookmark, isBookmarked }) => {
  const { categoryId } = useParams();
  const category = categories.find(cat => cat.id === categoryId);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 6; // 每页显示6个站点
  
  // 获取当前分类下的站点
  const categorySites = sites.filter(site => site.classify && site.classify.includes(categoryId));
  
  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">未找到分类</h2>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首页</span>
          </Link>
        </div>
      </div>
    );
  }
  
  // 计算分页数据
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;
  const currentSites = categorySites.slice(indexOfFirstSite, indexOfLastSite);
  const totalPages = Math.ceil(categorySites.length / sitesPerPage);
  
  // 处理页面切换
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-400">{category.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {currentSites.map((site) => (
          <div key={site.id} className="bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <a 
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow"
              >
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {site.name}
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </h3>
                <p className="text-gray-400 mb-4">{site.description}</p>
              </a>
              <button 
                onClick={() => toggleBookmark(site)}
                className={`p-2 rounded-full ${isBookmarked(site.id) ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-500 hover:text-yellow-400 hover:bg-yellow-400/10'}`}
                aria-label={isBookmarked(site.id) ? "取消收藏" : "收藏"}
              >
                {isBookmarked(site.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {site.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
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
    </div>
  );
};

export default CategoryPage;