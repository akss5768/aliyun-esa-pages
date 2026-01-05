import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, FolderOpen, Sparkles, Heart, Shield, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            <span className="block">管理您的卡牌收藏</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
              构建专属卡牌世界
            </span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-600">
            一站式卡牌收藏管理平台，支持多种卡牌类型，AI辅助创作，随时随地展示您的收藏。
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/cards"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
            >
              开始使用
            </Link>
            <Link
              to="/ai-generator"
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-colors duration-300"
            >
              AI生成
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              强大功能
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              专为卡牌收藏爱好者设计的功能
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <LayoutGrid className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">多类型卡牌支持</h3>
                <p className="text-gray-600">
                  支持游戏卡牌、收藏卡牌、身份卡牌、技能卡牌、道具卡牌等多种类型，满足不同需求。
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">卡牌组管理</h3>
                <p className="text-gray-600">
                  创建和管理多个卡牌组，方便组织和展示您的卡牌收藏，支持公开分享。
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI辅助生成</h3>
                <p className="text-gray-600">
                  基于自然语言描述快速生成卡牌，智能调整属性和图像，大幅提升创作效率。
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">个性化标签</h3>
                <p className="text-gray-600">
                  为卡牌添加自定义标签，方便分类和搜索，让您的收藏井井有条。
                </p>
              </div>
              
              {/* Feature 5 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">云端同步</h3>
                <p className="text-gray-600">
                  所有数据云端存储，多设备同步，随时随地访问和管理您的卡牌收藏。
                </p>
              </div>
              
              {/* Feature 6 */}
              <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">响应式设计</h3>
                <p className="text-gray-600">
                  完美适配桌面、平板和手机设备，随时随地管理您的卡牌收藏。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-800 to-purple-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">准备好开始管理您的卡牌收藏了吗？</span>
            <span className="block text-indigo-200">立即创建您的专属卡牌库。</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/cards"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                开始使用
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;