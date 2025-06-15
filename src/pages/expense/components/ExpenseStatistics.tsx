import React, { CSSProperties } from 'react';
import { Row, Col, Card, Statistic, Space } from 'antd';
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,
  WalletOutlined,
  BankOutlined,
  ShoppingOutlined,
  BookOutlined,
  GiftOutlined
} from '@ant-design/icons';
import './ExpenseStatistics.css';

interface FinanceStatisticsProps {
  totalExpense: number;
  totalIncome: number;
  salaryExpense: number;
  operationExpense: number;
  otherExpense: number;
  tuitionIncome: number;
  trainingIncome: number;
  otherIncome: number;
}

// 统计卡片组件，与数据统计页面风格一致
const StatisticCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: number;
  growth: number;
  color: string;
  prefix?: React.ReactNode;
}> = ({ icon, title, value, growth, color, prefix }) => {
  const isUp = growth >= 0;

  const iconStyle: CSSProperties = {
    backgroundColor: `${color}20`,
    color: color,
  };

  return (
    <Card className="expense-statistic-card">
      <div className="expense-statistic-card-inner">
        <div className="expense-statistic-card-icon" style={iconStyle}>
          {icon}
        </div>
        <div className="expense-statistic-card-content">
          <Statistic
            title={<span className="expense-statistic-card-title">{title}</span>}
            value={value}
            precision={2}
            prefix={prefix}
            valueStyle={{
              color: '#333',
              fontSize: '16px',
              fontWeight: 600,
              textAlign: 'center',
              display: 'block'
            }}
            suffix={
              <Space size={4} className="expense-statistic-card-growth" style={{ color: isUp ? '#52c41a' : '#f5222d' }}>
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

const FinanceStatistics: React.FC<FinanceStatisticsProps> = ({
  totalExpense,
  totalIncome,
  salaryExpense,
  operationExpense,
  otherExpense,
  tuitionIncome,
  trainingIncome,
  otherIncome
}) => {
  // 模拟增长率数据（实际项目中应该从API获取）
  const statisticsData = [
    {
      icon: <MoneyCollectOutlined />,
      title: '总支出',
      value: totalExpense,
      growth: -3.2,
      color: '#f5222d',
      prefix: '¥',
    },
    {
      icon: <PayCircleOutlined />,
      title: '工资支出',
      value: salaryExpense,
      growth: 2.1,
      color: '#1890ff',
      prefix: '¥',
    },
    {
      icon: <BankOutlined />,
      title: '固定成本',
      value: operationExpense,
      growth: -1.5,
      color: '#faad14',
      prefix: '¥',
    },
    {
      icon: <WalletOutlined />,
      title: '其他支出',
      value: otherExpense,
      growth: -5.8,
      color: '#f5222d',
      prefix: '¥',
    },
    {
      icon: <DollarOutlined />,
      title: '总收入',
      value: totalIncome,
      growth: 8.5,
      color: '#52c41a',
      prefix: '¥',
    },
    {
      icon: <BookOutlined />,
      title: '学费收入',
      value: tuitionIncome,
      growth: 12.3,
      color: '#52c41a',
      prefix: '¥',
    },
    {
      icon: <ShoppingOutlined />,
      title: '培训收入',
      value: trainingIncome,
      growth: 6.7,
      color: '#13c2c2',
      prefix: '¥',
    },
    {
      icon: <GiftOutlined />,
      title: '其他收入',
      value: otherIncome,
      growth: 4.2,
      color: '#722ed1',
      prefix: '¥',
    },
  ];

  return (
    <div style={{ marginBottom: 24 }}>
      {/* 第一行：支出相关 */}
      <Row gutter={[8, 12]} style={{ marginBottom: 16 }} wrap={false}>
        <Col flex="1">
          <StatisticCard {...statisticsData[0]} />
        </Col>
        <Col flex="none" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="expense-equals-separator" style={{ color: '#1890ff' }}>
            =
          </div>
        </Col>
        <Col flex="1">
          <StatisticCard {...statisticsData[1]} />
        </Col>
        <Col flex="none" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="expense-equals-separator" style={{ color: '#1890ff', fontSize: '16px' }}>
            +
          </div>
        </Col>
        <Col flex="1">
          <StatisticCard {...statisticsData[2]} />
        </Col>
        <Col flex="none" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="expense-equals-separator" style={{ color: '#1890ff', fontSize: '16px' }}>
            +
          </div>
        </Col>
        <Col flex="1">
          <StatisticCard {...statisticsData[3]} />
        </Col>
      </Row>

      {/* 第二行：收入相关 */}
      <Row gutter={[8, 12]} wrap={false}>
        <Col flex="1">
          <StatisticCard {...statisticsData[4]} />
        </Col>
        <Col flex="none" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="expense-equals-separator" style={{ color: '#52c41a' }}>
            =
          </div>
        </Col>
        <Col flex="1">
          <StatisticCard {...statisticsData[5]} />
        </Col>
        <Col flex="none" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="expense-equals-separator" style={{ color: '#52c41a', fontSize: '16px' }}>
            +
          </div>
        </Col>
        <Col flex="1">
          <StatisticCard {...statisticsData[6]} />
        </Col>
        <Col flex="none" style={{ width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="expense-equals-separator" style={{ color: '#52c41a', fontSize: '16px' }}>
            +
          </div>
        </Col>
        <Col flex="1">
          <StatisticCard {...statisticsData[7]} />
        </Col>
      </Row>
    </div>
  );
};

export default FinanceStatistics;