import React, { useState } from 'react';
import { Button, Spin, Row, Col, Space, Card } from 'antd';
import ReactECharts from 'echarts-for-react';
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import { CHART_COLORS } from '../constants/chartColors';
import './StudentAnalysis.css';
import '../statistics.css';

interface StudentAnalysisProps {
  data: any;
  loading: boolean;
}

type StudentChartType = 'cumulative' | 'new' | 'lost' | 'retention' | 'renewal';

const StudentAnalysis: React.FC<StudentAnalysisProps> = ({ data, loading }) => {
  const [timeframe, setTimeframe] = useState<string>('week');
  const [studentChartType, setStudentChartType] = useState<StudentChartType>('cumulative');
  const [studentTrendTimeframe, setStudentTrendTimeframe] = useState<string>('month');
  const [renewalTimeframe, setRenewalTimeframe] = useState<string>('month');
  const [sourceTimeframe, setSourceTimeframe] = useState<string>('month');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  const studentData = {
    totalStudents: 1284,
    newStudents: 68,
    lostStudents: 24,
    renewalStudents: 156,
    studentGrowth: 12.5,
    newGrowth: 15.3,
    lostGrowth: -5.2,
    renewalGrowth: 8.7,
    ...(data || {}),
  };

  const studentStats = [
    {
      title: '总学员数',
      value: studentData.totalStudents || 0,
      growth: Number(studentData.studentGrowth) || 0,
      icon: <UserOutlined />,
      color: '#3498db',
    },
    {
      title: '新增学员数',
      value: studentData.newStudents || 0,
      growth: Number(studentData.newGrowth) || 0,
      icon: <UserAddOutlined />,
      color: '#2ecc71',
    },
    {
      title: '续费学员数',
      value: studentData.renewalStudents || 0,
      growth: Number(studentData.renewalGrowth) || 0,
      icon: <ReloadOutlined />,
      color: '#f39c12',
    },
    {
      title: '流失学员数',
      value: studentData.lostStudents || 0,
      growth: Number(studentData.lostGrowth) || 0,
      icon: <UserDeleteOutlined />,
      color: '#e74c3c',
    },
  ];

  const studentTrendData = {
    months: studentTrendTimeframe === 'month'
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      : ['2020年', '2021年', '2022年', '2023年', '2024年'],
    cumulative: studentTrendTimeframe === 'month'
      ? [1050, 1080, 1110, 1130, 1160, 1190, 1210, 1230, 1250, 1260, 1270, 1284]
      : [800, 950, 1100, 1200, 1284],
    new: studentTrendTimeframe === 'month'
      ? [30, 35, 42, 28, 38, 45, 32, 40, 36, 25, 30, 28]
      : [150, 180, 220, 180, 200],
    lost: studentTrendTimeframe === 'month'
      ? [10, 12, 15, 8, 12, 18, 14, 16, 12, 10, 14, 12]
      : [50, 60, 80, 70, 85],
    retention: studentTrendTimeframe === 'month'
      ? [92, 91, 93, 94, 92, 90, 91, 92, 93, 94, 92, 93]
      : [88, 90, 92, 91, 93],
    renewal: studentTrendTimeframe === 'month'
      ? [120, 125, 130, 115, 140, 150, 135, 145, 140, 130, 135, 156]
      : [1200, 1350, 1500, 1400, 1560],
  };

  const studentSourceData = [
    { name: '小程序推广', value: 387 },
    { name: '老学员介绍', value: 335 },
    { name: '线下活动', value: 245 },
    { name: '社交媒体', value: 180 },
    { name: '其他渠道', value: 137 },
  ];

  const renewalAmountData = {
    months: renewalTimeframe === 'month'
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      : ['2020年', '2021年', '2022年', '2023年', '2024年'],
    renewal: renewalTimeframe === 'month'
      ? [320000, 280000, 380000, 260000, 420000, 360000, 300000, 460000, 380000, 500000, 480000, 560000]
      : [3200000, 3500000, 4200000, 4800000, 5600000],
    newPayment: renewalTimeframe === 'month'
      ? [450000, 380000, 520000, 350000, 580000, 490000, 420000, 630000, 520000, 680000, 650000, 750000]
      : [4500000, 4800000, 5600000, 6200000, 7500000],
  };

  const sourceTimeData = {
    months: sourceTimeframe === 'month'
      ? ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      : ['2020年', '2021年', '2022年', '2023年', '2024年'],
    sources: ['小程序推广', '老学员介绍', '线下活动', '社交媒体', '其他渠道'],
    data: sourceTimeframe === 'month' ? {
      '小程序推广': [15, 18, 22, 16, 25, 28, 20, 30, 26, 32, 28, 35],
      '老学员介绍': [12, 15, 18, 14, 20, 22, 18, 24, 20, 26, 24, 28],
      '线下活动': [8, 10, 12, 9, 15, 18, 12, 20, 16, 22, 18, 24],
      '社交媒体': [6, 8, 10, 7, 12, 15, 10, 16, 12, 18, 15, 20],
      '其他渠道': [4, 6, 8, 5, 10, 12, 8, 14, 10, 16, 12, 18],
    } : {
      '小程序推广': [180, 220, 280, 320, 350],
      '老学员介绍': [150, 180, 220, 260, 280],
      '线下活动': [120, 140, 180, 200, 240],
      '社交媒体': [80, 100, 130, 150, 180],
      '其他渠道': [60, 80, 100, 120, 137],
    }
  };

  return (
    <div className="student-analysis-container">
      {/* Top Statistic Cards */}
      <Card
        title="学员指标"
        size="small"
        style={{ marginBottom: '24px' }}
        extra={
          <Space.Compact size="small">
            <Button type={timeframe === 'week' ? 'primary' : 'default'} onClick={() => setTimeframe('week')}>周度</Button>
            <Button type={timeframe === 'month' ? 'primary' : 'default'} onClick={() => setTimeframe('month')}>月度</Button>
            <Button type={timeframe === 'quarter' ? 'primary' : 'default'} onClick={() => setTimeframe('quarter')}>季度</Button>
            <Button type={timeframe === 'year' ? 'primary' : 'default'} onClick={() => setTimeframe('year')}>年度</Button>
          </Space.Compact>
        }
      >
        <Row gutter={[16, 16]}>
          {studentStats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} lg={6} key={index}>
              <StatisticCard {...stat} />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Student Growth Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="学员增长趋势"
            size="small"
            extra={
              <Space.Compact size="small">
                <Button type={studentTrendTimeframe === 'month' ? 'primary' : 'default'} onClick={() => setStudentTrendTimeframe('month')}>月度</Button>
                <Button type={studentTrendTimeframe === 'year' ? 'primary' : 'default'} onClick={() => setStudentTrendTimeframe('year')}>年度</Button>
              </Space.Compact>
            }
          >
            <div style={{ display: 'flex', height: '300px' }}>
              <div style={{ flex: 1 }}>
                <ReactECharts
                  option={{
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category', data: studentTrendData.months },
                    yAxis: { type: 'value', name: studentChartType === 'retention' ? '%' : '' },
                    series: [{
                      name: studentChartType === 'cumulative' ? '累计' :
                            studentChartType === 'new' ? '新增' :
                            studentChartType === 'lost' ? '流失' :
                            studentChartType === 'renewal' ? '续费' : '留存率',
                      type: 'line',
                      smooth: true,
                      data: studentTrendData[studentChartType],
                      lineStyle: { color: CHART_COLORS[0], width: 3 },
                      itemStyle: { color: CHART_COLORS[0] },
                      emphasis: { disabled: true }
                    }],
                  }}
                  style={{ height: '100%', width: '100%' }}
                />
              </div>
              <div style={{
                width: '120px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                paddingLeft: '16px'
              }}>
                <Button
                  type={studentChartType === 'cumulative' ? 'primary' : 'default'}
                  onClick={() => setStudentChartType('cumulative')}
                  size="small"
                  style={{ width: '80px' }}
                >
                  总计
                </Button>
                <Button
                  type={studentChartType === 'new' ? 'primary' : 'default'}
                  onClick={() => setStudentChartType('new')}
                  size="small"
                  style={{ width: '80px' }}
                >
                  新增
                </Button>
                <Button
                  type={studentChartType === 'renewal' ? 'primary' : 'default'}
                  onClick={() => setStudentChartType('renewal')}
                  size="small"
                  style={{ width: '80px' }}
                >
                  续费
                </Button>
                <Button
                  type={studentChartType === 'lost' ? 'primary' : 'default'}
                  onClick={() => setStudentChartType('lost')}
                  size="small"
                  style={{ width: '80px' }}
                >
                  流失
                </Button>
                <Button
                  type={studentChartType === 'retention' ? 'primary' : 'default'}
                  onClick={() => setStudentChartType('retention')}
                  size="small"
                  style={{ width: '80px' }}
                >
                  留存率
                </Button>
              </div>
            </div>

          </Card>
        </Col>

        {/* Renewal Amount Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="学员续费金额趋势 (元)"
            size="small"
            extra={
              <Space.Compact size="small">
                <Button type={renewalTimeframe === 'month' ? 'primary' : 'default'} onClick={() => setRenewalTimeframe('month')}>月度</Button>
                <Button type={renewalTimeframe === 'year' ? 'primary' : 'default'} onClick={() => setRenewalTimeframe('year')}>年度</Button>
              </Space.Compact>
            }
          >
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'axis',
                  formatter: function(params: any) {
                    let result = `${params[0].name}<br/>`;
                    params.forEach((param: any) => {
                      result += `${param.seriesName}: ¥${param.value.toLocaleString()}<br/>`;
                    });
                    return result;
                  }
                },
                legend: {
                  data: ['续费金额', '新增学员缴费金额'],
                  top: 10,
                  left: 'center'
                },
                xAxis: { type: 'category', data: renewalAmountData.months },
                yAxis: {
                  type: 'value',
                  axisLabel: {
                    formatter: function(value: number) {
                      if (value >= 1000000) {
                        return (value / 1000000).toFixed(1) + 'M';
                      } else if (value >= 1000) {
                        return (value / 1000).toFixed(0) + 'K';
                      }
                      return value.toString();
                    }
                  }
                },
                series: [
                  {
                    name: '续费金额',
                    type: 'bar',
                    data: renewalAmountData.renewal,
                    itemStyle: { color: '#FFB6C1' }, // 马卡龙粉色 (暖色系)
                    emphasis: { disabled: true }
                  },
                  {
                    name: '新增学员缴费金额',
                    type: 'bar',
                    data: renewalAmountData.newPayment,
                    itemStyle: { color: '#FFDAB9' }, // 马卡龙桃色 (暖色系)
                    emphasis: { disabled: true }
                  }
                ],
              }}
              style={{ height: '300px', width: '100%' }}
            />
          </Card>
        </Col>

        {/* Student Source Charts */}
        <Col xs={24}>
          <Row gutter={[16, 0]}>
            {/* Student Source Distribution */}
            <Col xs={24} lg={12}>
              <Card
                title="学员来源分布"
                size="small"
              >
            <ReactECharts
              option={{
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b}: {c}人 ({d}%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: '#e8e8e8',
                  borderWidth: 1,
                  textStyle: {
                    color: '#333'
                  }
                },
                legend: {
                  orient: 'horizontal',
                  bottom: 10,
                  left: 'center',
                  data: studentSourceData.map(d => d.name),
                  textStyle: {
                    fontSize: 12,
                    color: '#666'
                  },
                  itemWidth: 14,
                  itemHeight: 14,
                  itemGap: 20
                },
                series: [{
                  name: '学员来源',
                  type: 'pie',
                  radius: ['40%', '70%'],
                  center: ['50%', '45%'],
                  avoidLabelOverlap: true,
                  label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}: {c}人\n({d}%)',
                    fontSize: 11,
                    color: '#666',
                    lineHeight: 14
                  },
                  emphasis: {
                    label: {
                      show: true,
                      fontSize: 12,
                      fontWeight: 'bold',
                      color: '#333'
                    },
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.3)'
                    }
                  },
                  labelLine: {
                    show: true,
                    length: 15,
                    length2: 10,
                    lineStyle: {
                      color: '#999',
                      width: 1
                    }
                  },
                  data: studentSourceData.map((item, index) => ({
                    ...item,
                    itemStyle: {
                      color: CHART_COLORS[index % CHART_COLORS.length],
                      borderColor: '#fff',
                      borderWidth: 2
                    }
                  })),
                }],
              }}
                style={{ height: '300px', width: '100%' }}
              />
            </Card>
          </Col>

          {/* Student Source Time Trend */}
          <Col xs={24} lg={12}>
            <Card
              title="新增学员来源分布"
              size="small"
              extra={
                <Space.Compact size="small">
                  <Button type={sourceTimeframe === 'month' ? 'primary' : 'default'} onClick={() => setSourceTimeframe('month')}>月度</Button>
                  <Button type={sourceTimeframe === 'year' ? 'primary' : 'default'} onClick={() => setSourceTimeframe('year')}>年度</Button>
                </Space.Compact>
              }
            >
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                      type: 'shadow'
                    },
                    formatter: function(params: any) {
                      let result = `${params[0].name}<br/>`;
                      let total = 0;
                      params.forEach((param: any) => {
                        total += param.value;
                      });
                      params.forEach((param: any) => {
                        const percentage = ((param.value / total) * 100).toFixed(1);
                        result += `${param.marker}${param.seriesName}: ${param.value}人 (${percentage}%)<br/>`;
                      });
                      result += `总计: ${total}人`;
                      return result;
                    }
                  },
                  legend: {
                    orient: 'horizontal',
                    bottom: 10,
                    left: 'center',
                    data: sourceTimeData.sources,
                    textStyle: {
                      fontSize: 12,
                      color: '#666'
                    },
                    itemWidth: 14,
                    itemHeight: 14,
                    itemGap: 15
                  },
                  grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '20%',
                    top: '10%',
                    containLabel: true
                  },
                  xAxis: {
                    type: 'category',
                    data: sourceTimeData.months,
                    axisLabel: {
                      fontSize: 12,
                      color: '#666'
                    }
                  },
                  yAxis: {
                    type: 'value',
                    name: '新增学员数',
                    nameTextStyle: {
                      color: '#666',
                      fontSize: 12
                    },
                    axisLabel: {
                      fontSize: 12,
                      color: '#666'
                    }
                  },
                  series: sourceTimeData.sources.map((source, index) => ({
                    name: source,
                    type: 'bar',
                    stack: 'total',
                    data: sourceTimeData.data[source as keyof typeof sourceTimeData.data],
                    itemStyle: {
                      color: CHART_COLORS[index % CHART_COLORS.length]
                    },
                    emphasis: { disabled: true }
                  }))
                }}
                style={{ height: '300px', width: '100%' }}
              />

            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
);
};

export default StudentAnalysis;