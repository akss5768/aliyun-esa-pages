import React, { useState } from 'react';
import { useCardsLocalStorage } from '../hooks/useLocalStorage';
import { useCardTypesLocalStorage } from '../hooks/useLocalStorage';
import CardComponent from '../components/Card';
import CardForm from '../components/CardForm';
import { Plus, Search, Filter, Upload, Download } from 'lucide-react';

const Cards = () => {
  const { cards, createCard, updateCard, deleteCard, exportCards, importCards } = useCardsLocalStorage();
  const { cardTypes } = useCardTypesLocalStorage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const handleCreateCard = async (cardData) => {
    try {
      await createCard(cardData);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to create card:', err);
    }
  };
  
  const handleUpdateCard = async (cardData) => {
    try {
      await updateCard(editingCard.id, cardData);
      setEditingCard(null);
    } catch (err) {
      console.error('Failed to update card:', err);
    }
  };
  
  const handleDeleteCard = async (cardId) => {
    if (window.confirm('确定要删除这张卡牌吗？')) {
      try {
        await deleteCard(cardId);
      } catch (err) {
        console.error('Failed to delete card:', err);
      }
    }
  };
  
  const handleExportCards = () => {
    exportCards();
  };
  
  const handleImportCards = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        importCards(importedData);
        alert('卡牌导入成功！');
      } catch (err) {
        console.error('Failed to import cards:', err);
        alert('导入失败：' + err.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };
  
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? card.type_id === filterType : true;
    return matchesSearch && matchesType;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的卡牌库</h1>
          <p className="mt-2 text-gray-600">管理您的所有卡牌收藏</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => document.getElementById('import-cards').click()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-1" />
            导入
          </button>
          <input
            id="import-cards"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportCards}
          />
          <button
            onClick={handleExportCards}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-1" />
            导出
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建新卡牌
          </button>
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
              {cardTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
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
              onEdit={(card) => setEditingCard(card)}
              onDelete={handleDeleteCard}
              onAddToGroup={() => {}}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无卡牌</h3>
          <p className="mt-1 text-sm text-gray-500">开始创建您的第一张卡牌吧</p>
          <div className="mt-6">
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建新卡牌
            </button>
          </div>
        </div>
      )}
      
      {/* Card Form Modal */}
      {(isFormOpen || editingCard) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardForm
              card={editingCard}
              onSave={editingCard ? handleUpdateCard : handleCreateCard}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingCard(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;