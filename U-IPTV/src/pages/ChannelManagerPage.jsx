import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Check, X, Upload, FileText, Link as LinkIcon, Wifi, WifiOff, LoaderCircle, Play } from 'lucide-react';
import useChannelStatus from '../hooks/useChannelStatus';

const ChannelManagerPage = () => {
  const [channels, setChannels] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newChannel, setNewChannel] = useState({
    name: '',
    url: '',
    category: 'news'
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importMethod, setImportMethod] = useState('file'); // 'file' or 'url'
  const [importUrl, setImportUrl] = useState('');
  const [checkingAll, setCheckingAll] = useState(false); // 批量检查状态
  const [selectedChannels, setSelectedChannels] = useState([]); // 用于批量选择
  
  const { checkingStatus, checkChannelStatus, checkAllChannelsStatus } = useChannelStatus();
  const fileInputRef = useRef(null);

  // 从localStorage加载频道数据
  useEffect(() => {
    const savedChannels = localStorage.getItem('channels');
    if (savedChannels) {
      setChannels(JSON.parse(savedChannels));
    } else {
      // 默认频道数据
      const initialChannels = [
        { id: 1, name: '[BD]凤凰卫视', url: 'https://stream1.freetv.fun/e6886dbde2158fbb51da8cd6db21e2bb5fb68f4e5aa4db51e3589f30c20a13d8.m3u8', category: 'news' },
        { id: 2, name: '中央电视塔东', url: 'https://gcalic.v.myalicdn.com/gc/ztd_1/index.m3u8', category: 'news' },
        { id: 3, name: '中央电视塔南', url: 'https://gcalic.v.myalicdn.com/gc/ztn_1/index.m3u8', category: 'news' },
        { id: 4, name: 'Anime (1080p)', url: 'https://shls-live-enc.edgenextcdn.net/out/v1/e7350ddf46c94dddafe14b099394ff56/index.m3u8', category: 'news' },
        { id: 5, name: 'CGNTV Japan (1080p)', url: 'https://d2p4mrcwl6ly4.cloudfront.net/out/v1/8d50f69fdbbf411a8d302743e4263716/CGNWebLiveJP.m3u8', category: 'news' },
        { id: 6, name: 'QVC Japan (720p)', url: 'https://cdn-live1.qvc.jp/iPhone/1501/1501.m3u8', category: 'news' },
        { id: 7, name: 'ABN TV (720p)', url: 'https://vod2.abn.co.kr/IPHONE/abn.m3u8', category: 'news' },
        { id: 8, name: 'TV Chosun 2 (720p)', url: 'http://onair2.cdn.tvchosun.com/origin2/_definst_/tvchosun_s3/playlist.m3u8', category: 'news' }
      ];
      setChannels(initialChannels);
      localStorage.setItem('channels', JSON.stringify(initialChannels));
    }
  }, []);

  // 保存频道数据到localStorage
  useEffect(() => {
    if (channels.length > 0) {
      localStorage.setItem('channels', JSON.stringify(channels));
    }
  }, [channels]);
  
  // 当频道列表发生变化时，清理选中的频道列表，移除不存在的频道ID
  useEffect(() => {
    setSelectedChannels(prevSelected => 
      prevSelected.filter(id => 
        channels.some(channel => channel.id === id)
      )
    );
  }, [channels]);
  
  

  const handleAddChannel = () => {
    if (newChannel.name && newChannel.url) {
      const channel = {
        id: Date.now(),
        ...newChannel
      };
      const updatedChannels = [...channels, channel];
      setChannels(updatedChannels);
      setNewChannel({ name: '', url: '', category: 'news' });
      setIsAdding(false);
    }
  };

  const handleUpdateChannel = () => {
    if (newChannel.name && newChannel.url) {
      const updatedChannels = channels.map(channel => 
        channel.id === editingId ? { ...channel, ...newChannel } : channel
      );
      setChannels(updatedChannels);
      setNewChannel({ name: '', url: '', category: 'news' });
      setEditingId(null);
    }
  };

  const handleEdit = (channel) => {
    setEditingId(channel.id);
    setNewChannel({
      name: channel.name,
      url: channel.url,
      category: channel.category
    });
  };

  const handleDelete = (id) => {
    const updatedChannels = channels.filter(channel => channel.id !== id);
    setChannels(updatedChannels);
    // 同时从选中列表中移除该频道
    setSelectedChannels(prev => prev.filter(channelId => channelId !== id));
  };

  // 切换单个频道的选择状态
  const toggleChannelSelection = (id) => {
    setSelectedChannels(prev => {
      if (prev.includes(id)) {
        return prev.filter(channelId => channelId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // 切换所有频道的选择状态
  const toggleAllChannelsSelection = () => {
    if (selectedChannels.length === channels.length) {
      // 如果全部已选中，则清空选择
      setSelectedChannels([]);
    } else {
      // 否则选中全部频道
      setSelectedChannels(channels.map(channel => channel.id));
    }
  };

  // 批量删除选中的频道
  const handleBulkDelete = () => {
    if (selectedChannels.length === 0) {
      alert('请至少选择一个频道进行删除');
      return;
    }
    
    if (window.confirm(`确定要删除选中的 ${selectedChannels.length} 个频道吗？`)) {
      try {
        const updatedChannels = channels.filter(channel => !selectedChannels.includes(channel.id));
        setChannels(updatedChannels);
        setSelectedChannels([]); // 清空选择
      } catch (error) {
        console.error('批量删除时发生错误:', error);
        alert('删除操作失败，请重试');
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewChannel({ name: '', url: '', category: 'news' });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewChannel({ name: '', url: '', category: 'news' });
  };

  // 解析M3U内容并转换为频道列表
  const parseM3U = (content) => {
    const lines = content.split('\n');
    const parsedChannels = [];
    let currentChannel = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 跳过空行和注释
      if (!line || line.startsWith('#EXTM3U')) continue;
      
      // 处理EXTINF行
      if (line.startsWith('#EXTINF:')) {
        const match = line.match(/#EXTINF:(-?\d+)(?:\s+([^,]*))?[,\s]*(.*)?/);
        if (match) {
          currentChannel = {
            id: Date.now() + i,
            name: match[3] || `频道 ${parsedChannels.length + 1}`,
            category: 'other'
          };
          
          // 尝试从属性中提取分类
          const attrs = match[2] || '';
          if (attrs.includes('group-title')) {
            const groupMatch = attrs.match(/group-title="([^"]*)"/);
            if (groupMatch) {
              currentChannel.category = groupMatch[1].toLowerCase();
              // 标准化分类名称
              if (currentChannel.category.includes('news')) currentChannel.category = 'news';
              else if (currentChannel.category.includes('sport')) currentChannel.category = 'sports';
              else if (currentChannel.category.includes('movie')) currentChannel.category = 'movies';
              else if (currentChannel.category.includes('music')) currentChannel.category = 'music';
              else if (currentChannel.category.includes('kid') || currentChannel.category.includes('child')) currentChannel.category = 'kids';
              else if (currentChannel.category.includes('entertainment')) currentChannel.category = 'entertainment';
              else currentChannel.category = 'other';
            }
          }
        }
      }
      // 处理URL行
      else if (line.startsWith('http') && currentChannel) {
        currentChannel.url = line;
        parsedChannels.push(currentChannel);
        currentChannel = null;
      }
    }
    
    return parsedChannels;
  };

  // 处理文件导入
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedChannels = parseM3U(content);
        const updatedChannels = [...channels, ...parsedChannels];
        setChannels(updatedChannels);
        setIsImporting(false);
        setImportUrl('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (error) {
        console.error('解析M3U文件时出错:', error);
        alert('导入失败，请确保文件格式正确');
      }
    };
    reader.readAsText(file);
  };

  // 处理URL导入
  const handleUrlImport = async () => {
    if (!importUrl) {
      alert('请输入有效的URL');
      return;
    }
    
    try {
      // 尝试直接请求，如果失败则使用代理
      let content;
      
      try {
        // 首先尝试直接获取
        const response = await fetch(importUrl, { mode: 'cors' });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        content = await response.text();
      } catch (directError) {
        console.warn('直接请求失败，尝试使用代理:', directError.message);
        
        // 如果直接请求失败，尝试使用代理
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(importUrl)}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`代理请求失败: ${response.status}`);
        content = await response.text();
      }
      
      const parsedChannels = parseM3U(content);
      
      // 验证解析结果
      if (!parsedChannels || parsedChannels.length === 0) {
        alert('M3U文件中未找到有效的频道数据，请确认文件格式正确');
        return;
      }
      
      const updatedChannels = [...channels, ...parsedChannels];
      setChannels(updatedChannels);
      setIsImporting(false);
      setImportUrl('');
      
      // 成功导入后提示
      alert(`成功导入 ${parsedChannels.length} 个频道`);
      
    } catch (error) {
      console.error('从URL导入时出错:', error);
      alert(`导入失败: ${error.message || '请确保URL有效且可访问'}`);
    }
  };

  // 使用自定义Hook提供的函数
  const checkAllChannelsStatusWrapper = async () => {
    if (channels.length === 0) return;
    
    setCheckingAll(true);
    
    await checkAllChannelsStatus(channels);
    
    setCheckingAll(false);
  };
  
  // 导出频道为M3U格式
  const handleExportChannels = () => {
    if (channels.length === 0) {
      alert('没有频道可导出');
      return;
    }
    
    // 生成M3U格式内容
    let m3uContent = '#EXTM3U\n';
    
    channels.forEach(channel => {
      // 根据分类映射到组标题
      const categoryMap = {
        'news': '新闻',
        'sports': '体育',
        'movies': '电影',
        'entertainment': '娱乐',
        'kids': '少儿',
        'music': '音乐',
        'other': '其他'
      };
      
      const groupName = categoryMap[channel.category] || channel.category;
      
      m3uContent += `#EXTINF:-1 tvg-id="${channel.id}" group-title="${groupName}",${channel.name}\n`;
      m3uContent += `${channel.url}\n`;
    });
    
    // 创建Blob对象并下载文件
    const blob = new Blob([m3uContent], { type: 'application/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `channels_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.m3u`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">频道管理</h2>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            onClick={() => setIsAdding(true)}
          >
            <Plus size={20} className="mr-2" />
            添加频道
          </button>
          
          <button 
            className="flex items-center bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            onClick={() => setIsImporting(true)}
          >
            <Upload size={20} className="mr-2" />
            导入频道
          </button>
          
          <button 
            className="flex items-center bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors"
            onClick={handleExportChannels}
          >
            <Upload size={20} className="mr-2" />
            导出频道
          </button>
          
          <button 
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${checkingAll ? 'bg-yellow-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            onClick={checkAllChannelsStatusWrapper}
            disabled={checkingAll}
          >
            {checkingAll ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                检查中...
              </>
            ) : (
              <>
                <Wifi size={20} className="mr-2" />
                检查所有频道
              </>
            )}
          </button>
          
          {selectedChannels.length > 0 && (
            <button 
              className="flex items-center bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              onClick={handleBulkDelete}
            >
              <Trash2 size={20} className="mr-2" />
              删除选中的 {selectedChannels.length} 个频道
            </button>
          )}
        </div>
      </div>

      {/* 导入对话框 */}
      {isImporting && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Upload size={20} className="mr-2" />
            导入频道列表
          </h3>
          
          <div className="mb-4">
            <div className="flex border-b border-gray-700 mb-4">
              <button 
                className={`pb-2 px-4 ${importMethod === 'file' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
                onClick={() => setImportMethod('file')}
              >
                <FileText size={16} className="inline mr-2" />
                从文件导入
              </button>
              <button 
                className={`pb-2 px-4 ${importMethod === 'url' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-400'}`}
                onClick={() => setImportMethod('url')}
              >
                <LinkIcon size={16} className="inline mr-2" />
                从URL导入
              </button>
            </div>
            
            {importMethod === 'file' ? (
              <div>
                <label className="block text-sm font-medium mb-2">选择M3U文件</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".m3u,.m3u8"
                  onChange={handleFileImport}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-400 mt-2">支持.m3u和.m3u8格式的文件</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-2">输入M3U文件URL</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="https://example.com/playlist.m3u8"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                />
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg transition-colors"
                  onClick={handleUrlImport}
                >
                  导入
                </button>
                <p className="text-sm text-gray-400 mt-2">请输入可公开访问的M3U文件URL</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <button 
              className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => {
                setIsImporting(false);
                setImportUrl('');
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              <X size={18} className="inline mr-1" />
              取消
            </button>
          </div>
        </div>
      )}

      {/* 添加/编辑表单 */}
      {(isAdding || editingId !== null) && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId !== null ? '编辑频道' : '添加新频道'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">频道名称</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入频道名称"
                value={newChannel.name}
                onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">播放地址</label>
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入播放地址 (m3u8)"
                value={newChannel.url}
                onChange={(e) => setNewChannel({...newChannel, url: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">频道分类</label>
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newChannel.category}
                onChange={(e) => setNewChannel({...newChannel, category: e.target.value})}
              >
                <option value="news">新闻</option>
                <option value="sports">体育</option>
                <option value="movies">电影</option>
                <option value="entertainment">娱乐</option>
                <option value="kids">少儿</option>
                <option value="music">音乐</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                onClick={editingId !== null ? cancelEdit : cancelAdd}
              >
                <X size={18} className="inline mr-1" />
                取消
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center"
                onClick={editingId !== null ? handleUpdateChannel : handleAddChannel}
              >
                <Check size={18} className="inline mr-1" />
                {editingId !== null ? '更新' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 频道列表 */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-750 font-semibold border-b border-gray-700">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={channels.length > 0 && selectedChannels.length === channels.length}
              onChange={toggleAllChannelsSelection}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-3">频道名称</div>
          <div className="col-span-3">播放地址</div>
          <div className="col-span-2">分类</div>
          <div className="col-span-2">状态</div>
          <div className="col-span-1 text-right">操作</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {channels.map((channel, index) => (
            <div key={channel.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-750 transition-colors">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedChannels.includes(channel.id)}
                  onChange={() => toggleChannelSelection(channel.id)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-3 flex items-center font-medium">{channel.name}</div>
              <div className="col-span-3 flex items-center text-sm text-gray-400 truncate">{channel.url}</div>
              <div className="col-span-2 flex items-center">
                <span className="px-2 py-1 bg-gray-700 rounded text-xs capitalize">
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
                    return categoryMap[channel.category] || channel.category;
                  })()}
                </span>
              </div>
              <div className="col-span-2 flex items-center">
                {checkingStatus[channel.id] === 'checking' ? (
                  <span className="flex items-center text-yellow-500 text-sm">
                    <LoaderCircle size={14} className="mr-1 animate-spin" />
                    检查中
                  </span>
                ) : checkingStatus[channel.id] === 'online' ? (
                  <span className="flex items-center text-green-500 text-sm">
                    <Wifi size={14} className="mr-1" />
                    在线
                  </span>
                ) : checkingStatus[channel.id] === 'offline' ? (
                  <span className="flex items-center text-red-500 text-sm">
                    <WifiOff size={14} className="mr-1" />
                    离线
                  </span>
                ) : (
                  <button 
                    className="text-gray-400 hover:text-blue-500"
                    onClick={() => checkChannelStatus(channel)}
                  >
                    <Wifi size={14} />
                  </button>
                )}
              </div>
              <div className="col-span-1 flex justify-end items-center space-x-2">
                <button 
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  onClick={() => handleEdit(channel)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-red-500/20 transition-colors text-red-500"
                  onClick={() => handleDelete(channel.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          
          {channels.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无频道数据，请添加新频道
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelManagerPage;