import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ItemDetail from './pages/ItemDetail';
import Notifications from './pages/Notifications';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </HashRouter>
  );
};

export default App;