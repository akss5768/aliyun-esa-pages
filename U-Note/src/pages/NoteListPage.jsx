import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import { exportAsJson, exportAsText, exportAsMarkdown } from '../utils/exportUtils';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = localStorage.getItem('cute-notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const handleExport = () => {
    if (notes.length === 0) {
      alert('没有笔记可以导出！');
      return;
    }
    
    // 创建一个简单的选择对话框
    const choice = prompt(
      '请选择导出格式:\n1. json - JSON格式(保留所有数据)\n2. txt - 文本格式(纯文本)\n3. md - Markdown格式\n\n请输入数字(1/2/3):', 
      '1'
    );
    
    switch(choice) {
      case '1':
        exportAsJson(notes);
        break;
      case '2':
        exportAsText(notes);
        break;
      case '3':
        exportAsMarkdown(notes);
        break;
      default:
        alert('无效的选择，将默认导出为JSON格式');
        exportAsJson(notes);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7]">
      <Header title="我的笔记" showNewButton={true} onExport={handleExport} />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-500">还没有笔记，快来创建你的第一篇吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NoteListPage;