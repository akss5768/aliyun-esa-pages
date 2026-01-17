import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { marked } from 'marked';

const NoteEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  
  useEffect(() => {
    if (id) {
      const storedNotes = localStorage.getItem('cute-notes');
      if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        const note = notes.find(note => note.id === id);
        if (note) {
          setTitle(note.title);
          setContent(note.content);
        }
      }
    }
  }, [id]);
  
  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      navigate('/');
      return;
    }
    
    const newNote = {
      id: id || Date.now().toString(),
      title: title || '未命名笔记',
      content,
      updatedAt: new Date().toISOString()
    };
    
    const storedNotes = localStorage.getItem('cute-notes');
    let notes = storedNotes ? JSON.parse(storedNotes) : [];
    
    if (id) {
      // 更新现有笔记
      notes = notes.map(note => note.id === id ? newNote : note);
    } else {
      // 添加新笔记
      notes.unshift(newNote);
    }
    
    localStorage.setItem('cute-notes', JSON.stringify(notes));
    navigate('/');
  };
  
  const handleCancel = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <Header title={id ? "编辑笔记" : "新建笔记"} />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入标题..."
            className="w-full rounded-lg border border-pink-200 focus:ring-2 focus:ring-pink-300 focus:border-transparent p-3 text-lg font-semibold bg-white"
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            {isPreview ? '预览模式' : '编辑模式'}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">编辑</span>
            <button 
              onClick={() => setIsPreview(false)}
              className={`w-10 h-5 rounded-full relative ${!isPreview ? 'bg-pink-400' : 'bg-pink-200'}`}
            >
              <span className={`block w-4 h-4 bg-white rounded-full transition-transform duration-200 absolute top-0.5 ${!isPreview ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-sm text-gray-600">预览</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          {isPreview ? (
            <div className="flex-1 bg-white rounded-lg shadow-sm p-4 min-h-96 border border-pink-100">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(content || '') }}
              />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入内容（支持Markdown语法）..."
              className="flex-1 h-96 p-4 border border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent resize-none bg-white"
            />
          )}
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-[#FFB7C5] text-white hover:bg-pink-400 transition-colors duration-200 shadow-sm"
          >
            保存
          </button>
        </div>
      </main>
    </div>
  );
};

export default NoteEditPage;