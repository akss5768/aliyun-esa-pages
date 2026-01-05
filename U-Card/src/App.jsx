import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cards from './pages/Cards';
import CardGroups from './pages/CardGroups';
import GroupCards from './pages/GroupCards';
import AIGenerator from './pages/AIGenerator';
import Navbar from './components/Navbar';
import CreateCardGroup from './pages/CreateCardGroup';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/groups" element={<CardGroups />} />
            <Route path="/groups/create" element={<CreateCardGroup />} />
            <Route path="/groups/:groupId/cards" element={<GroupCards />} />
            <Route path="/ai-generator" element={<AIGenerator />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;