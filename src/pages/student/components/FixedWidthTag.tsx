import React from 'react';
import { Tag } from 'antd';
import { TagProps } from 'antd/lib/tag';

interface FixedWidthTagProps extends TagProps {
  width?: number;
  variant?: 'filled' | 'outlined';
}

/**
 * 固定宽度的标签组件，提供更加稳重高级的样式
 * @param props 标签属性
 * @returns 固定宽度的标签组件
 */
const FixedWidthTag: React.FC<FixedWidthTagProps> = ({
  width = 60,
  children,
  variant = 'filled',
  color = 'default',
  ...props
}) => {
  // 定义更加高级的颜色映射
  const colorMap: Record<string, { background: string; text: string; border: string }> = {
    default: { background: '#f7f7f7', text: '#5c5c5c', border: '#e8e8e8' },
    green: { background: '#f0f9f0', text: '#2c7a2c', border: '#d4e8d4' },
    blue: { background: '#f0f5fa', text: '#2c5282', border: '#d4e2f0' },
    red: { background: '#fdf2f2', text: '#9b2c2c', border: '#f0d4d4' },
    orange: { background: '#faf5eb', text: '#97590d', border: '#f0e4d4' },
    purple: { background: '#f5f0fa', text: '#553c9a', border: '#e4d4f0' },
    gray: { background: '#f7f7f7', text: '#6b7280', border: '#e5e7eb' },
    // 新增高级颜色
    teal: { background: '#e6fffa', text: '#285e61', border: '#b2f5ea' },
    indigo: { background: '#ebf4ff', text: '#434190', border: '#c3dafe' },
    pink: { background: '#fef5f7', text: '#97266d', border: '#fad1e8' },
    cyan: { background: '#e6f7fa', text: '#046c7a', border: '#a8e1eb' },
    amber: { background: '#fffbeb', text: '#92400e', border: '#fde68a' },
  };

  // 获取颜色配置
  const colorConfig = colorMap[color as string] || colorMap.default;

  // 根据变体类型设置样式
  const variantStyle = variant === 'outlined'
    ? {
        background: 'transparent',
        color: colorConfig.text,
        border: `1px solid ${colorConfig.border}`,
      }
    : {
        background: colorConfig.background,
        color: colorConfig.text,
        border: `1px solid ${colorConfig.border}`,
        boxShadow: `0 2px 4px rgba(0, 0, 0, 0.04)`,
      };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Tag
        {...props}
        color={undefined} // 不使用 antd 的默认颜色
        style={{
          width: `${width}px`,
          textAlign: 'center',
          display: 'inline-block',
          margin: 0,
          padding: '4px 0',
          fontSize: '12px',
          fontWeight: 500,
          borderRadius: '6px',
          letterSpacing: '0.3px',
          transition: 'all 0.2s ease',
          ...variantStyle,
          ...props.style
        }}
      >
        {children}
      </Tag>
    </div>
  );
};

export default FixedWidthTag;
