import React from 'react';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import { AllCampusData, TrendMetric } from '../types/campus';

interface CampusGrowthChartProps {
  data: AllCampusData;
  metric: TrendMetric;
}

const CampusGrowthChart: React.FC<CampusGrowthChartProps> = ({ data, metric }) => {
  // 设置图表标题和Y轴标签
  const getChartConfig = (metric: TrendMetric) => {
    switch(metric) {
      case 'students':
        return {
          title: '各校区学员增长趋势',
          yAxisLabel: '学员数量'
        };
      case 'revenue':
        return {
          title: '各校区收入增长趋势',
          yAxisLabel: '收入(万元)'
        };
      case 'profit':
        return {
          title: '各校区利润增长趋势',
          yAxisLabel: '利润(万元)'
        };
      default:
        return {
          title: '增长趋势',
          yAxisLabel: '数值'
        };
    }
  };

  // 准备数据
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
  const series = Object.values(data).map((campus, index) => ({
    name: campus.name,
    type: 'line',
    data: campus.growthData[metric],
    smooth: true,
    symbol: 'circle',
    symbolSize: 6,
    lineStyle: {
      width: 3,
      color: colors[index % colors.length]
    },
    itemStyle: {
      color: colors[index % colors.length]
    },
    areaStyle: {
      opacity: 0.3,
      color: colors[index % colors.length]
    },
    emphasis: {
      disabled: true
    }
  }));

  const { title, yAxisLabel } = getChartConfig(metric);

  // ECharts配置选项
  const getOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e8e8e8',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: function(params: any) {
          let result = `${params[0].name}<br/>`;
          params.forEach((param: any) => {
            let unit = '';
            if (metric === 'revenue' || metric === 'profit') {
              unit = '万元';
            } else if (metric === 'students') {
              unit = '人';
            }
            result += `${param.marker}${param.seriesName}: ${param.value}${unit}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: Object.values(data).map(campus => campus.name),
        bottom: 10,
        textStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '20%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels,
        axisLabel: {
          fontSize: 12,
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
      series: series
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

export default CampusGrowthChart;