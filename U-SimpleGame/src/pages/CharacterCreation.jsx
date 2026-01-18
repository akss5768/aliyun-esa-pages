import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

import regionsData from '../data/regions.json';
import professionsData from '../data/professions.json';
import { ImagePlaceholder } from '../components/ui/ImagePlaceholder';

const CharacterCreation = () => {
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  
  useEffect(() => {
    // 生成角色
    generateCharacter();
  }, []);
  
  const generateCharacter = () => {
    const dynasties = {
      tang: '唐朝',
      song: '宋朝',
      ming: '明朝',
      qing: '清朝'
    };
    
    const selectedDynasty = localStorage.getItem('selectedDynasty') || 'tang';
    const region = regionsData[Math.floor(Math.random() * regionsData.length)];
    const profession = professionsData[Math.floor(Math.random() * professionsData.length)];
    
    setCharacter({
      dynasty: dynasties[selectedDynasty],
      region: region,
      profession: profession,
      wealth: 50 + profession.wealth,
      mood: 50 + profession.mood,
      health: 50 + profession.health
    });
  };
  
  const handleStart = () => {
    // 保存角色信息到本地存储
    localStorage.setItem('character', JSON.stringify(character));
    localStorage.setItem('gameState', JSON.stringify({
      wealth: character.wealth,
      mood: character.mood,
      health: character.health,
      turn: 1
    }));
    navigate('/game');
  };
  
  if (!character) {
    return <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center">生成角色中...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 flex flex-col items-center justify-center p-4" style={{ fontFamily: 'serif' }}>
      <div className="max-w-4xl w-full bg-gradient-to-br from-amber-100 to-stone-200 rounded-xl p-8 border-2 border-amber-800 shadow-lg">
        <h1 className="text-4xl font-bold text-amber-900 text-center mb-8">恭贺！降临于{character.region.name}！</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl p-6 h-full border-2 border-amber-300 shadow-md">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">家庭背景</h2>
              <div className="flex items-center mb-4">
                <div className="mr-4 flex-shrink-0">
                  <ImagePlaceholder 
                    type="profession"
                    alt={character.profession.name}
                    src={character.profession.image}
                    className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
                  />
                </div>
                <div>
                  <p className="text-lg text-amber-900">你是一名{character.dynasty}时期生活在{character.region.name}的{character.profession.name}。</p>
                  <p className="text-amber-700 mt-2">{character.region.description}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-bold text-amber-900 mb-2">地域特色</h3>
                <p className="text-amber-700">{character.region.description}，这里的商品价格和供需关系有独特之处。</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl p-6 h-full border-2 border-amber-300 shadow-md">
              <h2 className="text-2xl font-bold text-amber-900 mb-4">初始属性</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-900 font-semibold">财富值</span>
                    <span className="text-amber-700 font-bold">{character.wealth}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-4 rounded-full" 
                      style={{ width: `${Math.min(100, character.wealth)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-900 font-semibold">心情值</span>
                    <span className="text-red-600 font-bold">{character.mood}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full" 
                      style={{ width: `${Math.min(100, character.mood)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-900 font-semibold">健康值</span>
                    <span className="text-green-600 font-bold">{character.health}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full" 
                      style={{ width: `${Math.min(100, character.health)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-bold text-amber-900 mb-2">初始资金来源</h3>
                <p className="text-amber-700">家族传承的{character.profession.name}生意为你提供了启动资金。</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={handleStart}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-10 rounded-xl text-xl transition duration-300 shadow-lg"
          >
            <span>开启商旅生涯</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;