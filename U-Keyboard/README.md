# 键盘测试工具

键盘测试工具是一个现代化的键盘检测应用，用于实时检测按键状态、识别故障按键、测试响应速度和连击性能。支持多种键盘布局，提供详细的按键分析功能。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)


## 功能特性

- **实时按键检测** - 检测所有按键的按下和释放状态
- **故障按键识别** - 标识无法正常工作的按键
- **响应速度测试** - 测量按键响应时间
- **连击性能测试** - 测试快速连续按键的性能
- **多种键盘布局** - 支持标准键盘布局及自定义布局
- **详细结果分析** - 提供按键历史记录和性能分析

## 技术栈

- **前端框架**: React 18
- **UI样式**: Tailwind CSS
- **状态管理**: React Hooks
- **构建工具**: Vite
- **图标库**: Lucide React

## 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd keyboard-tester
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中。

### 5. 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 可复用的UI组件
│   ├── KeyboardLayout.jsx  # 键盘布局组件
│   ├── LayoutSelector.jsx  # 布局选择组件
│   └── TestResults.jsx     # 测试结果组件
├── utils/               # 工具库
│   └── keyboardLayouts.js  # 键盘布局定义
├── App.jsx              # 主应用组件
├── index.css            # 全局样式
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

## 使用方法

1. 打开应用
2. 选择键盘布局
3. 选择测试模式（按键检测、响应速度、连击测试）
4. 按键盘上的任意键进行测试
5. 观察测试结果和按键状态

## 开发

### 添加新功能

1. 在 `src/components/` 中创建新组件
2. 在 `src/App.jsx` 中集成新功能
3. 如需要，创建相应的工具函数

### 自定义样式

样式使用 Tailwind CSS 定义，可以在 `src/index.css` 中添加自定义样式，在 `tailwind.config.js` 中扩展配置。

## 故障排除

### Node.js 版本问题

如果遇到构建错误，建议升级到 Node.js 18.0.0 或更高版本。

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