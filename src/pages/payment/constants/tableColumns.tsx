import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Button, Tooltip, Space } from 'antd';
import { 
  InfoCircleOutlined, 
  DeleteOutlined,
  WechatOutlined,
  AlipayOutlined,
  CreditCardOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { Payment } from '../types/payment';

// 课程类型标签颜色映射
const getCourseTypeColor = (lessonType: string): string => {
  // 根据课程类型返回不同颜色
  const colors = [
    'blue', 'green', 'orange', 'red', 'purple', 'cyan', 'magenta', 'gold'
  ];
  
  // 使用课程类型的hash值来确定颜色，确保同样的类型始终是同样的颜色
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

// 获取支付类型图标
const getPayTypeIcon = (payType: string): React.ReactNode => {
  let icon: React.ReactNode;
  let color: string;
  let title: string;

  switch (payType) {
    case 'WECHAT':
    case '微信支付':
      icon = <WechatOutlined />;
      color = '#07C160';
      title = '微信支付';
      break;
    case 'CASH':
    case '现金支付':
      icon = <DollarOutlined />;
      color = '#faad14';
      title = '现金支付';
      break;
    case 'ALIPAY':
    case '支付宝支付':
      icon = <AlipayOutlined />;
      color = '#1677ff';
      title = '支付宝支付';
      break;
    case 'CARD':
    case 'BANK_TRANSFER':
    case '银行卡转账':
    case '银行卡':
      icon = <CreditCardOutlined />;
      color = '#722ed1';
      title = '银行卡';
      break;
    default:
      return <span>-</span>;
  }

  return (
    <Tooltip title={title}>
      <span style={{ color, fontSize: '16px' }}>
        {icon}
      </span>
    </Tooltip>
  );
};

export const getTableColumns = (
  handleReceipt: (record: Payment) => void,
  showDeleteConfirm: (id: string) => void
): ColumnsType<Payment> => [
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>日期</span>,
    dataIndex: 'date',
    key: 'date',
    align: 'center',
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>学员</span>,
    dataIndex: 'studentName',
    key: 'studentName',
    render: (text, record) => {
      // 如果API没有返回studentId，只显示姓名
      return record.studentId ? `${text} (${record.studentId})` : text;
    },
    align: 'center',
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>课程名称</span>,
    dataIndex: 'course',
    key: 'course',
    align: 'center',
    render: (courseName) => {
      if (!courseName) return '-';
      return (
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
          title={courseName}
        >
          {courseName}
        </Tag>
      );
    },
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>课程类型</span>,
    dataIndex: 'lessonType',
    key: 'lessonType',
    align: 'center',
    render: (type) => {
      if (!type) return '-';
      return (
        <Tag 
          color={getCourseTypeColor(type)}
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
          title={type}
        >
          {type}
        </Tag>
      );
    },
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>缴费金额</span>,
    dataIndex: 'amount',
    key: 'amount',
    align: 'center',
    render: (amount, record) => {
      const payTypeIcon = getPayTypeIcon(record.payType || '');
      return (
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {payTypeIcon}
          <span>¥{amount.toLocaleString('zh-CN')}</span>
        </span>
      );
    },
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>增减课时</span>,
    dataIndex: 'lessonChange',
    key: 'lessonChange',
    align: 'center',
    render: (lessonChange) => {
      if (!lessonChange) return '-';
      
      // 更精确地判断是否是负数
      const isNegative = lessonChange.includes('-') || 
                        (lessonChange.startsWith('-')) ||
                        (parseFloat(lessonChange.replace(/[^\d.-]/g, '')) < 0);
      
      const color = isNegative ? '#ff4d4f' : '#52c41a'; // 红色或绿色
      
      return <span style={{ color, fontWeight: 'bold' }}>{lessonChange}</span>;
    },
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>缴费类型</span>,
    dataIndex: 'paymentType',
    key: 'paymentType',
    align: 'center',
    render: (paymentType) => {
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
    },
  },
  {
    title: <span style={{ whiteSpace: 'nowrap' }}>操作</span>,
    key: 'action',
    align: 'center',
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="查看详情">
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => handleReceipt(record)}
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record.id)}
          />
        </Tooltip>
      </Space>
    ),
  },
]; 