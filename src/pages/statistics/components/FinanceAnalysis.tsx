import React from 'react';
import { Card, Row, Col, Spin, Button, Space } from 'antd';
import { DollarOutlined, RiseOutlined, FallOutlined, PieChartOutlined } from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../constants/chartColors';
import { FinanceAnalysisData } from '@/api/statistics/types';
import './FinanceAnalysis.css';

interface FinanceAnalysisProps {
  data: FinanceAnalysisData | null;
  loading: boolean;
}

const FinanceAnalysis: React.FC<FinanceAnalysisProps> = ({ data, loading }) => {
  // 移除整页loading，改为局部loading

  // 使用真实API数据或默认值
  const financeData = data ? {
    totalRevenue: data.financeMetrics.totalRevenue,
    totalCost: data.financeMetrics.totalCost,
    totalProfit: data.financeMetrics.totalProfit,
    profitMargin: data.financeMetrics.profitMargin,
    revenueGrowth: data.financeMetrics.revenueChangeRate,
    costGrowth: data.financeMetrics.costChangeRate,
    profitGrowth: data.financeMetrics.profitChangeRate,
    marginGrowth: data.financeMetrics.marginChangeRate,
  } : {
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: 0,
    revenueGrowth: 0,
    costGrowth: 0,
    profitGrowth: 0,
    marginGrowth: 0,
  };

  // 财务统计卡片数据
  const financeStats = [
    {
      title: '总收入',
      value: financeData.totalRevenue,
      unit: '元',
      icon: <DollarOutlined />,
      growth: financeData.revenueGrowth,
      color: '#1890ff',
      loading: loading
    },
    {
      title: '总成本',
      value: financeData.totalCost,
      unit: '元',
      icon: <FallOutlined />,
      growth: financeData.costGrowth,
      color: '#f5222d',
      loading: loading
    },
    {
      title: '总利润',
      value: financeData.totalProfit,
      unit: '元',
      icon: <RiseOutlined />,
      growth: financeData.profitGrowth,
      color: '#52c41a',
      loading: loading
    },
    {
      title: '利润率',
      value: financeData.profitMargin,
      unit: '%',
      icon: <PieChartOutlined />,
      growth: financeData.marginGrowth,
      color: '#faad14',
      loading: loading
    }
  ];

  // 收入成本趋势数据
  const revenueCostTrendData = data?.revenueCostTrend || [];

  // 成本结构数据
  const costStructureData = data?.costStructure?.map(item => ({
    name: item.costType,
    value: item.amount
  })) || [];

  // 财务趋势数据
  const financeTrendData = data?.financeTrend || [];

  return (
    <div className="finance-analysis">
      {/* Finance KPI Cards */}
      <Card
        title="财务指标"
        size="small"
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {financeStats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} lg={6} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 收入成本趋势 */}
        <Col xs={24} lg={12}>
          <Card title="收入成本趋势" size="small">
            <Spin spinning={loading}>
              <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross'
                  }
                },
                legend: {
                  data: ['收入', '成本', '利润']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: revenueCostTrendData.map(item => item.timePoint)
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '收入',
                    type: 'bar',
                    data: revenueCostTrendData.map(item => item.revenue),
                    itemStyle: { color: CHART_COLORS[0] }
                  },
                  {
                    name: '成本',
                    type: 'bar',
                    data: revenueCostTrendData.map(item => item.cost),
                    itemStyle: { color: CHART_COLORS[1] }
                  },
                  {
                    name: '利润',
                    type: 'line',
                    data: revenueCostTrendData.map(item => item.profit),
                    itemStyle: { color: CHART_COLORS[2] }
                  }
                ]
              }}
              style={{ height: '300px' }}
              />
            </Spin>
          </Card>
        </Col>

        {/* 成本结构分析 */}
        <Col xs={24} lg={12}>
          <Card title="成本结构分析" size="small">
            <Spin spinning={loading}>
              <ReactECharts
              option={{
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [
                  {
                    name: '成本结构',
                    type: 'pie',
                    radius: '50%',
                    data: costStructureData,
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }}
              style={{ height: '300px' }}
              />
            </Spin>
          </Card>
        </Col>

        {/* 利润率趋势 */}
        <Col xs={24} lg={12}>
          <Card title="利润率趋势" size="small">
            <Spin spinning={loading}>
              <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: financeTrendData.map(item => item.timePoint)
                },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: '{value}%'
                  }
                },
                series: [
                  {
                    name: '利润率',
                    type: 'line',
                    smooth: true,
                    data: financeTrendData.map(item => item.profitMargin),
                    itemStyle: { color: CHART_COLORS[3] },
                    areaStyle: {
                      color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                          {
                            offset: 0,
                            color: CHART_COLORS[3] + '40'
                          },
                          {
                            offset: 1,
                            color: CHART_COLORS[3] + '10'
                          }
                        ]
                      }
                    }
                  }
                ]
              }}
              style={{ height: '300px' }}
              />
            </Spin>
          </Card>
        </Col>

        {/* 收入分析 */}
        <Col xs={24} lg={12}>
          <Card title="收入来源分析" size="small">
            <Spin spinning={loading}>
              <ReactECharts
              option={{
                tooltip: {
                  trigger: 'item'
                },
                legend: {
                  orient: 'vertical',
                  left: 'left'
                },
                series: [
                  {
                    name: '收入来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: data?.revenueAnalysis?.revenueBySource?.map(item => ({
                      name: item.source,
                      value: item.amount
                    })) || [],
                    emphasis: {
                      itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                      }
                    }
                  }
                ]
              }}
              style={{ height: '300px' }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceAnalysis;