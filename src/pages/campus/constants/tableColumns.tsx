import React from 'react';
import { Tag, Space, Button, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ClockCircleOutlined
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
              <ClockCircleOutlined style={{ color: '#1890ff', fontSize: 16 }} />
            </div>
            <div className="scale-label">总课时</div>
            <div className="scale-value scale-value-lesson">{record.totalLessonHours || 0}</div>
          </div>
          {/* 待销课时 */}
          <div className="scale-combined-item">
            <div className="scale-icon-wrapper scale-icon-lesson">
              <ClockCircleOutlined style={{ color: '#f39c12', fontSize: 16 }} />
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