import React, { useState, CSSProperties } from 'react';
import { Spin, Button, Row, Col, Space, Card, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatisticsOverviewProps {
  data: any;
  timeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  loading: boolean;
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({
  data,
  timeframe,
  onTimeframeChange,
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

  const cardStyle: CSSProperties = {
    textAlign: 'center' as const,
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const renderStatisticCard = (title: string, value: number, growth: number, color: string, prefix?: React.ReactNode) => {
    const isUp = growth >= 0;
    return (
      <Col span={6}>
        <Card style={{ ...cardStyle, borderTop: `4px solid ${color}` }}>
          <Statistic
            title={title}
            value={value}
            precision={0}
            prefix={prefix}
            valueStyle={{ color: color, fontSize: '24px', fontWeight: 600 }}
            suffix={
              <span style={{ color: isUp ? '#52c41a' : '#f5222d', fontSize: '14px', marginLeft: '8px' }}>
                {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(growth)}%
              </span>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <div>
      <div className="stats-section">
        <div className="section-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="section-title">核心经营指标</div>
        </div>
        <Row gutter={[16, 16]}>
          {renderStatisticCard('总学员数', statisticsData.totalStudents, statisticsData.studentGrowth, '#3498db')}
          {renderStatisticCard('活跃学员数', statisticsData.activeStudents, statisticsData.activeGrowth, '#2ecc71')}
          {renderStatisticCard('新增学员', statisticsData.newStudents, statisticsData.newGrowth, '#f39c12')}
          {renderStatisticCard('流失学员', statisticsData.lostStudents, statisticsData.lostGrowth, '#e74c3c')}
          {renderStatisticCard('总教练数', statisticsData.totalCoaches, statisticsData.coachGrowth, '#1abc9c')}
          {renderStatisticCard('课消总数', statisticsData.totalLessons, statisticsData.lessonGrowth, '#9b59b6')}
          {renderStatisticCard('总收入 (元)', statisticsData.totalIncome, statisticsData.incomeGrowth, '#e67e22', '¥')}
          {renderStatisticCard('总利润 (元)', statisticsData.totalProfit, statisticsData.profitGrowth, '#3498db', '¥')}
        </Row>
      </div>
      {/* 趋势图表 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="chart-title">收入与学员数量趋势</div>
          <div className="chart-actions">
            <div className="time-filter-buttons">
              <Space.Compact size="small">
                <Button
                  type={trendTimeframe === 'month' ? 'primary' : 'default'}
                  onClick={() => {
                    setTrendChartLoading(true);
                    setTrendTimeframe('month');
                    // 模拟数据加载
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
                    // 模拟数据加载
                    setTimeout(() => setTrendChartLoading(false), 500);
                  }}
                >
                  年度
                </Button>
              </Space.Compact>
            </div>
          </div>
        </div>
        <div className="chart-wrapper" style={{ position: 'relative' }}>
          {trendChartLoading ? (
            <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(255, 255, 255, 0.7)', zIndex: 10 }}>
              <Spin />
            </div>
          ) : null}
          <ReactECharts
            option={{
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: {
                    backgroundColor: '#6a7985'
                  }
                }
              },
              legend: {
                data: ['收入(万元)', '学员数量'],
                top: '2%',
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
                axisLine: {
                  lineStyle: {
                    color: '#ddd'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#eee',
                    type: 'dashed'
                  }
                }
              },
              yAxis: [
                {
                  type: 'value',
                  name: '收入(万元)',
                  min: trendTimeframe === 'month' ? 70 : 60,
                  max: trendTimeframe === 'month' ? 140 : 150,
                  interval: 10,
                  position: 'left',
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#3498db'
                    }
                  },
                  axisLabel: {
                    formatter: '{value}'
                  },
                  splitLine: {
                    show: true,
                    lineStyle: {
                      color: '#eee',
                      type: 'dashed'
                    }
                  }
                },
                {
                  type: 'value',
                  name: '学员数量',
                  min: trendTimeframe === 'month' ? 1050 : 900,
                  max: trendTimeframe === 'month' ? 1300 : 1400,
                  interval: 50,
                  position: 'right',
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#e74c3c'
                    }
                  },
                  axisLabel: {
                    formatter: '{value}'
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: '收入(万元)',
                  type: 'line',
                  stack: '总量',
                  areaStyle: {
                    color: '#3498db',
                    opacity: 0.3
                  },
                  data: trendTimeframe === 'month'
                    ? [80, 92, 91, 94, 120, 130, 120, 110, 100, 90, 85, 80]
                    : [70, 82, 91, 94, 120, 130, 140]
                },
                {
                  name: '学员数量',
                  type: 'line',
                  yAxisIndex: 1,
                  stack: '总量',
                  areaStyle: {
                    color: '#e74c3c',
                    opacity: 0.3
                  },
                  data: trendTimeframe === 'month'
                    ? [1200, 1220, 1240, 1260, 1280, 1290, 1285, 1270, 1250, 1230, 1210, 1200]
                    : [1100, 1150, 1200, 1250, 1300, 1350, 1380]
                }
              ]
            }}
            style={{ height: '350px', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;