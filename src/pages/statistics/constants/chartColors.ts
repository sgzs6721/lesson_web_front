// 图表颜色配置 - 高饱和度鲜艳色系
export const CHART_COLORS = [
  '#3498DB', '#2ECC71', '#F1C40F', '#E74C3C', '#9B59B6', '#1ABC9C',
  '#E67E22', '#E91E63', '#00BCD4', '#8BC34A', '#FF9800', '#795548'
];

// 生成带渐变效果的柱状图颜色配置
export const generateBarItemStyle = (index: number) => ({
  color: {
    type: 'linear' as const,
    x: 0, y: 0, x2: 0, y2: 1,
    colorStops: [
      { offset: 0, color: CHART_COLORS[index % CHART_COLORS.length] },
      { offset: 1, color: CHART_COLORS[index % CHART_COLORS.length] }
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