import { useState, useCallback, useEffect } from 'react';

const useChannelStatus = (autoRefreshInterval = 1800000) => { // 默认为1800秒（30分钟）
  const [checkingStatus, setCheckingStatus] = useState({});

  const checkChannelStatus = useCallback(async (channel) => {
    // 设置检查状态为进行中
    setCheckingStatus(prev => ({ ...prev, [channel.id]: 'checking' }));
    
    // 验证URL格式
    if (!channel.url || typeof channel.url !== 'string' || !channel.url.trim()) {
      console.warn(`频道 ${channel.name} 的URL无效:`, channel.url);
      setCheckingStatus(prev => ({ ...prev, [channel.id]: 'offline' }));
      
      return false;
    }
    
    // 尝试构造一个有效的URL
    let validUrl;
    try {
      validUrl = new URL(channel.url);
    } catch (urlError) {
      console.warn(`频道 ${channel.name} 的URL格式无效:`, channel.url);
      setCheckingStatus(prev => ({ ...prev, [channel.id]: 'offline' }));
      
      return false;
    }
    
    try {
      // 发送HEAD请求检查URL是否可访问
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
      
      const response = await fetch(validUrl.href, { 
        method: 'HEAD', 
        signal: controller.signal,
        mode: 'cors'
      });
      
      clearTimeout(timeoutId);
      
      const isOnline = response.ok;
      setCheckingStatus(prev => ({ ...prev, [channel.id]: isOnline ? 'online' : 'offline' }));
      
      return isOnline;
    } catch (error) {
      console.error('检查频道状态时出错:', error);
      setCheckingStatus(prev => ({ ...prev, [channel.id]: 'offline' }));
      

      
      return false;
    }
  }, []);

  const checkAllChannelsStatus = useCallback(async (channels) => {
    if (!channels || channels.length === 0) return [];
    
    // 创建所有检查任务
    const checkPromises = channels.map(channel => checkChannelStatus(channel));
    
    // 等待所有检查完成
    const results = await Promise.all(checkPromises);
    
    return results;
  }, [checkChannelStatus]);

  
  return {
    checkingStatus,
    checkChannelStatus,
    checkAllChannelsStatus
  };
};

export default useChannelStatus;