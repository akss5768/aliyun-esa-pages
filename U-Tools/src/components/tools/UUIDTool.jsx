import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

// 简单的UUID生成函数（实际应用中可使用uuid库）
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const UUIDTool = () => {
  const [uuid, setUuid] = useState(generateUUID());
  const [copied, setCopied] = useState(false);
  
  const generateNewUUID = () => {
    const newUuid = generateUUID();
    setUuid(newUuid);
    setCopied(false);
    
    // 保存到历史记录
    saveToHistory(newUuid, newUuid);
  };
  
  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'uuid',
      toolName: 'UUID生成',
      input: '生成UUID',
      output,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">生成的UUID</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm break-all">
            {uuid}
          </div>
        </div>
        
        <div className="flex justify-center gap-3">
          <button 
            onClick={generateNewUUID}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${copied ? '' : 'animate-spin'}`} />
            重新生成
          </button>
          <button 
            onClick={copyToClipboard}
            className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                复制
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">关于UUID</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          UUID（通用唯一识别码）是一个128位的标识符，用于在分布式系统中唯一标识信息。
          标准的UUID格式为8-4-4-4-12的32个十六进制数字，例如：
          550e8400-e29b-41d4-a716-446655440000
        </p>
      </div>
    </div>
  );
};

export default UUIDTool;