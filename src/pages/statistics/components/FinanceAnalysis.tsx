import React, { useState } from 'react';
import { Button, Spin, Space, Row, Col, Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  LineChartOutlined,
  WarningOutlined,
  SmileOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import { generateBarItemStyle, CHART_COLORS, SERIES_COLORS } from '../constants/chartColors';
import './FinanceAnalysis.css';
import '../statistics.css';

interface FinanceAnalysisProps {
  data: any;
  loading: boolean;
}

interface CostStructureItem {
  name: string;
  value: number;
}

const FinanceAnalysis: React.FC<FinanceAnalysisProps> = ({ data, loading }) => {
  const [financeTimeframe, setFinanceTimeframe] = useState<string>('month');

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const financeData = data;

  const financeStats = [
    {
      title: '总收入 (元)',
      value: financeData.totalRevenue.toLocaleString(),
      growth: financeData.revenueGrowth,
      icon: <LineChartOutlined />,
      color: '#3498db',
    },
    {
      title: '总成本 (元)',
      value: financeData.totalCost.toLocaleString(),
      growth: financeData.costGrowth,
      icon: <WarningOutlined />,
      color: '#e74c3c',
    },
    {
      title: '总利润 (元)',
      value: financeData.totalProfit.toLocaleString(),
      growth: financeData.profitGrowth,
      icon: <SmileOutlined />,
      color: '#2ecc71',
    },
    {
      title: '利润率',
      value: `${financeData.profitRate}%`,
      growth: financeData.profitRateGrowth,
      icon: <PieChartOutlined />,
      color: '#9b59b6',
    },
  ];

  return (
    <div className="finance-analysis-container">
      <Card
        title="财务核心指标"
        size="small"
        style={{ marginBottom: '24px' }}
        extra={
          <Space.Compact size="small">
            <Button type={financeTimeframe === 'month' ? 'primary' : 'default'} onClick={() => setFinanceTimeframe('month')}>本月</Button>
            <Button type={financeTimeframe === 'quarter' ? 'primary' : 'default'} onClick={() => setFinanceTimeframe('quarter')}>季度</Button>
            <Button type={financeTimeframe === 'year' ? 'primary' : 'default'} onClick={() => setFinanceTimeframe('year')}>年度</Button>
          </Space.Compact>
        }
      >
        <Row gutter={[16, 16]}>
          {financeStats.map((stat, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Revenue and Cost Trends */}
        <Col xs={24} lg={12}>
          <Card
            title="收入与成本趋势 (万元)"
            size="small"
          >
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                legend: { data: ['收入', '成本', '利润'], bottom: 0 },
                xAxis: { type: 'category', data: financeData.monthlyData.months },
                yAxis: { type: 'value' },
                series: [
                  {
                    name: '收入',
                    type: 'bar',
                    data: financeData.monthlyData.revenue.map((value: number, index: number) => ({
                      value: value,
                      itemStyle: generateBarItemStyle(index)
                    })),
                    emphasis: { disabled: true }
                  },
                  {
                    name: '成本',
                    type: 'bar',
                    data: financeData.monthlyData.cost.map((value: number, index: number) => ({
                      value: value,
                      itemStyle: generateBarItemStyle(index + 3)
                    })),
                    emphasis: { disabled: true }
                  },
                  {
                    name: '利润',
                    type: 'line',
                    smooth: true,
                    data: financeData.monthlyData.profit,
                    lineStyle: { color: SERIES_COLORS.success, width: 3 },
                    itemStyle: { color: SERIES_COLORS.success },
                    emphasis: { disabled: true }
                  },
                ],
              }}
              style={{ height: '350px', width: '100%' }}
            />
          </Card>
        </Col>

        {/* Cost Structure Analysis */}
        <Col xs={24} lg={12}>
          <Card
            title="成本结构分析"
            size="small"
          >
            <ReactECharts
              option={{
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { orient: 'vertical', left: 'left', data: financeData.costStructure.map((d: CostStructureItem) => d.name) },
                series: [{
                  name: '成本结构',
                  type: 'pie',
                  radius: '70%',
                  center: ['60%', '50%'],
                  data: financeData.costStructure.map((item: CostStructureItem, index: number) => ({
                    ...item,
                    itemStyle: {
                      color: CHART_COLORS[index % CHART_COLORS.length]
                    }
                  })),
                }],
              }}
              style={{ height: '350px', width: '100%' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceAnalysis;