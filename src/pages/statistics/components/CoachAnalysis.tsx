import React, { useState } from 'react';
import { Button, Spin, Space } from 'antd';
import ReactECharts from 'echarts-for-react';

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

  // 示例数据
  const coachData = data || {
    totalCoaches: 42,
    averageLessons: 82.5,
    averageSalary: 8500,
    retentionRate: 85.2,
    coachGrowth: 4.8,
    lessonGrowth: 5.3,
    salaryGrowth: 6.2,
    retentionGrowth: 3.1
  };

  // 教练课时统计数据
  const coachLessonsData = {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    lessons: [350, 380, 410, 380, 420, 450, 470, 490, 520, 540, 560, 580],
    students: [25, 28, 30, 27, 32, 35, 38, 40, 42, 45, 48, 50],
    income: [30, 32, 35, 33, 38, 40, 42, 45, 48, 50, 52, 55]
  };

  // 教练多维度对比数据
  const coachBarData = {
    coaches: ['李教练', '王教练', '张教练', '赵教练', '刘教练'],
    lessons: [125, 115, 110, 100, 95],
    students: [25, 24, 22, 20, 18],
    income: [30, 28, 26, 24, 22]
  };

  // 已在按钮中直接使用 setCoachChartType

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
            <div className="stat-title">月平均课时量</div>
            <div className="stat-value">{coachData.averageLessons}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {coachData.lessonGrowth}%</span>
              <span>较上期</span>
            </div>
          </div>
          <div className="stat-card" style={{ borderTop: '4px solid #e74c3c' }}>
            <div className="stat-title">月平均工资</div>
            <div className="stat-value">{coachData.averageSalary ? coachData.averageSalary.toLocaleString() : '8,500'}</div>
            <div className="stat-trend">
              <span className="trend-up">↑ {coachData.salaryGrowth || 6.2}%</span>
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
        <div className="chart-header" style={{ borderBottom: 'none !important', paddingBottom: 0 }}>
          <div className="chart-title">教练课时统计</div>
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
                data: ['课时数', '学员数', '收入'],
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
              yAxis: [
                {
                  type: 'value',
                  name: '课时数',
                  position: 'left',
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#69c0ff'
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
                      color: '#b37feb'
                    }
                  },
                  splitLine: {
                    show: false
                  }
                }
              ],
              series: [
                {
                  name: '课时数',
                  type: 'bar',
                  barWidth: '20%',
                  data: coachLessonsData.lessons,
                  itemStyle: {
                    color: '#69c0ff'
                  }
                },
                {
                  name: '学员数',
                  type: 'bar',
                  barWidth: '20%',
                  yAxisIndex: 1,
                  data: coachLessonsData.students,
                  itemStyle: {
                    color: '#b37feb'
                  }
                },
                {
                  name: '收入',
                  type: 'bar',
                  barWidth: '20%',
                  yAxisIndex: 0,
                  data: coachLessonsData.income,
                  itemStyle: {
                    color: '#95de64'
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
        <div className="chart-header" style={{ borderBottom: 'none !important', paddingBottom: 0 }}>
          <div className="chart-title">教练TOP10多维度对比</div>
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
                data: coachBarType === 'all' ? ['课时量', '学员数', '创收额(千元)'] :
                      coachBarType === 'lessons' ? ['课时量'] :
                      coachBarType === 'students' ? ['学员数'] : ['创收额(千元)'],
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
              yAxis: coachBarType === 'all' ? [
                {
                  type: 'value',
                  name: '课时量',
                  position: 'left',
                  axisLine: {
                    show: true,
                    lineStyle: {
                      color: '#ffd591'
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
                      color: '#87e8de'
                    }
                  },
                  splitLine: {
                    show: false
                  }
                }
              ] : [{
                type: 'value',
                name: coachBarType === 'lessons' ? '课时量' :
                      coachBarType === 'students' ? '学员数' : '创收额(千元)',
                axisLine: {
                  show: true,
                  lineStyle: {
                    color: coachBarType === 'lessons' ? '#ffd591' :
                           coachBarType === 'students' ? '#87e8de' : '#ffadd2'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#eee',
                    type: 'dashed'
                  }
                }
              }],
              series: coachBarType === 'all' ? [
                {
                  name: '课时量',
                  type: 'bar',
                  barWidth: '20%',
                  data: coachBarData.lessons,
                  itemStyle: {
                    color: '#ffd591'
                  }
                },
                {
                  name: '学员数',
                  type: 'bar',
                  barWidth: '20%',
                  yAxisIndex: 1,
                  data: coachBarData.students,
                  itemStyle: {
                    color: '#87e8de'
                  }
                },
                {
                  name: '创收额(千元)',
                  type: 'bar',
                  barWidth: '20%',
                  yAxisIndex: 0,
                  data: coachBarData.income,
                  itemStyle: {
                    color: '#ffadd2'
                  }
                }
              ] : [{
                name: coachBarType === 'lessons' ? '课时量' :
                      coachBarType === 'students' ? '学员数' : '创收额(千元)',
                type: 'bar',
                barWidth: '40%',
                yAxisIndex: 0,
                data: coachBarType === 'lessons' ? coachBarData.lessons :
                      coachBarType === 'students' ? coachBarData.students : coachBarData.income,
                itemStyle: {
                  color: coachBarType === 'lessons' ? '#ffd591' :
                         coachBarType === 'students' ? '#87e8de' : '#ffadd2'
                }
              }]
            }}
            style={{ height: '300px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoachAnalysis;