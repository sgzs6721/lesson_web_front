import React from 'react';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { CourseSalesData } from './CourseAnalysis';
import { CHART_COLORS } from '../constants/chartColors';

interface CourseEngagementChartProps {
  data: CourseSalesData | null;
  chartType: 'soldCourses' | 'consumedLessons' | 'salesAmount' | 'newCourses';
  loading: boolean;
}

const CourseEngagementChart: React.FC<CourseEngagementChartProps> = ({ 
  data, 
  chartType, 
  loading 
}) => {
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

  const getChartConfig = () => {
    switch (chartType) {
      case 'soldCourses':
        return {
          title: '课程销售趋势',
          yAxisName: '销课数量',
          data: data.soldCourses,
          color: CHART_COLORS[0],
          formatter: '{value}份'
        };
      case 'consumedLessons':
        return {
          title: '课时消耗趋势',
          yAxisName: '消耗课时',
          data: data.consumedLessons,
          color: CHART_COLORS[1],
          formatter: '{value}课时'
        };
      case 'salesAmount':
        return {
          title: '销售额趋势',
          yAxisName: '销售额(万元)',
          data: data.salesAmount,
          color: CHART_COLORS[2],
          formatter: '{value}万元'
        };
      case 'newCourses':
        return {
          title: '新报课程趋势',
          yAxisName: '新报课程数',
          data: data.newCourses,
          color: CHART_COLORS[3],
          formatter: '{value}份'
        };
      default:
        return {
          title: '课程数据趋势',
          yAxisName: '数值',
          data: data.soldCourses,
          color: CHART_COLORS[0],
          formatter: '{value}'
        };
    }
  };

  const config = getChartConfig();

  const option = {
    title: {
      text: config.title,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#262626'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: function(params: any) {
        const point = params[0];
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${point.name}</div>
            <div>${config.yAxisName}: ${point.value}${chartType === 'consumedLessons' ? '课时' : chartType === 'salesAmount' ? '万元' : '份'}</div>
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
      data: data.months,
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
      name: config.yAxisName,
      axisLabel: {
        formatter: config.formatter,
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
        name: config.yAxisName,
        type: 'line',
        smooth: true,
        data: config.data,
        lineStyle: {
          color: config.color,
          width: 3
        },
        itemStyle: {
          color: config.color,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: config.color + '40' },
              { offset: 1, color: config.color + '10' }
            ]
          }
        },
        symbol: 'circle',
        symbolSize: 6,
        emphasis: {
          itemStyle: {
            color: config.color,
            borderColor: '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: config.color + '50'
          },
          scale: true
        },
        markPoint: {
          data: [
            {
              type: 'max',
              name: '最大值',
              itemStyle: {
                color: config.color
              },
              label: {
                formatter: function(params: any) {
                  return `最高: ${params.value}${chartType === 'consumedLessons' ? '课时' : chartType === 'salesAmount' ? '万元' : '份'}`;
                },
                fontSize: 10
              }
            }
          ]
        },
        markLine: {
          data: [
            {
              type: 'average',
              name: '平均值',
              lineStyle: {
                color: config.color,
                type: 'dashed'
              },
              label: {
                formatter: function(params: any) {
                  return `平均: ${params.value.toFixed(1)}${chartType === 'consumedLessons' ? '课时' : chartType === 'salesAmount' ? '万元' : '份'}`;
                },
                fontSize: 10
              }
            }
          ]
        }
      }
    ]
  };

  return (
    <div className="course-engagement-chart">
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default CourseEngagementChart;
