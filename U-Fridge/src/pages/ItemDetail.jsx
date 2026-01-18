import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/Select';
import { Label } from '../components/ui/Label';
import { safeFormatDate } from '../utils/dateUtils';
import { Trash2, Calendar } from 'lucide-react';
import dbUtils from '../utils/dbUtils';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  
  // 分类选项
  const categories = [
    { id: 'vegetable', name: '蔬菜' },
    { id: 'fruit', name: '水果' },
    { id: 'dairy', name: '乳制品' },
    { id: 'beverage', name: '饮料' },
    { id: 'meat', name: '肉类' },
    { id: 'other', name: '其他' }
  ];
  
  // 加载物品详情
  useEffect(() => {
    const loadItem = async () => {
      try {
        const foundItem = await dbUtils.getItemById(parseInt(id));
        if (foundItem) {
          setItem(foundItem);
          setEditedItem({ ...foundItem });
        }
      } catch (error) {
        console.error('加载物品详情失败:', error);
      }
    };
    
    loadItem();
  }, [id]);
  
  // 保存修改
  const saveChanges = async () => {
    try {
      await dbUtils.addItem(editedItem);
      navigate('/');
    } catch (error) {
      console.error('保存修改失败:', error);
      alert('保存修改失败，请重试');
    }
  };
  
  // 删除物品
  const deleteItem = async () => {
    if (window.confirm('确定要删除这个物品吗？')) {
      try {
        await dbUtils.deleteItem(parseInt(id));
        navigate('/');
      } catch (error) {
        console.error('删除物品失败:', error);
        alert('删除物品失败，请重试');
      }
    }
  };
  
  if (!item) return <div>加载中...</div>;
  
  // 处理日期值，确保格式正确
  const getFormattedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0]; // 返回 YYYY-MM-DD 格式
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="物品详情" />
      
      <div className="p-4">
        {/* 物品图片 */}
        <div className="mb-6 rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-64 object-cover"
          />
        </div>
        
        {/* 编辑表单 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="mb-5">
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              物品名称
            </Label>
            <input 
              id="name"
              type="text"
              value={editedItem.name || ''}
              onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4"
              placeholder="输入物品名称"
            />
          </div>
          <div className="mb-5">
            <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              物品类型
            </Label>
            <Select 
              value={editedItem.category} 
              onValueChange={(value) => setEditedItem({...editedItem, category: value})}
            >
              <SelectTrigger className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-5">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              入库时间
            </Label>
            <div className="relative">
              <input 
                type="date" 
                value={getFormattedDate(editedItem.addedDate)}
                onChange={(e) => setEditedItem({...editedItem, addedDate: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 pl-12"
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="mb-5">
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              过期时间
            </Label>
            <div className="relative">
              <input 
                type="date" 
                value={getFormattedDate(editedItem.expiryDate)}
                onChange={(e) => setEditedItem({...editedItem, expiryDate: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 pl-12"
              />
              <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              备注信息
            </Label>
            <textarea 
              id="notes"
              value={editedItem.notes || ''}
              onChange={(e) => setEditedItem({...editedItem, notes: e.target.value})}
              placeholder="添加备注"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 min-h-[100px]"
            />
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex space-x-3">
          <Button 
            onClick={saveChanges}
            className="flex-1 bg-green-400 hover:bg-green-500 text-white py-3 rounded-xl"
          >
            保存修改
          </Button>
          <Button 
            onClick={deleteItem}
            variant="destructive"
            className="flex-1 bg-red-400 hover:bg-red-500 text-white py-3 rounded-xl flex items-center justify-center"
          >
            <Trash2 className="mr-2" size={18} />
            删除物品
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;