import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';

const EventModal = ({ event, onClose }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          <div className="rounded-lg overflow-hidden w-full h-48 mb-4">
            <img 
              src={`https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(event.imageKeyword)}&width=600&height=300&random=event_${event.id}`} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <p className="text-[#2C241A] text-center mb-6">{event.description}</p>
          
          <div className="w-full mb-6">
            <h3 className="text-lg font-bold text-[#2C241A] mb-2 text-center">事件影响</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {event.effects.map((effect, index) => (
                <div 
                  key={index} 
                  className="bg-[#E2DAD2] rounded-lg p-3 text-center border border-[#D4A53E]"
                >
                  <div className="text-sm text-[#8B7A99]">
                    {effect.stat === 'wealth' && '财富值'}
                    {effect.stat === 'mood' && '心情值'}
                    {effect.stat === 'health' && '健康值'}
                  </div>
                  <div className={`text-lg font-bold ${effect.value >= 0 ? 'text-[#3D8B72]' : 'text-[#C94D4D]'}`}>
                    {effect.value >= 0 ? '+' : ''}{effect.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            className="bg-[#C94D4D] hover:bg-[#A53D3D] text-white px-8 py-3 rounded-lg font-bold"
          >
            朕知道了！
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { EventModal };