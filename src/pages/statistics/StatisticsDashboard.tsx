import React, { useState } from 'react';
import { Typography, Tabs } from 'antd';
import { useStatisticsData } from './hooks/useStatisticsData';
import StatisticsOverview from './components/StatisticsOverview';
import StudentAnalysis from './components/StudentAnalysis';
import CoachAnalysis from './components/CoachAnalysis';
import FinanceAnalysis from './components/FinanceAnalysis';
import './statistics.css';

const { Title } = Typography;
const { TabPane } = Tabs;

const StatisticsDashboard: React.FC = () => {
  // 状态管理
  const [timeframe, setTimeframe] = useState<string>('month');
  const [activeTab, setActiveTab] = useState<string>('overview');

  // 使用自定义 Hook 获取统计数据
  const {
    data,
    studentData,
    coachData,
    financeData,
    loading,
    applyFilters
  } = useStatisticsData();

  // 已移除核心经营指标的时间范围按钮

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="statistics-dashboard-container">
      <div className="header" style={{ borderBottom: 'none', paddingBottom: 0, display: 'flex', alignItems: 'center', marginTop: '-10px', marginBottom: '10px' }}>
        <Title level={3} style={{ marginBottom: 0, marginRight: '40px' }}>数据统计</Title>
        <Tabs activeKey={activeTab} onChange={handleTabChange} className="header-tabs" size="large" tabBarStyle={{ marginBottom: 0 }}>
          <TabPane tab="概览" key="overview" />
          <TabPane tab="学员分析" key="student" />
          <TabPane tab="教练分析" key="coach" />
          <TabPane tab="财务分析" key="finance" />
        </Tabs>
      </div>

      <div className="statistics-tabs-content">
        {activeTab === 'overview' && (
          <StatisticsOverview
            data={data}
            timeframe={timeframe}
            onTimeframeChange={() => {}}
            loading={loading}
          />
        )}
        {activeTab === 'student' && (
          <StudentAnalysis
            data={studentData}
            loading={loading}
          />
        )}
        {activeTab === 'coach' && (
          <CoachAnalysis
            data={coachData}
            loading={loading}
          />
        )}
        {activeTab === 'finance' && (
          <FinanceAnalysis
            data={financeData}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default StatisticsDashboard;