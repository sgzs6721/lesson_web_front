import React from 'react';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { AllCampusData, CoachMetric } from '../types/campus';

interface CoachPerformanceChartProps {
  data: AllCampusData;
  metric: CoachMetric;
}

const CoachPerformanceChart: React.FC<CoachPerformanceChartProps> = ({ data, metric }) => {
  // 设置图表标题和Y轴标签
  const getChartConfig = (metric: CoachMetric) => {
    switch(metric) {
      case 'lessons':
        return {
          title: '各校区教练平均课时量对比',
          yAxisLabel: '平均课时量',
          unit: '课时'
        };
      case 'students':
        return {
          title: '各校区教练平均学员数对比',
          yAxisLabel: '平均学员数',
          unit: '人'
        };
      case 'salary':
        return {
          title: '各校区教练平均收入对比',
          yAxisLabel: '平均收入',
          unit: '万元'
        };
      default:
        return {
          title: '教练绩效对比',
          yAxisLabel: '数值',
          unit: ''
        };
    }
  };

  // 准备数据
  const labels = Object.values(data).map(campus => campus.name);
  const values = Object.values(data).map(campus => campus.coachPerformance[metric]);
  const { yAxisLabel, unit } = getChartConfig(metric);

  // 定义多种颜色
  const colors = ['#722ed1', '#52c41a', '#faad14', '#f5222d', '#1890ff', '#13c2c2', '#eb2f96', '#fa8c16'];

  // ECharts配置选项
  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: ${param.value}${unit}`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisTick: {
          alignWithLabel: true
        },
        axisLabel: {
          fontSize: 12,
          color: '#666',
          interval: 0,
          rotate: labels.length > 4 ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel,
        nameTextStyle: {
          color: '#666',
          fontSize: 12
        },
        axisLabel: {
          fontSize: 12,
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      },
      series: [
        {
          name: yAxisLabel,
          type: 'bar',
          barWidth: '50%',
          data: values.map((value, index) => ({
            value: value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: colors[index % colors.length]
                }, {
                  offset: 1, color: colors[index % colors.length] + '80'
                }]
              },
              borderRadius: [4, 4, 0, 0]
            }
          })),
          emphasis: {
            disabled: true
          }
        }
      ]
    };
  };

  if (!data || Object.keys(data).length === 0) {
    return <Empty description="暂无数据" />;
  }

  return (
    <ReactECharts
      option={getOption()}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default CoachPerformanceChart;