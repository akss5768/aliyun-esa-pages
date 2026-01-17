import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Dialog } from '../components/ui/Dialog';
import { MarketPanel } from '../components/game/MarketPanel';
import { EventModal } from '../components/game/EventModal';
import { StatusBars } from '../components/game/StatusBars';

const GameMain = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [character, setCharacter] = useState(null);
  const [market, setMarket] = useState([]);
  const [showMarket, setShowMarket] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  useEffect(() => {
    // 从本地存储加载游戏状态
    const savedState = localStorage.getItem('gameState');
    const savedCharacter = localStorage.getItem('character');
    
    if (!savedState || !savedCharacter) {
      navigate('/');
      return;
    }
    
    setGameState(JSON.parse(savedState));
    setCharacter(JSON.parse(savedCharacter));
    
    // 初始化市场
    initializeMarket();
  }, [navigate]);
  
  const initializeMarket = () => {
    // 根据角色地域生成市场商品
    const baseGoods = [
      { id: 'rice', name: '稻米', basePrice: 15, inventory: 100 },
      { id: 'silk', name: '丝绸', basePrice: 80, inventory: 50 },
      { id: 'pottery', name: '陶器', basePrice: 30, inventory: 80 }
    ];
    
    // 根据地域调整价格
    const regionModifiers = {
      jiangnan: { rice: 0.8, silk: 1.2, pottery: 0.9 },
      saibei: { rice: 1.3, silk: 0.9, pottery: 1.1 },
      zhongyuan: { rice: 1.0, silk: 1.0, pottery: 1.0 }
    };
    
    const characterData = JSON.parse(localStorage.getItem('character'));
    const regionId = characterData.region.id;
    const modifiers = regionModifiers[regionId] || regionModifiers.zhongyuan;
    
    const marketGoods = baseGoods.map(good => ({
      ...good,
      price: Math.round(good.basePrice * modifiers[good.id]),
      quantity: 0 // 玩家持有数量
    }));
    
    setMarket(marketGoods);
  };
  
  const handleTrade = (goodId, action) => {
    if (!gameState) return;
    
    setMarket(prevMarket => {
      const updatedMarket = [...prevMarket];
      const goodIndex = updatedMarket.findIndex(g => g.id === goodId);
      
      if (goodIndex === -1) return prevMarket;
      
      const good = updatedMarket[goodIndex];
      
      if (action === 'buy') {
        if (gameState.wealth >= good.price) {
          updatedMarket[goodIndex] = {
            ...good,
            inventory: good.inventory - 1,
            quantity: good.quantity + 1
          };
          
          setGameState(prevState => ({
            ...prevState,
            wealth: prevState.wealth - good.price
          }));
        }
      } else if (action === 'sell' && good.quantity > 0) {
        updatedMarket[goodIndex] = {
          ...good,
          inventory: good.inventory + 1,
          quantity: good.quantity - 1
        };
        
        setGameState(prevState => ({
          ...prevState,
          wealth: prevState.wealth + good.price
        }));
      }
      
      // 保存更新后的市场状态
      localStorage.setItem('market', JSON.stringify(updatedMarket));
      return updatedMarket;
    });
    
    // 保存更新后的游戏状态
    setTimeout(() => {
      const updatedState = {...gameState};
      if (action === 'buy' && gameState.wealth >= market.find(g => g.id === goodId)?.price) {
        updatedState.wealth -= market.find(g => g.id === goodId)?.price;
      } else if (action === 'sell') {
        updatedState.wealth += market.find(g => g.id === goodId)?.price;
      }
      
      updatedState.turn += 1;
      setGameState(updatedState);
      localStorage.setItem('gameState', JSON.stringify(updatedState));
      
      // 一定概率触发事件
      if (Math.random() < 0.3) {
        triggerRandomEvent();
      }
    }, 100);
  };
  
  const triggerRandomEvent = () => {
    const events = [
      {
        id: 'war',
        title: '边关战事频仍！',
        description: '朝廷下令筹措军粮，粮食价格大涨！同时征兵令使市面萧条...',
        imageKeyword: 'ancient war',
        effects: [
          { stat: 'wealth', value: 30 },
          { stat: 'mood', value: -15 },
          { stat: 'health', value: -5 }
        ]
      },
      {
        id: 'flood',
        title: '夏季洪涝成灾',
        description: '连日暴雨引发洪灾，农田受损严重，稻米价格飞涨...',
        imageKeyword: 'flood disaster',
        effects: [
          { stat: 'wealth', value: -20 },
          { stat: 'mood', value: -10 },
          { stat: 'health', value: -15 }
        ]
      },
      {
        id: 'policy',
        title: '朝廷新税令',
        description: '新政减轻商税，市场交易活跃，各类商品价格略有下降...',
        imageKeyword: 'ancient policy',
        effects: [
          { stat: 'wealth', value: 15 },
          { stat: 'mood', value: 10 }
        ]
      },
      {
        id: 'festival',
        title: '传统佳节将至',
        description: '节日临近，民众采购年货，丝绸、瓷器等商品需求大增...',
        imageKeyword: 'chinese festival',
        effects: [
          { stat: 'wealth', value: 25 },
          { stat: 'mood', value: 20 }
        ]
      }
    ];
    
    const event = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(event);
    
    // 应用事件效果
    setGameState(prevState => {
      const newState = { ...prevState };
      event.effects.forEach(effect => {
        newState[effect.stat] = Math.max(0, newState[effect.stat] + effect.value);
      });
      return newState;
    });
  };
  
  const closeEvent = () => {
    setCurrentEvent(null);
    
    // 保存更新后的游戏状态
    setTimeout(() => {
      localStorage.setItem('gameState', JSON.stringify(gameState));
    }, 100);
  };
  
  if (!gameState || !character) {
    return <div className="min-h-screen bg-[#F2EDE4] flex items-center justify-center">加载游戏中...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-stone-100 flex flex-col" style={{ fontFamily: 'serif' }}>
      {/* 状态栏 */}
      <StatusBars gameState={gameState} />
      
      {/* 主要内容区 */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full bg-gradient-to-br from-amber-100 to-stone-200 rounded-xl p-6 border-2 border-amber-800 shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-amber-900 text-center mb-4">商行天下 - {character.region.name}</h1>
          <div className="rounded-lg overflow-hidden h-64 mb-6 border border-amber-700 shadow-md">
            <img 
              src={`https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(character.region.name)}&width=800&height=400&random=region_${character.region.id}`} 
              alt={character.region.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-amber-800 text-center mb-6 text-lg">{character.region.description}，作为{character.dynasty}的重要区域，这里的商业活动十分活跃。</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => setShowMarket(true)}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md"
            >
              <span className="text-lg">查看市场</span>
            </Button>
            <Button 
              onClick={triggerRandomEvent}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-lg transition duration-300 shadow-md"
            >
              <span className="text-lg">等待时机</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* 市场面板 */}
      {showMarket && (
        <MarketPanel 
          market={market} 
          onTrade={handleTrade} 
          onClose={() => setShowMarket(false)} 
        />
      )}
      
      {/* 事件弹窗 */}
      {currentEvent && (
        <EventModal event={currentEvent} onClose={closeEvent} />
      )}
    </div>
  );
};

export default GameMain;