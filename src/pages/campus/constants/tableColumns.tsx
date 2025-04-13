import React from 'react';
import { Tag, Space, Button, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { Campus } from '../types/campus';
import type { ColumnsType } from 'antd/es/table';

// 获取表格列配置
export const getTableColumns = (
  onEdit: (record: Campus) => void,
  onToggleStatus: (record: Campus) => void,
  onDelete: (id: string, name: string) => void
): ColumnsType<Campus> => [
  {
    title: '校区名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '联系方式',
    key: 'contact',
    align: 'center',
    render: (_, record) => (
      <>
        <div>{record.contactPerson}</div>
        <div>{record.phone}</div>
      </>
    ),
  },
  {
    title: '校区规模',
    key: 'scale',
    align: 'center',
    render: (_, record) => (
      <>
        <div>学员数: {record.studentCount}</div>
        <div>教练数: {record.coachCount}</div>
        <div>待销课时: {record.courseCount}</div>
      </>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    render: (status) => {
      let color = '';
      let text = '';
      
      switch (status) {
        case 'open':
          color = 'green';
          text = '营业中';
          break;
        case 'closed':
          color = 'red';
          text = '已关闭';
          break;
        case 'renovating':
          color = 'orange';
          text = '装修中';
          break;
        default:
          color = 'default';
          text = status;
      }
      
      return <Tag color={color}>{text}</Tag>;
    },
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center',
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="编辑">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)} 
          />
        </Tooltip>
        <Tooltip title={record.status === 'CLOSED' ? '启用' : '停用'}>
          <Button
            type="text"
            size="small"
            icon={record.status === 'CLOSED' ? <PlayCircleOutlined /> : <PauseCircleOutlined />}
            onClick={() => onToggleStatus(record)}
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