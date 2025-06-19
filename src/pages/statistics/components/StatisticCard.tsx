import React, { CSSProperties } from 'react';
import { Card, Statistic, Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import './StatisticCard.css';

interface StatisticCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  growth: number;
  color: string;
  prefix?: React.ReactNode;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  icon,
  title,
  value,
  growth,
  color,
  prefix,
}) => {
  const isUp = growth >= 0;

  const iconStyle: CSSProperties = {
    backgroundColor: `${color}20`, // Lighter shade for background
    color: color,
  };

  return (
    <Card className="statistic-card">
      <div className="statistic-card-inner">
        <div className="statistic-card-icon" style={iconStyle}>
          {icon}
        </div>
        <div className="statistic-card-content">
          <div className="statistic-card-title">{title}</div>
          <div className="statistic-card-value">
            {prefix && <span className="statistic-card-prefix">{prefix}</span>}
            <span className="statistic-card-number">{value}</span>
          </div>
          <div className="statistic-card-growth" style={{ color: isUp ? '#52c41a' : '#f5222d' }}>
            {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            <span style={{ marginLeft: 4 }}>{Math.abs(growth)}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatisticCard; 