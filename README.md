# 培训机构管理系统前端

基于 React、Ant Design、TypeScript 的培训机构管理系统前端部分。

## 功能特性

- 📊 数据看板 - 直观展示核心业务指标
- 👥 学员管理 - 学员档案、课程记录、考勤、缴费管理
- 📚 课程管理 - 课程设置、排课、班级管理
- 👨‍🏫 教练管理 - 教练档案、排班、考核
- 🏢 校区管理 - 多校区数据管理
- 📅 排课管理 - 灵活的课表安排
- 📋 考勤管理 - 学员和教练的考勤记录
- 💰 收支管理 - 费用收取与支出管理
- 📊 数据统计 - 业务数据多维度分析
- ⚙️ 系统设置 - 权限、学期、角色等系统配置

## 技术栈

- 框架：React 18
- UI 组件库：Ant Design 5
- 状态管理：Redux Toolkit
- 路由：React Router 6
- 类型系统：TypeScript
- 构建工具：Vite
- HTTP 请求：Axios
- 代码规范：ESLint + Prettier

## 开发指南

### 环境要求

- Node.js 16+
- npm 8+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
# 或
yarn
```

### 开发环境启动

```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 代码规范检查

```bash
npm run lint
# 或
yarn lint
```

## 项目结构

```
src/
├── api/              # API接口
├── assets/           # 静态资源
│   ├── images/       # 图片资源
│   └── styles/       # 样式文件
├── components/       # 通用组件
├── config/           # 配置文件
├── hooks/            # 自定义Hooks
├── layouts/          # 布局组件
├── pages/            # 页面组件
├── redux/            # Redux状态管理
│   ├── slices/       # Redux切片
│   └── store.ts      # Redux存储配置
├── router/           # 路由配置
├── types/            # 类型定义
├── utils/            # 工具函数
├── App.tsx           # 应用入口组件
└── main.tsx          # 应用入口文件
```

## 开发规范

本项目遵循阿里巴巴前端编码规约，主要规范点：

1. 组件文件使用 PascalCase 命名（如 UserList.tsx）
2. 工具函数等非组件文件使用 camelCase 命名（如 formatDate.ts）
3. 样式文件使用连字符命名（如 user-profile.scss）
4. 组件属性按字母顺序排序
5. 使用 ESLint + Prettier 确保代码风格一致
6. 使用 TypeScript 类型系统，避免使用 any 类型
7. 按功能模块组织代码，而非技术角色

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的变更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建一个 Pull Request

## 许可协议

本项目采用 MIT 许可协议。详见 [LICENSE](LICENSE) 文件。
