import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCards } from '../hooks/useCards';
import { useCardGroups } from '../hooks/useCardGroups';
import { getCurrentUserId, ensureUserExists } from '../lib/supabase';
import CardComponent from '../components/Card';
import { Search, Filter, ArrowLeft, Image as ImageIcon } from 'lucide-react';

const GroupCards = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const { cards, loading: cardsLoading, error: cardsError } = useCards(userId);
  const { groups, loading: groupsLoading, error: groupsError } = useCardGroups(userId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [groupCards, setGroupCards] = useState([]);
  
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const id = await getCurrentUserId();
        await ensureUserExists(id);
        setUserId(id);
      } catch (err) {
        console.error('Failed to initialize user:', err);
      }
    };
    
    initializeUser();
  }, []);
  
  // Find the current group
  const currentGroup = groups.find(group => group.id === groupId);
  
  // Get cards that belong to this group
  useEffect(() => {
    if (cards.length > 0 && groupId) {
      const groupCardIds = cards
        .filter(card => card.group?.id === groupId)
        .map(card => card.id);
      
      const filteredCards = cards.filter(card => groupCardIds.includes(card.id));
      setGroupCards(filteredCards);
    }
  }, [cards, groupId]);
  
  const filteredCards = groupCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? card.type_id === filterType : true;
    return matchesSearch && matchesType;
  });
  
  if (cardsLoading || groupsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  if (cardsError || groupsError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-4xl mx-auto mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{cardsError || groupsError}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </button>
      </div>
      
      {/* Group Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{currentGroup?.name || '卡牌组'}</h1>
            <p className="mt-2 text-gray-600">{currentGroup?.description || '查看和管理此组中的卡牌'}</p>
          </div>
        </div>
        
        {/* Group Cover Image */}
        {currentGroup?.cover_image_url && (
          <div className="mb-6 rounded-lg overflow-hidden max-w-3xl mx-auto">
            <img 
              src={currentGroup.cover_image_url} 
              alt={currentGroup.name} 
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-indigo-600">{filteredCards.length}</div>
            <div className="text-gray-600">卡牌数量</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-indigo-600">{currentGroup?.is_public ? '公开' : '私有'}</div>
            <div className="text-gray-600">可见性</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-indigo-600">{new Date(currentGroup?.created_at).toLocaleDateString()}</div>
            <div className="text-gray-600">创建日期</div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索卡牌..."
            />
          </div>
          
          <div className="flex items-center">
            <div className="absolute pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">所有类型</option>
              <option value="character">角色卡</option>
              <option value="spell">法术卡</option>
              <option value="item">物品卡</option>
              <option value="location">地点卡</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Cards Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map(card => (
            <CardComponent
              key={card.id}
              card={card}
              onEdit={() => {}}
              onDelete={() => {}}
              onAddToGroup={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <ImageIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">此组中暂无卡牌</h3>
          <p className="mt-1 text-sm text-gray-500">添加一些卡牌到这个组中</p>
        </div>
      )}
    </div>
  );
};

export default GroupCards;