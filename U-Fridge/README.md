# U-Fridge 冰箱物品管理系统

U-Fridge 是一个现代化的冰箱物品管理平台，允许用户添加、组织和管理冰箱中的各类食品。支持拍照识别、保质期跟踪、分类管理等功能。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)


## 功能特性

- **拍照识别添加** - 通过拍照快速添加冰箱物品
- **保质期跟踪** - 自动计算和显示物品保质期
- **多类别管理** - 支持蔬菜、水果、乳制品、饮料、肉类等多种食品分类
- **本地数据存储** - 使用浏览器 localStorage 进行数据存储，无需服务器
- **响应式设计** - 完美适配桌面、平板和手机设备

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS
- **状态管理**: React Hooks
- **数据存储**: LocalStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 环境要求

- Node.js >= 18.0.0 (推荐使用 Node.js >= 20.0.0 以获得最佳 localStorage 支持)
- npm 或 yarn

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd U-Fridge
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

项目当前使用浏览器 localStorage 进行数据存储，无需额外配置。数据操作直接在组件中完成。

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
│   ├── ui/              # UI基础组件
│   │   ├── Button.jsx   # 按钮组件
│   │   ├── Label.jsx    # 标签组件
│   │   └── Select.jsx   # 选择框组件
│   ├── Header.jsx       # 顶部导航组件
│   └── ItemCard.jsx     # 物品卡片组件
├── pages/               # 页面组件
│   ├── Home.jsx         # 首页
│   ├── ItemDetail.jsx   # 物品详情页
│   ├── Notifications.jsx # 通知页面
│   └── Upload.jsx       # 上传页面
├── utils/               # 工具函数
│   └── dateUtils.js     # 日期处理工具
├── App.jsx              # 主应用组件
└── index.jsx            # 应用入口文件
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
- **兼容性**: `src/lib/localStorage.js` 文件仅作为兼容性保留，实际数据操作使用本地存储

如需使用后端服务，请替换 `src/lib/localStorage.js` 中的实现。

## 数据结构

项目当前使用浏览器 localStorage 存储冰箱物品数据，数据结构包括：

- `fridgeItems` - 冰箱物品数组，包含物品名称、类别、添加日期、过期日期、备注等信息

数据直接存储在浏览器的localStorage中，无需服务器。

## 开发

### 添加新功能

1. 在 `src/pages/` 中创建新页面组件
2. 在 `src/App.jsx` 中添加路由
3. 如需要，创建相应的组件和 Hook

### 自定义样式

样式使用 Tailwind CSS 定义，可以在 `src/index.css` 中添加自定义样式，在 `tailwind.config.js` 中扩展配置。

## 故障排除

### Node.js 版本问题

虽然项目使用 localStorage 而非 localStorage，但某些依赖可能仍需要较新版本的 Node.js。如果遇到构建错误，建议升级到 Node.js 18.0.0 或更高版本。

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