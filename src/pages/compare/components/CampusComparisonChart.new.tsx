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
  
  // ECharts配置选项
  const getOption = () => {
    return {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
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
        data: labels,
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel
      },
      series: [
        {
          name: yAxisLabel,
          type: 'bar',
          barWidth: '60%',
          data: values,
          itemStyle: {
            color: '#3498db'
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
    />
  );
};

export default CampusComparisonChart;
