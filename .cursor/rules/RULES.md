# 课时管理系统前端开发规范

本文档定义了课时管理系统前端项目的开发规范和最佳实践，所有开发人员必须遵循这些规则以确保代码质量和一致性。

## 目录

1. [项目结构](#1-项目结构)
2. [命名规范](#2-命名规范)
3. [TypeScript 规范](#3-typescript-规范)
4. [React 组件规范](#4-react-组件规范)
5. [状态管理规范](#5-状态管理规范)
6. [UI/UX 规范](#6-uiux-规范)
7. [API 集成规范](#7-api-集成规范)
8. [性能优化规范](#8-性能优化规范)
9. [测试规范](#9-测试规范)
10. [Git 工作流规范](#10-git-工作流规范)

## 1. 项目结构

### 1.1 目录结构

项目必须遵循以下目录结构：

```
src/
├── api/               # API 集成
│   ├── auth/          # 认证相关 API
│   ├── campus/        # 校区管理 API
│   ├── coach/         # 教练管理 API
│   ├── course/        # 课程管理 API
│   ├── student/       # 学生管理 API
│   └── ...
├── assets/            # 静态资源
│   ├── images/        # 图片资源
│   ├── styles/        # 全局样式
│   └── js/            # JavaScript 工具
├── components/        # 可复用组件
├── contexts/          # React 上下文
├── hooks/             # 自定义 React Hooks
├── layouts/           # 布局组件
├── pages/             # 页面组件
│   ├── dashboard/     # 仪表盘页面
│   ├── campus/        # 校区管理
│   ├── coach/         # 教练管理
│   ├── course/        # 课程管理
│   ├── student/       # 学生管理
│   ├── schedule/      # 排课管理
│   ├── statistics/    # 统计报表
│   ├── settings/      # 系统设置
│   └── ...
├── redux/             # Redux 状态管理
│   ├── slices/        # Redux slices
│   └── store.ts       # Redux store 配置
├── router/            # 路由配置
├── types/             # TypeScript 类型定义
├── utils/             # 工具函数
├── App.tsx            # 根组件
└── main.tsx           # 应用入口点
```

### 1.2 模块化原则

- 每个功能模块应该有自己的目录，包含相关的组件、hooks、工具函数和类型定义
- 页面级组件应放在 `pages` 目录下
- 可复用组件应放在 `components` 目录下
- 每个页面模块应遵循以下结构：

```
pages/student/
├── components/        # 页面特定组件
├── hooks/             # 页面特定 hooks
├── utils/             # 页面特定工具函数
├── types/             # 页面特定类型定义
├── constants/         # 页面特定常量
├── StudentManagement.tsx  # 主页面组件
└── index.css          # 页面样式
```

## 2. 命名规范

### 2.1 文件命名

- **React 组件文件**：使用 PascalCase（首字母大写），例如 `StudentTable.tsx`
- **Hook 文件**：使用 camelCase（首字母小写）并以 `use` 开头，例如 `useStudentData.ts`
- **工具函数文件**：使用 camelCase，例如 `formatDate.ts`
- **类型定义文件**：使用 camelCase，例如 `student.ts`
- **样式文件**：与对应组件同名，例如 `StudentTable.css`
- **测试文件**：与被测试文件同名，后缀为 `.test.tsx` 或 `.spec.tsx`，例如 `StudentTable.test.tsx`

### 2.2 变量命名

- 使用有意义的、描述性的名称
- 布尔变量应以 `is`、`has`、`can` 等前缀开头，例如 `isLoading`、`hasError`
- 事件处理函数应以 `handle` 开头，例如 `handleSubmit`、`handleChange`
- 回调函数应以 `on` 开头，例如 `onSubmit`、`onChange`
- 私有变量和方法应以下划线 `_` 开头，例如 `_privateMethod`

### 2.3 组件命名

- 组件名应使用 PascalCase
- 组件名应具有描述性，表明其用途
- 高阶组件应以 `with` 开头，例如 `withAuth`
- 容器组件应以 `Container` 结尾，例如 `StudentContainer`
- 页面组件应以 `Page` 或 `Management` 结尾，例如 `StudentManagement`

### 2.4 常量命名

- 全局常量应使用全大写字母，单词间用下划线分隔，例如 `API_HOST`
- 枚举值应使用全大写字母，例如 `UserRole.ADMIN`

## 3. TypeScript 规范

### 3.1 类型定义

- 所有变量、函数参数和返回值都应该有明确的类型定义
- 避免使用 `any` 类型，优先使用 `unknown` 或具体类型
- 为复杂对象创建接口或类型别名，放在 `types` 目录下
- 使用类型断言时，优先使用 `as` 语法而非尖括号语法
- 导出所有公共类型，便于其他模块使用

### 3.2 接口和类型别名

- 接口名应以大写字母 `I` 开头，例如 `IStudent`
- 类型别名应使用 PascalCase，例如 `StudentType`
- 为 API 响应数据创建专门的类型，例如 `StudentResponse`
- 为表单数据创建专门的类型，例如 `StudentFormData`

### 3.3 泛型

- 泛型参数应使用单个大写字母或有描述性的名称，例如 `T`、`U` 或 `TData`
- 为复杂泛型提供默认类型，例如 `<T = unknown>`

### 3.4 枚举

- 枚举名应使用 PascalCase，例如 `UserRole`
- 枚举值应使用全大写字母，例如 `UserRole.ADMIN`
- 优先使用字符串枚举而非数字枚举，提高代码可读性

## 4. React 组件规范

### 4.1 组件结构

- 使用函数组件和 Hooks，避免使用类组件
- 每个组件文件只应导出一个主要组件
- 组件应遵循以下结构：
  1. 导入语句
  2. 类型定义
  3. 常量定义
  4. 组件定义
  5. 辅助函数
  6. 导出语句

### 4.2 Props 定义

- 为组件 props 创建专门的接口，例如 `StudentTableProps`
- Props 应该是只读的，使用 `readonly` 修饰符
- 为可选 props 提供默认值
- 使用解构赋值获取 props 值

```typescript
interface StudentTableProps {
  readonly data: Student[];
  readonly loading?: boolean;
  readonly onEdit: (student: Student) => void;
}

const StudentTable: React.FC<StudentTableProps> = ({ 
  data, 
  loading = false, 
  onEdit 
}) => {
  // ...
};
```

### 4.3 Hooks 使用

- 遵循 Hooks 的使用规则，只在顶层调用
- 自定义 Hooks 应以 `use` 开头
- 相关的状态和副作用应该封装在自定义 Hooks 中
- 使用 `useCallback` 和 `useMemo` 优化性能，但不要过度使用

### 4.4 组件拆分

- 遵循单一职责原则，每个组件只做一件事
- 当组件超过 300 行时，考虑拆分为更小的组件
- 将复杂的表单拆分为多个子组件
- 将列表项抽取为单独的组件

### 4.5 条件渲染

- 使用三元运算符进行简单的条件渲染
- 使用逻辑与（`&&`）运算符进行简单的条件渲染
- 对于复杂的条件渲染，使用变量或函数

```typescript
// 简单条件渲染
{isLoading ? <Spin /> : <StudentTable data={students} />}

// 复杂条件渲染
const renderContent = () => {
  if (isLoading) {
    return <Spin />;
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  return <StudentTable data={students} />;
};

return (
  <div>
    {renderContent()}
  </div>
);
```

## 5. 状态管理规范

### 5.1 本地状态

- 使用 `useState` 管理组件本地状态
- 相关的状态应该组合在一起，使用对象或自定义 Hook
- 避免状态提升过多层级，考虑使用 Context 或 Redux

### 5.2 Context API

- 使用 Context API 管理中等规模的状态
- 为每个 Context 创建专门的 Provider 组件
- 将 Context 相关逻辑封装在自定义 Hook 中

```typescript
// 创建 Context
const StudentContext = createContext<StudentContextType | undefined>(undefined);

// 创建 Provider 组件
export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 状态和逻辑
  const value = { /* ... */ };
  
  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

// 创建自定义 Hook
export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};
```

### 5.3 Redux

- 使用 Redux Toolkit 简化 Redux 代码
- 按功能模块组织 Redux 状态，使用 slices
- 异步操作使用 `createAsyncThunk`
- 使用选择器（selectors）获取状态，避免直接访问 state

```typescript
// 创建 slice
const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    // 同步 reducers
  },
  extraReducers: (builder) => {
    // 异步 reducers
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### 5.4 状态持久化

- 使用 localStorage 或 cookies 持久化关键状态
- 敏感信息应该加密后再存储
- 清除会话时应该清除所有持久化状态

## 6. UI/UX 规范

### 6.1 设计系统

- 使用 Ant Design 组件库作为基础 UI 框架
- 遵循 Ant Design 的设计规范和最佳实践
- 自定义组件应该与 Ant Design 风格保持一致
- 使用 Ant Design 的主题定制功能，而不是覆盖默认样式

### 6.2 布局

- 使用 Ant Design 的 Layout 组件构建页面布局
- 使用栅格系统（Grid）进行响应式布局
- 保持页面结构的一致性，使用相同的页眉、页脚和侧边栏
- 表单和数据展示应该有足够的空间和间距

### 6.3 颜色和主题

- 使用预定义的颜色变量，避免硬编码颜色值
- 支持亮色和暗色主题切换
- 颜色应该有语义，例如成功使用绿色，错误使用红色
- 确保颜色对比度符合无障碍标准

### 6.4 响应式设计

- 所有页面应该支持响应式设计，适应不同屏幕尺寸
- 使用媒体查询和相对单位（如 rem、%）而非固定像素
- 在小屏幕上简化 UI，隐藏非必要元素
- 测试不同设备和屏幕尺寸上的显示效果

### 6.5 表单设计

- 使用 Ant Design 的 Form 组件构建表单
- 表单字段应该有清晰的标签和验证规则
- 错误信息应该具体且有帮助
- 提交按钮应该在表单底部，并有明确的视觉提示

### 6.6 数据展示

- 使用 Ant Design 的 Table 组件展示表格数据
- 表格应该支持排序、筛选和分页
- 空数据状态应该有友好的提示
- 加载状态应该有明确的视觉反馈

### 6.7 交互反馈

- 所有用户操作应该有即时反馈
- 使用加载指示器（如 Spin）显示异步操作状态
- 使用消息提示（如 message、notification）显示操作结果
- 确认危险操作前应该显示确认对话框

### 6.8 国际化和本地化

- 所有用户界面文本应该使用中文
- 日期和时间格式应该符合中国标准
- 支持不同时区的日期和时间显示
- 数字和货币格式应该符合中国标准

## 7. API 集成规范

### 7.1 API 客户端

- 使用 Axios 作为 HTTP 客户端
- 为每个 API 端点创建专门的函数
- 集中配置 API 基础 URL 和请求头
- 实现请求拦截器处理认证和错误

### 7.2 请求和响应处理

- 为请求参数和响应数据创建类型定义
- 使用 TypeScript 泛型确保类型安全
- 统一处理 API 错误，包括网络错误和业务错误
- 实现请求重试和超时机制

```typescript
// API 请求函数
export const getStudentList = async (params: StudentListParams): Promise<ApiResponse<StudentListResponse>> => {
  try {
    const response = await request(`${STUDENT_API_PATHS.LIST}`, {
      method: 'GET',
      params,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
```

### 7.3 数据转换

- 在 API 层进行数据转换，将后端数据结构转换为前端数据结构
- 使用映射函数处理枚举值和日期格式
- 确保数据转换是类型安全的

```typescript
// 数据转换函数
const convertApiStudentToUiStudent = (apiStudent: ApiStudent): UiStudent => {
  return {
    id: apiStudent.id.toString(),
    name: apiStudent.name,
    gender: mapApiGenderToUi(apiStudent.gender),
    age: apiStudent.age,
    // ...其他字段
  };
};
```

### 7.4 Mock 数据

- 为开发和测试提供 Mock 数据
- Mock 数据应该尽可能接近真实数据
- 使用环境变量控制是否使用 Mock 数据
- 确保 Mock 数据和真实 API 使用相同的类型定义

## 8. 性能优化规范

### 8.1 代码分割

- 使用动态导入（`import()`）和 React.lazy 实现代码分割
- 按路由分割代码，减少初始加载时间
- 使用 Suspense 和 Fallback 提供加载状态

```typescript
const StudentManagement = React.lazy(() => import('./pages/student/StudentManagement'));

// 在路由中使用
<Suspense fallback={<Spin />}>
  <Route path="/students" element={<StudentManagement />} />
</Suspense>
```

### 8.2 渲染优化

- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useCallback` 和 `useMemo` 缓存函数和计算结果
- 避免在渲染函数中创建新函数或对象
- 使用虚拟滚动（如 `react-window`）处理长列表

### 8.3 资源优化

- 优化图片大小和格式，使用 WebP 或 AVIF 格式
- 使用 SVG 图标而非位图图标
- 压缩 CSS 和 JavaScript 文件
- 使用 Tree Shaking 减少打包体积

### 8.4 缓存策略

- 实现客户端缓存，减少重复请求
- 使用 HTTP 缓存头控制资源缓存
- 缓存不经常变化的数据，如用户信息和配置
- 实现数据预取，提前加载可能需要的数据

## 9. 测试规范

### 9.1 单元测试

- 使用 Jest 和 React Testing Library 进行单元测试
- 为每个组件和工具函数编写测试
- 测试文件应与被测试文件放在同一目录下
- 测试应该独立且可重复运行

```typescript
// 组件测试示例
describe('StudentTable', () => {
  it('should render student data correctly', () => {
    const students = [/* mock data */];
    const { getByText } = render(<StudentTable data={students} />);
    
    expect(getByText(students[0].name)).toBeInTheDocument();
  });
  
  it('should call onEdit when edit button is clicked', () => {
    const students = [/* mock data */];
    const onEdit = jest.fn();
    const { getByTestId } = render(<StudentTable data={students} onEdit={onEdit} />);
    
    fireEvent.click(getByTestId('edit-button-0'));
    expect(onEdit).toHaveBeenCalledWith(students[0]);
  });
});
```

### 9.2 集成测试

- 测试组件之间的交互和数据流
- 模拟 API 请求和响应
- 测试表单提交和数据加载
- 测试路由导航和页面切换

### 9.3 端到端测试

- 使用 Cypress 或 Playwright 进行端到端测试
- 测试关键用户流程，如登录、注册和数据管理
- 测试不同设备和浏览器上的兼容性
- 自动化测试部署前的验证

### 9.4 测试覆盖率

- 目标代码覆盖率至少 80%
- 关键业务逻辑应该有 100% 的测试覆盖率
- 定期检查测试覆盖率报告
- 持续改进测试策略和覆盖率

## 10. Git 工作流规范

### 10.1 分支管理

- 主分支：`master`，用于生产环境
- 开发分支：`develop`，用于开发环境
- 功能分支：`feature/feature-name`，用于开发新功能
- 修复分支：`bugfix/bug-name`，用于修复 bug
- 发布分支：`release/version`，用于准备发布

### 10.2 提交规范

- 使用语义化的提交消息，格式为 `type(scope): message`
- 类型（type）包括：feat、fix、docs、style、refactor、test、chore 等
- 范围（scope）应该是受影响的模块或组件
- 消息应该简洁明了，描述变更内容

```
feat(student): 添加学生导出功能
fix(auth): 修复登录表单验证错误
docs(readme): 更新安装说明
style(ui): 优化表格样式
refactor(api): 重构 API 请求函数
test(components): 添加 StudentTable 测试
chore(deps): 更新依赖版本
```

### 10.3 代码审查

- 所有代码变更都应该通过拉取请求（Pull Request）提交
- 至少一名团队成员应该审查代码
- 代码审查应该关注代码质量、性能和安全性
- 自动化测试应该在合并前通过

### 10.4 版本管理

- 使用语义化版本（Semantic Versioning）
- 主版本号（Major）：不兼容的 API 变更
- 次版本号（Minor）：向后兼容的功能新增
- 修订号（Patch）：向后兼容的问题修复
- 为每个版本创建发布说明，描述变更内容

### 10.5 持续集成/持续部署

- 使用 GitHub Actions 实现 CI/CD
- 每次提交都应该触发自动化测试
- 合并到主分支应该触发自动部署
- 部署前应该进行代码质量检查和测试

## 总结

遵循这些规范和最佳实践，可以确保课时管理系统前端项目的代码质量、可维护性和性能。所有团队成员都应该熟悉这些规则，并在日常开发中严格执行。

规范是动态的，应该根据项目需求和团队反馈不断完善和更新。
