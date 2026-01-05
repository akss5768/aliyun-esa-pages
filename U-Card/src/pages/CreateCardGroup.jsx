import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardGroupsLocalStorage } from '../hooks/useLocalStorage';
import { ArrowLeft, Lock, Users } from 'lucide-react';

const CreateCardGroup = () => {
  const navigate = useNavigate();
  const { createGroup } = useCardGroupsLocalStorage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('请输入组名');
      return;
    }
    
    try {
      setLoading(true);
      await createGroup({
        name: name.trim(),
        description: description.trim(),
        is_public: isPublic,
        cover_image_url: coverImageUrl
      });
      navigate('/groups');
    } catch (err) {
      console.error('Failed to create group:', err);
      alert('创建失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/groups')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          返回
        </button>
        <h1 className="text-3xl font-bold text-gray-900">创建新卡牌组</h1>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">组名 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入组名"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
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
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/groups')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建组'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCardGroup;