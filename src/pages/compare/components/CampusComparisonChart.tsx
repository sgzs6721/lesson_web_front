import React from 'react';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { AllCampusData, ComparisonMetric } from '../types/campus';

interface CampusComparisonChartProps {
  data: AllCampusData;
  metric: ComparisonMetric;
}

const CampusComparisonChart: React.FC<CampusComparisonChartProps> = ({ data, metric }) => {
  // 设置图表标题和Y轴标签
  const getChartConfig = (metric: ComparisonMetric) => {
    switch(metric) {
      case 'revenue':
        return {
          title: '各校区收入对比(万元)',
          yAxisLabel: '收入(万元)'
        };
      case 'profit':
        return {
          title: '各校区利润对比(万元)',
          yAxisLabel: '利润(万元)'
        };
      case 'students':
        return {
          title: '各校区学员数对比',
          yAxisLabel: '学员数'
        };
      case 'coaches':
        return {
          title: '各校区教练数对比',
          yAxisLabel: '教练数'
        };
      default:
        return {
          title: '校区对比',
          yAxisLabel: '数值'
        };
    }
  };

  // 准备数据
  const labels = Object.values(data).map(campus => campus.name);
  const values = Object.values(data).map(campus => campus[metric]);
  const { title, yAxisLabel } = getChartConfig(metric);

  // 定义多种颜色
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16'];

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
          let unit = '';
          if (metric === 'revenue' || metric === 'profit') {
            unit = '万元';
          } else if (metric === 'students') {
            unit = '人';
          } else if (metric === 'coaches') {
            unit = '人';
          }
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
          color: '#666'
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
            itemStyle: {
              color: function(params: any) {
                const color = colors[params.dataIndex % colors.length];
                return {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: color
                  }, {
                    offset: 1, color: color + 'CC'
                  }]
                };
              }
            }
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

export default CampusComparisonChart;
