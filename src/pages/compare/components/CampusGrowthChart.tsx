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
  const series = Object.values(data).map((campus, index) => ({
    name: campus.name,
    type: 'line',
    data: campus.growthData[metric],
    smooth: true
  }));
  
  const { title, yAxisLabel } = getChartConfig(metric);
  
  // ECharts配置选项
  const getOption = () => {
    return {
      title: {
        text: title,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: Object.values(data).map(campus => campus.name),
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: labels
      },
      yAxis: {
        type: 'value',
        name: yAxisLabel
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
    />
  );
};

export default CampusGrowthChart; 