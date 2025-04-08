import React, { CSSProperties } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

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
  const cardStyle: CSSProperties = {
    textAlign: 'center' as const,
    height: '100%'
  };

  // 支出卡片样式
  const expenseCardStyle: CSSProperties = {
    ...cardStyle,
    background: 'rgba(231, 76, 60, 0.1)',
    borderLeft: '3px solid #e74c3c'
  };

  // 收入卡片样式
  const incomeCardStyle: CSSProperties = {
    ...cardStyle,
    background: 'rgba(46, 204, 113, 0.1)',
    borderLeft: '3px solid #2ecc71'
  };

  return (
    <>
      {/* 所有统计数据放在一起，每行4个卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* 第一行：支出相关 */}
        <Col span={6}>
          <Card style={expenseCardStyle}>
            <Statistic
              title="总支出"
              value={totalExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title="工资支出"
              value={salaryExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title="固定成本"
              value={operationExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title="其他支出"
              value={otherExpense}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        {/* 第二行：收入相关 */}
        <Col span={6}>
          <Card style={incomeCardStyle}>
            <Statistic
              title="总收入"
              value={totalIncome}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title="学费收入"
              value={tuitionIncome}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title="培训收入"
              value={trainingIncome}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={cardStyle}>
            <Statistic
              title="其他收入"
              value={otherIncome}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FinanceStatistics;