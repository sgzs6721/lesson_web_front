import React from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
import { DollarOutlined, SwapOutlined, TransactionOutlined } from '@ant-design/icons';

interface PaymentStatisticsProps {
  paymentCount: number;
  paymentAmount: number;
  refundCount: number;
  refundAmount: number;
  loading?: boolean;
}

const PaymentStatistics: React.FC<PaymentStatisticsProps> = ({
  paymentCount,
  paymentAmount,
  refundCount,
  refundAmount,
  loading = false
}) => {
  return (
    <Spin spinning={loading}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title="缴费次数"
              value={paymentCount}
              prefix={<TransactionOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title="缴费金额"
              value={paymentAmount}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title="退费次数"
              value={refundCount}
              prefix={<SwapOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title="退费金额"
              value={refundAmount}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default PaymentStatistics; 