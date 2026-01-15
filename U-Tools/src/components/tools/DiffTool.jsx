import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const DiffTool = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [diffResult, setDiffResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // 简单的文本对比算法
  const compareTexts = () => {
    if (!text1.trim() && !text2.trim()) {
      setDiffResult('请输入要对比的文本');
      return;
    }
    
    // 按行分割文本
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    
    // 简单的行对比
    const maxLength = Math.max(lines1.length, lines2.length);
    let differences = [];
    let hasDifferences = false;
    
    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 !== line2) {
        hasDifferences = true;
        differences.push({
          lineNumber: i + 1,
          text1: line1,
          text2: line2
        });
      }
    }
    
    if (!hasDifferences) {
      setDiffResult('两个文本内容完全相同');
    } else {
      const result = `发现 ${differences.length} 处差异:\n\n` + 
        differences.map(diff => 
          `第${diff.lineNumber}行:\n` +
          `  文本1: ${diff.text1}\n` +
          `  文本2: ${diff.text2}\n`
        ).join('\n');
      
      setDiffResult(result);
    }
    
    saveToHistory(
      `文本1: ${text1.substring(0, 30)}...\n文本2: ${text2.substring(0, 30)}...`, 
      hasDifferences ? `发现 ${differences.length} 处差异` : '文本相同'
    );
  };
  
  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'diff',
      toolName: '文本对比',
      input,
      output,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(updatedHistory));
  };
  
  const copyToClipboard = () => {
    if (diffResult) {
      navigator.clipboard.writeText(diffResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">文本1</label>
          <textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="输入第一个文本"
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">文本2</label>
          <textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="输入第二个文本"
            className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />
        </div>
      </div>
      
      <button 
        onClick={compareTexts}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        对比文本
      </button>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">对比结果</label>
          {diffResult && (
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
          {diffResult || '对比结果将显示在这里'}
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">使用说明</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          该工具可以对比两段文本的差异，按行进行比较。适用于代码对比、配置文件对比等场景。
        </p>
      </div>
    </div>
  );
};

export default DiffTool;