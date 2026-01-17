import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import NoteListPage from './pages/NoteListPage';
import NoteEditPage from './pages/NoteEditPage';
import NoteDetailPage from './pages/NoteDetailPage';

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#FFF5F7]">
        <Routes>
          <Route path="/" element={<NoteListPage />} />
          <Route path="/note/new" element={<NoteEditPage />} />
          <Route path="/note/:id" element={<NoteDetailPage />} />
          <Route path="/note/:id/edit" element={<NoteEditPage />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;