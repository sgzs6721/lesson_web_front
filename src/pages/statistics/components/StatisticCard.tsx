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
          <Statistic
            title={<span className="statistic-card-title">{title}</span>}
            value={value}
            precision={0}
            prefix={prefix}
            valueStyle={{ color: '#333', fontSize: '22px', fontWeight: 600 }}
            suffix={
              <Space size={4} className="statistic-card-growth" style={{ color: isUp ? '#52c41a' : '#f5222d' }}>
                {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                <span>{Math.abs(growth)}%</span>
              </Space>
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default StatisticCard; 