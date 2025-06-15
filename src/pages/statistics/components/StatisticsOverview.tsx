import React, { useState } from 'react';
import { Spin, Button, Row, Col, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  UsergroupDeleteOutlined,
  BookOutlined,
  RiseOutlined,
  MoneyCollectOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import '../StatisticsOverview.css';

interface StatisticsOverviewProps {
  data: any;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  loading: boolean;
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  data,
  loading
}) => {
  const [trendChartLoading, setTrendChartLoading] = useState(false);
  const [trendTimeframe, setTrendTimeframe] = useState<'month' | 'year'>('month');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const statisticsData = data || {
    totalStudents: 1284,
    activeStudents: 876,
    newStudents: 68,
    lostStudents: 24,
    totalCoaches: 42,
    totalLessons: 3425,
    totalIncome: 876500,
    totalProfit: 412680,
    studentGrowth: 12.5,
    activeGrowth: 8.2,
    newGrowth: 15.3,
    lostGrowth: -5.2,
    coachGrowth: 4.8,
    lessonGrowth: 9.7,
    incomeGrowth: 11.3,
    profitGrowth: 10.5
  };

  const academicStats = [
    {
      title: '总学员数',
      value: statisticsData.totalStudents,
      growth: statisticsData.studentGrowth,
      icon: <UserOutlined />,
      color: '#3498db',
    },
    {
      title: '活跃学员数',
      value: statisticsData.activeStudents,
      growth: statisticsData.activeGrowth,
      icon: <SolutionOutlined />,
      color: '#2ecc71',
    },
    {
      title: '新增学员',
      value: statisticsData.newStudents,
      growth: statisticsData.newGrowth,
      icon: <RiseOutlined />,
      color: '#f39c12',
    },
    {
      title: '流失学员',
      value: statisticsData.lostStudents,
      growth: statisticsData.lostGrowth,
      icon: <UsergroupDeleteOutlined />,
      color: '#e74c3c',
    },
    {
      title: '总教练数',
      value: statisticsData.totalCoaches,
      growth: statisticsData.coachGrowth,
      icon: <TeamOutlined />,
      color: '#1abc9c',
    },
    {
      title: '课消总数',
      value: statisticsData.totalLessons,
      growth: statisticsData.lessonGrowth,
      icon: <BookOutlined />,
      color: '#9b59b6',
    },
  ];

  const financialStats = [
    {
      title: '总收入 (元)',
      value: statisticsData.totalIncome,
      growth: statisticsData.incomeGrowth,
      icon: <MoneyCollectOutlined />,
      color: '#e67e22',
      prefix: '¥',
    },
    {
      title: '总利润 (元)',
      value: statisticsData.totalProfit,
      growth: statisticsData.profitGrowth,
      icon: <PieChartOutlined />,
      color: '#3498db',
      prefix: '¥',
    },
  ];

  return (
    <div className="statistics-overview-container">
      <div className="statistics-overview-layout">
        {/* Left Column: Statistic Cards */}
        <div className="statistics-cards-column">
          <div className="statistics-group">
            <h3 className="statistics-group-title">学员与教务</h3>
            <Row gutter={[16, 16]}>
              {academicStats.map((stat, index) => (
                <Col span={12} key={index}>
                  <StatisticCard {...stat} />
                </Col>
              ))}
            </Row>
          </div>
          <div className="statistics-group">
            <h3 className="statistics-group-title">财务指标</h3>
            <Row gutter={[16, 16]}>
              {financialStats.map((stat, index) => (
                <Col span={12} key={index}>
                  <StatisticCard {...stat} />
                </Col>
              ))}
            </Row>
          </div>
        </div>

        {/* Right Column: Chart */}
        <div className="statistics-chart-column">
          <div className="chart-container-card">
            <div className="chart-header">
              <div className="chart-title">收入与学员数量趋势</div>
              <Space.Compact size="small">
                <Button
                  type={trendTimeframe === 'month' ? 'primary' : 'default'}
                  onClick={() => {
                    setTrendChartLoading(true);
                    setTrendTimeframe('month');
                    setTimeout(() => setTrendChartLoading(false), 500);
                  }}
                >
                  月度
                </Button>
                <Button
                  type={trendTimeframe === 'year' ? 'primary' : 'default'}
                  onClick={() => {
                    setTrendChartLoading(true);
                    setTrendTimeframe('year');
                    setTimeout(() => setTrendChartLoading(false), 500);
                  }}
                >
                  年度
                </Button>
              </Space.Compact>
            </div>
            <div className="chart-wrapper">
              {trendChartLoading && (
                <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
                  <Spin />
                </div>
              )}
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } },
                  },
                  legend: { 
                    data: ['收入(万元)', '学员数量'], 
                    top: '0%', 
                    left: 'center'
                  },
                  grid: { 
                    left: '3%', 
                    right: '4%', 
                    bottom: '3%', 
                    top: '15%', 
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: trendTimeframe === 'month'
                      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                      : ['2018年', '2019年', '2020年', '2021年', '2022年', '2023年', '2024年'],
                  },
                  yAxis: [
                    { 
                      type: 'value', 
                      name: '收入(万元)', 
                      position: 'left', 
                      axisLine: { show: true, lineStyle: { color: '#3B82F6' } },
                      axisLabel: { color: '#3B82F6' },
                      nameTextStyle: { color: '#3B82F6' }
                    },
                    { 
                      type: 'value', 
                      name: '学员数量', 
                      position: 'right', 
                      axisLine: { show: true, lineStyle: { color: '#10B981' } },
                      axisLabel: { color: '#10B981' },
                      nameTextStyle: { color: '#10B981' }
                    },
                  ],
                  series: [
                    {
                      name: '收入(万元)',
                      type: 'line',
                      smooth: true,
                      lineStyle: { color: '#3B82F6', width: 2 },
                      itemStyle: { color: '#3B82F6' },
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [
                            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                            { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
                          ]
                        }
                      },
                      emphasis: { disabled: true },
                      data: trendTimeframe === 'month' ? [80, 92, 91, 94, 120, 130, 120, 110, 100, 90, 85, 80] : [70, 82, 91, 94, 120, 130, 140]
                    },
                    {
                      name: '学员数量',
                      type: 'line',
                      yAxisIndex: 1,
                      smooth: true,
                      lineStyle: { color: '#10B981', width: 2 },
                      itemStyle: { color: '#10B981' },
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0, y: 0, x2: 0, y2: 1,
                          colorStops: [
                            { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                            { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
                          ]
                        }
                      },
                      emphasis: { disabled: true },
                      data: trendTimeframe === 'month' ? [1200, 1220, 1240, 1260, 1280, 1290, 1285, 1270, 1250, 1230, 1210, 1200] : [1100, 1150, 1200, 1250, 1300, 1350, 1380]
                    }
                  ],
                }}
                style={{ height: '450px', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;