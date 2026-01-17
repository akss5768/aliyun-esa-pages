# U-Note 轻量级笔记管理系统

U-Note 是一个现代化的轻量级笔记管理平台，允许用户创建、组织和管理个人笔记。基于浏览器localStorage实现数据存储，无需服务器，完全轻量化设计。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)


## 功能特性

- **轻量级设计** - 无后端依赖，纯前端SPA应用，体积小巧
- **本地数据存储** - 使用浏览器 localStorage 进行数据存储，安全可靠
- **响应式设计** - 完美适配桌面、平板和手机设备
- **便捷编辑** - 支持笔记的增删改查功能
- **快速部署** - 静态文件部署，一键发布
- **隐私保护** - 数据完全存储在本地，无需担心云端泄露

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS
- **状态管理**: React Hooks
- **存储方案**: 浏览器localStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 环境要求

- Node.js >= 18.0.0 (推荐使用 Node.js >= 20.0.0 以获得最佳 localStorage 支持)
- npm 或 yarn

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd U-Note
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

项目当前使用浏览器 localStorage 进行数据存储，无需额外配置。`src/lib/localStorage.js` 文件仅作为兼容性保留，实际数据操作使用本地存储。

### 4. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:3000` 启动。

### 5. 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中。

### 6. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用的UI组件
│   ├── Header.jsx       # 头部导航组件
│   └── NoteCard.jsx     # 笔记卡片组件
├── pages/              # 页面组件
│   ├── NoteDetailPage.jsx  # 笔记详情页面
│   ├── NoteEditPage.jsx    # 笔记编辑页面
│   └── NoteListPage.jsx    # 笔记列表页面
├── App.jsx             # 主应用组件
└── index.jsx           # 应用入口文件
```

## 部署

### 部署到静态托管服务

1. 构建生产版本:

```bash
npm run build
```

2. 将 `dist/` 目录中的文件部署到您的静态托管服务（如 Netlify、Vercel、GitHub Pages 等）

### 部署到阿里云ESA

项目已配置为可在阿里云ESA平台部署，配置文件 `esa.jsonc` 定义了部署参数：

- **构建命令**: `npm install`
- **构建输出目录**: `./dist`
- **404处理策略**: 单页应用模式

要部署到阿里云ESA，只需将项目推送到配置的仓库，ESA将自动构建和部署。

### 部署到 Vercel

1. 安装 Vercel CLI:

```bash
npm i -g vercel
```

2. 登录 Vercel:

```bash
vercel login
```

3. 部署项目:

```bash
vercel --prod
```

注意：由于项目使用 localStorage，部署后数据将按浏览器隔离存储。如需共享数据，需配置后端服务。

### 部署到 Netlify

1. 在项目根目录创建 `netlify.toml` 文件:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  environment = { NODE_VERSION = "18" }
```

2. 使用 Netlify CLI 部署:

```bash
netlify deploy --prod
```

注意：由于项目使用 localStorage，部署后数据将按浏览器隔离存储。如需共享数据，需配置后端服务。

## 数据存储配置

本项目使用浏览器 localStorage 作为数据存储方案。当前配置信息如下：

- **存储方案**: 浏览器 localStorage
- **安全性**: 数据仅保存在用户本地浏览器，不会上传至任何服务器

如需使用后端服务，可扩展数据存储实现。

## 特色亮点

项目采用轻量化设计，所有数据均存储在浏览器本地，具有以下优势：

- **隐私安全** - 所有数据仅在用户本地浏览器中存储
- **快速加载** - 无需网络请求，响应迅速
- **离线可用** - 不依赖网络连接，随时访问笔记
- **零部署成本** - 仅需部署静态文件

## 轻量化使用场景

U-Note的轻量化设计使其适用于多种实际场景：

- **临时记录** - 快速记录想法、待办事项、灵感等，无需注册账号
- **隐私笔记** - 记录私密信息，如密码提示、个人信息等，数据仅保存在本地
- **会议纪要** - 现场记录会议要点，离线也可随时查阅
- **学习笔记** - 整理课堂或自学内容，支持Markdown格式
- **旅行规划** - 制定行程安排，无需担心网络状况
- **密码管理** - 保存账户信息提示（不建议保存真实密码）
- **知识整理** - 汇总各类知识点，形成个人知识库
- **创意收集** - 随时捕捉创意想法，避免遗忘
- **读书笔记** - 记录阅读心得和摘录
- **代码片段** - 保存常用代码片段和备忘清单

这种轻量化设计让U-Note成为一款随时随地可用的个人笔记助手，无需担心服务器宕机或服务停止运营的问题。

## 开发

### 添加新功能

1. 在 `src/pages/` 中创建新页面组件
2. 在 `src/App.jsx` 中添加路由
3. 如需要，创建相应的组件和 Hook

### 自定义样式

样式使用 Tailwind CSS 定义，可以在 `src/index.css` 中添加自定义样式，在 `tailwind.config.js` 中扩展配置。

## 故障排除

### Node.js 版本问题

项目使用 localStorage 进行数据存储，某些依赖可能仍需要较新版本的 Node.js。如果遇到构建错误，建议升级到 Node.js 18.0.0 或更高版本。

### 依赖安装问题

如果安装依赖时遇到问题，尝试清理缓存:

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 构建错误

如果构建时出现错误，检查控制台输出以定位问题，通常需要检查 JavaScript 语法错误或导入/导出问题。

## 许可证


该项目遵循以下协议 [MIT license](https://opensource.org/licenses/MIT).