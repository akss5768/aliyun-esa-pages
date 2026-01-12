import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import ChannelList from './components/ChannelList';
import ChannelManagerPage from './pages/ChannelManagerPage';

const App = () => {


  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4">
            <Routes>
              <Route path="/" element={<ChannelList />} />
              <Route path="/channels" element={<ChannelManagerPage />} />
            </Routes>
          </main>
          <Player />
        </div>
      </div>
    </HashRouter>
  );
};

export default App;