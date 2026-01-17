import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';

const MarketPanel = ({ market, onTrade, onClose }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">市场行情</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {market.map((good) => (
            <div 
              key={good.id} 
              className="bg-[#E2DAD2] rounded-lg p-4 border border-[#D4A53E] flex flex-col sm:flex-row justify-between items-center"
            >
              <div className="mb-2 sm:mb-0">
                <h3 className="text-lg font-bold text-[#2C241A]">{good.name}</h3>
                <p className="text-[#8B7A99]">库存: {good.inventory} | 持有: {good.quantity}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#D4A53E]">￥{good.price}</span>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => onTrade(good.id, 'buy')}
                    disabled={good.inventory <= 0}
                    className="bg-[#3D8B72] hover:bg-[#2D6B52] text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    买入
                  </Button>
                  <Button 
                    onClick={() => onTrade(good.id, 'sell')}
                    disabled={good.quantity <= 0}
                    className="bg-[#C94D4D] hover:bg-[#A53D3D] text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    卖出
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button 
            onClick={onClose}
            className="bg-[#8B7A99] hover:bg-[#6B5A79] text-white px-6 py-2 rounded"
          >
            关闭
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { MarketPanel };