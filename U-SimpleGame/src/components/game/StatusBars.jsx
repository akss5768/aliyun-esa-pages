import React from 'react';

const StatusBars = ({ gameState }) => {
  return (
    <div className="bg-[#E2DAD2] border-b-2 border-[#D4A53E] p-4 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center">
          <span className="text-[#2C241A] font-bold mr-2">금 财富值:</span>
          <div className="w-32 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-[#D4A53E] h-4 rounded-full" 
              style={{ width: `${Math.min(100, gameState.wealth / 2)}%` }}
            ></div>
          </div>
          <span className="text-[#D4A53E] font-bold ml-2">{gameState.wealth}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-[#2C241A] font-bold mr-2">❤ 心情值:</span>
          <div className="w-32 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-[#C94D4D] h-4 rounded-full" 
              style={{ width: `${Math.min(100, gameState.mood)}%` }}
            ></div>
          </div>
          <span className="text-[#C94D4D] font-bold ml-2">{gameState.mood}</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-[#2C241A] font-bold mr-2">✚ 健康值:</span>
          <div className="w-32 bg-gray-200 rounded-full h-4">
            <div 
              className="bg-[#3D8B72] h-4 rounded-full" 
              style={{ width: `${Math.min(100, gameState.health)}%` }}
            ></div>
          </div>
          <span className="text-[#3D8B72] font-bold ml-2">{gameState.health}</span>
        </div>
        
        <div className="text-[#8B7A99] font-bold">
          回合: {gameState.turn}
        </div>
      </div>
    </div>
  );
};

export { StatusBars };