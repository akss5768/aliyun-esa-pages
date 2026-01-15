import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const TimestampTool = () => {
  const [timestampInput, setTimestampInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // 初始化当前时间
    const now = new Date();
    setDateInput(formatDateForInput(now));
    
    // 检查是否有恢复数据
    const restoreData = localStorage.getItem('tool-timestamp-restore');
    if (restoreData) {
      const data = JSON.parse(restoreData);
      setTimestampInput(data.input || '');
      setResult(data.output || '');
      localStorage.removeItem('tool-timestamp-restore');
    }
  }, []);
  
  const formatDateForInput = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
  
  const timestampToDate = () => {
    if (!timestampInput.trim()) {
      setResult('请输入时间戳');
      return;
    }
    
    const timestamp = parseInt(timestampInput, 10);
    if (isNaN(timestamp)) {
      setResult('请输入有效的时间戳');
      return;
    }
    
    // 支持秒和毫秒时间戳
    const date = timestamp > 1e10 ? new Date(timestamp) : new Date(timestamp * 1000);
    
    if (isNaN(date.getTime())) {
      setResult('无效的时间戳');
      return;
    }
    
    const formatted = {
      '标准时间': date.toString(),
      'ISO格式': date.toISOString(),
      '本地格式': date.toLocaleString('zh-CN'),
      'UTC格式': date.toUTCString()
    };
    
    const resultText = Object.entries(formatted)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
      
    setResult(resultText);
    saveToHistory(timestampInput, resultText);
  };
  
  const dateToTimestamp = () => {
    if (!dateInput) {
      setResult('请选择日期时间');
      return;
    }
    
    const date = new Date(dateInput);
    
    if (isNaN(date.getTime())) {
      setResult('请选择有效的日期时间');
      return;
    }
    
    const timestamp = {
      '秒级时间戳': Math.floor(date.getTime() / 1000),
      '毫秒级时间戳': date.getTime()
    };
    
    const resultText = Object.entries(timestamp)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
      
    setResult(resultText);
    saveToHistory(dateInput, resultText);
  };
  
  const getCurrentTimestamp = () => {
    const now = Date.now();
    const timestamp = {
      '秒级时间戳': Math.floor(now / 1000),
      '毫秒级时间戳': now
    };
    
    const resultText = Object.entries(timestamp)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
      
    setResult(resultText);
    saveToHistory('当前时间', resultText);
  };
  
  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'timestamp',
      toolName: '时间戳转换',
      input,
      output,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };
  
  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">时间戳转日期</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              placeholder="输入Unix时间戳"
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={timestampToDate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              转换
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            支持秒级和毫秒级时间戳
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">日期转时间戳</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={dateToTimestamp}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              转换
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={getCurrentTimestamp}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          获取当前时间戳
        </button>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">转换结果</label>
          {result && (
            <button 
              onClick={copyToClipboard}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-green-500" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  复制结果
                </>
              )}
            </button>
          )}
        </div>
        
        <div className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 font-mono text-sm overflow-auto whitespace-pre">
          {result || '转换结果将显示在这里'}
        </div>
      </div>
    </div>
  );
};

export default TimestampTool;