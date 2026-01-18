import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { safeFormatDate } from '../utils/dateUtils';
import { AlertTriangle, XCircle } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  
  // 生成提醒通知
  useEffect(() => {
    const savedItems = localStorage.getItem('fridgeItems');
    if (savedItems) {
      const items = JSON.parse(savedItems);
      const today = new Date();
      
      // 过滤出即将过期和已过期的物品
      const expiringItems = items.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        // 检查日期是否有效
        if (isNaN(expiryDate.getTime())) return false;
        
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // 提前1-2天提醒或已过期
        return diffDays <= 2;
      });
      
      // 生成通知数据
      const notificationData = expiringItems.map(item => {
        const expiryDate = new Date(item.expiryDate);
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let status, message;
        if (diffDays < 0) {
          status = 'expired';
          message = '今天已过期';
        } else if (diffDays === 0) {
          status = 'expiring';
          message = '今天过期';
        } else {
          status = 'expiring';
          message = `将在${diffDays}天后过期`;
        }
        
        return {
          id: item.id,
          image: item.image,
          name: item.name,
          message,
          status,
          date: item.expiryDate
        };
      });
      
      setNotifications(notificationData);
    }
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header title="提醒通知" />
      
      <div className="p-4">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                onClick={() => navigate(`/item/${notification.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                  <img 
                    src={notification.image} 
                    alt={notification.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{notification.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    过期日期: {safeFormatDate(notification.date, 'yyyy年MM月dd日')}
                  </p>
                </div>
                <div className="ml-2">
                  {notification.status === 'expired' ? (
                    <XCircle className="text-red-500" size={24} />
                  ) : (
                    <AlertTriangle className="text-orange-500" size={24} />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <AlertTriangle className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">暂无提醒</h3>
            <p className="text-gray-500">没有即将过期的物品</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;