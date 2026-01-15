import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const RegexTool = () => {
  const [pattern, setPattern] = useState('');
  const [text, setText] = useState('');
  const [flags, setFlags] = useState('g');
  const [result, setResult] = useState('');
  const [matches, setMatches] = useState([]);
  const [copied, setCopied] = useState(false);
  
  const testRegex = () => {
    if (!pattern || !text) {
      setResult('请输入正则表达式和测试文本');
      setMatches([]);
      return;
    }
    
    try {
      const regex = new RegExp(pattern, flags);
      const matchResult = text.match(regex);
      
      if (matchResult) {
        const matchArray = [...text.matchAll(new RegExp(pattern, flags))];
        setMatches(matchArray);
        
        const resultText = `匹配成功!
匹配项数量: ${matchArray.length}

匹配详情:
` + 
          matchArray.map((match, index) => 
            `匹配 ${index + 1}: "${match[0]}" (位置: ${match.index})`
          ).join('\n');
        
        setResult(resultText);
        saveToHistory(`${pattern} (${flags})`, text, resultText);
      } else {
        setResult('未找到匹配项');
        setMatches([]);
        saveToHistory(`${pattern} (${flags})`, text, '未找到匹配项');
      }
    } catch (error) {
      setResult(`正则表达式错误: ${error.message}`);
      setMatches([]);
    }
  };
  
  const saveToHistory = (pattern, text, result) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'regex',
      toolName: '正则表达式测试',
      input: `Pattern: ${pattern}\nText: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
      output: result,
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
          <label className="block text-sm font-medium mb-2">正则表达式</label>
          <div className="flex flex-col sm:flex-row">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                /
              </span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="输入正则表达式"
                className="flex-grow p-3 border border-gray-300 dark:border-gray-600 border-r-0 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
              <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                /{flags}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">标志</label>
          <div className="flex flex-wrap gap-3">
            {['g', 'i', 'm', 's', 'u', 'y'].map((flag) => (
              <label key={flag} className="flex items-center">
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFlags(flags + flag);
                    } else {
                      setFlags(flags.replace(flag, ''));
                    }
                  }}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>{flag}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">测试文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="输入要测试的文本"
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button 
        onClick={testRegex}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        测试正则表达式
      </button>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">匹配结果</label>
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
          {result || '匹配结果将显示在这里'}
        </div>
      </div>
      
      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">匹配详情</label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">匹配项</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">位置</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">内容</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {matches.map((match, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{index + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{match.index}</td>
                    <td className="px-4 py-2 text-sm font-mono text-gray-900 dark:text-gray-100">{match[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegexTool;