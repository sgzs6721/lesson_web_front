import React, { useState } from 'react';
import { Button, Spin, Space, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  LineChartOutlined,
  WarningOutlined,
  SmileOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
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
      <div className="statistics-group" style={{ marginBottom: '24px' }}>
        <div className="chart-header">
            <h3 className="statistics-group-title" style={{ marginBottom: 0 }}>财务核心指标</h3>
            <Space.Compact size="small">
                <Button type={financeTimeframe === 'month' ? 'primary' : 'default'} onClick={() => setFinanceTimeframe('month')}>本月</Button>
                <Button type={financeTimeframe === 'quarter' ? 'primary' : 'default'} onClick={() => setFinanceTimeframe('quarter')}>季度</Button>
                <Button type={financeTimeframe === 'year' ? 'primary' : 'default'} onClick={() => setFinanceTimeframe('year')}>年度</Button>
            </Space.Compact>
        </div>
        <Row gutter={[16, 16]}>
          {financeStats.map((stat, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="finance-analysis-layout">
        <div className="finance-analysis-column">
          <div className="chart-container-card">
            <div className="chart-header">
                <div className="chart-title">收入与成本趋势 (万元)</div>
            </div>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                legend: { data: ['收入', '成本', '利润'], bottom: 0 },
                xAxis: { type: 'category', data: financeData.monthlyData.months },
                yAxis: { type: 'value' },
                series: [
                  { name: '收入', type: 'bar', data: financeData.monthlyData.revenue },
                  { name: '成本', type: 'bar', data: financeData.monthlyData.cost },
                  { name: '利润', type: 'line', smooth: true, data: financeData.monthlyData.profit },
                ],
              }}
              style={{ height: '350px', width: '100%' }}
            />
          </div>
        </div>

        <div className="finance-analysis-column">
          <div className="chart-container-card">
            <div className="chart-header">
                <div className="chart-title">成本结构分析</div>
            </div>
            <ReactECharts
              option={{
                tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                legend: { orient: 'vertical', left: 'left', data: financeData.costStructure.map((d: CostStructureItem) => d.name) },
                series: [{
                  name: '成本结构',
                  type: 'pie',
                  radius: '70%',
                  center: ['60%', '50%'],
                  data: financeData.costStructure,
                }],
              }}
              style={{ height: '350px', width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceAnalysis;