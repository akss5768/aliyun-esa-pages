import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import ItemCard from '../components/ItemCard';
import { Button } from '../components/ui/Button';
import dbUtils from '../utils/dbUtils';

const Home = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // 从IndexedDB加载数据
  useEffect(() => {
    const loadItems = async () => {
      try {
        const savedItems = await dbUtils.getAllItems();
        setItems(savedItems);
      } catch (error) {
        console.error('加载物品失败:', error);
      }
    };
    
    loadItems();
  }, []);
  
  // 过滤物品
  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.category === filter);
  
  // 分类选项
  const categories = [
    { id: 'all', name: '全部' },
    { id: 'vegetable', name: '蔬菜' },
    { id: 'fruit', name: '水果' },
    { id: 'dairy', name: '乳制品' },
    { id: 'beverage', name: '饮料' },
    { id: 'meat', name: '肉类' },
    { id: 'other', name: '其他' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="我的冰箱" showAddButton showNotificationButton />
      
      {/* 分类标签 */}
      <div className="px-4 py-3 flex overflow-x-auto space-x-2 bg-white border-b border-gray-100">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setFilter(category.id)}
            className={`px-4 py-2 text-sm whitespace-nowrap rounded-full transition-colors ${filter === category.id 
              ? 'bg-pink-300 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {category.name}
          </button>
        ))}
      </div>
      
      {/* 物品列表 */}
      {filteredItems.length > 0 ? (
        <div className="p-4 grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center mb-4">
            <div className="bg-gray-400 rounded-full w-10 h-10"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">冰箱空空如也</h3>
          <p className="text-gray-500 mb-6">添加物品开始管理您的冰箱</p>
          <Button 
            onClick={() => window.location.hash = '#/upload'}
            className="bg-pink-300 hover:bg-pink-400 text-white px-6 py-2 rounded-full"
          >
            + 添加物品
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;