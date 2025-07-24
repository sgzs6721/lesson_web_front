import React, { useState } from 'react';
import { Empty, Radio, Row, Col, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { CourseRevenueData } from '../hooks/useCourseAnalysisData';
import { CourseComparisonData } from './CourseAnalysis';
import { CHART_COLORS } from '../constants/chartColors';

interface CourseRatingChartProps {
  data: CourseComparisonData[] | null;
  loading: boolean;
}

type RevenueChartType = 'distribution' | 'trend';

const CourseRatingChart: React.FC<CourseRatingChartProps> = ({ data, loading }) => {
  const [chartType, setChartType] = useState<RevenueChartType>('distribution');

  if (loading) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ height: '300px' }}>
        <Empty description="暂无数据" />
      </div>
    );
  }

  const getDistributionOption = () => {
    // Group by course type and calculate revenue
    const revenueByType: { [key: string]: number } = {};
    data.forEach(course => {
      if (!revenueByType[course.courseType]) {
        revenueByType[course.courseType] = 0;
      }
      revenueByType[course.courseType] += course.totalRevenue;
    });

    const typeLabels = Object.keys(revenueByType);
    const typeRevenues = Object.values(revenueByType);
    const totalRevenue = typeRevenues.reduce((sum, revenue) => sum + revenue, 0);

    return {
      title: {
        text: '课程类型收入分布',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#262626'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const revenue = params.value;
          const percentage = ((revenue / totalRevenue) * 100).toFixed(1);
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${params.name}</div>
              <div>收入: ${(revenue / 10000).toFixed(1)}万元</div>
              <div>占比: ${percentage}%</div>
            </div>
          `;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        data: typeLabels,
        textStyle: {
          fontSize: 11,
          color: '#666'
        }
      },
      series: [
        {
          name: '收入分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',
            formatter: function(params: any) {
              const percentage = ((params.value / totalRevenue) * 100).toFixed(1);
              return `${params.name}\n${percentage}%`;
            },
            fontSize: 11,
            color: '#666'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 12,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data: typeLabels.map((type, index) => ({
            value: revenueByType[type],
            name: type,
            itemStyle: {
              color: CHART_COLORS[index % CHART_COLORS.length]
            }
          }))
        }
      ]
    };
  };

  const getTrendOption = () => {
    // Mock monthly revenue trend data
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const revenues = [171, 194.4, 225, 255.6, 280.8, 320.4, 351, 378, 405, 432, 459, 482.4];

    return {
      title: {
        text: '月度收入趋势',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#262626'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          const point = params[0];
          return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${point.name}</div>
              <div>收入: ${point.value}万元</div>
            </div>
          `;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: months,
        axisLabel: {
          fontSize: 11,
          color: '#666'
        },
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '收入(万元)',
        axisLabel: {
          formatter: '{value}万',
          fontSize: 11,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#e8e8e8'
          }
        }
      },
      series: [
        {
          name: '月度收入',
          type: 'line',
          smooth: true,
          data: revenues,
          lineStyle: {
            color: CHART_COLORS[2],
            width: 3
          },
          itemStyle: {
            color: CHART_COLORS[2],
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: CHART_COLORS[2] + '40' },
                { offset: 1, color: CHART_COLORS[2] + '10' }
              ]
            }
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            itemStyle: {
              color: CHART_COLORS[2],
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: CHART_COLORS[2] + '50'
            },
            scale: true
          },
          markLine: {
            data: [
              {
                type: 'average',
                name: '平均值',
                lineStyle: {
                  color: CHART_COLORS[2],
                  type: 'dashed'
                },
                label: {
                  formatter: function(params: any) {
                    return `平均: ${params.value.toFixed(1)}万元`;
                  },
                  fontSize: 10
                }
              }
            ]
          }
        }
      ]
    };
  };

  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, course) => sum + course.totalRevenue, 0);
  const averagePrice = data.reduce((sum, course) => sum + course.unitPrice, 0) / data.length;
  const totalSold = data.reduce((sum, course) => sum + course.totalSold, 0);

  return (
    <div className="course-rating-chart">
      {/* Revenue Summary */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总收入"
            value={totalRevenue / 10000}
            precision={1}
            suffix="万元"
            prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
            valueStyle={{ fontSize: 18, color: '#1890ff' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="平均单价"
            value={averagePrice}
            precision={0}
            suffix="元/课时"
            valueStyle={{ fontSize: 18, color: '#52c41a' }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="总销量"
            value={totalSold}
            suffix="份"
            valueStyle={{ fontSize: 18, color: '#faad14' }}
          />
        </Col>
      </Row>

      {/* Chart Type Selector */}
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Radio.Group 
          value={chartType} 
          onChange={(e) => setChartType(e.target.value)}
          size="small"
        >
          <Radio.Button value="distribution">收入分布</Radio.Button>
          <Radio.Button value="trend">收入趋势</Radio.Button>
        </Radio.Group>
      </div>

      {/* Chart */}
      <ReactECharts
        option={chartType === 'distribution' ? getDistributionOption() : getTrendOption()}
        style={{ height: '200px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default CourseRatingChart;
