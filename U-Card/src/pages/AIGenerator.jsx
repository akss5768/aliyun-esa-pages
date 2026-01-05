import React, { useState, useEffect } from 'react';
import { Sparkles, Image as ImageIcon, Download, Copy } from 'lucide-react';
import { useCardGroups } from '../hooks/useCardGroups';
import { getCurrentUserId } from '../lib/supabase';

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCard, setGeneratedCard] = useState(null);
  const [copied, setCopied] = useState(false);
  const [userId, setUserId] = useState(null);
  const { groups, loading: groupsLoading, createGroup } = useCardGroups(userId);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const id = await getCurrentUserId();
        setUserId(id);
      } catch (err) {
        console.error('Failed to get user ID:', err);
      }
    };
    
    initializeUser();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock generated card data
    const mockCard = {
      name: prompt.includes('龙') ? '火焰龙' : prompt.includes('法师') ? '大法师' : '神秘生物',
      type: prompt.includes('龙') ? '生物卡' : prompt.includes('法师') ? '角色卡' : '道具卡',
      description: `这是一张根据您的描述生成的${prompt.includes('龙') ? '强大的龙族生物' : prompt.includes('法师') ? '智慧的法师职业' : '神秘的道具'}卡牌。`,
      rarity: prompt.includes('传说') ? '传说' : prompt.includes('稀有') ? '稀有' : '普通',
      attributes: {
        attack: prompt.includes('战士') || prompt.includes('龙') ? Math.floor(Math.random() * 10) + 5 : null,
        defense: prompt.includes('战士') || prompt.includes('龙') ? Math.floor(Math.random() * 10) + 3 : null,
        mana: prompt.includes('法师') ? Math.floor(Math.random() * 8) + 2 : null,
      },
      imageUrl: `https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(prompt)}&width=400&height=600&random=${Date.now()}`,
      tags: prompt.includes('火') ? ['火焰', '攻击'] : prompt.includes('水') ? ['水流', '治疗'] : ['神秘', '通用']
    };
    
    setGeneratedCard(mockCard);
    setIsGenerating(false);
  };

  const createDefaultGroup = async () => {
    try {
      const defaultGroup = await createGroup({
        name: '默认卡牌组',
        description: '系统自动创建的默认卡牌组'
      });
      return defaultGroup.id;
    } catch (err) {
      console.error('Failed to create default group:', err);
      return null;
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    
    try {
      const newGroup = await createGroup({
        name: newGroupName,
        description: ''
      });
      
      setSelectedGroupId(newGroup.id);
      setNewGroupName('');
      document.getElementById('create-group-modal').classList.add('hidden');
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleCopyToLibrary = async () => {
    // Ensure a group is selected or create default group
    let groupId = selectedGroupId;
    if (!groupId) {
      if (groups.length > 0) {
        groupId = groups[0].id;
      } else {
        groupId = await createDefaultGroup();
      }
      
      if (!groupId) {
        alert('无法创建或选择卡牌组，请稍后重试');
        return;
      }
    }
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // In a real app, this would add the card to the user's library with the selected group
    console.log(`Card added to group: ${groupId}`);
  };
  
  const handleDownload = () => {
    // In a real app, this would download the card image
    alert('卡牌图片已下载!');
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-yellow-500 mr-2" />
          AI卡牌生成器
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
          通过自然语言描述，让AI为您创建独特的卡牌
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                描述您想要的卡牌
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="例如：一张红色的龙族生物卡，具有火焰攻击能力，稀有度为传说..."
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium flex items-center justify-center ${isGenerating || !prompt.trim() ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'}`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    生成卡牌
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>提示：描述越详细，生成的卡牌越符合您的想象。可以包括卡牌类型、颜色、能力、稀有度等信息。</p>
          </div>
        </div>
        
        {generatedCard && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">生成结果</h2>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Card Preview */}
                <div className="flex-shrink-0 mx-auto lg:mx-0">
                  <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md overflow-hidden" style={{ width: '280px', height: '400px' }}>
                    {generatedCard.imageUrl ? (
                      <img 
                        src={generatedCard.imageUrl} 
                        alt={generatedCard.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-indigo-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                      {generatedCard.rarity}
                    </div>
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="flex-grow">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{generatedCard.name}</h3>
                    <div className="mt-1 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {generatedCard.type}
                      </span>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {generatedCard.rarity}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">描述</h4>
                    <p className="text-gray-600">{generatedCard.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">属性</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {generatedCard.attributes.attack !== null && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">攻击力</span>
                          <span className="font-medium">{generatedCard.attributes.attack}</span>
                        </div>
                      )}
                      {generatedCard.attributes.defense !== null && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">防御力</span>
                          <span className="font-medium">{generatedCard.attributes.defense}</span>
                        </div>
                      )}
                      {generatedCard.attributes.mana !== null && (
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 w-20">法力值</span>
                          <span className="font-medium">{generatedCard.attributes.mana}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">标签</h4>
                    <div className="flex flex-wrap gap-2">
                      {generatedCard.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Group Selection */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">添加到卡牌组 *</h4>
                    <div className="flex">
                      <select
                        value={selectedGroupId}
                        onChange={(e) => setSelectedGroupId(e.target.value)}
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">选择卡牌组</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>{group.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => document.getElementById('create-group-modal').classList.remove('hidden')}
                        className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        新建
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleCopyToLibrary}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      添加到我的卡牌库
                    </button>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载图片
                    </button>
                    <button
                      onClick={() => setGeneratedCard(null)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      重新生成
                    </button>
                  </div>
                  
                  {copied && (
                    <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
                      卡牌已添加到您的卡牌库！
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {!generatedCard && !isGenerating && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100">
              <Sparkles className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">开始创建您的专属卡牌</h3>
            <p className="mt-2 text-gray-600">
              在上方输入框中描述您想要的卡牌，AI将为您生成独特的设计
            </p>
          </div>
        )}
      </div>
      
      {/* Create Group Modal */}
      <div id="create-group-modal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">创建新卡牌组</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">组名 *</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入组名"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => document.getElementById('create-group-modal').classList.add('hidden')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              取消
            </button>
            <button
              onClick={handleCreateGroup}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              创建
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;