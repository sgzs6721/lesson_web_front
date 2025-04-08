import React from 'react';
import { Modal, Typography, Space, Button, Descriptions, Divider, Tag } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { Payment } from '../types/payment';
import { printReceipt } from '../utils/printReceipt';

const { Text } = Typography;

interface PaymentReceiptModalProps {
  visible: boolean;
  payment: Payment | null;
  onCancel: () => void;
}

const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  visible,
  payment,
  onCancel
}) => {
  if (!payment) {
    return null;
  }

  // 根据缴费类型设置颜色
  const getMethodTag = () => {
    let color = 'default';
    switch (payment.paymentMethod) {
      case '新增': color = 'green'; break;
      case '续费': color = 'cyan'; break;
      case '补费': color = 'orange'; break;
      case '退费': color = 'red'; break;
    }
    return <Tag color={color}>{payment.paymentMethod}</Tag>;
  };

  return (
    <Modal
      title="付款详情"
      open={visible}
      onCancel={onCancel}
      footer={
        <Space>
          <Button key="print" icon={<PrinterOutlined />} onClick={printReceipt}>
            打印
          </Button>
          <Button key="close" onClick={onCancel}>
            关闭
          </Button>
        </Space>
      }
      width={600}
      className="payment-receipt-modal"
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Descriptions bordered column={1} className="payment-receipt-descriptions">
        <Descriptions.Item label="日期">
          {payment.date}
        </Descriptions.Item>

        <Descriptions.Item label="学员">
          {payment.studentName} ({payment.studentId})
        </Descriptions.Item>

        <Descriptions.Item label="课程">
          {payment.course}
        </Descriptions.Item>

        <Descriptions.Item label="课时类型">
          <Tag color="blue">{payment.paymentType}</Tag>
        </Descriptions.Item>

        <Descriptions.Item label="缴费类型">
          {getMethodTag()}
        </Descriptions.Item>

        <Descriptions.Item label="支付类型">
          {payment.status}
        </Descriptions.Item>

        <Descriptions.Item label="金额">
          <Text
            style={{
              color: payment.paymentMethod === '退费' ? '#cf1322' : '#3f8600',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ¥{payment.amount.toLocaleString('zh-CN')}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="备注">
          {payment.remark || '无'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PaymentReceiptModal; 