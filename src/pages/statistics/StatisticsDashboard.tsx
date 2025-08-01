import React, { useState, useEffect } from 'react';
import { Typography, Tabs, Card, Spin } from 'antd';
import { useStatisticsData } from './hooks/useStatisticsData';
import StudentAnalysis from './components/StudentAnalysis';
import CourseAnalysis from './components/CourseAnalysis';
import CoachAnalysis from './components/CoachAnalysis';
import FinanceAnalysis from './components/FinanceAnalysis';
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined,
  DollarOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  FundOutlined
} from '@ant-design/icons';
import './StatisticsDashboard.css';

const { Title } = Typography;

const StatisticsDashboard: React.FC = () => {
  // 状态管理
  const [activeTab, setActiveTab] = useState<string>('student');

  // 使用自定义 Hook 获取统计数据
  const {
    data,
    studentData,
    courseData,
    coachData,
    financeData,
    loading,
    studentLoading,
    courseLoading,
    coachLoading,
    financeLoading,
    filters,
    applyFilters,
    fetchDataByTab,
    getLoadingState,
    getStudentLoadingStates,
    updateStudentTrendTimeframe,
    updateStudentRenewalTimeframe
  } = useStatisticsData();

  // 时间段变更处理 - 只对学员分析页面有效
  const handleTimeframeChange = (timeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => {
    applyFilters({ timeframe }, 'student');
  };

  // 切换tab时，如果该tab没有数据，则加载数据
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    
    // 检查是否需要加载数据
    let needsData = false;
    switch (key) {
      case 'student':
        needsData = !studentData;
        break;
      case 'course':
        needsData = !courseData;
        break;
      case 'coach':
        needsData = !coachData;
        break;
      case 'finance':
        needsData = !financeData;
        break;
    }

    // 如果需要数据，则加载
    if (needsData) {
      fetchDataByTab(key as 'student' | 'course' | 'coach' | 'finance');
    }
  };

  // 组件首次加载时，加载学员分析数据
  useEffect(() => {
    // 确保首次加载时有loading状态
    fetchDataByTab('student');
  }, []);

  return (
    <div className="statistics-management">
      <Card className="statistics-management-card">
        <div className="statistics-header">
          <Title level={4} className="statistics-title">数据统计</Title>
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            className="header-tabs"
            items={[
              {
                key: 'student',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BarChartOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
                    <span>学员分析</span>
                  </span>
                ),
              },
              {
                key: 'course',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PieChartOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                    <span>课程分析</span>
                  </span>
                ),
              },
              {
                key: 'coach',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LineChartOutlined style={{ color: '#faad14', fontSize: '16px' }} />
                    <span>教练分析</span>
                  </span>
                ),
              },
              {
                key: 'finance',
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FundOutlined style={{ color: '#f5222d', fontSize: '16px' }} />
                    <span>财务分析</span>
                  </span>
                ),
              },
            ]}
          />
        </div>

        <div className="statistics-tabs-content">
          {activeTab === 'student' && (
            <StudentAnalysis 
              data={studentData} 
              loading={studentLoading}
              timeframe={filters.timeframe}
              onTimeframeChange={handleTimeframeChange}
              loadingStates={getStudentLoadingStates()}
              onTrendTimeframeChange={updateStudentTrendTimeframe}
              onRenewalTimeframeChange={updateStudentRenewalTimeframe}
            />
          )}
          {activeTab === 'course' && (
            <CourseAnalysis 
              data={courseData} 
              loading={courseLoading} 
            />
          )}
          {activeTab === 'coach' && (
            <CoachAnalysis 
              data={coachData} 
              loading={coachLoading} 
            />
          )}
          {activeTab === 'finance' && (
            <FinanceAnalysis 
              data={financeData} 
              loading={financeLoading} 
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default StatisticsDashboard;