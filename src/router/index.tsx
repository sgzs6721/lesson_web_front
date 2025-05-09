import { Suspense, lazy } from 'react';
import { Navigate, RouteObject, createBrowserRouter } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '@/layouts/MainLayout';

// 懒加载组件
// const Login = lazy(() => import('@/pages/auth/Login'));
// const Register = lazy(() => import('@/pages/auth/Register'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));
const StudentManagement = lazy(() => import('@/pages/student/StudentManagement'));
const CourseManagement = lazy(() => import('@/pages/course/CourseManagement'));
const ScheduleView = lazy(() => import('@/pages/schedule/ScheduleView'));
const CoachManagement = lazy(() => import('@/pages/coach/CoachManagement'));
const AttendanceManagement = lazy(() => import('@/pages/attendance/AttendanceManagement'));
const CampusManagement = lazy(() => import('@/pages/campus/CampusManagement'));
const StatisticsDashboard = lazy(() => import('@/pages/statistics/StatisticsDashboard'));
const SystemSettings = lazy(() => import('@/pages/settings/SystemSettings'));
const UserManagement = lazy(() => import('@/pages/settings/UserManagement'));
const ChangePassword = lazy(() => import('@/pages/profile/ChangePassword'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));
const Unauthorized = lazy(() => import('@/pages/error/Unauthorized'));
const ExpenseManagement = lazy(() => import('@/pages/expense/ExpenseManagement'));
const PaymentRecords = lazy(() => import('@/pages/payment/PaymentRecords'));
const HomePage = lazy(() => import('@/pages/home/HomePage.tsx'));
const CampusAnalysis = lazy(() => import('@/pages/compare/CampusAnalysis'));

// 加载容器
const Loadable = (Component: React.ComponentType) => (props: any) => (
  <Suspense
    fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    }
  >
    <Component {...props} />
  </Suspense>
);

// 路由配置
const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/home" replace />
  },
  {
    path: '/home',
    element: Loadable(HomePage)({}),
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'dashboard', element: Loadable(Dashboard)({}) },
      { path: 'students', element: Loadable(StudentManagement)({}) },
      { path: 'courses', element: Loadable(CourseManagement)({}) },
      { path: 'schedules', element: Loadable(ScheduleView)({}) },
      { path: 'coaches', element: Loadable(CoachManagement)({}) },
      { path: 'attendance', element: Loadable(AttendanceManagement)({}) },
      { path: 'campuses', element: Loadable(CampusManagement)({}) },
      { path: 'statistics', element: Loadable(StatisticsDashboard)({}) },
      { path: 'settings', element: Loadable(SystemSettings)({}) },
      { path: 'users', element: Loadable(UserManagement)({}) },
      { path: 'change-password', element: Loadable(ChangePassword)({}) },
      { path: 'unauthorized', element: Loadable(Unauthorized)({}) },
      { path: 'expenses', element: Loadable(ExpenseManagement)({}) },
      { path: 'payments', element: Loadable(PaymentRecords)({}) },
      { path: 'analysis', element: Loadable(CampusAnalysis)({}) },
    ],
  },
  {
    path: '*',
    element: Loadable(NotFound)({}),
  },
];

// 创建路由器并启用未来标志
export const router = createBrowserRouter(appRoutes, {
  future: {
    v7_relativeSplatPath: true
  },
  // 添加更多配置以确保所有路由都使用未来标志
  basename: '/' // 确保基础路径正确
});