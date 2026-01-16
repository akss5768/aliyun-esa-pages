import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';

const MD5Tool = () => {
  const [inputText, setInputText] = useState('');
  const [hashedText, setHashedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // 引入 crypto-js 的 MD5 功能
  const [CryptoJS, setCryptoJS] = useState(null);
  
  useEffect(() => {
    import('crypto-js').then(module => {
      setCryptoJS(module.default || module);
    }).catch(() => {
      setError('加密库加载失败，请刷新页面重试');
    });
  }, []);

  const generateMD5 = () => {
    if (!CryptoJS) {
      setError('加密库未加载');
      return;
    }

    try {
      if (inputText.trim()) {
        const hash = CryptoJS.MD5(inputText).toString();
        setHashedText(hash);
        setError('');
        saveToHistory(inputText, hash);
      } else {
        setHashedText('');
        setError('');
      }
    } catch (err) {
      setError('MD5 生成失败: ' + err.message);
      setHashedText('');
    }
  };

  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'md5',
      toolName: 'MD5生成',
      input: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      output: output.substring(0, 50) + (output.length > 50 ? '...' : ''),
      timestamp: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...history.slice(0, 9)]; // 保留最近10条记录
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };

  const copyToClipboard = async () => {
    if (hashedText) {
      try {
        await navigator.clipboard.writeText(hashedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('无法复制到剪贴板', err);
      }
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    setError('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateMD5();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">MD5 生成器</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                输入文本
              </label>
              <button
                onClick={generateMD5}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                生成 MD5
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="在此输入您想要生成 MD5 的文本..."
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
                MD5 结果
              </label>
              {hashedText && (
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
              {hashedText || (
                <p className="text-gray-500 dark:text-gray-400 h-full flex items-center">
                  {inputText ? 'MD5 哈希值将显示在这里' : '请输入文本以生成 MD5'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">关于 MD5</h3>
        <div className="text-gray-600 dark:text-gray-300 space-y-2 text-sm">
          <p>MD5（Message-Digest Algorithm 5）是一种广泛使用的哈希函数，可产生一个 128 位（16 字节）的哈希值。</p>
          <p>MD5 常用于：</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>验证数据完整性</li>
            <li>密码存储（虽然不再推荐用于安全目的）</li>
            <li>数字签名应用</li>
          </ul>
          <p className="pt-2"><strong>注意：</strong>MD5 不再被认为是加密安全的，不应在需要抗碰撞性的场景中使用。</p>
        </div>
      </div>
    </div>
  );
};

export default MD5Tool;