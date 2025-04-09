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
          yAxisLabel: '平均课时量'
        };
      case 'students':
        return {
          title: '各校区教练平均学员数对比',
          yAxisLabel: '平均学员数'
        };
      case 'salary':
        return {
          title: '各校区教练平均工资对比',
          yAxisLabel: '平均工资(元)'
        };
      default:
        return {
          title: '教练绩效对比',
          yAxisLabel: '数值'
        };
    }
  };

  // 准备数据
  const labels = Object.values(data).map(campus => campus.name);
  const values = Object.values(data).map(campus => campus.coachPerformance[metric]);
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
            color: '#9b59b6'
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

export default CoachPerformanceChart; 