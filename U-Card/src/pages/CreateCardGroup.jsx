import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCardGroups } from '../hooks/useCardGroups';
import { getCurrentUserId, ensureUserExists } from '../lib/supabase';
import { Plus, Lock, Users, ArrowLeft } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const CreateCardGroup = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const { createGroup, loading, error } = useCardGroups(userId);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  
  // 初始化用户
  React.useEffect(() => {
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      alert('请输入卡牌组名称');
      return;
    }
    
    try {
      await createGroup({
        name: groupName,
        description: groupDescription,
        is_public: isPublic,
        cover_image_url: coverImageUrl
      });
      
      // 创建成功后返回卡牌组列表页
      navigate('/groups');
    } catch (err) {
      console.error('Failed to create group:', err);
      alert('创建卡牌组失败，请重试');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/groups')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回卡牌组
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">创建新卡牌组</h1>
        
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">组名 *</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入卡牌组名称"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              value={groupDescription}
              onChange={(e) => setGroupDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="输入卡牌组描述"
            />
          </div>
          
          <div>
            <ImageUpload
              label="封面图片"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              placeholder="输入图片URL或上传图片"
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
              {loading ? '创建中...' : '创建卡牌组'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCardGroup;