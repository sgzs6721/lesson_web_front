import React from 'react';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../constants/chartColors';

interface CourseEngagementChartProps {
  data: any[] | null;
  chartType: 'soldCourses' | 'consumedLessons' | 'salesAmount' | 'newCourses';
  loading: boolean;
}

const CourseEngagementChart: React.FC<CourseEngagementChartProps> = ({ data, chartType, loading }) => {
  if (loading || !data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Empty description="暂无数据" />
      </div>
    );
  }

  // 根据chartType获取相应的数据
  const getChartData = () => {
    switch (chartType) {
      case 'soldCourses':
        return {
          name: '已销课程',
          data: data.map(item => item.salesCount || 0),
          color: CHART_COLORS[0]
        };
      case 'newCourses':
        return {
          name: '新报课程',
          data: data.map(item => item.enrollmentCount || 0),
          color: CHART_COLORS[1]
        };
      case 'consumedLessons':
        return {
          name: '消耗课时',
          data: data.map(item => item.consumedLessons || 0),
          color: CHART_COLORS[2]
        };
      case 'salesAmount':
        return {
          name: '销售额',
          data: data.map(item => item.salesAmount || 0),
          color: CHART_COLORS[3]
        };
      default:
        return {
          name: '数据',
          data: [],
          color: CHART_COLORS[0]
        };
    }
  };

  const chartData = getChartData();
  const timePoints = data.map(item => item.timePoint || '');

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
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
      data: timePoints
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: chartData.name,
        type: 'line',
        smooth: true,
        data: chartData.data,
        itemStyle: {
          color: chartData.color
        },
        lineStyle: {
          color: chartData.color
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: chartData.color + '40'
              },
              {
                offset: 1,
                color: chartData.color + '10'
              }
            ]
          }
        }
      }
    ]
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '300px' }}
    />
  );
};

export default CourseEngagementChart;
