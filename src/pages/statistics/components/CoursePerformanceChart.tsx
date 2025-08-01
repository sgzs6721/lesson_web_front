import React from 'react';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../constants/chartColors';

interface CoursePerformanceChartProps {
  data: any[] | null;
  loading: boolean;
}

const CoursePerformanceChart: React.FC<CoursePerformanceChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>加载中...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ height: '300px' }}>
        <Empty description="暂无数据" />
      </div>
    );
  }

  // Sort by total revenue and take top 8
  const topCourses = data
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 8);

  const courseNames = topCourses.map(course => course.courseName);
  const revenues = topCourses.map(course => course.totalRevenue / 10000); // 转换为万元
  const soldCourses = topCourses.map(course => course.totalSold);

  const option = {
    title: {
      text: '课程销售收入排行',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#262626'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        const dataIndex = params[0].dataIndex;
        const course = topCourses[dataIndex];
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${course.courseName}</div>
            <div>课程类型: ${course.courseType}</div>
            <div>销售数量: ${course.totalSold}份</div>
            <div>单价: ${course.unitPrice}元/课时</div>
            <div>总收入: ${(course.totalRevenue / 10000).toFixed(1)}万元</div>
            <div>已消耗: ${course.consumedLessons}课时</div>
            <div>剩余: ${course.remainingLessons}课时</div>
          </div>
        `;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: courseNames,
      axisLabel: {
        rotate: 45,
        fontSize: 11,
        color: '#666'
      },
      axisTick: {
        alignWithLabel: true
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '收入(万元)',
        position: 'left',
        axisLabel: {
          formatter: '{value}万',
          fontSize: 11,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      {
        type: 'value',
        name: '销售数量',
        position: 'right',
        axisLabel: {
          formatter: '{value}份',
          fontSize: 11,
          color: '#666'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '收入',
        type: 'bar',
        yAxisIndex: 0,
        data: revenues,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: CHART_COLORS[0] },
              { offset: 1, color: CHART_COLORS[0] + '80' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: CHART_COLORS[0]
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}万',
          fontSize: 10,
          color: '#666'
        }
      },
      {
        name: '销售数量',
        type: 'line',
        yAxisIndex: 1,
        data: soldCourses,
        lineStyle: {
          color: CHART_COLORS[1],
          width: 2
        },
        itemStyle: {
          color: CHART_COLORS[1]
        },
        symbol: 'circle',
        symbolSize: 6,
        smooth: true
      }
    ],
    legend: {
      data: ['收入', '销售数量'],
      bottom: 0,
      textStyle: {
        fontSize: 11,
        color: '#666'
      }
    }
  };

  return (
    <div className="course-performance-chart">
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default CoursePerformanceChart;
