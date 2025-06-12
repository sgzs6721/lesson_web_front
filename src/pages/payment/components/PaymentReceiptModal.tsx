import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space } from 'antd';
import { 
  WechatOutlined, 
  AlipayOutlined, 
  CreditCardOutlined, 
  DollarOutlined 
} from '@ant-design/icons';
import { Payment } from '../types/payment';

const { Text } = Typography;

interface PaymentReceiptModalProps {
  visible: boolean;
  payment: Payment | null;
  onCancel: () => void;
}

// 获取课程类型标签颜色
const getCourseTypeColor = (lessonType: string): string => {
  const colors = [
    'blue', 'green', 'orange', 'red', 'purple', 'cyan', 'magenta', 'gold'
  ];
  
  let hash = 0;
  for (let i = 0; i < lessonType.length; i++) {
    hash = lessonType.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// 缴费类型英文转中文
const getPaymentTypeText = (paymentType: string): string => {
  switch (paymentType?.toUpperCase()) {
    case 'NEW':
    case '新增':
      return '新增';
    case 'RENEWAL':
    case 'RENEW':
    case '续费':
      return '续费';
    case 'MAKEUP':
    case 'SUPPLEMENT':
    case '补费':
      return '补费';
    case 'REFUND':
    case '退费':
      return '退费';
    default:
      return paymentType || '-';
  }
};

// 获取缴费类型标签
const getPaymentTypeTag = (paymentType: string) => {
  const chineseText = getPaymentTypeText(paymentType);
  if (chineseText === '-') return '-';
  
  let color = 'default';
  switch (chineseText) {
    case '新增': 
      color = 'green'; 
      break;
    case '续费': 
      color = 'blue'; 
      break;
    case '补费': 
      color = 'orange'; 
      break;
    case '退费': 
      color = 'red'; 
      break;
    default: 
      color = 'default';
  }
  
  return (
    <Tag 
      color={color}
      style={{ 
        minWidth: '80px', 
        width: '80px',
        textAlign: 'center',
        margin: 0,
        display: 'inline-block',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
      title={chineseText}
    >
      {chineseText}
    </Tag>
  );
};

// 获取支付类型图标和文本
const getPayTypeIconAndText = (payType: string): React.ReactNode => {
  switch (payType) {
    case 'WECHAT':
    case '微信支付':
      return (
        <Space>
          <WechatOutlined style={{ color: '#07C160', fontSize: '16px' }} />
          <span>微信支付</span>
        </Space>
      );
    case 'CASH':
    case '现金支付':
      return (
        <Space>
          <DollarOutlined style={{ color: '#faad14', fontSize: '16px' }} />
          <span>现金支付</span>
        </Space>
      );
    case 'ALIPAY':
    case '支付宝支付':
      return (
        <Space>
          <AlipayOutlined style={{ color: '#1677ff', fontSize: '16px' }} />
          <span>支付宝支付</span>
        </Space>
      );
    case 'CARD':
    case 'BANK_TRANSFER':
    case '银行卡转账':
    case '银行卡':
      return (
        <Space>
          <CreditCardOutlined style={{ color: '#722ed1', fontSize: '16px' }} />
          <span>银行卡</span>
        </Space>
      );
    default:
      return payType || '-';
  }
};

const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  visible,
  payment,
  onCancel
}) => {
  if (!payment) return null;

  return (
    <Modal
      title="缴费详情"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="payment-receipt-modal"
    >
      <Descriptions bordered column={2} className="payment-receipt-descriptions">
        <Descriptions.Item label="日期">
          {payment.date}
        </Descriptions.Item>

        <Descriptions.Item label="学员">
          {payment.studentId ? `${payment.studentName} (${payment.studentId})` : payment.studentName}
        </Descriptions.Item>

        <Descriptions.Item label="课程名称">
          <Tag 
            color="blue"
            style={{ 
              minWidth: '120px', 
              width: '120px',
              textAlign: 'center',
              margin: 0,
              display: 'inline-block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={payment.course}
          >
            {payment.course}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="课程类型">
          <Tag 
            color={getCourseTypeColor(payment.lessonType || '')}
            style={{ 
              minWidth: '100px', 
              width: '100px',
              textAlign: 'center',
              margin: 0,
              display: 'inline-block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
            title={payment.lessonType || '-'}
          >
            {payment.lessonType || '-'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="缴费金额">
          <Text
            style={{
              color: getPaymentTypeText(payment.paymentType) === '退费' ? '#cf1322' : '#3f8600',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            ¥{payment.amount.toLocaleString('zh-CN')}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="增减课时">
          {payment.lessonChange ? (
            <span
              style={{
                color: payment.lessonChange.includes('-') ? '#ff4d4f' : '#52c41a',
                fontWeight: 'bold'
              }}
            >
              {payment.lessonChange}
            </span>
          ) : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="缴费类型">
          {getPaymentTypeTag(payment.paymentType)}
        </Descriptions.Item>

        <Descriptions.Item label="支付类型">
          {getPayTypeIconAndText(payment.payType || '')}
        </Descriptions.Item>

        <Descriptions.Item label="备注" span={2}>
          {payment.remark || '无'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default PaymentReceiptModal; 