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
import CampusScale from '../components/CampusScale';
import ContactInfoSimple from '@/components/ContactInfoSimple';

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
    width: 220,
    render: (_, record) => (
      <ContactInfoSimple
        managerName={record.managerName || '未设置'}
        managerPhone={record.managerPhone || '未设置'}
      />
    ),
  },
  {
    title: '校区规模',
    key: 'scale',
    align: 'center',
    width: 220,
    render: (_, record) => (
      <CampusScale
        studentCount={record.studentCount || 0}
        coachCount={record.coachCount || 0}
      />
    ),
  },
  {
    title: '课时信息',
    key: 'lessonInfo',
    align: 'center',
    width: 220,
    render: (_, record) => (
      <div className="campus-scale-combined-container">
        <div className="campus-scale-combined-content">
          {/* 总课时 */}
          <div className="scale-combined-item">
            <div className="scale-icon-wrapper scale-icon-lesson">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#1890ff">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div className="scale-label">总课时</div>
            <div className="scale-value scale-value-lesson">{record.totalLessonHours || 0}</div>
          </div>
          {/* 待销课时 */}
          <div className="scale-combined-item">
            <div className="scale-icon-wrapper scale-icon-lesson">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#f39c12">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
              </svg>
            </div>
            <div className="scale-label">待销课时</div>
            <div className="scale-value scale-value-lesson">{record.pendingLessonCount || 0}</div>
          </div>
        </div>
      </div>
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
        case 'OPERATING':
          color = 'green';
          text = '营业中';
          break;
        case 'CLOSED':
          color = 'red';
          text = '已关闭';
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
            onClick={() => onDelete(String(record.id), record.name)}
          />
        </Tooltip>
      </Space>
    ),
  },
];