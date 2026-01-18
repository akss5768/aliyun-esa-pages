# 千年商旅 - 古代商业模拟游戏

千年商旅是一款沉浸式的古代商业模拟游戏，让玩家穿越到中国古代的不同朝代，体验经商贸易的乐趣。游戏包含多个历史时期，丰富的贸易系统，以及随机事件系统。

## 声明

本项目由阿里云ESA提供加速、计算和保护  
![阿里云ESA](aliyun.png)


## 功能特性

- **多朝代选择** - 可选择唐朝、宋朝、明朝、清朝等不同历史时期的背景
- **地域特色** - 江南水乡、塞外边疆、中原腹地等不同地域带来独特的贸易体验
- **职业系统** - 绸缎铺老板、茶商、药材商、书商、瓷器商等不同职业各有特色
- **属性管理** - 财富值、心情值、健康值三大属性影响游戏进程
- **市场交易** - 实时市场行情，买卖稻米、丝绸、陶器等商品
- **随机事件** - 边关战事、洪涝灾害、朝廷新政、传统佳节等随机事件影响游戏进程
- **本地数据存储** - 使用浏览器 localStorage 保存游戏进度，无需服务器
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
cd U-SimpleGame
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
│   ├── game/            # 游戏相关组件
│   │   ├── EventModal.jsx      # 事件弹窗组件
│   │   ├── MarketPanel.jsx     # 市场面板组件
│   │   └── StatusBars.jsx      # 状态栏组件
│   └── ui/              # UI基础组件
│       ├── Button.jsx          # 按钮组件
│       ├── Card.jsx            # 卡片组件
│       └── Dialog.jsx          # 对话框组件
├── pages/               # 页面组件
│   ├── CharacterCreation.jsx   # 角色创建页面
│   ├── DynastySelection.jsx    # 朝代选择页面
│   └── GameMain.jsx           # 游戏主页面
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
- **存储内容**: 游戏进度、角色属性、市场行情等数据

游戏数据完全保存在本地浏览器中，无需服务器支持。

## 数据结构

项目当前使用浏览器 localStorage 存储游戏数据：

- `selectedDynasty` - 玩家选择的朝代
- `character` - 角色信息（地区、职业等）
- `gameState` - 游戏状态（财富值、心情值、健康值、回合数）
- `market` - 市场行情数据

所有数据均保存在浏览器本地存储中，无需服务器支持。

## 配置数据文件

项目中的静态数据已拆分为独立的JSON文件，位于 `src/data/` 目录下，以提高可维护性：

- `dynasties.json` - 朝代配置数据，包含各朝代的ID、名称、描述和背景图片路径
- `regions.json` - 地区配置数据，包含不同地区的ID、名称、描述、价格调节器等信息
- `professions.json` - 职业配置数据，包含各职业的初始属性加成（财富、心情、健康）和图片路径
- `items.json` - 商品配置数据，包含游戏中各类商品的基础价格、库存和图片路径
- `events.json` - 事件配置数据，包含随机事件的标题、描述、影响效果和图片路径

这些数据文件采用模块化设计，便于调整游戏平衡性和扩展新内容。

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