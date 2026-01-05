import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCard, setGeneratedCard] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const mockCard = {
        id: Date.now().toString(),
        name: prompt.split(' ')[0] || '神秘卡牌',
        type_id: '2', // 收藏卡牌
        type_name: '收藏卡牌',
        description: `这是一张基于"${prompt}"生成的卡牌。在遥远的幻想世界中，这种卡牌具有独特的力量和价值。`,
        image_url: `https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(prompt)}&width=400&height=600&random=${Date.now()}`,
        back_image_url: '',
        attributes: {
          rarity: ['普通', '稀有', '史诗', '传说'][Math.floor(Math.random() * 4)],
          power: Math.floor(Math.random() * 100),
          defense: Math.floor(Math.random() * 100),
          cost: Math.floor(Math.random() * 10)
        },
        tags: [
          { id: '1', name: '幻想', color: '#3b82f6' },
          { id: '2', name: '稀有', color: '#f59e0b' }
        ],
        group_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setGeneratedCard(mockCard);
      setLoading(false);
    }, 1500);
  };
  
  const handleSaveCard = () => {
    // In a real app, this would save to localStorage
    alert('卡牌已保存到您的收藏中！');
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI卡牌生成器</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          使用自然语言描述您想要的卡牌，AI将为您生成独特的卡牌设计
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述您想要的卡牌
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例如：一只火焰龙卡牌，红色背景，有翅膀和火焰效果..."
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {loading ? '生成中...' : '生成卡牌'}
            </button>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>提示：描述越详细，生成的卡牌越符合您的想象</p>
        </div>
      </div>
      
      {generatedCard && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">生成的卡牌</h2>
              <button
                onClick={handleSaveCard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                保存到收藏
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <div className="relative pb-[140%] bg-gray-100 rounded-lg overflow-hidden">
                  {generatedCard.image_url ? (
                    <img 
                      src={generatedCard.image_url} 
                      alt={generatedCard.name}
                      className="absolute h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{generatedCard.name}</h3>
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
                      {generatedCard.type_name}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">描述</h4>
                    <p className="text-gray-600">{generatedCard.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">属性</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">稀有度</p>
                        <p className="font-medium">{generatedCard.attributes.rarity}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">力量</p>
                        <p className="font-medium">{generatedCard.attributes.power}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">防御</p>
                        <p className="font-medium">{generatedCard.attributes.defense}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">消耗</p>
                        <p className="font-medium">{generatedCard.attributes.cost}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">标签</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedCard.tags.map(tag => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!generatedCard && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 text-gray-400 flex items-center justify-center">
            <Sparkles className="h-12 w-12" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">开始生成您的专属卡牌</h3>
          <p className="mt-2 text-gray-500">在上方输入框中描述您想要的卡牌，点击生成按钮</p>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;