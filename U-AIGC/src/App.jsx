import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import BookmarksPage from './pages/BookmarksPage';

const App = () => {
  const [sites, setSites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  
  useEffect(() => {
    // 从localStorage加载数据
    const storedData = localStorage.getItem('aigcSites');
    if (storedData) {
      setSites(JSON.parse(storedData));
    } else {
      // 初始化默认数据
      const defaultData = [
        {
          id: 1,
          name: 'Midjourney',
          description: '强大的AI图像生成工具',
          url: 'https://www.midjourney.com',
          tags: ['图像生成', '艺术创作'],
          classify: ['ai-art']
        },
        {
          id: 2,
          name: 'DALL-E',
          description: 'OpenAI的图像生成模型',
          url: 'https://openai.com/dall-e',
          tags: ['图像生成', '创意设计'],
          classify: ['ai-art']
        },
        {
          id: 3,
          name: 'ChatGPT',
          description: '多用途AI对话和写作工具',
          url: 'https://chat.openai.com',
          tags: ['文本生成', '对话AI'],
          classify: ['ai-writing']
        },
        {
          id: 4,
          name: 'Copy.ai',
          description: '营销文案生成工具',
          url: 'https://www.copy.ai',
          tags: ['文案写作', '营销'],
          classify: ['ai-writing']
        },
        {
          id: 5,
          name: 'RunwayML',
          description: 'AI视频编辑和生成工具',
          url: 'https://runwayml.com',
          tags: ['视频编辑', '特效生成'],
          classify: ['ai-video']
        },
        {
          id: 6,
          name: 'Pika',
          description: 'AI视频创作平台',
          url: 'https://pika.art',
          tags: ['视频生成', '创意'],
          classify: ['ai-video']
        },
        {
          id: 7,
          name: 'Canva AI',
          description: '集成AI功能的在线设计平台',
          url: 'https://www.canva.com',
          tags: ['图像生成', '设计工具'],
          classify: ['ai-art', 'ai-writing']
        },
        {
          id: 8,
          name: 'Descript',
          description: 'AI驱动的视频和音频编辑工具',
          url: 'https://www.descript.com',
          tags: ['视频编辑', '音频处理'],
          classify: ['ai-video', 'ai-writing']
        },
        // 以下为新增的20条测试数据
        {
          id: 9,
          name: 'Stable Diffusion',
          description: '开源的AI图像生成模型',
          url: 'https://stability.ai',
          tags: ['图像生成', '开源'],
          classify: ['ai-art']
        },
        {
          id: 10,
          name: 'Leonardo AI',
          description: '专业的AI艺术创作平台',
          url: 'https://leonardo.ai',
          tags: ['图像生成', '艺术'],
          classify: ['ai-art']
        },
        {
          id: 11,
          name: 'Jasper',
          description: 'AI内容创作和营销文案工具',
          url: 'https://jasper.ai',
          tags: ['文案写作', '营销'],
          classify: ['ai-writing']
        },
        {
          id: 12,
          name: 'Writesonic',
          description: 'AI写作助手和内容生成器',
          url: 'https://writesonic.com',
          tags: ['文本生成', 'SEO'],
          classify: ['ai-writing']
        },
        {
          id: 13,
          name: 'Synthesia',
          description: 'AI视频生成和虚拟主播平台',
          url: 'https://www.synthesia.io',
          tags: ['视频生成', '虚拟主播'],
          classify: ['ai-video']
        },
        {
          id: 14,
          name: 'Pictory',
          description: '将文本转换为视频的AI工具',
          url: 'https://pictory.ai',
          tags: ['视频生成', '文本转视频'],
          classify: ['ai-video']
        },
        {
          id: 15,
          name: 'Lumen5',
          description: 'AI驱动的视频制作平台',
          url: 'https://www.lumen5.com',
          tags: ['视频编辑', '社交媒体'],
          classify: ['ai-video']
        },
        {
          id: 16,
          name: 'HeyGen',
          description: 'AI视频生成和虚拟形象平台',
          url: 'https://www.heygen.com',
          tags: ['视频生成', '虚拟形象'],
          classify: ['ai-video']
        },
        {
          id: 17,
          name: 'Artflow',
          description: 'AI角色设计和动画制作工具',
          url: 'https://artflow.ai',
          tags: ['角色设计', '动画'],
          classify: ['ai-art']
        },
        {
          id: 18,
          name: 'Craiyon',
          description: '免费的AI图像生成器',
          url: 'https://www.craiyon.com',
          tags: ['图像生成', '免费'],
          classify: ['ai-art']
        },
        {
          id: 19,
          name: 'Bard',
          description: 'Google的对话式AI助手',
          url: 'https://bard.google.com',
          tags: ['对话AI', '搜索引擎'],
          classify: ['ai-writing']
        },
        {
          id: 20,
          name: 'Claude',
          description: 'Anthropic的安全AI助手',
          url: 'https://claude.ai',
          tags: ['对话AI', '安全'],
          classify: ['ai-writing']
        },
        {
          id: 21,
          name: 'ElevenLabs',
          description: 'AI语音合成和文本转语音',
          url: 'https://elevenlabs.io',
          tags: ['语音合成', '音频'],
          classify: ['ai-writing']
        },
        {
          id: 22,
          name: 'Murf.ai',
          description: 'AI语音生成和音频编辑工具',
          url: 'https://www.murf.ai',
          tags: ['语音生成', '音频编辑'],
          classify: ['ai-writing']
        },
        {
          id: 23,
          name: 'Kuaishou AI',
          description: '快手AI创作工具集',
          url: 'https://ai.kuaishou.com',
          tags: ['视频生成', '社交媒体'],
          classify: ['ai-video']
        },
        {
          id: 24,
          name: 'CapCut AI',
          description: '集成AI功能的视频编辑工具',
          url: 'https://www.capcut.com',
          tags: ['视频编辑', '移动端'],
          classify: ['ai-video']
        },
        {
          id: 25,
          name: 'Remove.bg',
          description: 'AI背景移除工具',
          url: 'https://www.remove.bg',
          tags: ['图像编辑', '背景移除'],
          classify: ['ai-art']
        },
        {
          id: 26,
          name: 'DeepAI',
          description: '多种AI工具集合平台',
          url: 'https://deepai.org',
          tags: ['工具集合', '多功能'],
          classify: ['ai-art', 'ai-writing', 'ai-video']
        },
        {
          id: 27,
          name: 'Hugging Face',
          description: '机器学习模型和AI工具平台',
          url: 'https://huggingface.co',
          tags: ['模型库', '开源'],
          classify: ['ai-art', 'ai-writing', 'ai-video']
        },
        {
          id: 28,
          name: 'Replicate',
          description: 'AI模型运行和部署平台',
          url: 'https://replicate.com',
          tags: ['模型部署', '云计算'],
          classify: ['ai-art', 'ai-writing', 'ai-video']
        }
      ];
      
      localStorage.setItem('aigcSites', JSON.stringify(defaultData));
      setSites(defaultData);
    }
    
    // 从localStorage加载书签数据
    const storedBookmarks = localStorage.getItem('aigcBookmarks');
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    } else {
      localStorage.setItem('aigcBookmarks', JSON.stringify([]));
    }
  }, []);
  
  // 保存书签到localStorage
  useEffect(() => {
    localStorage.setItem('aigcBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);
  
  // 切换书签状态
  const toggleBookmark = (site) => {
    setBookmarks(prev => {
      const isBookmarked = prev.some(bookmark => bookmark.id === site.id);
      if (isBookmarked) {
        return prev.filter(bookmark => bookmark.id !== site.id);
      } else {
        return [...prev, site];
      }
    });
  };
  
  // 检查是否已收藏
  const isBookmarked = (siteId) => {
    return bookmarks.some(bookmark => bookmark.id === siteId);
  };
  
  // 获取分类数据
  const getCategories = () => {
    return [
      { id: 'ai-art', name: 'AI绘画工具', description: '基于AI的图像生成和编辑工具' },
      { id: 'ai-writing', name: 'AI写作助手', description: '智能文本生成和编辑工具' },
      { id: 'ai-video', name: 'AI视频生成', description: '智能视频创作和编辑平台' }
    ];
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        {/* 背景粒子动效 */}
        <div className="absolute inset-0 z-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/20"
              style={{
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<HomePage sites={sites} categories={getCategories()} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isBookmarked={isBookmarked} />} />
            <Route path="/category/:categoryId" element={<CategoryPage sites={sites} categories={getCategories()} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isBookmarked={isBookmarked} />} />
            <Route path="/search" element={<SearchPage sites={sites} categories={getCategories()} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isBookmarked={isBookmarked} />} />
            <Route path="/bookmarks" element={<BookmarksPage bookmarks={bookmarks} toggleBookmark={toggleBookmark} sites={sites} categories={getCategories()} />} />
          </Routes>
        </div>
        
        <footer className="relative z-10 py-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AI创作者导航 - 为创意而生</p>
        </footer>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
            50% { transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px); }
            75% { transform: translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px); }
          }
        `}</style>
      </div>
    </HashRouter>
  );
};

export default App;