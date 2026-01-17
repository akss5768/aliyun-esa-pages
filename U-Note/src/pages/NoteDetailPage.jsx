import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { marked } from 'marked';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    const storedNotes = localStorage.getItem('cute-notes');
    if (storedNotes) {
      const notes = JSON.parse(storedNotes);
      const foundNote = notes.find(note => note.id === id);
      if (foundNote) {
        setNote(foundNote);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);
  
  const handleDelete = () => {
    const storedNotes = localStorage.getItem('cute-notes');
    if (storedNotes) {
      let notes = JSON.parse(storedNotes);
      notes = notes.filter(note => note.id !== id);
      localStorage.setItem('cute-notes', JSON.stringify(notes));
      navigate('/');
    }
    setShowDeleteDialog(false);
  };
  
  if (!note) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div>加载中...</div>
      </div>
    );
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('zh-CN', options);
  };
  
  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <Header title="笔记详情" />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{note.title}</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/note/${id}/edit`)}
              className="w-10 h-10 rounded-full bg-white border border-pink-200 text-pink-500 flex items-center justify-center hover:bg-pink-50 transition-colors duration-200 shadow-sm"
            >
              <PencilIcon size={18} />
            </button>
            <button 
              onClick={() => setShowDeleteDialog(true)}
              className="w-10 h-10 rounded-full bg-white border border-pink-200 text-red-400 flex items-center justify-center hover:bg-red-50 transition-colors duration-200 shadow-sm"
            >
              <Trash2Icon size={18} />
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mb-6">
          最后更新：{formatDate(note.updatedAt)}
        </div>
        
        <div 
          className="prose max-w-none p-4 bg-white rounded-lg shadow-sm border border-pink-50"
          dangerouslySetInnerHTML={{ __html: marked(note.content || '') }}
        />
      </main>
      
      {/* 删除确认对话框 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 max-w-md border border-pink-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">确认删除</h3>
            <p className="text-gray-600 mb-4">
              您确定要删除这篇笔记吗？此操作无法撤销。
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                取消
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailPage;