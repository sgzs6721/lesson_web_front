import React, { useState } from 'react';
import { Button, Spin } from 'antd';
import ReactECharts from 'echarts-for-react';

interface CoachAnalysisProps {
  data: any;
  loading: boolean;
}

const CoachAnalysis: React.FC<CoachAnalysisProps> = ({ data, loading }) => {
  const [coachChartType, setCoachChartType] = useState<string>('lessons');
  const [coachMetricView, setCoachMetricView] = useState<string>('all');

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // 示例数据
  const coachData = data || {
    totalCoaches: 42,
    averageLessons: 82.5,
    retentionRate: 85.2,
    coachGrowth: 4.8,
    lessonGrowth: 5.3,
    retentionGrowth: 3.1
  };

  // 教练课时统计数据
  const coachLessonsData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    lessons: [350, 380, 410, 380, 420, 450, 470, 490, 520, 540, 560, 580]
  };

  // 教练多维度对比数据
  const coachBarData = {
    coaches: ['李教练', '王教练', '张教练', '赵教练', '刘教练'],
    lessons: [125, 115, 110, 100, 95],
    students: [25, 24, 22, 20, 18],
    income: [30, 28, 26, 24, 22]
  };

  // 处理教练图表类型变更
  const handleCoachChartTypeChange = (value: string) => {
    setCoachChartType(value);
  };

  // 处理教练指标视图变更
  const handleCoachMetricViewChange = (value: string) => {
    setCoachMetricView(value);
  };

  return (
    <div>
      {/* 教练指标卡片 */}
      <div className="stats-section">
        <div className="section-header">
          <div className="section-title">教练绩效指标</div>
        </div>
        <div className="stats-cards">
          <div className="stat-card" style={{ borderTop: '4px solid #3498db' }}>
            <div className="stat-title">教练总数</div>
            <div className="stat-value">{coachData.totalCoaches}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {coachData.coachGrowth}%</span>
              <span>较上期</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #f39c12' }}>
            <div className="stat-title">平均课时量</div>
            <div className="stat-value">{coachData.averageLessons}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {coachData.lessonGrowth}%</span>
              <span>较上期</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #1abc9c' }}>
            <div className="stat-title">学员留存贡献率</div>
            <div className="stat-value">{coachData.retentionRate}%</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {coachData.retentionGrowth}%</span>
              <span>较上期</span>
            </div>
          </div>
        </div>
      </div>

      {/* 教练课时统计 */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">教练课时统计</div>
          <div className="chart-actions">
            <div className="btn-group">
              <Button
                type="primary"
                size="small"
              >
                课时数
              </Button>
              <Button
                type="default"
                size="small"
              >
                学员数
              </Button>
              <Button
                type="default"
                size="small"
              >
                收入
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
                  type: 'line'
                }
              },
              legend: {
                data: ['总课时数'],
                show: false
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
                data: coachLessonsData.months,
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
                name: '课时数',
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: '#666'
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
                  name: '总课时数',
                  type: 'line',
                  smooth: true,
                  symbol: 'circle',
                  symbolSize: 6,
                  data: coachLessonsData.lessons,
                  itemStyle: {
                    color: '#5b8ff9'
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
                        offset: 0, color: 'rgba(91,143,249,0.3)'
                      }, {
                        offset: 1, color: 'rgba(91,143,249,0.05)'
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

      {/* 教练多维度对比 */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">教练TOP10多维度对比</div>
          <div className="chart-actions">
            <div className="btn-group">
              <Button
                type="primary"
                size="small"
              >
                所有指标
              </Button>
              <Button
                type="default"
                size="small"
              >
                课时量
              </Button>
              <Button
                type="default"
                size="small"
              >
                学员数
              </Button>
              <Button
                type="default"
                size="small"
              >
                创收额
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
              legend: {
                data: ['课时量', '学员数', '创收额(千元)'],
                top: 'bottom',
                left: 'center'
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                top: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: coachBarData.coaches,
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#ddd'
                    }
                  },
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  name: '课时量',
                  position: 'left',
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#5b8ff9'
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
                {
                  type: 'value',
                  name: '学员数',
                  position: 'right',
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#f6bd16'
                    }
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: '课时量',
                  type: 'bar',
                  barWidth: '20%',
                  data: coachBarData.lessons,
                  itemStyle: {
                    color: '#5b8ff9'
                  }
                },
                {
                  name: '学员数',
                  type: 'bar',
                  barWidth: '20%',
                  yAxisIndex: 1,
                  data: coachBarData.students,
                  itemStyle: {
                    color: '#f6bd16'
                  }
                },
                {
                  name: '创收额(千元)',
                  type: 'bar',
                  barWidth: '20%',
                  data: coachBarData.income,
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
    </div>
  );
};

export default CoachAnalysis;