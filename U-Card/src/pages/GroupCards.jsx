import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCardsLocalStorage } from '../hooks/useLocalStorage';
import { useCardGroupsLocalStorage } from '../hooks/useLocalStorage';
import CardComponent from '../components/Card';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupCards = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { cards } = useCardsLocalStorage();
  const { groups } = useCardGroupsLocalStorage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  // Find the current group
  const currentGroup = groups.find(group => group.id === groupId);
  
  // Filter cards belonging to this group
  const groupCards = cards.filter(card => card.group_id === groupId);
  
  // Filter cards based on search and type filter
  const filteredCards = groupCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? card.type_id === filterType : true;
    return matchesSearch && matchesType;
  });
  
  if (!currentGroup) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">未找到指定的卡牌组</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          返回
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{currentGroup.name}</h1>
      </div>
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600 mb-4">{currentGroup.description || '暂无描述'}</p>
        
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
        </div>
      </div>
      
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
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">此组中暂无卡牌</h3>
          <p className="mt-1 text-sm text-gray-500">添加一些卡牌到这个组中</p>
        </div>
      )}
    </div>
  );
};

export default GroupCards;