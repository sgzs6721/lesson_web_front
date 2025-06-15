import React, { useState } from 'react';
import { Button, Spin, Space, Row, Col } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  TeamOutlined,
  BookOutlined,
  MoneyCollectOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import './CoachAnalysis.css';
import '../statistics.css';

interface CoachAnalysisProps {
  data: any;
  loading: boolean;
}

const CoachAnalysis: React.FC<CoachAnalysisProps> = ({ data, loading }) => {
  const [coachChartType, setCoachChartType] = useState<string>('lessons');
  const [coachBarType, setCoachBarType] = useState<string>('all');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const coachData = data || {
    totalCoaches: 42,
    averageLessons: 82.5,
    averageSalary: 8500,
    retentionRate: 85.2,
    coachGrowth: 4.8,
    lessonGrowth: 5.3,
    salaryGrowth: 6.2,
    retentionGrowth: 3.1,
  };

  const coachStats = [
    {
      title: '教练总数',
      value: coachData.totalCoaches,
      growth: coachData.coachGrowth,
      icon: <TeamOutlined />,
      color: '#3498db',
    },
    {
      title: '月平均课时量',
      value: coachData.averageLessons.toFixed(1),
      growth: coachData.lessonGrowth,
      icon: <BookOutlined />,
      color: '#f39c12',
    },
    {
      title: '月平均工资',
      value: coachData.averageSalary,
      growth: coachData.salaryGrowth,
      icon: <MoneyCollectOutlined />,
      color: '#e74c3c',
      prefix: '¥',
    },
    {
      title: '学员留存贡献率',
      value: `${coachData.retentionRate}%`,
      growth: coachData.retentionGrowth,
      icon: <SafetyCertificateOutlined />,
      color: '#1abc9c',
    },
  ];

  const coachLessonsData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    lessons: [350, 380, 410, 380, 420, 450, 470, 490, 520, 540, 560, 580],
    students: [25, 28, 30, 27, 32, 35, 38, 40, 42, 45, 48, 50],
    income: [30, 32, 35, 33, 38, 40, 42, 45, 48, 50, 52, 55],
  };

  const coachBarData = {
    coaches: ['李教练', '王教练', '张教练', '赵教练', '刘教练'],
    lessons: [125, 115, 110, 100, 95],
    students: [25, 24, 22, 20, 18],
    income: [30, 28, 26, 24, 22],
  };

  return (
    <div className="coach-analysis-container">
      <div className="statistics-group" style={{ marginBottom: '24px' }}>
        <h3 className="statistics-group-title">教练绩效指标</h3>
        <Row gutter={[16, 16]}>
          {coachStats.map((stat, index) => (
            <Col xs={24} sm={12} md={12} lg={6} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </div>

      <div className="coach-analysis-layout">
        <div className="coach-analysis-column">
          <div className="chart-container-card">
            <div className="chart-header">
              <div className="chart-title">教练课时统计</div>
            </div>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                legend: { data: ['课时数', '学员数', '收入 (千元)'], bottom: 0 },
                xAxis: { type: 'category', data: coachLessonsData.months },
                yAxis: [{ type: 'value', name: '数量' }, { type: 'value', name: '收入' }],
                series: [
                  {
                    name: '课时数',
                    type: 'bar',
                    data: coachLessonsData.lessons,
                    itemStyle: { color: '#1890ff' },
                    emphasis: { disabled: true }
                  },
                  {
                    name: '学员数',
                    type: 'bar',
                    data: coachLessonsData.students,
                    itemStyle: { color: '#52c41a' },
                    emphasis: { disabled: true }
                  },
                  {
                    name: '收入 (千元)',
                    type: 'line',
                    yAxisIndex: 1,
                    smooth: true,
                    data: coachLessonsData.income,
                    lineStyle: { color: '#faad14', width: 3 },
                    itemStyle: { color: '#faad14' },
                    emphasis: { disabled: true }
                  },
                ],
              }}
              style={{ height: '350px', width: '100%' }}
            />
          </div>
        </div>

        <div className="coach-analysis-column">
          <div className="chart-container-card">
            <div className="chart-header">
              <div className="chart-title">教练TOP5多维度对比</div>
              <Space.Compact>
                <Button size="small" type={coachBarType === 'all' ? 'primary' : 'default'} onClick={() => setCoachBarType('all')}>全部</Button>
                <Button size="small" type={coachBarType === 'lessons' ? 'primary' : 'default'} onClick={() => setCoachBarType('lessons')}>课时</Button>
                <Button size="small" type={coachBarType === 'students' ? 'primary' : 'default'} onClick={() => setCoachBarType('students')}>学员</Button>
                <Button size="small" type={coachBarType === 'income' ? 'primary' : 'default'} onClick={() => setCoachBarType('income')}>创收</Button>
              </Space.Compact>
            </div>
            <ReactECharts
              option={{
                tooltip: { trigger: 'axis' },
                legend: { data: ['课时量', '学员数', '创收额(千元)'], bottom: 0 },
                xAxis: { type: 'category', data: coachBarData.coaches },
                yAxis: { type: 'value' },
                series: [
                  { name: '课时量', type: 'bar', data: coachBarData.lessons, visible: coachBarType === 'all' || coachBarType === 'lessons' },
                  { name: '学员数', type: 'bar', data: coachBarData.students, visible: coachBarType === 'all' || coachBarType === 'students' },
                  { name: '创收额(千元)', type: 'bar', data: coachBarData.income, visible: coachBarType === 'all' || coachBarType === 'income' },
                ],
              }}
              style={{ height: '350px', width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachAnalysis;