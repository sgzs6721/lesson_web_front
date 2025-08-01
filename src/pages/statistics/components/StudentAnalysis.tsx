import React, { useState } from 'react';
import { Button, Spin, Row, Col, Space, Card } from 'antd';
import { getTimeRange } from '@/utils/date';
import ReactECharts from 'echarts-for-react';
import {
  UserOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import StatisticCard from './StatisticCard';
import { CHART_COLORS } from '../constants/chartColors';
import { StudentAnalysisData } from '@/api/statistics/types';
import './StudentAnalysis.css';
import '../statistics.css';

interface StudentAnalysisProps {
  data: StudentAnalysisData | null;
  loading: boolean;
  timeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  onTimeframeChange: (timeframe: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => void;
  loadingStates?: {
    metrics: boolean;
    trend: boolean;
    renewal: boolean;
  };
  onTrendTimeframeChange?: (timeframe: 'MONTHLY' | 'YEARLY') => void;
  onRenewalTimeframeChange?: (timeframe: 'MONTHLY' | 'YEARLY') => void;
}

type StudentChartType = 'cumulative' | 'new' | 'lost' | 'retention' | 'renewal';

const StudentAnalysis: React.FC<StudentAnalysisProps> = ({ 
  data, 
  loading, 
  timeframe, 
  onTimeframeChange,
  loadingStates,
  onTrendTimeframeChange,
  onRenewalTimeframeChange
}) => {
  const [studentChartType, setStudentChartType] = useState<StudentChartType>('cumulative');
  const [studentTrendTimeframe, setStudentTrendTimeframe] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [renewalTimeframe, setRenewalTimeframe] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [newStudentSourceTimeframe, setNewStudentSourceTimeframe] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');

  // 处理学员趋势图表时间范围切换
  const handleStudentTrendTimeframeChange = (newTimeframe: string) => {
    setStudentTrendTimeframe(newTimeframe as 'MONTHLY' | 'YEARLY');
    if (onTrendTimeframeChange) {
      onTrendTimeframeChange(newTimeframe as 'MONTHLY' | 'YEARLY');
    }
  };

  // 处理续费金额图表时间范围切换
  const handleRenewalTimeframeChange = (newTimeframe: string) => {
    setRenewalTimeframe(newTimeframe as 'MONTHLY' | 'YEARLY');
    if (onRenewalTimeframeChange) {
      onRenewalTimeframeChange(newTimeframe as 'MONTHLY' | 'YEARLY');
    }
  };

  const handleNewStudentSourceTimeframeChange = (newTimeframe: string) => {
    setNewStudentSourceTimeframe(newTimeframe as 'MONTHLY' | 'YEARLY');
  };

  const studentData = data ? {
    totalStudents: data.studentMetrics.totalStudents,
    newStudents: data.studentMetrics.newStudents,
    lostStudents: data.studentMetrics.lostStudents,
    renewalStudents: data.studentMetrics.renewingStudents,
    studentGrowth: data.studentMetrics.totalStudentsChangeRate,
    newGrowth: data.studentMetrics.newStudentsChangeRate,
    lostGrowth: data.studentMetrics.lostStudentsChangeRate,
    renewalGrowth: data.studentMetrics.renewingStudentsChangeRate,
  } : {
    totalStudents: 0,
    newStudents: 0,
    lostStudents: 0,
    renewalStudents: 0,
    studentGrowth: 0,
    newGrowth: 0,
    lostGrowth: 0,
    renewalGrowth: 0,
  };

  // 学员趋势数据
  const studentTrendData = data ? {
    months: data.growthTrend.map(item => {
      // 根据时间范围格式化横坐标显示
      if (studentTrendTimeframe === 'YEARLY') {
        // 年度显示：生成连续的年份
        const timeStr = item.timePoint;
        // 如果timePoint是"2024-01"这样的格式，提取年份
        if (timeStr.includes('-')) {
          return timeStr.split('-')[0] + '年';
        }
        // 如果timePoint已经是年份，直接使用
        if (/^\d{4}$/.test(timeStr)) {
          return timeStr + '年';
        }
        // 其他情况，尝试提取4位数字作为年份
        const yearMatch = timeStr.match(/\d{4}/);
        return yearMatch ? yearMatch[0] + '年' : timeStr;
      } else {
        // 月度显示：显示月份格式
        const timeStr = item.timePoint;
        if (timeStr.includes('-') && timeStr.length >= 7) {
          // 如果是"2024-01"格式，显示为"1月"
          const parts = timeStr.split('-');
          if (parts.length >= 2) {
            const month = parseInt(parts[1], 10);
            return month + '月';
          }
        }
        // 如果已经是月份格式，直接返回
        if (timeStr.includes('月')) {
          return timeStr;
        }
        return timeStr;
      }
    }),
    cumulative: data.growthTrend.map(item => item.totalStudents),
    new: data.growthTrend.map(item => item.newStudents),
    lost: data.growthTrend.map(item => item.lostStudents),
    retention: data.growthTrend.map(item => item.retentionRate),
    renewal: data.growthTrend.map(item => item.renewingStudents),
  } : {
    months: [],
    cumulative: [],
    new: [],
    lost: [],
    retention: [],
    renewal: [],
  };

  // 学员来源数据
  const studentSourceData = data ? data.sourceDistribution.map(item => ({
    name: item.sourceName,
    value: item.studentCount
  })) : [];

  // 续费金额数据
  const renewalAmountData = data ? {
    months: data.renewalAmountTrend.map(item => {
      // 根据时间范围格式化横坐标显示
      if (renewalTimeframe === 'YEARLY') {
        // 年度显示：生成连续的年份
        const timeStr = item.timePoint;
        // 如果timePoint是"2024-01"这样的格式，提取年份
        if (timeStr.includes('-')) {
          return timeStr.split('-')[0] + '年';
        }
        // 如果timePoint已经是年份，直接使用
        if (/^\d{4}$/.test(timeStr)) {
          return timeStr + '年';
        }
        // 其他情况，尝试提取4位数字作为年份
        const yearMatch = timeStr.match(/\d{4}/);
        return yearMatch ? yearMatch[0] + '年' : timeStr;
      } else {
        // 月度显示：显示月份格式
        const timeStr = item.timePoint;
        if (timeStr.includes('-') && timeStr.length >= 7) {
          // 如果是"2024-01"格式，显示为"1月"
          const parts = timeStr.split('-');
          if (parts.length >= 2) {
            const month = parseInt(parts[1], 10);
            return month + '月';
          }
        }
        // 如果已经是月份格式，直接返回
        if (timeStr.includes('月')) {
          return timeStr;
        }
        return timeStr;
      }
    }),
    renewal: data.renewalAmountTrend.map(item => item.renewalAmount),
    newPayment: data.renewalAmountTrend.map(item => item.newStudentPaymentAmount),
  } : {
    months: [],
    renewal: [],
    newPayment: [],
  };

  // 新增学员来源数据 - 堆叠柱状图格式
  const newStudentSourceData = data ? data.newStudentSourceDistribution.map(item => ({
    name: item.sourceName,
    value: item.studentCount
  })) : [];

  // 生成模拟的时间序列数据用于堆叠柱状图
  const generateTimeSeriesData = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const years = ['2023年', '2024年'];
    
    return {
      monthly: months,
      yearly: years,
      series: newStudentSourceData.map((source, index) => ({
        name: source.name,
        type: 'bar',
        stack: 'total',
        data: newStudentSourceTimeframe === 'YEARLY' 
          ? years.map(() => Math.floor(Math.random() * 50) + 10) // 模拟年度数据
          : months.map(() => Math.floor(Math.random() * 20) + 5), // 模拟月度数据
        itemStyle: {
          color: CHART_COLORS[index % CHART_COLORS.length]
        }
      }))
    };
  };

  // 获取当前时间范围的显示文本
  const getTimeRangeText = () => {
    const range = getTimeRange(timeframe);
    const timeframeText = {
      'WEEKLY': '周度',
      'MONTHLY': '月度', 
      'QUARTERLY': '季度',
      'YEARLY': '年度'
    }[timeframe];
    return `${timeframeText} (${range.start} ~ ${range.end})`;
  };

  const studentStats = [
    {
      title: '总学员数',
      value: studentData.totalStudents || 0,
      growth: Number(studentData.studentGrowth) || 0,
      icon: <UserOutlined />,
      color: '#3498db',
      loading: loadingStates?.metrics || false,
    },
    {
      title: '新增学员数',
      value: studentData.newStudents || 0,
      growth: Number(studentData.newGrowth) || 0,
      icon: <UserAddOutlined />,
      color: '#2ecc71',
      loading: loadingStates?.metrics || false,
    },
    {
      title: '续费学员数',
      value: studentData.renewalStudents || 0,
      growth: Number(studentData.renewalGrowth) || 0,
      icon: <ReloadOutlined />,
      color: '#f39c12',
      loading: loadingStates?.metrics || false,
    },
    {
      title: '流失学员数',
      value: studentData.lostStudents || 0,
      growth: Number(studentData.lostGrowth) || 0,
      icon: <UserDeleteOutlined />,
      color: '#e74c3c',
      loading: loadingStates?.metrics || false,
    },
  ];

  return (
    <div className="student-analysis-container">
      {/* Top Statistic Cards */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>
              学员指标
              <span style={{ fontSize: '12px', color: '#666', fontWeight: 400, marginLeft: '12px' }}>
                {getTimeRangeText()}
              </span>
            </div>
          </div>
        }
        size="small"
        style={{ marginBottom: '24px' }}
        extra={
          <Space.Compact size="small">
            <Button type={timeframe === 'WEEKLY' ? 'primary' : 'default'} onClick={() => onTimeframeChange('WEEKLY')}>周度</Button>
            <Button type={timeframe === 'MONTHLY' ? 'primary' : 'default'} onClick={() => onTimeframeChange('MONTHLY')}>月度</Button>
            <Button type={timeframe === 'QUARTERLY' ? 'primary' : 'default'} onClick={() => onTimeframeChange('QUARTERLY')}>季度</Button>
            <Button type={timeframe === 'YEARLY' ? 'primary' : 'default'} onClick={() => onTimeframeChange('YEARLY')}>年度</Button>
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
                <Button 
                  type={studentTrendTimeframe === 'MONTHLY' ? 'primary' : 'default'} 
                  onClick={() => handleStudentTrendTimeframeChange('MONTHLY')}
                >
                  月度
                </Button>
                <Button 
                  type={studentTrendTimeframe === 'YEARLY' ? 'primary' : 'default'} 
                  onClick={() => handleStudentTrendTimeframeChange('YEARLY')}
                >
                  年度
                </Button>
              </Space.Compact>
            }
          >
            <Spin spinning={loadingStates?.trend || false}>
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
                        lineStyle: {
                          color: studentChartType === 'cumulative' ? '#1890ff' :
                                 studentChartType === 'new' ? '#52c41a' :
                                 studentChartType === 'lost' ? '#ff4d4f' :
                                 studentChartType === 'renewal' ? '#722ed1' :
                                 '#faad14',
                          width: 3
                        },
                        itemStyle: {
                          color: studentChartType === 'cumulative' ? '#1890ff' :
                                 studentChartType === 'new' ? '#52c41a' :
                                 studentChartType === 'lost' ? '#ff4d4f' :
                                 studentChartType === 'renewal' ? '#722ed1' :
                                 '#faad14'
                        },
                        areaStyle: {
                          color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                              {
                                offset: 0,
                                color: (studentChartType === 'cumulative' ? '#1890ff' :
                                       studentChartType === 'new' ? '#52c41a' :
                                       studentChartType === 'lost' ? '#ff4d4f' :
                                       studentChartType === 'renewal' ? '#722ed1' :
                                       '#faad14') + '40'
                              },
                              {
                                offset: 1,
                                color: (studentChartType === 'cumulative' ? '#1890ff' :
                                       studentChartType === 'new' ? '#52c41a' :
                                       studentChartType === 'lost' ? '#ff4d4f' :
                                       studentChartType === 'renewal' ? '#722ed1' :
                                       '#faad14') + '10'
                              }
                            ]
                          }
                        },
                        emphasis: { disabled: true }
                      }],
                    }}
                    style={{ height: '100%', width: '100%' }}
                  />
                </div>
                <div style={{
                  width: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  paddingLeft: '20px',
                  background: 'linear-gradient(135deg, #f8faff 0%, #f0f5ff 100%)',
                  borderRadius: '12px',
                  padding: '20px 16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  {['cumulative', 'new', 'renewal', 'lost', 'retention'].map((type) => {
                    const isActive = studentChartType === type;
                    const colors = {
                      cumulative: '#1890ff',
                      new: '#52c41a',
                      renewal: '#722ed1',
                      lost: '#ff4d4f',
                      retention: '#faad14'
                    };
                    const labels = {
                      cumulative: '总计',
                      new: '新增',
                      renewal: '续费',
                      lost: '流失',
                      retention: '留存率'
                    };
                    
                    return (
                      <div
                        key={type}
                        onClick={() => setStudentChartType(type as StudentChartType)}
                        style={{
                          width: '100px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '18px',
                          background: isActive
                            ? `linear-gradient(135deg, ${colors[type as keyof typeof colors]} 0%, ${colors[type as keyof typeof colors]}cc 100%)`
                            : 'rgba(255,255,255,0.8)',
                          color: isActive ? 'white' : '#666',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: isActive ? '600' : '500',
                          border: isActive ? 'none' : '1px solid #e8e8e8',
                          boxShadow: isActive
                            ? `0 4px 12px ${colors[type as keyof typeof colors]}40`
                            : '0 2px 4px rgba(0,0,0,0.04)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: isActive ? 'translateY(-1px)' : 'none'
                        }}
                      >
                        {labels[type as keyof typeof labels]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Spin>
          </Card>
        </Col>

        {/* Renewal Amount Chart */}
        <Col xs={24} lg={12}>
          <Card
            title="学员续费金额趋势 (元)"
            size="small"
            extra={
              <Space.Compact size="small">
                <Button 
                  type={renewalTimeframe === 'MONTHLY' ? 'primary' : 'default'} 
                  onClick={() => handleRenewalTimeframeChange('MONTHLY')}
                >
                  月度
                </Button>
                <Button 
                  type={renewalTimeframe === 'YEARLY' ? 'primary' : 'default'} 
                  onClick={() => handleRenewalTimeframeChange('YEARLY')}
                >
                  年度
                </Button>
              </Space.Compact>
            }
          >
            <Spin spinning={loadingStates?.renewal || false}>
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
                      itemStyle: { color: '#1890ff' },
                      emphasis: { disabled: true }
                    },
                    {
                      name: '新增学员缴费金额',
                      type: 'bar',
                      data: renewalAmountData.newPayment,
                      itemStyle: { color: '#52c41a' },
                      emphasis: { disabled: true }
                    }
                  ],
                }}
                style={{ height: '300px', width: '100%' }}
              />
            </Spin>
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

            {/* 新增学员来源分布 */}
            <Col xs={24} lg={12}>
              <Card
                title="新增学员来源分布"
                size="small"
                extra={
                  <Space.Compact size="small">
                    <Button 
                      type={newStudentSourceTimeframe === 'MONTHLY' ? 'primary' : 'default'} 
                      onClick={() => handleNewStudentSourceTimeframeChange('MONTHLY')}
                    >
                      月度
                    </Button>
                    <Button 
                      type={newStudentSourceTimeframe === 'YEARLY' ? 'primary' : 'default'} 
                      onClick={() => handleNewStudentSourceTimeframeChange('YEARLY')}
                    >
                      年度
                    </Button>
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
                        let result = params[0].name + '<br/>';
                        let total = 0;
                        params.forEach((param: any) => {
                          result += param.marker + param.seriesName + ': ' + param.value + '人<br/>';
                          total += param.value;
                        });
                        result += '<br/>总计: ' + total + '人';
                        return result;
                      }
                    },
                    legend: {
                      data: ['小程序推广', '老学员介绍', '线下活动', '社交媒体', '其他渠道'],
                      bottom: 10,
                      textStyle: {
                        fontSize: 12,
                        color: '#666'
                      }
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '15%',
                      top: '10%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                    },
                    yAxis: {
                      type: 'value',
                      name: '新增学员数',
                      nameTextStyle: {
                        color: '#666'
                      },
                      max: 150,
                      interval: 30
                    },
                    series: [
                      {
                        name: '小程序推广',
                        type: 'bar',
                        stack: 'total',
                        data: [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
                        itemStyle: { color: '#3498db' }
                      },
                      {
                        name: '老学员介绍',
                        type: 'bar',
                        stack: 'total',
                        data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75],
                        itemStyle: { color: '#2ecc71' }
                      },
                      {
                        name: '线下活动',
                        type: 'bar',
                        stack: 'total',
                        data: [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70],
                        itemStyle: { color: '#f39c12' }
                      },
                      {
                        name: '社交媒体',
                        type: 'bar',
                        stack: 'total',
                        data: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
                        itemStyle: { color: '#e74c3c' }
                      },
                      {
                        name: '其他渠道',
                        type: 'bar',
                        stack: 'total',
                        data: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
                        itemStyle: { color: '#9b59b6' }
                      }
                    ]
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