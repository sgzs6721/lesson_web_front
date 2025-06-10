import React, { useState, CSSProperties } from 'react';
import { Button, Spin, Row, Col, Card, Statistic } from 'antd';
import ReactECharts from 'echarts-for-react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StudentAnalysisProps {
  data: any;
  loading: boolean;
}

const StudentAnalysis: React.FC<StudentAnalysisProps> = ({ data, loading }) => {
  const [timeframe, setTimeframe] = useState<string>('week');
  const [studentChartType, setStudentChartType] = useState<string>('cumulative');
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
    lostGrowth: -5.2
  };

  const cardStyle: CSSProperties = {
    textAlign: 'center' as const,
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const renderStatisticCard = (title: string, value: number, growth: number, color: string) => {
    const isUp = growth >= 0;
    return (
      <Col span={8}>
        <Card style={{ ...cardStyle, borderTop: `4px solid ${color}` }}>
          <Statistic
            title={title}
            value={value}
            precision={0}
            valueStyle={{ color: color, fontSize: '24px', fontWeight: 600 }}
            suffix={
              <span style={{ color: isUp ? '#52c41a' : '#f5222d', fontSize: '14px', marginLeft: '8px' }}>
                {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(growth)}%
              </span>
            }
          />
        </Card>
      </Col>
    );
  };

  // 学员增长趋势数据
  const studentTrendData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    cumulative: [1050, 1080, 1110, 1130, 1160, 1190, 1210, 1230, 1250, 1260, 1270, 1284],
    new: [30, 35, 42, 28, 38, 45, 32, 40, 36, 25, 30, 28],
    lost: [10, 12, 15, 8, 12, 18, 14, 16, 12, 10, 14, 12],
    retention: [92, 91, 93, 94, 92, 90, 91, 92, 93, 94, 92, 93]
  };

  // 学员来源表格数据
  const studentSourceData = [
    {
      key: '1',
      source: '小程序推广',
      count: 387,
      percentage: '30.1%'
    },
    {
      key: '2',
      source: '老学员介绍',
      count: 335,
      percentage: '26.1%'
    },
    {
      key: '3',
      source: '线下活动',
      count: 245,
      percentage: '19.1%'
    },
    {
      key: '4',
      source: '社交媒体',
      count: 180,
      percentage: '14.0%'
    },
    {
      key: '5',
      source: '其他渠道',
      count: 137,
      percentage: '10.7%'
    }
  ];

  // 学员续费金额趋势数据
  const renewalAmountData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    amounts: [32, 28, 38, 26, 42, 36, 30, 46, 38, 50, 48, 56]
  };

  // 处理时间范围变更
  const handleStudentTimeframeChange = (value: string) => {
    setTimeframe(value);
  };

  // 处理学员图表类型变更
  const handleStudentChartTypeChange = (value: string) => {
    setStudentChartType(value);
  };

  // 处理续费周期变更
  const handleRenewalTimeframeChange = (value: string) => {
    setRenewalTimeframe(value);
  };

  return (
    <div>
      {/* 学员指标卡片 */}
      <div className="stats-section">
        <div className="section-header" style={{ borderBottom: 'none !important', paddingBottom: 0 }}>
          <div className="section-title">学员指标</div>
          <div className="btn-group">
            <Button
              type={timeframe === 'week' ? 'primary' : 'default'}
              size="small"
              onClick={() => handleStudentTimeframeChange('week')}
            >
              本周
            </Button>
            <Button
              type={timeframe === 'month' ? 'primary' : 'default'}
              size="small"
              onClick={() => handleStudentTimeframeChange('month')}
            >
              本月
            </Button>
            <Button
              type={timeframe === 'quarter' ? 'primary' : 'default'}
              size="small"
              onClick={() => handleStudentTimeframeChange('quarter')}
            >
              季度
            </Button>
            <Button
              type={timeframe === 'year' ? 'primary' : 'default'}
              size="small"
              onClick={() => handleStudentTimeframeChange('year')}
            >
              年度
            </Button>
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {renderStatisticCard('总学员数', studentData.totalStudents, studentData.studentGrowth, '#3498db')}
          {renderStatisticCard('新增学员数', studentData.newStudents, studentData.newGrowth, '#2ecc71')}
          {renderStatisticCard('流失学员数', studentData.lostStudents, studentData.lostGrowth, '#e74c3c')}
        </Row>
      </div>

      {/* 学员增长趋势 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none' }}>
          <div className="chart-title">学员增长趋势</div>
          <div className="chart-actions">
            <div className="btn-group">
              <Button
                type={studentChartType === 'cumulative' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleStudentChartTypeChange('cumulative')}
              >
                累计学员
              </Button>
              <Button
                type={studentChartType === 'new' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleStudentChartTypeChange('new')}
              >
                新增学员
              </Button>
              <Button
                type={studentChartType === 'lost' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleStudentChartTypeChange('lost')}
              >
                流失学员
              </Button>
              <Button
                type={studentChartType === 'retention' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleStudentChartTypeChange('retention')}
              >
                留存率
              </Button>
            </div>
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
                data: studentChartType === 'cumulative' ? ['累计学员'] :
                      studentChartType === 'new' ? ['新增学员'] :
                      studentChartType === 'lost' ? ['流失学员'] : ['留存率'],
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
                boundaryGap: false,
                data: studentTrendData.months,
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
                name: studentChartType === 'retention' ? '留存率(%)' : '学员数量',
                min: studentChartType === 'retention' ? 80 : 0,
                max: studentChartType === 'retention' ? 100 : (studentChartType === 'cumulative' ? 1400 : 50),
                interval: studentChartType === 'retention' ? 5 : (studentChartType === 'cumulative' ? 200 : 10),
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#666'
                  }
                },
                axisLabel: {
                  formatter: studentChartType === 'retention' ? '{value}%' : '{value}'
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
                  name: studentChartType === 'cumulative' ? '累计学员' :
                        studentChartType === 'new' ? '新增学员' :
                        studentChartType === 'lost' ? '流失学员' : '留存率',
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  data: studentChartType === 'cumulative' ? studentTrendData.cumulative :
                        studentChartType === 'new' ? studentTrendData.new :
                        studentChartType === 'lost' ? studentTrendData.lost : studentTrendData.retention,
                  itemStyle: {
                    color: studentChartType === 'cumulative' ? '#3498db' :
                           studentChartType === 'new' ? '#2ecc71' :
                           studentChartType === 'lost' ? '#e74c3c' : '#f39c12'
                  },
                  lineStyle: {
                    width: 2
                  },
                  areaStyle: {
                    color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: studentChartType === 'cumulative' ? 'rgba(52,152,219,0.3)' :
                                        studentChartType === 'new' ? 'rgba(46,204,113,0.3)' :
                                        studentChartType === 'lost' ? 'rgba(231,76,60,0.3)' : 'rgba(243,156,18,0.3)'
                      }, {
                        offset: 1, color: studentChartType === 'cumulative' ? 'rgba(52,152,219,0.05)' :
                                        studentChartType === 'new' ? 'rgba(46,204,113,0.05)' :
                                        studentChartType === 'lost' ? 'rgba(231,76,60,0.05)' : 'rgba(243,156,18,0.05)'
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

      {/* 学员续费金额趋势 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none' }}>
          <div className="chart-title">学员续费金额趋势</div>
          <div className="chart-actions">
            <div className="btn-group">
              <Button
                type={renewalTimeframe === 'month' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleRenewalTimeframeChange('month')}
              >
                月度
              </Button>
              <Button
                type={renewalTimeframe === 'quarter' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleRenewalTimeframeChange('quarter')}
              >
                季度
              </Button>
              <Button
                type={renewalTimeframe === 'year' ? 'primary' : 'default'}
                size="small"
                onClick={() => handleRenewalTimeframeChange('year')}
              >
                年度
              </Button>
            </div>
          </div>
        </div>
        <div className="chart-wrapper">
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
                top: '8%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: renewalAmountData.months,
                axisLine: {
                  lineStyle: {
                    color: '#ddd'
                  }
                },
                axisLabel: {
                  interval: 0,
                  rotate: 0
                },
                splitLine: {
                  show: false
                }
              },
              yAxis: {
                type: 'value',
                name: '续费金额(万元)',
                nameTextStyle: {
                  padding: [0, 0, 0, 40]
                },
                axisLine: {
                  show: true,
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
              series: [
                {
                  name: '续费金额',
                  type: 'bar',
                  barWidth: '60%',
                  data: renewalAmountData.amounts,
                  itemStyle: {
                    color: '#5ad8a6'
                  }
                }
              ]
            }}
            style={{ height: '300px' }}
          />
        </div>
      </div>

      {/* 学员来源渠道分析 */}
      <div className="chart-container">
        <div className="chart-header" style={{ borderBottom: 'none' }}>
          <div className="chart-title">学员来源渠道分析</div>
        </div>
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <div className="chart-wrapper" style={{ height: 300 }}>
              <ReactECharts
                option={{
                  tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                  },
                  legend: {
                    orient: 'vertical',
                    right: 10,
                    top: 'center',
                    data: studentSourceData.map(item => item.source)
                  },
                  color: ['#5b8ff9', '#f6bd16', '#5ad8a6', '#945fb9', '#dd81e6'],
                  series: [
                    {
                      name: '来源渠道',
                      type: 'pie',
                      radius: ['50%', '70%'],
                      center: ['40%', '50%'],
                      avoidLabelOverlap: false,
                      label: {
                        show: false,
                        position: 'center'
                      },
                      emphasis: {
                        label: {
                          show: true,
                          fontSize: '14',
                          fontWeight: 'bold'
                        }
                      },
                      labelLine: {
                        show: false
                      },
                      data: studentSourceData.map(item => ({
                        value: item.count,
                        name: item.source
                      }))
                    }
                  ]
                }}
                style={{ height: '300px' }}
              />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="source-table-container">
              <div className="source-table-header">
                <div className="source-header-item">来源渠道</div>
                <div className="source-header-item">学员数</div>
                <div className="source-header-item">占比</div>
              </div>
              <div className="source-table-body">
                {studentSourceData.map(item => (
                  <div className="source-table-row" key={item.key}>
                    <div className="source-row-item">{item.source}</div>
                    <div className="source-row-item">{item.count}</div>
                    <div className="source-row-item">{item.percentage}</div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default StudentAnalysis;