import React from 'react';
import { LayoutGrid, Heart, Star, Tag } from 'lucide-react';

const CardComponent = ({ card, onEdit, onDelete, onAddToGroup }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {/* Card Image */}
      <div className="relative pb-[140%]"> {/* 1.4:1 aspect ratio */}
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.name}
            className="absolute h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <LayoutGrid className="h-12 w-12 text-indigo-300" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Star className="h-3 w-3 mr-1" />
          {card.attributes?.rarity || 'N/A'}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg truncate">{card.name}</h3>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {card.type_name || '未知类型'}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 flex-grow">
          {card.description && card.description.length > 100 
            ? `${card.description.substring(0, 100)}...` 
            : card.description || '暂无描述'}
        </p>
        
        {/* Tags */}
        {card.tags && card.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.tags.slice(0, 3).map(tag => (
              <span 
                key={tag.id}
                className="text-xs px-2 py-1 rounded-full flex items-center"
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag.name}
              </span>
            ))}
            {card.tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                +{card.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-between mt-auto">
          <button 
            onClick={() => onEdit(card)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            编辑
          </button>
          <div className="flex space-x-2">
            <button 
              onClick={() => onAddToGroup(card)}
              className="text-gray-600 hover:text-gray-800"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button 
              onClick={() => onDelete(card.id)}
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

export default CardComponent;