// 图表颜色配置
export const CHART_COLORS = [
  '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', 
  '#eb2f96', '#fa8c16', '#a0d911', '#2f54eb', '#fa541c', '#1890ff'
];

// 生成带渐变效果的柱状图颜色配置
export const generateBarItemStyle = (index: number) => ({
  color: {
    type: 'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: CHART_COLORS[index % CHART_COLORS.length] },
      { offset: 1, color: CHART_COLORS[index % CHART_COLORS.length] + '80' }
    ]
  },
  borderRadius: [4, 4, 0, 0]
});

// 获取纯色配置（用于多系列图表）
export const getBarColor = (index: number) => CHART_COLORS[index % CHART_COLORS.length];

// 预定义的系列颜色映射
export const SERIES_COLORS = {
  primary: '#1890ff',
  success: '#52c41a', 
  warning: '#faad14',
  danger: '#f5222d',
  info: '#13c2c2',
  purple: '#722ed1'
}; 