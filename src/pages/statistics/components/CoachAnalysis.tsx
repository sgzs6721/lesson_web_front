import React from 'react';
import { Card, Row, Col, Spin, Button, Space } from 'antd';
import { TeamOutlined, ClockCircleOutlined, DollarOutlined, TrophyOutlined } from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../constants/chartColors';
import { CoachAnalysisData } from '@/api/statistics/types';
import './CoachAnalysis.css';

interface CoachAnalysisProps {
  data: CoachAnalysisData | null;
  loading: boolean;
}

const CoachAnalysis: React.FC<CoachAnalysisProps> = ({ data, loading }) => {
  // 移除整页loading，改为局部loading

  // 使用真实API数据或默认值
  const coachData = data ? {
    totalCoaches: data.coachMetrics.totalCoaches,
    monthlyAverageClassHours: data.coachMetrics.monthlyAverageClassHours,
    monthlyAverageSalary: data.coachMetrics.monthlyAverageSalary,
    studentRetentionContributionRate: data.coachMetrics.studentRetentionContributionRate,
    coachGrowth: data.coachMetrics.totalCoachesChangeRate,
    hoursGrowth: data.coachMetrics.monthlyAverageClassHoursChangeRate,
    salaryGrowth: data.coachMetrics.monthlyAverageSalaryChangeRate,
    retentionGrowth: data.coachMetrics.studentRetentionContributionRateChangeRate,
  } : {
    totalCoaches: 0,
    monthlyAverageClassHours: 0,
    monthlyAverageSalary: 0,
    studentRetentionContributionRate: 0,
    coachGrowth: 0,
    hoursGrowth: 0,
    salaryGrowth: 0,
    retentionGrowth: 0,
  };

  // 教练统计卡片数据
  const coachStats = [
    {
      title: '教练总数',
      value: coachData.totalCoaches,
      unit: '人',
      icon: <TeamOutlined />,
      growth: coachData.coachGrowth,
      color: '#1890ff',
      loading: loading
    },
    {
      title: '月平均课时',
      value: coachData.monthlyAverageClassHours,
      unit: '课时',
      icon: <ClockCircleOutlined />,
      growth: coachData.hoursGrowth,
      color: '#52c41a',
      loading: loading
    },
    {
      title: '月平均工资',
      value: coachData.monthlyAverageSalary,
      unit: '元',
      icon: <DollarOutlined />,
      growth: coachData.salaryGrowth,
      color: '#faad14',
      loading: loading
    },
    {
      title: '学员留存贡献率',
      value: coachData.studentRetentionContributionRate,
      unit: '%',
      icon: <TrophyOutlined />,
      growth: coachData.retentionGrowth,
      color: '#f5222d',
      loading: loading
    }
  ];

  // 教练课时趋势数据
  const classHourTrendData = data?.classHourTrend?.map(item => ({
    timePoint: item.timePoint,
    totalClassHours: item.totalClassHours,
    averageClassHours: item.averageClassHours,
    activeCoaches: item.activeCoaches
  })) || [];

  // Top5教练对比数据
  const top5CoachData = data?.coachTop5Comparison || [];

  // 教练类型分布数据
  const coachTypeData = data?.coachTypeDistribution?.map(item => ({
    name: item.coachType,
    value: item.coachCount
  })) || [];

  // 教练薪资分析数据
  const salaryDistributionData = data?.salaryAnalysis?.salaryDistribution || [];

  return (
    <div className="coach-analysis">
      {/* Coach KPI Cards */}
      <Card
        title="教练指标"
        size="small"
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          {coachStats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} lg={6} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 教练课时趋势 */}
        <Col xs={24} lg={12}>
          <Card title="教练课时趋势" size="small">
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
                  data: ['总课时', '平均课时', '活跃教练数']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: classHourTrendData.length > 0 ? classHourTrendData.map(item => item.timePoint) : ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                },
                yAxis: [
                  {
                    type: 'value',
                    name: '课时数'
                  },
                  {
                    type: 'value',
                    name: '教练数'
                  }
                ],
                series: [
                  {
                    name: '总课时',
                    type: 'bar',
                    data: classHourTrendData.length > 0 ? classHourTrendData.map(item => item.totalClassHours) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[0] }
                  },
                  {
                    name: '平均课时',
                    type: 'line',
                    data: classHourTrendData.length > 0 ? classHourTrendData.map(item => item.averageClassHours) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[1] }
                  },
                  {
                    name: '活跃教练数',
                    type: 'line',
                    yAxisIndex: 1,
                    data: classHourTrendData.length > 0 ? classHourTrendData.map(item => item.activeCoaches) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[2] }
                  }
                ]
              }}
              style={{ height: '300px' }}
              />
            </Spin>
          </Card>
        </Col>

        {/* Top5教练对比 */}
        <Col xs={24} lg={12}>
          <Card title="Top5教练对比" size="small">
            <Spin spinning={loading}>
              <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                legend: {
                  data: ['课时数', '学员数', '留存率']
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: {
                  type: 'category',
                  data: top5CoachData.length > 0 ? top5CoachData.map(item => item.coachName) : ['教练A', '教练B', '教练C', '教练D', '教练E']
                },
                yAxis: [
                  {
                    type: 'value',
                    name: '数量'
                  },
                  {
                    type: 'value',
                    name: '留存率(%)'
                  }
                ],
                series: [
                  {
                    name: '课时数',
                    type: 'bar',
                    data: top5CoachData.length > 0 ? top5CoachData.map(item => item.classHours) : [0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[0] }
                  },
                  {
                    name: '学员数',
                    type: 'bar',
                    data: top5CoachData.length > 0 ? top5CoachData.map(item => item.studentCount) : [0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[1] }
                  },
                  {
                    name: '留存率',
                    type: 'line',
                    yAxisIndex: 1,
                    data: top5CoachData.length > 0 ? top5CoachData.map(item => item.retentionRate) : [0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[2] }
                  }
                ]
              }}
              style={{ height: '300px' }}
              />
            </Spin>
          </Card>
        </Col>

        {/* 教练类型分布 */}
        <Col xs={24} lg={12}>
          <Card title="教练类型分布" size="small">
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
                    name: '教练类型',
                    type: 'pie',
                    radius: '50%',
                    data: coachTypeData.length > 0 ? coachTypeData : [
                      { name: '全职教练', value: 0 },
                      { name: '兼职教练', value: 0 },
                      { name: '特聘教练', value: 0 }
                    ],
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

        {/* 教练薪资分析 */}
        <Col xs={24} lg={12}>
          <Card title="教练薪资分析" size="small">
            <Spin spinning={loading}>
              <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
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
                  data: salaryDistributionData.length > 0 ? salaryDistributionData.map(item => item.salaryRange) : ['5K以下', '5K-10K', '10K-15K', '15K-20K', '20K以上']
                },
                yAxis: {
                  type: 'value'
                },
                series: [
                  {
                    name: '教练数量',
                    type: 'bar',
                    data: salaryDistributionData.length > 0 ? salaryDistributionData.map(item => item.coachCount) : [0, 0, 0, 0, 0],
                    itemStyle: { color: CHART_COLORS[2] }
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

export default CoachAnalysis;