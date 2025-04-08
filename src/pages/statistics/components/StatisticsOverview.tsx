import React, { useState } from 'react';
import { Spin, Button, Row, Col, Space } from 'antd';
import ReactECharts from 'echarts-for-react';

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
  // 移除了核心指标的时间筛选按钮
  const [trendChartLoading, setTrendChartLoading] = useState(false);
  const [trendTimeframe, setTrendTimeframe] = useState<'month' | 'year'>('month');
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 示例数据
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

  return (
    <div>
      {/* 核心指标卡片 */}
      <div className="stats-section">
        <div className="section-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="section-title">核心经营指标</div>

        </div>
        <div className="stats-cards">
          <div className="stat-card" style={{ borderTop: '4px solid #3498db' }}>
            <div className="stat-title">总学员数</div>
            <div className="stat-value">{statisticsData.totalStudents.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.studentGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #2ecc71' }}>
            <div className="stat-title">活跃学员数</div>
            <div className="stat-value">{statisticsData.activeStudents.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.activeGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #f39c12' }}>
            <div className="stat-title">新增学员</div>
            <div className="stat-value">{statisticsData.newStudents.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.newGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #e74c3c' }}>
            <div className="stat-title">流失学员</div>
            <div className="stat-value">{statisticsData.lostStudents.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-down">↓ {Math.abs(statisticsData.lostGrowth)}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #1abc9c' }}>
            <div className="stat-title">总教练数</div>
            <div className="stat-value">{statisticsData.totalCoaches.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.coachGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #9b59b6' }}>
            <div className="stat-title">课消总数</div>
            <div className="stat-value">{statisticsData.totalLessons.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.lessonGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #e67e22' }}>
            <div className="stat-title">总收入 (元)</div>
            <div className="stat-value">{statisticsData.totalIncome.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.incomeGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #3498db' }}>
            <div className="stat-title">总利润 (元)</div>
            <div className="stat-value">{statisticsData.totalProfit.toLocaleString()}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {statisticsData.profitGrowth}%</span>
              <span>较上月</span>
            </div>
          </div>
        </div>
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
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  data: trendTimeframe === 'month'
                    ? [85, 78, 92, 83, 98, 102, 96, 112, 106, 114, 124, 135]
                    : [65, 78, 92, 105, 118, 132, 145],
                  itemStyle: {
                    color: '#3498db'
                  },
                  lineStyle: {
                    width: 2
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: 'rgba(52, 152, 219, 0.3)'
                      }, {
                        offset: 1, color: 'rgba(52, 152, 219, 0.05)'
                      }]
                    }
                  }
                },
                {
                  name: '学员数量',
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  yAxisIndex: 1,
                  data: trendTimeframe === 'month'
                    ? [1070, 1080, 1100, 1090, 1150, 1170, 1180, 1200, 1220, 1250, 1280, 1300]
                    : [950, 1020, 1080, 1150, 1220, 1280, 1350],
                  itemStyle: {
                    color: '#e74c3c'
                  },
                  lineStyle: {
                    width: 2
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: 'rgba(231, 76, 60, 0.3)'
                      }, {
                        offset: 1, color: 'rgba(231, 76, 60, 0.05)'
                      }]
                    }
                  }
                }
              ]
            }}
            style={{ height: '300px' }}
          />
        </div>
      </div>

      {/* 课程类型分布 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <div className="chart-title">课程类型分布</div>
        </div>
        <div className="chart-content">
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <div className="chart-wrapper" style={{ height: 300 }}>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                  },
                  legend: {
                    orient: 'vertical',
                    left: 30,
                    top: 'center',
                    data: ['团体课程', '小班课', '工作坊', '特殊课程', '企业团课']
                  },
                  series: [
                    {
                      name: '课程类型',
                      type: 'pie',
                      radius: ['40%', '70%'],
                      center: ['50%', '50%'],
                      avoidLabelOverlap: false,
                      itemStyle: {
                        borderRadius: 0,
                        borderColor: '#fff',
                        borderWidth: 2
                      },
                      label: {
                        show: false
                      },
                      emphasis: {
                        label: {
                          show: false
                        }
                      },
                      labelLine: {
                        show: false
                      },
                      data: [
                        { value: 452, name: '团体课程', itemStyle: { color: '#3498db' } },
                        { value: 385, name: '小班课', itemStyle: { color: '#e74c3c' } },
                        { value: 298, name: '工作坊', itemStyle: { color: '#f39c12' } },
                        { value: 149, name: '特殊课程', itemStyle: { color: '#1abc9c' } },
                        { value: 78, name: '企业团课', itemStyle: { color: '#9b59b6' } }
                      ]
                    }
                  ]
                }}
                style={{ height: '100%' }}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>课程类型</th>
                  <th>学员数</th>
                  <th>占比</th>
                  <th>课时单价(元)</th>
                  <th>总收入(元)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>团体课程</td>
                  <td>452</td>
                  <td>35.2%</td>
                  <td>300</td>
                  <td>406,800</td>
                </tr>
                <tr>
                  <td>小班课</td>
                  <td>385</td>
                  <td>30.0%</td>
                  <td>180</td>
                  <td>277,200</td>
                </tr>
                <tr>
                  <td>工作坊</td>
                  <td>298</td>
                  <td>23.2%</td>
                  <td>120</td>
                  <td>142,500</td>
                </tr>
                <tr>
                  <td>特殊课程</td>
                  <td>149</td>
                  <td>11.6%</td>
                  <td>250</td>
                  <td>50,000</td>
                </tr>
              </tbody>
            </table>
          </Col>
        </Row>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;