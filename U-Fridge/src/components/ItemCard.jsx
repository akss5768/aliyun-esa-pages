import React from 'react';
import { Link } from 'react-router-dom';
import { safeFormatDate, getStatusInfo } from '../utils/dateUtils';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// 图标映射
const iconMap = {
  CheckCircle,
  AlertTriangle,
  XCircle
};

const ItemCard = ({ item }) => {
  const statusInfo = getStatusInfo(item.expiryDate);
  const IconComponent = iconMap[statusInfo.icon] || CheckCircle;
  
  return (
    <Link 
      to={`/item/${item.id}`}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-transform hover:scale-[1.02]"
    >
      <div className="relative pb-[100%]">
        <img 
          src={item.image} 
          alt={item.name} 
          className="absolute w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-800 truncate">{item.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {safeFormatDate(item.expiryDate, 'yyyy年MM月dd日')}
          </span>
          <div className={`flex items-center px-2 py-1 rounded-full ${statusInfo.bg}`}>
            <IconComponent className={statusInfo.color} size={14} />
            <span className={`ml-1 text-xs ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;