import React, { useState } from 'react';
import { Typography, Tabs, Card } from 'antd';
import { useStatisticsData } from './hooks/useStatisticsData';
import StatisticsOverview from './components/StatisticsOverview';
import StudentAnalysis from './components/StudentAnalysis';
import CoachAnalysis from './components/CoachAnalysis';
import FinanceAnalysis from './components/FinanceAnalysis';
import {
  BarChartOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined
} from '@ant-design/icons';
import './StatisticsDashboard.css';

const { Title } = Typography;

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
    loading
  } = useStatisticsData();

  return (
    <div className="statistics-management">
      <Card className="statistics-management-card">
        <div className="statistics-header">
          <Title level={4} className="statistics-title">数据统计</Title>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="header-tabs"
            items={[
              {
                key: 'overview',
                label: (
                  <span>
                    <BarChartOutlined />
                    数据概览
                  </span>
                ),
              },
              {
                key: 'student',
                label: (
                  <span>
                    <UserOutlined />
                    学员分析
                  </span>
                ),
              },
              {
                key: 'coach',
                label: (
                  <span>
                    <TeamOutlined />
                    教练分析
                  </span>
                ),
              },
              {
                key: 'finance',
                label: (
                  <span>
                    <DollarOutlined />
                    财务分析
                  </span>
                ),
              },
            ]}
          />
        </div>

        <div className="statistics-tabs-content">
          {activeTab === 'overview' && <StatisticsOverview data={data} timeframe={timeframe} onTimeframeChange={setTimeframe} loading={loading} />}
          {activeTab === 'student' && <StudentAnalysis data={studentData} loading={loading} />}
          {activeTab === 'coach' && <CoachAnalysis data={coachData} loading={loading} />}
          {activeTab === 'finance' && <FinanceAnalysis data={financeData} loading={loading} />}
        </div>
      </Card>
    </div>
  );
};

export default StatisticsDashboard;