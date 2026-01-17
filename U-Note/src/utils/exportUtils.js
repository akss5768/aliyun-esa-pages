/**
 * 笔记导出工具函数
 */

// 导出为JSON格式
export const exportAsJson = (notes) => {
  const dataStr = JSON.stringify(notes, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `u-note-backup-${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// 导出为文本格式
export const exportAsText = (notes) => {
  let textContent = '# U-Note 笔记备份\n\n';
  
  notes.forEach((note, index) => {
    textContent += `## 笔记 ${index + 1}: ${note.title}\n`;
    textContent += `更新时间: ${note.updatedAt}\n\n`;
    textContent += `${note.content}\n\n`;
    textContent += '---\n\n';
  });
  
  const dataStr = textContent;
  const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `u-note-text-${new Date().toISOString().slice(0, 10)}.txt`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// 导出为Markdown格式
export const exportAsMarkdown = (notes) => {
  let markdownContent = '# U-Note 笔记备份\n\n';
  
  notes.forEach((note, index) => {
    markdownContent += `# ${note.title}\n`;
    markdownContent += `*更新时间: ${note.updatedAt}*\n\n`;
    markdownContent += `${note.content}\n\n`;
    markdownContent += '---\n\n';
  });
  
  const dataStr = markdownContent;
  const dataUri = 'data:text/markdown;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `u-note-markdown-${new Date().toISOString().slice(0, 10)}.md`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};