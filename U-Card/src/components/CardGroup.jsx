import React from 'react';
import { Heart, Lock, Users, Plus } from 'lucide-react';

const CardGroup = ({ group, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg truncate flex-grow mr-2">{group.name}</h3>
          <div className="flex space-x-2">
            {group.is_public ? (
              <Users className="h-4 w-4 text-green-500" />
            ) : (
              <Lock className="h-4 w-4 text-gray-500" />
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">
          {group.description && group.description.length > 100 
            ? `${group.description.substring(0, 100)}...` 
            : group.description || '暂无描述'}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {group.cards?.length || 0} 张卡牌
          </span>
          <div className="flex -space-x-2">
            {group.cards?.slice(0, 4).map((card, index) => (
              card.image_url ? (
                <img 
                  key={index}
                  src={card.image_url}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ) : (
                <div 
                  key={index}
                  className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                >
                  <span className="text-xs text-gray-500">?</span>
                </div>
              )
            ))}
            {group.cards?.length > 4 && (
              <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500">+{group.cards.length - 4}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={() => onView(group)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            查看
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit(group)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onDelete(group.id)}
              className="text-red-600 hover:text-red-800"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardGroup;