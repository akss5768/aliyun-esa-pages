import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CrontabTool = () => {
  const [expression, setExpression] = useState('* * * * *');
  const [timezone, setTimezone] = useState('Asia/Shanghai');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  
  // 简化的Crontab解析（实际应用中可使用cron-parser库）
  const parseCrontab = () => {
    if (!expression.trim()) {
      setResult('请输入Crontab表达式');
      return;
    }
    
    const parts = expression.trim().split(' ');
    if (parts.length !== 5) {
      setResult('Crontab表达式格式不正确，请使用5个字段的格式');
      return;
    }
    
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    
    // 简单的解释
    const explanation = `该定时任务将在以下时间执行：\n` +
      `- 分钟: ${minute}\n` +
      `- 小时: ${hour}\n` +
      `- 每月第几天: ${dayOfMonth}\n` +
      `- 月份: ${month}\n` +
      `- 每周第几天: ${dayOfWeek}\n\n` +
      `时区: ${timezone}`;
    
    // 模拟计算下次执行时间（实际应用中可使用node-cron或cronstrue库）
    const nextExecutions = `\n下次执行时间（模拟）:\n` +
      `- ${(new Date(Date.now() + 60000)).toLocaleString('zh-CN', { timeZone: timezone })}\n` +
      `- ${(new Date(Date.now() + 120000)).toLocaleString('zh-CN', { timeZone: timezone })}\n` +
      `- ${(new Date(Date.now() + 180000)).toLocaleString('zh-CN', { timeZone: timezone })}`;
    
    const fullResult = explanation + nextExecutions;
    setResult(fullResult);
    saveToHistory(expression, fullResult);
  };
  
  const saveToHistory = (input, output) => {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    const newEntry = {
      toolId: 'crontab',
      toolName: 'Crontab计算',
      input: `${input} (${timezone})`,
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
      <div>
        <label className="block text-sm font-medium mb-2">Crontab表达式</label>
        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="* * * * *"
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
        />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          格式: 分钟 小时 每月第几天 月份 每周第几天
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">时区</label>
        <select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option>
          <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
          <option value="Europe/London">Europe/London (UTC+0)</option>
          <option value="America/New_York">America/New_York (UTC-5)</option>
          <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
        </select>
      </div>
      
      <button 
        onClick={parseCrontab}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        解析Crontab
      </button>
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">解析结果</label>
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
        
        <div className="w-full h-60 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 font-mono text-sm overflow-auto whitespace-pre">
          {result || '解析结果将显示在这里'}
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium mb-2">Crontab表达式说明:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>* - 匹配任意值</li>
          <li>, - 分隔多个值 (例: 1,3,5)</li>
          <li>- - 范围 (例: 1-5)</li>
          <li>/ - 步长 (例: */5 每5个单位)</li>
          <li>示例: 0 9 * * 1 = 每周一上午9点执行</li>
        </ul>
      </div>
    </div>
  );
};

export default CrontabTool;