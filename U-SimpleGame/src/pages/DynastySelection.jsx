import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

import dynastiesData from '../data/dynasties.json';
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';

const DynastySelection = () => {
  const navigate = useNavigate();
  
  const dynasties = dynastiesData;
  
  const handleSelect = (dynastyId) => {
    // 保存选择的朝代到本地存储
    localStorage.setItem('selectedDynasty', dynastyId);
    navigate('/character');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 flex flex-col items-center justify-center p-4" style={{ fontFamily: 'serif' }}>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-amber-900 mb-4">千年商旅</h1>
        <p className="text-xl text-amber-800">一场跨越千年的财富之旅</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {dynasties.map((dynasty) => (
          <Card 
            key={dynasty.id}
            className="bg-gradient-to-br from-amber-100 to-stone-200 border-2 border-amber-800 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 shadow-lg"
            onClick={() => handleSelect(dynasty.id)}
          >
            <h2 className="text-2xl font-bold text-amber-900 mb-3">{dynasty.name}</h2>
            <p className="text-amber-700 text-lg mb-4">{dynasty.description}</p>
            <div className="mt-4 h-40 rounded-lg overflow-hidden border border-amber-700 shadow-md">
              <ImagePlaceholder 
                type="dynasty"
                alt={dynasty.name}
                src={dynasty.image}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 text-center text-amber-800">
        <p className="text-lg">选择一个朝代开始您的商旅人生</p>
      </div>
    </div>
  );
};

export default DynastySelection;