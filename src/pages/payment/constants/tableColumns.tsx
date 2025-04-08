import React from 'react';
import { ColumnsType } from 'antd/es/table';
import { Tag, Badge, Button, Tooltip, Space } from 'antd';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { Payment } from '../types/payment';

export const getTableColumns = (
  handleReceipt: (record: Payment) => void,
  showDeleteConfirm: (id: string) => void
): ColumnsType<Payment> => [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
    sorter: (a, b) => a.date.localeCompare(b.date),
    align: 'center',
  },
  {
    title: '学员',
    dataIndex: 'studentName',
    key: 'studentName',
    render: (text, record) => `${text} (${record.studentId})`,
    align: 'center',
  },
  {
    title: '课程',
    dataIndex: 'course',
    key: 'course',
    align: 'center',
  },
  {
    title: '金额 (¥)',
    dataIndex: 'amount',
    key: 'amount',
    sorter: (a, b) => a.amount - b.amount,
    render: (amount) => `¥${amount.toLocaleString('zh-CN')}`,
    align: 'center',
  },
  {
    title: '课时类型',
    dataIndex: 'paymentType',
    key: 'paymentType',
    align: 'center',
    render: (type) => <Tag color="blue">{type}</Tag>,
  },
  {
    title: '增减课时',
    dataIndex: 'lessonChange',
    key: 'lessonChange',
    align: 'center',
    render: (_, record) => {
      const isPositive = record.paymentMethod === '新增' || record.paymentMethod === '续费' || record.paymentMethod === '补费';
      const color = isPositive ? 'green' : 'red';
      const prefix = isPositive ? '+' : '-';
      const value = Math.floor(record.amount / 100); // 假设每节课100元
      return <span style={{ color }}>{prefix}{value}节</span>;
    },
  },
  {
    title: '缴费类型',
    dataIndex: 'paymentMethod',
    key: 'paymentMethod',
    align: 'center',
    render: (method) => {
      let color = 'default';
      switch (method) {
        case '新增': color = 'green'; break;
        case '续费': color = 'cyan'; break;
        case '补费': color = 'orange'; break;
        case '退费': color = 'red'; break;
      }
      return <Tag color={color}>{method}</Tag>;
    },
  },
  {
    title: '支付类型',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (status) => {
      let color = '';
      let text = '';
      switch (status) {
        case '微信支付':
          color = 'green';
          text = '微信支付';
          break;
        case '现金支付':
          color = 'gold';
          text = '现金支付';
          break;
        case '支付宝支付':
          color = 'blue';
          text = '支付宝支付';
          break;
        case '银行卡转账':
          color = 'purple';
          text = '银行卡转账';
          break;
        default:
          break;
      }
      return <Badge color={color} text={text} />;
    },
  },
  {
    title: '操作',
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