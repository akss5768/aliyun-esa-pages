# 键盘测试工具 部署指南

## 部署概述

键盘测试工具是一个单页应用(SPA)，使用 React 构建。这意味着部署非常简单，只需将构建后的静态文件托管到任何静态网站托管服务即可。

## 构建项目

在部署之前，您需要先构建项目：

```bash
npm run build
```

构建后的文件将位于 `dist/` 目录中，这些文件是纯静态资源，可以托管到任何静态托管服务。

## 部署选项

### 1. 阿里云ESA (推荐)

项目已预配置为支持阿里云ESA部署，配置文件 `esa.jsonc` 包含以下设置：

```json
{
    "name": "keyboard-tester",
    "installCommand": "npm install",
    "assets": {
        "directory": "./dist",
        "notFoundStrategy": "singlePageApplication"
    }
}
```

要部署到阿里云ESA：
1. 确保项目已推送到配置的 Git 仓库
2. ESA 会自动检测变更并执行 `npm install` 和 `npm run build`
3. 构建后的文件将自动部署到 `./dist` 目录

### 2. Vercel

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

### 3. Netlify

1. 安装 Netlify CLI:
```bash
npm install -g netlify-cli
```

2. 部署项目:
```bash
netlify deploy --prod
```

或者通过 Netlify 仪表板拖放 `dist` 目录中的文件。

### 4. GitHub Pages

1. 构建项目:
```bash
npm run build
```

2. 将 `dist` 目录中的内容推送到 GitHub 仓库的 `gh-pages` 分支，或使用 `gh-pages` 包：
```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

### 5. 自托管

将 `dist` 目录中的文件部署到您的 Web 服务器。确保服务器配置正确处理单页应用的路由（将所有路由重定向到 index.html）。

## 重要注意事项

### 路由配置
键盘测试工具是单一页面应用，没有复杂的路由配置，这使得应用可以作为静态网站运行而无需后端路由支持。

### HTTPS
建议在生产环境中使用 HTTPS，因为现代浏览器的安全策略要求在安全上下文中才能监听键盘事件。

## 自定义部署

如需对应用进行定制：

1. 修改源代码
2. 重新构建项目

## 故障排除

### 部署后页面空白
- 确保服务器正确提供静态文件
- 检查浏览器控制台是否有错误信息

### 路由问题
- 确保服务器将所有路由重定向到 `index.html`
- 检查是否存在 404 错误

### 构建错误
- 确保 Node.js 版本 >= 18.0.0
- 清理依赖并重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
```