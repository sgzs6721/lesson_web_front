import React from 'react';
import { Modal, Typography, Space, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { Payment } from '../types/payment';
import { printReceipt } from '../utils/printReceipt';

const { Title, Text } = Typography;

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
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={
        <div key="footer-wrapper" style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', marginTop: '0px', textAlign: 'right' }}>
          <Space>
            <Button key="print" icon={<PrinterOutlined />} onClick={printReceipt}>
              打印
            </Button>
            <Button key="close" onClick={onCancel}>
              关闭
            </Button>
          </Space>
        </div>
      }
      width={600}
      closable={true}
    >
      {payment && (
        <div className="payment-receipt-content" style={{ padding: '24px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: '24px' }}>付款详情</Title>
          <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 64px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text strong>日期:</Text>
              <Text>{payment.date}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text strong>状态:</Text>
              <Text>{payment.status}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text strong>学员姓名:</Text>
              <Text>{payment.studentName} ({payment.studentId})</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text strong>课程:</Text>
              <Text>{payment.course}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text strong>课时类型:</Text>
              <Text>{payment.paymentType}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text strong>缴费类型:</Text>
              <Text>{payment.paymentMethod}</Text>
            </div>
          </div>
          <div className="remark-section" style={{ marginBottom: '20px' }}>
            <Text strong>备注:</Text> <Text>{payment.remark || '无'}</Text>
          </div>
          <div className="amount-section" style={{ paddingTop: '16px', marginTop: '8px', textAlign: 'right' }}>
            <Title level={4} style={{ margin: 0 }}>金额: ¥{payment.amount.toLocaleString('zh-CN')}</Title>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PaymentReceiptModal; 