import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 mb-2">
          <span>© 2026 U-Tools. All rights reserved.</span>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">关于</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">反馈</a>
          <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a>
        </div>
        <p className="text-xs mt-2">专为开发者打造的U-Tools一站式在线工具平台</p>
      </div>
    </footer>
  );
};

export default Footer;