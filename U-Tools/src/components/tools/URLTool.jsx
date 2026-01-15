import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

const URLTool = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [formattedUrl, setFormattedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [operationType, setOperationType] = useState('encode');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      if (!inputUrl.trim()) {
        setFormattedUrl('');
        setError('');
        return;
      }

      let result = '';
      if (operationType === 'encode') {
        // URL 编码
        result = encodeURIComponent(inputUrl);
      } else if (operationType === 'decode') {
        // URL 解码
        result = decodeURIComponent(inputUrl);
      } else if (operationType === 'normalize') {
        // URL 规范化
        result = normalizeUrl(inputUrl);
      } else if (operationType === 'parse') {
        // URL 解析
        result = parseUrl(inputUrl);
      }

      setFormattedUrl(result);
      setError('');
      saveToHistory(inputUrl, result, operationType);
    } catch (err) {
      setError(`操作失败: ${err.message}`);
      setFormattedUrl('');
    }
  };

  const normalizeUrl = (url) => {
    try {
      // 使用 URL 构造函数来规范化 URL
      const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
      return urlObj.toString();
    } catch (e) {
      // 如果 URL 无效，则尝试基本清理
      return url.replace(/\s+/g, '').replace(/\/+/g, '/');
    }
  };

  const parseUrl = (url) => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `http://${url}`);
      const components = {
        '协议 (Protocol)': urlObj.protocol,
        '主机 (Host)': urlObj.host,
        '主机名 (Hostname)': urlObj.hostname,
        '端口 (Port)': urlObj.port || '默认',
        '路径 (Path)': urlObj.pathname,
        '参数 (Search)': urlObj.search,
        '哈希 (Hash)': urlObj.hash
      };

      return Object.entries(components)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    } catch (e) {
      return `URL 解析失败: ${e.message}`;
    }
  };

  const saveToHistory = (input, output, opType) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const opNames = {
      encode: 'URL编码',
      decode: 'URL解码',
      normalize: 'URL规范化',
      parse: 'URL解析'
    };
    
    const newEntry = {
      toolId: 'url',
      toolName: 'URL格式化',
      input: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      output: output.substring(0, 50) + (output.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString(),
      operation: opNames[opType] || opType
    };
    const updatedHistory = [newEntry, ...history.slice(0, 9)]; // 保留最近10条记录
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };

  const copyToClipboard = async () => {
    if (formattedUrl) {
      try {
        await navigator.clipboard.writeText(formattedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('无法复制到剪贴板', err);
      }
    }
  };

  const resetFields = () => {
    setInputUrl('');
    setFormattedUrl('');
    setError('');
  };

  const handleInputChange = (e) => {
    setInputUrl(e.target.value);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormat();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">URL 格式化工具</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              操作类型
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {[
                { value: 'encode', label: 'URL 编码' },
                { value: 'decode', label: 'URL 解码' },
                { value: 'normalize', label: 'URL 规范化' },
                { value: 'parse', label: 'URL 解析' }
              ].map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOperationType(op.value)}
                  className={`py-2 px-3 rounded-lg border transition-colors ${
                    operationType === op.value
                      ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                输入 URL
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={resetFields}
                  className="flex items-center py-1.5 px-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  清空
                </button>
                <button
                  onClick={handleFormat}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  {operationType === 'encode' ? '编码' :
                   operationType === 'decode' ? '解码' :
                   operationType === 'normalize' ? '规范化' : '解析'}
                </button>
              </div>
            </div>
            <textarea
              value={inputUrl}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                operationType === 'encode' ? '在此输入需要编码的文本...' :
                operationType === 'decode' ? '在此输入需要解码的URL...' :
                operationType === 'normalize' ? '在此输入需要规范化的URL...' :
                '在此输入需要解析的URL...'
              }
              className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 font-mono text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {operationType === 'encode' ? '编码结果' :
                 operationType === 'decode' ? '解码结果' :
                 operationType === 'normalize' ? '规范化结果' : '解析结果'}
              </label>
              {formattedUrl && (
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
                      复制
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 font-mono text-sm overflow-auto break-all whitespace-pre-wrap">
              {formattedUrl || (
                <p className="text-gray-500 dark:text-gray-400 h-full flex items-center">
                  {inputUrl ? '格式化结果将显示在这里' : '请输入URL以进行格式化'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">关于 URL 格式化</h3>
        <div className="text-gray-600 dark:text-gray-300 space-y-3 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">URL 编码</h4>
            <p>将 URL 中不允许的字符转换为 % 后跟两位十六进制数的形式，例如空格变为 %20。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">URL 解码</h4>
            <p>将已编码的 URL 字符串还原为其原始形式，例如 %20 变为空格。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">URL 规范化</h4>
            <p>将 URL 转换为标准格式，包括添加协议前缀、移除多余字符等。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">URL 解析</h4>
            <p>分解 URL 为各个组成部分，如协议、主机名、路径等。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLTool;