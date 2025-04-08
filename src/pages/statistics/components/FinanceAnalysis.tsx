import React, { useState } from 'react';
import { Button, Spin, Space, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';

interface FinanceAnalysisProps {
  data: any;
  loading: boolean;
}

const FinanceAnalysis: React.FC<FinanceAnalysisProps> = ({ data, loading }) => {
  const [financeTimeframe, setFinanceTimeframe] = useState<string>('month');
  const [financeTrendTimeframe, setFinanceTrendTimeframe] = useState<string>('month');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 示例数据
  const financeData = data || {
    totalRevenue: 1007700,
    totalCost: 614780,
    totalProfit: 392920,
    profitRate: 39.0,
    revenueGrowth: 8.4,
    costGrowth: 5.2,
    profitGrowth: 13.7,
    profitRateGrowth: 1.8
  };

  // 月度收入和成本数据
  const monthlyData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    revenue: [85, 78, 92, 83, 98, 102, 96, 112, 106, 114, 124, 135],
    cost: [52, 48, 56, 53, 58, 62, 58, 68, 64, 68, 72, 78],
    profit: [33, 30, 36, 30, 40, 40, 38, 44, 42, 46, 52, 57]
  };

  // 季度收入和成本数据
  const quarterlyData = {
    quarters: ['第一季度', '第二季度', '第三季度', '第四季度'],
    revenue: [255, 283, 314, 373],
    cost: [156, 173, 190, 218],
    profit: [99, 110, 124, 155]
  };

  // 年度收入和成本数据
  const yearlyData = {
    years: ['2020年', '2021年', '2022年', '2023年', '2024年'],
    revenue: [850, 920, 980, 1050, 1225],
    cost: [550, 580, 590, 620, 737],
    profit: [300, 340, 390, 430, 488]
  };

  // 获取当前显示的数据
  const getCurrentData = () => {
    if (financeTimeframe === 'quarter') {
      return {
        totalRevenue: 1257000,
        totalCost: 748300,
        totalProfit: 508700,
        profitRate: 40.5,
        revenueGrowth: 9.6,
        costGrowth: 6.7,
        profitGrowth: 15.2,
        profitRateGrowth: 2.3
      };
    } else if (financeTimeframe === 'year') {
      return {
        totalRevenue: 5025000,
        totalCost: 3077000,
        totalProfit: 1948000,
        profitRate: 38.8,
        revenueGrowth: 7.9,
        costGrowth: 4.8,
        profitGrowth: 12.5,
        profitRateGrowth: 1.6
      };
    } else {
      return financeData;
    }
  };

  // 获取当前趋势数据
  const getTrendData = () => {
    if (financeTrendTimeframe === 'quarter') {
      return {
        labels: quarterlyData.quarters,
        revenue: quarterlyData.revenue,
        cost: quarterlyData.cost,
        profit: quarterlyData.profit
      };
    } else if (financeTrendTimeframe === 'year') {
      return {
        labels: yearlyData.years,
        revenue: yearlyData.revenue,
        cost: yearlyData.cost,
        profit: yearlyData.profit
      };
    } else {
      return {
        labels: monthlyData.months,
        revenue: monthlyData.revenue,
        cost: monthlyData.cost,
        profit: monthlyData.profit
      };
    }
  };

  // 处理财务时间范围变更
  const handleFinanceTimeframeChange = (value: string) => {
    setFinanceTimeframe(value);
  };

  // 处理财务趋势时间范围变更
  const handleFinanceTrendTimeframeChange = (value: string) => {
    setFinanceTrendTimeframe(value);
  };

  const currentFinanceData = getCurrentData();
  const currentTrendData = getTrendData();

  return (
    <div>
      {/* 财务核心指标 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none !important', paddingBottom: 0 }}>
          <div className="chart-title">财务核心指标</div>
          <div className="chart-actions">
            <Space.Compact size="small">
              <Button
                type={financeTimeframe === 'month' ? 'primary' : 'default'}
                onClick={() => handleFinanceTimeframeChange('month')}
              >
                本月
              </Button>
              <Button
                type={financeTimeframe === 'quarter' ? 'primary' : 'default'}
                onClick={() => handleFinanceTimeframeChange('quarter')}
              >
                季度
              </Button>
              <Button
                type={financeTimeframe === 'year' ? 'primary' : 'default'}
                onClick={() => handleFinanceTimeframeChange('year')}
              >
                年度
              </Button>
            </Space.Compact>
          </div>
        </div>
        <div className="chart-content">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ 
                borderTop: '4px solid #3498db',
                background: 'linear-gradient(135deg, #eaf2fd 0%, #ffffff 100%)',
                boxShadow: '0 2px 8px rgba(52, 152, 219, 0.15)'
              }}>
                <div className="finance-stat-title">总收入(元)</div>
                <div className="finance-stat-value">{currentFinanceData.totalRevenue.toLocaleString()}</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {currentFinanceData.revenueGrowth}%</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ 
                borderTop: '4px solid #e74c3c',
                background: 'linear-gradient(135deg, #fdeaea 0%, #ffffff 100%)',
                boxShadow: '0 2px 8px rgba(231, 76, 60, 0.15)'
              }}>
                <div className="finance-stat-title">总成本(元)</div>
                <div className="finance-stat-value">{currentFinanceData.totalCost.toLocaleString()}</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {currentFinanceData.costGrowth}%</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ 
                borderTop: '4px solid #2ecc71',
                background: 'linear-gradient(135deg, #e9f9f0 0%, #ffffff 100%)',
                boxShadow: '0 2px 8px rgba(46, 204, 113, 0.15)'
              }}>
                <div className="finance-stat-title">总利润(元)</div>
                <div className="finance-stat-value">{currentFinanceData.totalProfit.toLocaleString()}</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {currentFinanceData.profitGrowth}%</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ 
                borderTop: '4px solid #9b59b6',
                background: 'linear-gradient(135deg, #f4ecf7 0%, #ffffff 100%)',
                boxShadow: '0 2px 8px rgba(155, 89, 182, 0.15)'
              }}>
                <div className="finance-stat-title">利润率</div>
                <div className="finance-stat-value">{currentFinanceData.profitRate}%</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {currentFinanceData.profitRateGrowth}%</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 收入与成本趋势 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none !important', paddingBottom: 0 }}>
          <div className="chart-title">收入与成本趋势</div>
          <div className="chart-actions">
            <Space.Compact size="small">
              <Button
                type={financeTrendTimeframe === 'month' ? 'primary' : 'default'}
                onClick={() => handleFinanceTrendTimeframeChange('month')}
              >
                月度
              </Button>
              <Button
                type={financeTrendTimeframe === 'quarter' ? 'primary' : 'default'}
                onClick={() => handleFinanceTrendTimeframeChange('quarter')}
              >
                季度
              </Button>
              <Button
                type={financeTrendTimeframe === 'year' ? 'primary' : 'default'}
                onClick={() => handleFinanceTrendTimeframeChange('year')}
              >
                年度
              </Button>
            </Space.Compact>
          </div>
        </div>
        <div className="chart-wrapper">
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
                data: ['收入(万元)', '成本(万元)', '利润(万元)'],
                top: '2%',
                left: 'center',
                textStyle: {
                  color: '#555'
                },
                itemWidth: 15,
                itemHeight: 10,
                itemGap: 25
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
                boundaryGap: true,
                data: currentTrendData.labels,
                axisLine: {
                  lineStyle: {
                    color: '#999'
                  }
                },
                axisLabel: {
                  color: '#666',
                  fontSize: 12
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#eee',
                    type: 'dashed'
                  }
                }
              },
              yAxis: {
                type: 'value',
                name: '金额(万元)',
                min: 0,
                max: 'auto',
                interval: 'auto',
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#999'
                  }
                },
                axisLabel: {
                  formatter: '{value}',
                  color: '#666',
                  fontSize: 12
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#eee',
                    type: 'dashed'
                  }
                }
              },
              series: [
                {
                  name: '收入(万元)',
                  type: 'bar',
                  barWidth: 15,
                  barGap: '30%',
                  data: currentTrendData.revenue,
                  itemStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, 
                        color: '#1890ff'
                      }, {
                        offset: 1, 
                        color: '#69c0ff'
                      }]
                    },
                    borderRadius: [3, 3, 0, 0]
                  },
                  emphasis: {
                    itemStyle: {
                      color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                          offset: 0, 
                          color: '#40a9ff'
                        }, {
                          offset: 1, 
                          color: '#91d5ff'
                        }]
                      }
                    }
                  }
                },
                {
                  name: '成本(万元)',
                  type: 'bar',
                  barWidth: 15,
                  barGap: '30%',
                  data: currentTrendData.cost,
                  itemStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, 
                        color: '#ff4d4f'
                      }, {
                        offset: 1, 
                        color: '#ff7875'
                      }]
                    },
                    borderRadius: [3, 3, 0, 0]
                  },
                  emphasis: {
                    itemStyle: {
                      color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                          offset: 0, 
                          color: '#ff7875'
                        }, {
                          offset: 1, 
                          color: '#ffa39e'
                        }]
                      }
                    }
                  }
                },
                {
                  name: '利润(万元)',
                  type: 'line',
                  smooth: true,
                  symbol: 'emptyCircle',
                  symbolSize: 8,
                  data: currentTrendData.profit,
                  itemStyle: {
                    color: '#52c41a'
                  },
                  lineStyle: {
                    width: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.2)',
                    shadowBlur: 10,
                    shadowOffsetY: 5
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: 'rgba(82, 196, 26, 0.2)'
                      }, {
                        offset: 1,
                        color: 'rgba(82, 196, 26, 0.02)'
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


    </div>
  );
};

export default FinanceAnalysis;