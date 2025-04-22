import React from 'react';
import { Space, Button, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Course } from '../types/course';
import { AlignType } from 'rc-table/lib/interface';

// 获取教练名称
const getCoachNames = (coaches?: { id: number; name: string }[]) => {
  if (!coaches || coaches.length === 0) return '';
  return coaches.map(coach => coach.name).join(', ');
};

// 获取课程分类名称
const getTypeName = (type: string) => {
  // 直接返回类型名称，因为API返回的已经是可读的名称
  return type || '未知类型';
};

// 渲染状态标签
export const renderStatusTag = (status: string) => {
  let color = '';
  let text = '';

  switch (status) {
    case 'PUBLISHED':
      color = 'green';
      text = '已发布';
      break;
    case 'DRAFT':
      color = 'blue';
      text = '草稿';
      break;
    case 'SUSPENDED':
      color = 'orange';
      text = '已暂停';
      break;
    case 'TERMINATED':
      color = 'red';
      text = '已终止';
      break;
    default:
      color = 'default';
      text = status;
  }

  return <Tag color={color} style={{ display: 'inline-flex', alignItems: 'center', height: '22px', padding: '0 8px', fontSize: '12px', lineHeight: '22px' }}>{text}</Tag>;
};

export const getTableColumns = (
  onEdit: (record: Course) => void,
  onShowDetail: (record: Course) => void,
  onDelete: (id: string, name: string) => void
) => [
  {
    title: '课程名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center' as AlignType,
  },
  {
    title: '课程类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center' as AlignType,
    render: (type: string) => getTypeName(type),
  },
  {
    title: '总课时',
    dataIndex: 'totalHours',
    key: 'totalHours',
    align: 'center' as AlignType,
    render: (hours: number) => `${hours}小时`,
  },
  {
    title: '已销课时',
    dataIndex: 'consumedHours',
    key: 'consumedHours',
    align: 'center' as AlignType,
    render: (hours: number) => `${hours}小时`,
  },
  {
    title: '上课教练',
    dataIndex: 'coaches',
    key: 'coaches',
    align: 'center' as AlignType,
    render: (coaches: { id: number; name: string }[]) => getCoachNames(coaches),
  },
  {
    title: '课筹单价',
    dataIndex: 'price',
    key: 'price',
    align: 'center' as AlignType,
    render: (price: number) => `¥${price}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center' as AlignType,
    render: (status: string) => renderStatusTag(status),
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    align: 'center' as AlignType,
    render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center' as AlignType,
    render: (_: any, record: Course) => (
      <Space size="middle">
        <Tooltip title="编辑">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              console.log('点击编辑按钮，课程数据:', JSON.stringify(record, null, 2));
              // 直接传递原始数据，不做任何修改
              onEdit(record);
            }}
          />
        </Tooltip>
        <Tooltip title="详情">
          <Button
            type="text"
            size="small"
            icon={<InfoCircleOutlined />}
            onClick={() => onShowDetail(record)}
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id, record.name)}
          />
        </Tooltip>
      </Space>
    ),
  },
];