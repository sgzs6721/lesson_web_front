import React, { useState } from 'react';
import { Empty, Radio, Space } from 'antd';
import ReactECharts from 'echarts-for-react';
import { CHART_COLORS } from '../constants/chartColors';

interface CourseComparisonChartProps {
  data: any[] | null;
  loading: boolean;
}

type ComparisonMetric = 'totalSold' | 'totalRevenue' | 'unitPrice';

const CourseComparisonChart: React.FC<CourseComparisonChartProps> = ({ data, loading }) => {
  const [metric, setMetric] = useState<ComparisonMetric>('totalSold');

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

  const getMetricConfig = () => {
    switch (metric) {
      case 'totalSold':
        return {
          title: '课程销售数量排行榜',
          yAxisName: '销售数量',
          formatter: '{value}份',
          sortKey: 'totalSold' as keyof any,
          color: CHART_COLORS[0]
        };
      case 'totalRevenue':
        return {
          title: '课程收入排行榜',
          yAxisName: '收入(万元)',
          formatter: function(value: number) {
            return value >= 10000 ? `${(value / 10000).toFixed(1)}万` : `${value}`;
          },
          sortKey: 'totalRevenue' as keyof any,
          color: CHART_COLORS[3]
        };
      case 'unitPrice':
        return {
          title: '课程单价排行榜',
          yAxisName: '单价(元)',
          formatter: '{value}元',
          sortKey: 'unitPrice' as keyof any,
          color: CHART_COLORS[2]
        };
      default:
        return {
          title: '课程排行榜',
          yAxisName: '数值',
          formatter: '{value}',
          sortKey: 'totalSold' as keyof any,
          color: CHART_COLORS[0]
        };
    }
  };

  const config = getMetricConfig();
  
  // Sort data and take top 6
  const sortedData = [...data]
    .sort((a, b) => (b[config.sortKey] as number) - (a[config.sortKey] as number))
    .slice(0, 6);

  const courseNames = sortedData.map(course => course.courseName);
  const values = sortedData.map(course => course[config.sortKey] as number);

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
      axisPointer: {
        type: 'shadow'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e8e8e8',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      },
      formatter: function(params: any) {
        const dataIndex = params[0].dataIndex;
        const course = sortedData[dataIndex];

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
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: courseNames,
      axisLabel: {
        rotate: 30,
        fontSize: 11,
        color: '#666'
      },
      axisTick: {
        alignWithLabel: true
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
        formatter: typeof config.formatter === 'function' ? config.formatter : config.formatter,
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
        type: 'bar',
        data: values.map((value, index) => ({
          value,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: CHART_COLORS[index % CHART_COLORS.length] },
                { offset: 1, color: CHART_COLORS[index % CHART_COLORS.length] }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          }
        })),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          }
        },
        label: {
          show: true,
          position: 'top',
          formatter: function(params: any) {
            if (metric === 'totalRevenue') {
              return params.value >= 10000 ? `${(params.value / 10000).toFixed(1)}万` : `${params.value}`;
            }
            return params.value + (metric === 'unitPrice' ? '元' : metric === 'totalSold' ? '份' : '');
          },
          fontSize: 10,
          color: '#666'
        }
      }
    ]
  };

  return (
    <div className="course-comparison-chart">
      <div style={{ marginBottom: 16, textAlign: 'center' }}>
        <Radio.Group 
          value={metric} 
          onChange={(e) => setMetric(e.target.value)}
          size="small"
        >
          <Radio.Button value="totalSold">销量排行</Radio.Button>
          <Radio.Button value="totalRevenue">收入排行</Radio.Button>
          <Radio.Button value="unitPrice">单价排行</Radio.Button>
        </Radio.Group>
      </div>
      
      <ReactECharts
        option={option}
        style={{ height: '260px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default CourseComparisonChart;
