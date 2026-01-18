import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 安全格式化日期的工具函数
 * @param {string|Date} date - 要格式化的日期
 * @param {string} formatStr - 格式化字符串
 * @returns {string} 格式化后的日期字符串
 */
export const safeFormatDate = (date, formatStr = 'yyyy年MM月dd日') => {
  try {
    // 检查日期是否有效
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    // 检查是否为有效日期
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to safeFormatDate:', date);
      return '';
    }
    
    return format(dateObj, formatStr, { locale: zhCN });
  } catch (error) {
    console.error('Error formatting date:', error, date);
    return '';
  }
};

/**
 * 获取物品状态信息
 * @param {string} expiryDate - 过期日期
 * @returns {object} 状态信息对象
 */
export const getStatusInfo = (expiryDate) => {
  try {
    const today = new Date();
    const expiry = new Date(expiryDate);
    
    // 检查日期是否有效
    if (isNaN(expiry.getTime())) {
      return { 
        status: 'unknown', 
        text: '未知', 
        icon: null, 
        color: 'text-gray-500', 
        bg: 'bg-gray-100' 
      };
    }
    
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { 
        status: 'expired', 
        text: '已过期', 
        icon: 'XCircle', 
        color: 'text-red-500', 
        bg: 'bg-red-100' 
      };
    } else if (diffDays <= 2) {
      return { 
        status: 'expiring', 
        text: `还剩${diffDays}天`, 
        icon: 'AlertTriangle', 
        color: 'text-orange-500', 
        bg: 'bg-orange-100' 
      };
    } else {
      return { 
        status: 'fresh', 
        text: '新鲜', 
        icon: 'CheckCircle', 
        color: 'text-green-500', 
        bg: 'bg-green-100' 
      };
    }
  } catch (error) {
    console.error('Error getting status info:', error);
    return { 
      status: 'unknown', 
      text: '未知', 
      icon: null, 
      color: 'text-gray-500', 
      bg: 'bg-gray-100' 
    };
  }
};