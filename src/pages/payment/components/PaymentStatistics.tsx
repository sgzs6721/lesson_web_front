import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined } from '@ant-design/icons';

interface PaymentStatisticsProps {
  totalIncome: number;
  pendingIncome: number;
  refundedAmount: number;
}

const PaymentStatistics: React.FC<PaymentStatisticsProps> = ({
  totalIncome,
  pendingIncome,
  refundedAmount
}) => {
  return (
    <Row gutter={16} style={{ marginBottom: 24 }}>
      <Col span={8}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic
            title="课时流水"
            value={totalIncome}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="元"
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic
            title="其他收入"
            value={pendingIncome}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="元"
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic
            title="退款金额"
            value={refundedAmount}
            precision={2}
            prefix={<DollarOutlined />}
            suffix="元"
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentStatistics; 