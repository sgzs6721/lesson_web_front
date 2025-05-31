# Stagewise 开发工具集成

## 概述
已成功将 Stagewise 开发工具集成到本项目中，提供AI驱动的编辑能力。

## 功能特性
- 🎯 浏览器工具栏：直接在网页上选择元素并添加注释
- 🤖 AI代理：基于上下文让AI代理在代码编辑器中进行修改
- 🔧 开发模式专用：仅在开发环境中运行，不影响生产构建

## 集成详情

### 安装的包
```bash
npm install @stagewise/toolbar-react --save-dev
```

### 集成文件
1. **工具栏配置**: `src/utils/stagewise.tsx`
   - 包含stagewise配置和初始化逻辑
   - 创建独立的React根来渲染工具栏
   - 仅在开发模式下激活

2. **主入口点**: `src/main.tsx`
   - 导入并初始化stagewise工具栏
   - 在应用启动后自动激活工具栏

### 使用方法
1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 打开浏览器访问应用
3. 工具栏将自动出现在页面上（仅开发模式）
4. 选择页面元素，添加注释，让AI代理进行相应的代码修改

### 环境检查
- ✅ 开发模式：工具栏自动加载
- ✅ 生产构建：工具栏不会包含在构建中
- ✅ 无语法错误：TypeScript编译通过
- ✅ 无冲突：独立React根避免与主应用冲突

## 注意事项
- 工具栏只在 `NODE_ENV === 'development'` 时加载
- 使用独立的React根来避免与主应用状态冲突
- 所有stagewise相关代码都在开发依赖中，不会影响生产包大小

## 故障排除
如果工具栏没有出现：
1. 确认当前环境是开发模式
2. 检查浏览器控制台是否有错误
3. 确认看到 "🚀 Stagewise toolbar initialized in development mode" 日志 