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

  // 切换标签页
  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="statistics-management">
      <Card className="statistics-management-card">
        <div className="statistics-header">
          <Title level={4} className="statistics-title">数据统计</Title>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'overview',
              label: (
                <span>
                  <BarChartOutlined />
                  数据概览
                </span>
              ),
              children: <StatisticsOverview data={data} timeframe={timeframe} onTimeframeChange={() => {}} loading={loading} />,
            },
            {
              key: 'student',
              label: (
                <span>
                  <UserOutlined />
                  学员分析
                </span>
              ),
              children: <StudentAnalysis data={studentData} loading={loading} />,
            },
            {
              key: 'coach',
              label: (
                <span>
                  <TeamOutlined />
                  教练分析
                </span>
              ),
              children: <CoachAnalysis data={coachData} loading={loading} />,
            },
            {
              key: 'finance',
              label: (
                <span>
                  <DollarOutlined />
                  财务分析
                </span>
              ),
              children: <FinanceAnalysis data={financeData} loading={loading} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default StatisticsDashboard;