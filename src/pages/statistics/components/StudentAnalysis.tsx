import React, { useState } from 'react';
import { Button, Spin, Row, Col, Space, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import './StudentAnalysis.css';
import '../statistics.css';

interface StudentAnalysisProps {
  data: any;
  loading: boolean;
}

type StudentChartType = 'cumulative' | 'new' | 'lost' | 'retention';

const StudentAnalysis: React.FC<StudentAnalysisProps> = ({ data, loading }) => {
  const [timeframe, setTimeframe] = useState<string>('week');
  const [studentChartType, setStudentChartType] = useState<StudentChartType>('cumulative');
  const [renewalTimeframe, setRenewalTimeframe] = useState<string>('month');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const studentData = data || {
    totalStudents: 1284,
    newStudents: 68,
    lostStudents: 24,
    studentGrowth: 12.5,
    newGrowth: 15.3,
    lostGrowth: -5.2,
  };

  const studentStats = [
    {
      title: '总学员数',
      value: studentData.totalStudents,
      growth: studentData.studentGrowth,
      icon: <UserOutlined />,
      color: '#3498db',
    },
    {
      title: '新增学员数',
      value: studentData.newStudents,
      growth: studentData.newGrowth,
      icon: <UserAddOutlined />,
      color: '#2ecc71',
    },
    {
      title: '流失学员数',
      value: studentData.lostStudents,
      growth: studentData.lostGrowth,
      icon: <UserDeleteOutlined />,
      color: '#e74c3c',
    },
  ];

  const studentTrendData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    cumulative: [1050, 1080, 1110, 1130, 1160, 1190, 1210, 1230, 1250, 1260, 1270, 1284],
    new: [30, 35, 42, 28, 38, 45, 32, 40, 36, 25, 30, 28],
    lost: [10, 12, 15, 8, 12, 18, 14, 16, 12, 10, 14, 12],
    retention: [92, 91, 93, 94, 92, 90, 91, 92, 93, 94, 92, 93],
  };

  const studentSourceData = [
    { name: '小程序推广', value: 387 },
    { name: '老学员介绍', value: 335 },
    { name: '线下活动', value: 245 },
    { name: '社交媒体', value: 180 },
    { name: '其他渠道', value: 137 },
  ];

  const sourceTableColumns = [
    { title: '来源渠道', dataIndex: 'name', key: 'name' },
    { title: '学员数量', dataIndex: 'value', key: 'value' },
  ];

  const renewalAmountData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    amounts: [32, 28, 38, 26, 42, 36, 30, 46, 38, 50, 48, 56],
  };

  return (
    <div className="student-analysis-container">
      {/* Top Statistic Cards */}
      <div className="statistics-group" style={{ marginBottom: '24px' }}>
        <div className="chart-header">
            <h3 className="statistics-group-title" style={{ marginBottom: 0 }}>学员指标</h3>
            <Space.Compact size="small">
                <Button type={timeframe === 'week' ? 'primary' : 'default'} onClick={() => setTimeframe('week')}>本周</Button>
                <Button type={timeframe === 'month' ? 'primary' : 'default'} onClick={() => setTimeframe('month')}>本月</Button>
                <Button type={timeframe === 'quarter' ? 'primary' : 'default'} onClick={() => setTimeframe('quarter')}>季度</Button>
                <Button type={timeframe === 'year' ? 'primary' : 'default'} onClick={() => setTimeframe('year')}>年度</Button>
            </Space.Compact>
        </div>
        <Row gutter={[16, 16]}>
          {studentStats.map((stat, index) => (
            <Col xs={24} sm={24} md={8} lg={8} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="student-analysis-layout">
        <div className="student-analysis-main-column">
          {/* Student Growth Chart */}
          <div className="chart-container-card">
            <div className="chart-header">
                <div className="chart-title">学员增长趋势</div>
                <Space.Compact size="small">
                    <Button type={studentChartType === 'cumulative' ? 'primary' : 'default'} onClick={() => setStudentChartType('cumulative')}>累计</Button>
                    <Button type={studentChartType === 'new' ? 'primary' : 'default'} onClick={() => setStudentChartType('new')}>新增</Button>
                    <Button type={studentChartType === 'lost' ? 'primary' : 'default'} onClick={() => setStudentChartType('lost')}>流失</Button>
                    <Button type={studentChartType === 'retention' ? 'primary' : 'default'} onClick={() => setStudentChartType('retention')}>留存率</Button>
                </Space.Compact>
            </div>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                legend: { data: [studentChartType] },
                xAxis: { type: 'category', data: studentTrendData.months },
                yAxis: { type: 'value', name: studentChartType === 'retention' ? '%' : '' },
                series: [{ name: studentChartType, type: 'line', smooth: true, data: studentTrendData[studentChartType] }],
              }}
              style={{ height: '300px', width: '100%' }}
            />
          </div>

          {/* Renewal Amount Chart */}
          <div className="chart-container-card">
            <div className="chart-header">
                <div className="chart-title">学员续费金额趋势 (万元)</div>
                <Space.Compact size="small">
                    <Button type={renewalTimeframe === 'month' ? 'primary' : 'default'} onClick={() => setRenewalTimeframe('month')}>月度</Button>
                    <Button type={renewalTimeframe === 'year' ? 'primary' : 'default'} onClick={() => setRenewalTimeframe('year')}>年度</Button>
                </Space.Compact>
            </div>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: renewalAmountData.months },
                yAxis: { type: 'value' },
                series: [{ name: '续费金额', type: 'bar', data: renewalAmountData.amounts }],
              }}
              style={{ height: '300px', width: '100%' }}
            />
          </div>
        </div>
        
        <div className="student-analysis-side-column">
            {/* Student Source Chart */}
            <div className="chart-container-card">
                <div className="chart-header">
                    <div className="chart-title">学员来源分布</div>
                </div>
                <ReactECharts
                    option={{
                        tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
                        legend: { orient: 'vertical', left: 'left', data: studentSourceData.map(d => d.name) },
                        series: [{
                            name: '学员来源',
                            type: 'pie',
                            radius: ['50%', '70%'],
                            avoidLabelOverlap: false,
                            label: { show: false, position: 'center' },
                            emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
                            labelLine: { show: false },
                            data: studentSourceData,
                        }],
                    }}
                    style={{ height: '300px', width: '100%' }}
                />
            </div>
            {/* Student Source Table */}
            <div className="chart-container-card">
                <div className="chart-header">
                    <div className="chart-title">学员来源详情</div>
                </div>
                <Table
                    columns={sourceTableColumns}
                    dataSource={studentSourceData}
                    pagination={false}
                    rowKey="name"
                    size="small"
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalysis;