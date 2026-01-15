import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const JWTTool = () => {
  const [token, setToken] = useState('');
  const [decodedHeader, setDecodedHeader] = useState('');
  const [decodedPayload, setDecodedPayload] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState({ header: false, payload: false });
  
  const decodeJWT = () => {
    if (!token.trim()) {
      setDecodedHeader('');
      setDecodedPayload('');
      setIsValid(true);
      return;
    }
    
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      setDecodedHeader('');
      setDecodedPayload('JWT格式不正确，应包含三个部分');
      setIsValid(false);
      return;
    }
    
    try {
      // 解码头部
      const header = JSON.parse(atob(parts[0]));
      setDecodedHeader(JSON.stringify(header, null, 2));
      
      // 解码载荷
      const payload = JSON.parse(atob(parts[1]));
      setDecodedPayload(JSON.stringify(payload, null, 2));
      
      setIsValid(true);
      saveToHistory(token, JSON.stringify({ header, payload }, null, 2));
    } catch (error) {
      setDecodedHeader('');
      setDecodedPayload(`解析错误: ${error.message}`);
      setIsValid(false);
    }
  };
  
  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'jwt',
      toolName: 'JWT解析',
      input: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      output,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };
  
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="输入JWT Token"
          className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>
      
      <button 
        onClick={decodeJWT}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        解析JWT
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">头部 (Header)</label>
            {decodedHeader && (
              <button 
                onClick={() => copyToClipboard(decodedHeader, 'header')}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                {copied.header ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </>
                )}
              </button>
            )}
          </div>
          <div className={`w-full h-40 p-3 border rounded-lg font-mono text-sm overflow-auto ${isValid ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
            {decodedHeader ? (
              <pre>{decodedHeader}</pre>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 h-full flex items-center">
                {token ? '解析后的头部信息将显示在这里' : '请输入JWT Token'}
              </p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">载荷 (Payload)</label>
            {decodedPayload && (
              <button 
                onClick={() => copyToClipboard(decodedPayload, 'payload')}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
              >
                {copied.payload ? (
                  <>
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    复制
                  </>
                )}
              </button>
            )}
          </div>
          <div className={`w-full h-40 p-3 border rounded-lg font-mono text-sm overflow-auto ${isValid ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
            {decodedPayload ? (
              <pre>{decodedPayload}</pre>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 h-full flex items-center">
                {token ? '解析后的载荷信息将显示在这里' : '请输入JWT Token'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {!isValid && (
        <p className="text-sm text-red-600 dark:text-red-400">
          JWT格式无效，请检查后重试
        </p>
      )}
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">关于JWT</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          JWT (JSON Web Token) 是一种开放标准 (RFC 7519)，用于在各方之间安全地传输信息。
          JWT由三部分组成：头部、载荷和签名，用点(.)分隔。
        </p>
      </div>
    </div>
  );
};

export default JWTTool;