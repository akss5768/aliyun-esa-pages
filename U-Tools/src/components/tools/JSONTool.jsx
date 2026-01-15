import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const JSONTool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // 检查是否有恢复数据
    const restoreData = localStorage.getItem('tool-json-restore');
    if (restoreData) {
      const data = JSON.parse(restoreData);
      setInput(data.input || '');
      setOutput(data.output || '');
      localStorage.removeItem('tool-json-restore');
    }
  }, []);
  
  const validateAndFormat = () => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(true);
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      
      // 保存到历史记录
      saveToHistory(input, formatted);
    } catch (error) {
      setOutput(`JSON格式错误: ${error.message}`);
      setIsValid(false);
    }
  };
  
  const minify = () => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(true);
      return;
    }
    
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      
      // 保存到历史记录
      saveToHistory(input, minified);
    } catch (error) {
      setOutput(`JSON格式错误: ${error.message}`);
      setIsValid(false);
    }
  };
  
  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'json',
      toolName: 'JSON校验与格式化',
      input,
      output,
      timestamp: new Date().toISOString()
    };
    
    // 限制历史记录数量为50条
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };
  
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">JSON输入</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{\n  "name": "示例",\n  "value": 123\n}'
          className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={validateAndFormat}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          校验并格式化
        </button>
        <button 
          onClick={minify}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 rounded-lg transition-colors"
        >
          压缩JSON
        </button>
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">结果</label>
          {output && (
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
        
        <div className={`w-full h-40 p-3 border rounded-lg font-mono text-sm overflow-auto ${isValid ? 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600' : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'}`}>
          {output ? (
            <pre>{output}</pre>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 h-full flex items-center">
              {input ? '点击"校验并格式化"按钮查看结果' : '请输入JSON内容'}
            </p>
          )}
        </div>
        
        {!isValid && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            JSON格式无效，请检查后重试
          </p>
        )}
      </div>
    </div>
  );
};

export default JSONTool;