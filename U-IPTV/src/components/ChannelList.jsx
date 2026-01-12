import React, { useState, useEffect } from 'react';
import { Play, Wifi, WifiOff, LoaderCircle } from 'lucide-react';
import useChannelStatus from '../hooks/useChannelStatus';

const ChannelList = () => {
  const [channels, setChannels] = useState([]);
  const [filteredChannels, setFilteredChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 添加分类筛选状态
  
  // 监听来自侧边栏的分类筛选事件
  useEffect(() => {
    const handleCategoryChange = (event) => {
      setCategoryFilter(event.detail);
    };
    
    window.addEventListener('categoryChange', handleCategoryChange);
    
    return () => {
      window.removeEventListener('categoryChange', handleCategoryChange);
    };
  }, []);
  
  const { checkingStatus, checkChannelStatus } = useChannelStatus();

  // 从localStorage加载频道数据
  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      const parsedChannels = JSON.parse(savedChannels);
      setChannels(parsedChannels);
      setFilteredChannels(parsedChannels);
      
      // 默认选择第一个频道
      if (parsedChannels.length > 0) {
        setSelectedChannel(parsedChannels[0]);
      }
    } else {
      // 默认频道数据
      const defaultChannels = [
        { id: 1, name: '中央电视塔东', url: 'https://gcalic.v.myalicdn.com/gc/ztd_1/index.m3u8', category: 'news' },
        { id: 2, name: '中央电视塔南', url: 'https://gcalic.v.myalicdn.com/gc/ztn_1/index.m3u8', category: 'sports' },
      ];
      setChannels(defaultChannels);
      setFilteredChannels(defaultChannels);
      
      if (defaultChannels.length > 0) {
        setSelectedChannel(defaultChannels[0]);
      }
    }
  }, []);

  // 获取所有唯一的分类
  const allCategories = ['all', ...new Set(channels.map(channel => channel.category))];
  
  // 处理搜索和分类筛选
  useEffect(() => {
    // 从URL参数获取搜索词
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    
    if (search) {
      setSearchQuery(search);
    }
    
    let result = channels;
    
    // 应用分类筛选
    if (categoryFilter !== 'all') {
      result = result.filter(channel => channel.category === categoryFilter);
    }
    
    // 应用搜索筛选
    if (searchQuery) {
      result = result.filter(channel => 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        channel.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredChannels(result);
  }, [channels, searchQuery, categoryFilter]);
  
  // 组件加载时检查所有频道状态，只检查一次
  useEffect(() => {
    if (channels.length > 0) {
      channels.forEach(channel => {
        // 为了避免过于频繁的请求，只检查那些尚未检查过的频道
        if (!checkingStatus.hasOwnProperty(channel.id)) {
          checkChannelStatus(channel);
        }
      });
    }
  }, [channels, checkingStatus, checkChannelStatus]);
  
  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    // 发送事件通知播放器组件切换频道
    window.dispatchEvent(new CustomEvent('channelChange', { detail: channel }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">电视频道</h2>
        
        <div className="text-sm text-gray-400">
          共 {filteredChannels.length} 个频道
        </div>
      </div>
      
      {/* 分类筛选 */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${categoryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
          onClick={() => setCategoryFilter('all')}
        >
          全部
        </button>
        {allCategories.slice(1).map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${categoryFilter === category ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
            onClick={() => setCategoryFilter(category)}
          >
            {(() => {
              const categoryMap = {
                'news': '新闻',
                'sports': '体育',
                'movies': '电影',
                'entertainment': '娱乐',
                'kids': '少儿',
                'music': '音乐',
                'other': '其他'
              };
              return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
            })()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChannels.map((channel) => (
          <div 
            key={channel.id}
            className={`bg-gray-800 rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:border-blue-500 ${selectedChannel?.id === channel.id ? 'border-blue-500' : 'border-gray-700'}`}
          >
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{channel.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{(() => {
                    const categoryMap = {
                      'news': '新闻',
                      'sports': '体育',
                      'movies': '电影',
                      'entertainment': '娱乐',
                      'kids': '少儿',
                      'music': '音乐',
                      'other': '其他'
                    };
                    return categoryMap[channel.category] || channel.category;
                  })()}</p>
                </div>
                
                {/* 频道状态指示器 */}
                <div className="flex items-center">
                  {checkingStatus[channel.id] === 'checking' ? (
                    <div className="text-yellow-500">
                      <LoaderCircle size={16} className="animate-spin" />
                    </div>
                  ) : checkingStatus[channel.id] === 'online' ? (
                    <div className="text-green-500">
                      <Wifi size={16} />
                    </div>
                  ) : checkingStatus[channel.id] === 'offline' ? (
                    <div className="text-red-500">
                      <WifiOff size={16} />
                    </div>
                  ) : (
                    <button 
                      className="text-gray-400 hover:text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        checkChannelStatus(channel);
                      }}
                    >
                      <Wifi size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <button 
                  className="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChannelSelect(channel);
                  }}
                >
                  <Play size={16} className="mr-1" />
                  播放
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelList;