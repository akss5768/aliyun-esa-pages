import React, { useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

const UnicodeTool = () => {
  const [inputText, setInputText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [operationType, setOperationType] = useState('encode');
  const [error, setError] = useState('');

  const handleConvert = () => {
    try {
      if (!inputText.trim()) {
        setConvertedText('');
        setError('');
        return;
      }

      let result = '';
      if (operationType === 'encode') {
        // 文本转 Unicode 编码
        result = textToUnicode(inputText);
      } else if (operationType === 'decode') {
        // Unicode 编码转文本
        result = unicodeToText(inputText);
      } else if (operationType === 'escape') {
        // JavaScript Unicode 转义序列
        result = textToUnicodeEscape(inputText);
      } else if (operationType === 'unescape') {
        // JavaScript Unicode 转义序列解码
        result = unicodeEscapeToText(inputText);
      }

      setConvertedText(result);
      setError('');
      saveToHistory(inputText, result, operationType);
    } catch (err) {
      setError(`转换失败: ${err.message}`);
      setConvertedText('');
    }
  };

  // 文本转 Unicode 编码 (格式: \uXXXX)
  const textToUnicode = (text) => {
    return text.split('').map(char => {
      const hex = char.charCodeAt(0).toString(16).padStart(4, '0');
      return '\\u' + hex.toUpperCase();
    }).join('');
  };

  // Unicode 编码转文本
  const unicodeToText = (unicodeStr) => {
    // 匹配 \uXXXX 格式
    return unicodeStr.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  };

  // JavaScript Unicode 转义序列 (格式: \u{X})
  const textToUnicodeEscape = (text) => {
    return text.split('').map(char => {
      const code = char.codePointAt(0);
      if (code <= 0xFFFF) {
        // BMP (Basic Multilingual Plane) 字符
        return '\\u' + code.toString(16).padStart(4, '0').toUpperCase();
      } else {
        // 超出 BMP 的字符 (如 emoji)
        return '\\u{' + code.toString(16).toUpperCase() + '}';
      }
    }).join('');
  };

  // JavaScript Unicode 转义序列解码
  const unicodeEscapeToText = (unicodeStr) => {
    // 处理 \u{XXXXX} 格式
    return unicodeStr.replace(/\\u\{([0-9a-fA-F]+)\}/g, (match, code) => {
      return String.fromCodePoint(parseInt(code, 16));
    }).replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  };

  const saveToHistory = (input, output, opType) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const opNames = {
      encode: 'Unicode编码',
      decode: 'Unicode解码',
      escape: 'JS转义编码',
      unescape: 'JS转义解码'
    };
    
    const newEntry = {
      toolId: 'unicode',
      toolName: 'Unicode转换',
      input: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      output: output.substring(0, 50) + (output.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString(),
      operation: opNames[opType] || opType
    };
    const updatedHistory = [newEntry, ...history.slice(0, 9)]; // 保留最近10条记录
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };

  const copyToClipboard = async () => {
    if (convertedText) {
      try {
        await navigator.clipboard.writeText(convertedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('无法复制到剪贴板', err);
      }
    }
  };

  const resetFields = () => {
    setInputText('');
    setConvertedText('');
    setError('');
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Unicode 编码转换工具</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              转换类型
            </label>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { value: 'encode', label: '文本转Unicode' },
                { value: 'decode', label: 'Unicode转文本' },
                { value: 'escape', label: '文本转JS转义' },
                { value: 'unescape', label: 'JS转义转文本' }
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
                输入文本
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
                  onClick={handleConvert}
                  className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  {operationType === 'encode' ? '编码' :
                   operationType === 'decode' ? '解码' :
                   operationType === 'escape' ? '转义' : '反转义'}
                </button>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                operationType === 'encode' ? '在此输入需要转换为Unicode的文本...' :
                operationType === 'decode' ? '在此输入Unicode编码(\\uXXXX格式)...' :
                operationType === 'escape' ? '在此输入需要JS转义的文本...' :
                '在此输入JS转义编码(\\u{X}格式)...'
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
                {operationType === 'encode' ? 'Unicode编码' :
                 operationType === 'decode' ? '解码文本' :
                 operationType === 'escape' ? 'JS转义序列' : '反转义文本'}
              </label>
              {convertedText && (
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
              {convertedText || (
                <p className="text-gray-500 dark:text-gray-400 h-full flex items-center">
                  {inputText ? '转换结果将显示在这里' : '请输入文本以进行转换'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">关于 Unicode 编码转换</h3>
        <div className="text-gray-600 dark:text-gray-300 space-y-3 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">文本转Unicode</h4>
            <p>将普通文本转换为 Unicode 编码格式（\uXXXX），例如 "你好" 转换为 "\u4f60\u597d"。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">Unicode转文本</h4>
            <p>将 Unicode 编码（\uXXXX 格式）还原为原始文本，例如 "\u4f60\u597d" 转换为 "你好"。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">文本转JS转义</h4>
            <p>将文本转换为 JavaScript Unicode 转义序列，支持超出 BMP 的字符（如 emoji）。</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">JS转义转文本</h4>
            <p>将 JavaScript Unicode 转义序列（\u{X} 格式）还原为原始文本。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnicodeTool;