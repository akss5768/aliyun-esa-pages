import React, { useState, useEffect } from 'react';
import { useCardTypes } from '../hooks/useCardTypes';
import { useCardGroups } from '../hooks/useCardGroups';
import { getCurrentUserId } from '../lib/supabase';
import { Plus, Tag, X } from 'lucide-react';
import ImageUpload from './ImageUpload';

const CardForm = ({ card, onSave, onCancel }) => {
  const { cardTypes, loading: typesLoading } = useCardTypes();
  const [userId, setUserId] = useState(null);
  const { groups, loading: groupsLoading, createGroup } = useCardGroups(userId);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type_id: '',
    image_url: '',
    back_image_url: '',
    attributes: {},
    tags: [],
    group_id: ''
  });
  const [newTag, setNewTag] = useState('');
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

  useEffect(() => {
    if (card) {
      setFormData({
        name: card.name || '',
        description: card.description || '',
        type_id: card.type_id || '',
        image_url: card.image_url || '',
        back_image_url: card.back_image_url || '',
        attributes: card.attributes || {},
        tags: card.tags || [],
        group_id: card.group_id || ''
      });
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAttributeChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [key]: value
      }
    }));
  };

  const handleImageChange = (field, url) => {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.find(tag => tag.name === newTag.trim())) {
      const tag = {
        id: Date.now(),
        name: newTag.trim(),
        color: '#94a3b8'
      };
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== tagId)
    }));
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
      
      setFormData(prev => ({
        ...prev,
        group_id: newGroup.id
      }));
      
      setNewGroupName('');
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure a group is selected or create default group
    let groupId = formData.group_id;
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
    
    onSave({
      ...formData,
      group_id: groupId
    });
  };

  if (typesLoading || groupsLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {card ? '编辑卡牌' : '创建新卡牌'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Card Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">卡牌名称 *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="输入卡牌名称"
          />
        </div>
        
        {/* Card Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">卡牌类型 *</label>
          <select
            name="type_id"
            value={formData.type_id}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">选择类型</option>
            {cardTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        {/* Card Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">卡牌组 *</label>
          <div className="flex">
            <select
              name="group_id"
              value={formData.group_id}
              onChange={handleChange}
              required
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
        
        {/* Rarity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">稀有度</label>
          <select
            value={formData.attributes.rarity || ''}
            onChange={(e) => handleAttributeChange('rarity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">选择稀有度</option>
            <option value="普通">普通</option>
            <option value="稀有">稀有</option>
            <option value="史诗">史诗</option>
            <option value="传说">传说</option>
          </select>
        </div>
        
        {/* Front Image */}
        <div className="md:col-span-2">
          <ImageUpload
            label="正面图片"
            value={formData.image_url}
            onChange={(url) => handleImageChange('image_url', url)}
            placeholder="输入图片URL或上传图片"
          />
        </div>
        
        {/* Back Image */}
        <div className="md:col-span-2">
          <ImageUpload
            label="背面图片"
            value={formData.back_image_url}
            onChange={(url) => handleImageChange('back_image_url', url)}
            placeholder="输入图片URL或上传图片"
          />
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="输入卡牌描述"
          />
        </div>
        
        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <span 
                key={tag.id}
                className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag.name}
                <button 
                  type="button" 
                  onClick={() => removeTag(tag.id)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="添加标签"
            />
            <button 
              type="button" 
              onClick={addTag}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          保存卡牌
        </button>
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
    </form>
  );
};

export default CardForm;