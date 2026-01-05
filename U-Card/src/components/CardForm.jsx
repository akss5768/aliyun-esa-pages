import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Tag, Plus, Trash2 } from 'lucide-react';
import { useCardTypesLocalStorage } from '../hooks/useLocalStorage';
import ImageUpload from './ImageUpload';

const CardForm = ({ card, onSave, onCancel }) => {
  const { cardTypes } = useCardTypesLocalStorage();
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [backImageUrl, setBackImageUrl] = useState('');
  const [attributes, setAttributes] = useState({
    rarity: '',
    power: '',
    defense: '',
    cost: ''
  });
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [groupId, setGroupId] = useState('');
  
  // Load card data if editing
  useEffect(() => {
    if (card) {
      setName(card.name || '');
      setTypeId(card.type_id || '');
      setDescription(card.description || '');
      setImageUrl(card.image_url || '');
      setBackImageUrl(card.back_image_url || '');
      setAttributes(card.attributes || {
        rarity: '',
        power: '',
        defense: '',
        cost: ''
      });
      setTags(card.tags || []);
      setGroupId(card.group_id || '');
    } else {
      // Reset form for new card
      setName('');
      setTypeId(cardTypes[0]?.id || '');
      setDescription('');
      setImageUrl('');
      setBackImageUrl('');
      setAttributes({
        rarity: '',
        power: '',
        defense: '',
        cost: ''
      });
      setTags([]);
      setGroupId('');
    }
  }, [card, cardTypes]);
  
  const handleAttributeChange = (attr, value) => {
    setAttributes(prev => ({
      ...prev,
      [attr]: value
    }));
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.find(t => t.name === newTag.trim())) {
      const newTagObj = {
        id: Date.now().toString(),
        name: newTag.trim(),
        color: '#3b82f6' // Default blue color
      };
      setTags(prev => [...prev, newTagObj]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagId) => {
    setTags(prev => prev.filter(t => t.id !== tagId));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cardData = {
      name: name.trim(),
      type_id: typeId,
      type_name: cardTypes.find(t => t.id === typeId)?.name || '未知类型',
      description: description.trim(),
      image_url: imageUrl,
      back_image_url: backImageUrl,
      attributes,
      tags,
      group_id: groupId || null
    };
    
    onSave(cardData);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {card ? '编辑卡牌' : '创建新卡牌'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">卡牌名称 *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入卡牌名称"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">卡牌类型 *</label>
              <select
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                {cardTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入卡牌描述"
              />
            </div>
          </div>
        </div>
        
        {/* Images */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">卡牌图片</h3>
          <div className="space-y-4">
            <div>
              <ImageUpload
                label="正面图片"
                value={imageUrl}
                onChange={setImageUrl}
                placeholder="输入图片URL或上传图片"
              />
            </div>
            
            <div>
              <ImageUpload
                label="背面图片"
                value={backImageUrl}
                onChange={setBackImageUrl}
                placeholder="输入图片URL或上传图片"
              />
            </div>
          </div>
        </div>
        
        {/* Attributes */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">属性</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">稀有度</label>
              <input
                type="text"
                value={attributes.rarity}
                onChange={(e) => handleAttributeChange('rarity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="例如: 普通, 稀有, 史诗, 传说"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">力量</label>
              <input
                type="number"
                value={attributes.power}
                onChange={(e) => handleAttributeChange('power', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入数值"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">防御</label>
              <input
                type="number"
                value={attributes.defense}
                onChange={(e) => handleAttributeChange('defense', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入数值"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">消耗</label>
              <input
                type="number"
                value={attributes.cost}
                onChange={(e) => handleAttributeChange('cost', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="输入数值"
              />
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">标签</h3>
          <div className="space-y-3">
            <div className="flex">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="添加新标签"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag.id)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Submit */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {card ? '更新卡牌' : '创建卡牌'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardForm;