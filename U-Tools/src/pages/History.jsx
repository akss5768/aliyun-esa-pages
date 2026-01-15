import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    // 按时间倒序排列
    const sortedHistory = savedHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    setHistory(sortedHistory);
  }, []);

  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const restoreHistory = (historyItem) => {
    // 将历史记录数据传递到工具页面
    localStorage.setItem(`tool-${historyItem.toolId}-restore`, JSON.stringify({
      input: historyItem.input,
      output: historyItem.output
    }));
    
    // 跳转到工具页面
    window.location.hash = `#/tools/${historyItem.toolId}`;
  };

  const deleteHistoryItem = (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem('toolHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('toolHistory');
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2">暂无使用历史</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          您使用过的工具将显示在这里，方便您快速恢复之前的工作
        </p>
        <Link 
          to="/" 
          className="inline-block py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          开始使用工具
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">使用历史</h1>
          <p className="text-gray-600 dark:text-gray-400">
            您在U-Tools中最近使用过的工具记录
          </p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="py-2 px-4 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            清空历史
          </button>
        )}
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {history.map((item, index) => (
            <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold">{item.toolName}</h3>
                    <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">输入:</p>
                      <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {truncateText(item.input)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">输出:</p>
                      <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded">
                        {truncateText(item.output)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button 
                    onClick={() => restoreHistory(item)}
                    className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    恢复
                  </button>
                  <button 
                    onClick={() => deleteHistoryItem(index)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="删除记录"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default History;