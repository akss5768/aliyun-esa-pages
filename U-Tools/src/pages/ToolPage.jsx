import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Copy, Share2 } from 'lucide-react';
import JSONTool from '../components/tools/JSONTool';
import TimestampTool from '../components/tools/TimestampTool';
import CrontabTool from '../components/tools/CrontabTool';
import RegexTool from '../components/tools/RegexTool';
import UUIDTool from '../components/tools/UUIDTool';
import JWTTool from '../components/tools/JWTTool';
import DiffTool from '../components/tools/DiffTool';

const ToolPage = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  
  const tools = {
    json: { 
      name: 'JSON校验与格式化', 
      component: JSONTool,
      description: '校验JSON语法并格式化显示'
    },
    timestamp: { 
      name: '时间戳转换', 
      component: TimestampTool,
      description: 'Unix时间戳与日期相互转换'
    },
    crontab: { 
      name: 'Crontab计算', 
      component: CrontabTool,
      description: '计算定时任务执行时间'
    },
    regex: { 
      name: '正则表达式测试', 
      component: RegexTool,
      description: '测试正则表达式的匹配结果'
    },
    uuid: { 
      name: 'UUID生成', 
      component: UUIDTool,
      description: '生成随机UUID字符串'
    },
    jwt: { 
      name: 'JWT解析', 
      component: JWTTool,
      description: '解析JWT Token内容'
    },
    diff: { 
      name: '文本对比', 
      component: DiffTool,
      description: '对比两段文本的差异'
    }
  };
  
  const currentTool = tools[toolId];
  
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);
  
  const toggleFavorite = () => {
    let newFavorites;
    if (favorites.includes(toolId)) {
      newFavorites = favorites.filter(id => id !== toolId);
    } else {
      newFavorites = [...favorites, toolId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };
  
  if (!currentTool) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">工具未找到</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          抱歉，您访问的工具不存在
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Link>
      </div>
    );
  }
  
  const ToolComponent = currentTool.component;
  
  return (
    <div>
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          返回U-Tools
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{currentTool.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {currentTool.description}
            </p>
          </div>
          
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button 
              onClick={toggleFavorite}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label={favorites.includes(toolId) ? '取消收藏' : '添加收藏'}
            >
              <Heart 
                className={`w-5 h-5 ${favorites.includes(toolId) ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </button>
            <button 
              onClick={() => {
                // 从localStorage获取当前工具的输出并复制
                const toolData = localStorage.getItem(`tool-${toolId}-restore`);
                if (toolData) {
                  const data = JSON.parse(toolData);
                  if (data.output) {
                    navigator.clipboard.writeText(data.output);
                    // 可以添加提示用户已复制的逻辑
                  }
                }
              }}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="复制结果"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                // 实现分享功能
                if (navigator.share) {
                  navigator.share({
                    title: currentTool.name,
                    text: currentTool.description,
                    url: window.location.href
                  });
                } else {
                  // 备用分享功能 - 复制链接
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label="分享工具"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <ToolComponent />
      </div>
    </div>
  );
};

export default ToolPage;