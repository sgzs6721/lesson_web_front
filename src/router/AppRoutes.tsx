import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '@/layouts/MainLayout';

// 懒加载组件
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
const HomePage = lazy(() => import('@/pages/home/HomePage'));
const CampusAnalysis = lazy(() => import('@/pages/compare/CampusAnalysis'));

// 加载容器
const Loadable = (Component: React.ComponentType) => () => (
  <Suspense
    fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={Loadable(HomePage)()} />
      
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={Loadable(Dashboard)()} />
        <Route path="/students" element={Loadable(StudentManagement)()} />
        <Route path="/courses" element={Loadable(CourseManagement)()} />
        <Route path="/schedules" element={Loadable(ScheduleView)()} />
        <Route path="/coaches" element={Loadable(CoachManagement)()} />
        <Route path="/attendance" element={Loadable(AttendanceManagement)()} />
        <Route path="/campuses" element={Loadable(CampusManagement)()} />
        <Route path="/statistics" element={Loadable(StatisticsDashboard)()} />
        <Route path="/settings" element={Loadable(SystemSettings)()} />
        <Route path="/users" element={Loadable(UserManagement)()} />
        <Route path="/change-password" element={Loadable(ChangePassword)()} />
        <Route path="/unauthorized" element={Loadable(Unauthorized)()} />
        <Route path="/expenses" element={Loadable(ExpenseManagement)()} />
        <Route path="/payments" element={Loadable(PaymentRecords)()} />
        <Route path="/analysis" element={Loadable(CampusAnalysis)()} />
      </Route>
      
      <Route path="*" element={Loadable(NotFound)()} />
    </Routes>
  );
};

export default AppRoutes; 