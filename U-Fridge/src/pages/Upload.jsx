import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { Camera, Image as ImageIcon } from 'lucide-react';

const Upload = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 模拟AI识别过程
  const processImage = (file) => {
    setIsProcessing(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      const mockItems = [
        {
          id: Date.now(),
          image: URL.createObjectURL(file),
          name: '牛奶',
          category: 'dairy',
          addedDate: new Date().toISOString(),
          expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后过期
          notes: ''
        }
      ];
      
      setItems(mockItems);
      setIsProcessing(false);
    }, 1500);
  };
  
  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };
  
  // 处理拍照
  const handleCapture = () => {
    document.getElementById('fileInput').click();
  };
  
  // 保存物品
  const saveItems = () => {
    const savedItems = localStorage.getItem('fridgeItems');
    const existingItems = savedItems ? JSON.parse(savedItems) : [];
    const updatedItems = [...existingItems, ...items];
    
    localStorage.setItem('fridgeItems', JSON.stringify(updatedItems));
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="添加物品" />
      
      <div className="p-4">
        {/* 上传区域 */}
        {!items.length && (
          <div className="mb-6">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="mx-auto bg-gray-100 rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4">
                <Camera className="text-gray-500" size={24} />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">添加冰箱物品</h3>
              <p className="text-gray-500 mb-4">点击此处拍照或从相册选择</p>
              <Button className="bg-pink-300 hover:bg-pink-400 text-white px-4 py-2 rounded-full">
                选择图片
              </Button>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Button 
                onClick={handleCapture}
                className="flex-1 bg-pink-300 hover:bg-pink-400 text-white py-3 rounded-xl flex items-center justify-center"
              >
                <Camera className="mr-2" size={20} />
                拍照上传
              </Button>
              <Button 
                onClick={() => document.getElementById('fileInput').click()}
                variant="secondary"
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center"
              >
                <ImageIcon className="mr-2" size={20} />
                相册选择
              </Button>
            </div>
            
            <input 
              id="fileInput"
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              onChange={handleFileSelect}
            />
          </div>
        )}
        
        {/* 处理中状态 */}
        {isProcessing && (
          <div className="bg-white rounded-xl p-6 text-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-300 mx-auto mb-4"></div>
            <p className="text-gray-600">正在识别图片中的物品...</p>
          </div>
        )}
        
        {/* 识别结果 */}
        {items.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">识别结果</h2>
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-4">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        入库时间: {new Date(item.addedDate).toLocaleDateString('zh-CN')}
                      </p>
                      <p className="text-sm text-gray-500">
                        过期时间: {new Date(item.expiryDate).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex space-x-3">
              <Button 
                onClick={saveItems}
                className="flex-1 bg-green-400 hover:bg-green-500 text-white py-3 rounded-xl"
              >
                确认添加
              </Button>
              <Button 
                onClick={() => {
                  setItems([]);
                  navigate('/');
                }}
                variant="secondary"
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl"
              >
                取消
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;