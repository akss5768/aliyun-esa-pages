import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardGroupsLocalStorage } from '../hooks/useLocalStorage';
import { useCardTypesLocalStorage } from '../hooks/useLocalStorage';
import CardGroup from '../components/CardGroup';
import { Plus, Lock, Users, Image as ImageIcon, Search, Filter, Upload, Download } from 'lucide-react';

const CardGroups = () => {
  const navigate = useNavigate();
  const { groups, createGroup, updateGroup, deleteGroup, exportGroups, importGroups } = useCardGroupsLocalStorage();
  const [isCreating, setIsCreating] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisibility, setFilterVisibility] = useState('');
  
  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    
    try {
      await createGroup({
        name: groupName,
        description: groupDescription,
        is_public: isPublic,
        cover_image_url: coverImageUrl
      });
      resetForm();
    } catch (err) {
      console.error('Failed to create group:', err);
    }
  };
  
  const handleUpdateGroup = async () => {
    if (!groupName.trim()) return;
    
    try {
      await updateGroup(editingGroup.id, {
        name: groupName,
        description: groupDescription,
        is_public: isPublic,
        cover_image_url: coverImageUrl
      });
      resetForm();
    } catch (err) {
      console.error('Failed to update group:', err);
    }
  };
  
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('确定要删除这个卡牌组吗？此操作不可恢复。')) {
      try {
        await deleteGroup(groupId);
      } catch (err) {
        console.error('Failed to delete group:', err);
      }
    }
  };
  
  const handleExportGroups = () => {
    exportGroups();
  };
  
  const handleImportGroups = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        importGroups(importedData);
        alert('卡牌组导入成功！');
      } catch (err) {
        console.error('Failed to import groups:', err);
        alert('导入失败：' + err.message);
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };
  
  const resetForm = () => {
    setIsCreating(false);
    setEditingGroup(null);
    setGroupName('');
    setGroupDescription('');
    setIsPublic(false);
    setCoverImageUrl('');
  };
  
  const openEditForm = (group) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setGroupDescription(group.description || '');
    setIsPublic(group.is_public);
    setCoverImageUrl(group.cover_image_url || '');
  };
  
  const handleViewGroup = (group) => {
    navigate(`/groups/${group.id}/cards`);
  };
  
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = filterVisibility ? 
      (filterVisibility === 'public' ? group.is_public : !group.is_public) : 
      true;
    return matchesSearch && matchesVisibility;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">我的卡牌组</h1>
          <p className="mt-2 text-gray-600">管理和组织您的卡牌集合</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => document.getElementById('import-groups').click()}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Upload className="h-4 w-4 mr-1" />
            导入
          </button>
          <input
            id="import-groups"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportGroups}
          />
          <button
            onClick={handleExportGroups}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="h-4 w-4 mr-1" />
            导出
          </button>
          <button
            onClick={() => navigate('/groups/create')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            创建新组
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
              placeholder="搜索卡牌组..."
            />
          </div>
          
          <div className="flex items-center">
            <div className="absolute pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterVisibility}
              onChange={(e) => setFilterVisibility(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">所有可见性</option>
              <option value="public">公开组</option>
              <option value="private">私有组</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Groups Grid */}
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map(group => (
            <CardGroup
              key={group.id}
              group={group}
              onEdit={openEditForm}
              onDelete={handleDeleteGroup}
              onView={handleViewGroup}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <ImageIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无匹配的卡牌组</h3>
          <p className="mt-1 text-sm text-gray-500">尝试调整搜索条件或创建新的卡牌组</p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/groups/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              创建新组
            </button>
          </div>
        </div>
      )}
      
      {/* Edit Group Modal */}
      {editingGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">编辑卡牌组</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">组名 *</label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="输入组名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="输入描述"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">封面图片URL</label>
                <input
                  type="text"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="输入图片URL"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 flex items-center text-sm text-gray-700">
                  {isPublic ? (
                    <Users className="h-4 w-4 mr-1 text-green-500" />
                  ) : (
                    <Lock className="h-4 w-4 mr-1 text-gray-500" />
                  )}
                  {isPublic ? '公开组' : '私有组'}
                </label>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
              <button
                onClick={handleUpdateGroup}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                更新
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardGroups;