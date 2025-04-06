import React from 'react';
import { Space, Button, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Course } from '../types/course';
import { categoryOptions, coachOptions } from './courseOptions';

// 获取教练名称
const getCoachNames = (coachIds: string[]) => {
  if (!coachIds || coachIds.length === 0) return '';
  // 只取第一个教练
  const id = coachIds[0];
  const coach = coachOptions.find(c => c.value === id);
  return coach ? coach.label : id;
};

// 获取课程分类名称
const getCategoryName = (categoryId: string) => {
  const category = categoryOptions.find(c => c.value === categoryId);
  return category ? category.label : categoryId;
};

// 渲染状态标签
export const renderStatusTag = (status: string) => {
  let color = '';
  let text = '';
  
  switch (status) {
    case 'active':
      color = 'green';
      text = '开课中';
      break;
    case 'inactive':
      color = 'red';
      text = '已停课';
      break;
    case 'pending':
      color = 'orange';
      text = '待开课';
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
    align: 'center',
  },
  {
    title: '课程类型',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
    render: (category: string) => getCategoryName(category),
  },
  {
    title: '总课时',
    dataIndex: 'totalHours',
    key: 'totalHours',
    align: 'center',
    render: (hours: number) => `${hours}小时`,
  },
  {
    title: '已销课时',
    dataIndex: 'consumedHours',
    key: 'consumedHours',
    align: 'center',
    render: (hours: number) => `${hours}小时`,
  },
  {
    title: '上课教练',
    dataIndex: 'coaches',
    key: 'coaches',
    align: 'center',
    render: (coaches: string[]) => getCoachNames(coaches),
  },
  {
    title: '课筹单价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    align: 'center',
    render: (price: number) => `¥${price}`,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (status: string) => renderStatusTag(status),
  },
  {
    title: '更新时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    align: 'center',
    render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    render: (_: any, record: Course) => (
      <Space size="middle">
        <Tooltip title="编辑">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
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