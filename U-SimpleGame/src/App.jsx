import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import DynastySelection from './pages/DynastySelection';
import CharacterCreation from './pages/CharacterCreation';
import GameMain from './pages/GameMain';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100">
      <HashRouter>
        <Routes>
          <Route path="/" element={<DynastySelection />} />
          <Route path="/character" element={<CharacterCreation />} />
          <Route path="/game" element={<GameMain />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

export default App;