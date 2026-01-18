# U-Tools 开发者工具箱

U-Tools 是一个一站式的开发者工具平台，提供多种实用工具，包括JSON格式化、时间戳转换、正则表达式测试、UUID生成、JWT解析、文本对比等。免安装、免注册，即开即用。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)


## 功能特性

- **JSON校验与格式化** - 校验JSON语法并美化格式化显示
- **时间戳转换** - Unix时间戳与日期时间相互转换
- **Crontab解析** - 解析和计算定时任务执行时间
- **正则表达式测试** - 实时测试正则表达式的匹配结果
- **UUID生成** - 生成标准格式的UUID字符串
- **JWT解析** - 解析和验证JWT Token内容
- **文本对比** - 高亮显示两段文本的差异
- **响应式设计** - 完美适配桌面、平板和手机设备

## 技术栈

- **前端框架**: React 18
- **路由**: React Router
- **UI样式**: Tailwind CSS
- **状态管理**: React Hooks
- **数据库**: LocalStorage
- **构建工具**: Vite
- **图标库**: Lucide React

## 环境要求

- Node.js >= 18.0.0 (推荐使用 Node.js >= 20.0.0 以获得最佳 localStorage 支持)
- npm 或 yarn

## 安装和启动

### 1. 克隆项目

```bash
git clone <repository-url>
cd U-Tools
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
│   ├── tools/           # 工具组件
│   │   ├── JSONTool.jsx # JSON校验与格式化工具
│   │   ├── TimestampTool.jsx # 时间戳转换工具
│   │   ├── CrontabTool.jsx # Crontab解析工具
│   │   ├── RegexTool.jsx # 正则表达式测试工具
│   │   ├── UUIDTool.jsx # UUID生成工具
│   │   ├── JWTTool.jsx # JWT解析工具
│   │   └── DiffTool.jsx # 文本对比工具
│   ├── Header.jsx       # 顶部导航栏
│   └── Footer.jsx       # 底部信息
├── pages/              # 页面组件
│   ├── Home.jsx        # 首页
│   ├── ToolPage.jsx    # 工具页面
│   ├── Favorites.jsx   # 收藏页面
│   └── History.jsx     # 历史记录页面
├── App.jsx             # 主应用组件
├── index.css           # 全局样式
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

- **项目名称**: U-Tools
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

本项目使用浏览器 localStorage 作为数据存储方案，用于保存用户的收藏和使用历史。当前配置信息如下：

- **存储方案**: 浏览器 localStorage
- **存储内容**: 用户收藏的工具列表和工具使用历史

## 功能数据结构

项目当前使用浏览器 localStorage 存储用户数据：

- `favorites` - 用户收藏的工具ID列表
- `toolHistory` - 用户工具使用历史记录
- `tool-[toolId]-restore` - 各工具的恢复数据

数据按工具类型分别存储，保证用户可以随时恢复之前的工具使用状态。

## 开发

### 添加新功能

1. 在 `src/components/tools/` 中创建新工具组件
2. 在 `src/pages/ToolPage.jsx` 中注册新工具
3. 在 `src/pages/Home.jsx` 的工具列表中添加新工具
4. 如需要，更新路由配置

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