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

  // 切换时间范围
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    // 只对核心经营指标部分进行刷新
    applyFilters({ timeframe: value });
  };

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="statistics-dashboard-container">
      <div className="header">
        <Title level={3}>数据统计</Title>
      </div>

      <div className="statistics-tabs-container">
        <Tabs activeKey={activeTab} onChange={handleTabChange} className="statistics-tabs">
          <TabPane tab="概览" key="overview">
            <StatisticsOverview
              data={data}
              timeframe={timeframe}
              onTimeframeChange={handleTimeframeChange}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="学员分析" key="student">
            <StudentAnalysis
              data={studentData}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="教练分析" key="coach">
            <CoachAnalysis
              data={coachData}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="财务分析" key="finance">
            <FinanceAnalysis
              data={financeData}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default StatisticsDashboard;