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

  // 处理财务时间范围变更
  const handleFinanceTimeframeChange = (value: string) => {
    setFinanceTimeframe(value);
  };

  // 处理财务趋势时间范围变更
  const handleFinanceTrendTimeframeChange = (value: string) => {
    setFinanceTrendTimeframe(value);
  };

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
              <div className="finance-stat-card" style={{ borderTop: '4px solid #3498db' }}>
                <div className="finance-stat-title">总收入(元)</div>
                <div className="finance-stat-value">{financeData.totalRevenue.toLocaleString()}</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {financeData.revenueGrowth}%</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ borderTop: '4px solid #2ecc71' }}>
                <div className="finance-stat-title">总成本(元)</div>
                <div className="finance-stat-value">{financeData.totalCost.toLocaleString()}</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {financeData.costGrowth}%</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ borderTop: '4px solid #27ae60' }}>
                <div className="finance-stat-title">总利润(元)</div>
                <div className="finance-stat-value">{financeData.totalProfit.toLocaleString()}</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {financeData.profitGrowth}%</span>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div className="finance-stat-card" style={{ borderTop: '4px solid #1abc9c' }}>
                <div className="finance-stat-title">利润率</div>
                <div className="finance-stat-value">{financeData.profitRate}%</div>
                <div className="finance-stat-trend">
                  <span>较上期</span>
                  <span className="trend-up">↑ {financeData.profitRateGrowth}%</span>
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
                boundaryGap: true,
                data: monthlyData.months,
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
              yAxis: {
                type: 'value',
                name: '金额(万元)',
                min: 0,
                max: 140,
                interval: 20,
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#666'
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
              series: [
                {
                  name: '收入(万元)',
                  type: 'bar',
                  barWidth: 20,
                  barGap: '0%',
                  data: monthlyData.revenue,
                  itemStyle: {
                    color: '#3498db'
                  }
                },
                {
                  name: '成本(万元)',
                  type: 'bar',
                  barWidth: 20,
                  barGap: '0%',
                  data: monthlyData.cost,
                  itemStyle: {
                    color: '#e74c3c'
                  }
                },
                {
                  name: '利润(万元)',
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  data: monthlyData.profit,
                  itemStyle: {
                    color: '#2ecc71'
                  },
                  lineStyle: {
                    width: 2
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