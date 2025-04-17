import React from 'react';
import { Table, Button, Space, Tooltip, Avatar, Dropdown, Menu } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo } from '../utils/formatters';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { CoachGender } from '../../../api/coach/types';

interface CoachTableProps {
  data: Coach[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  onEdit: (record: Coach) => void;
  onDelete: (id: string) => void;
  onViewDetail: (record: Coach) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

const CoachTable: React.FC<CoachTableProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewDetail,
  onStatusChange
}) => {
  // 渲染状态标签
  const renderStatusTag = (status: string, record: Coach) => {
    const { color, text } = getStatusTagInfo(status);

    // 如果没有提供状态变更回调，则只显示文本
    if (!onStatusChange) {
      return <span style={{ color: color }}>{text}</span>;
    }

    // 状态选项
    const statusOptions = [
      { key: 'ACTIVE', label: '在职', color: '#52c41a' },
      { key: 'VACATION', label: '休假中', color: '#faad14' },
      { key: 'RESIGNED', label: '已离职', color: '#ff4d4f' }
    ];

    // 创建下拉菜单项
    const items = statusOptions.map(option => ({
      key: option.key,
      label: (
        <span style={{ color: option.color }}>{option.label}</span>
      ),
      disabled: option.key === status // 当前状态禁用
    }));

    // 处理状态变更
    const handleStatusChange = ({ key }: { key: string }) => {
      if (key !== status) {
        onStatusChange(record.id, key);
      }
    };

    return (
      <Dropdown
        menu={{ items, onClick: handleStatusChange }}
        trigger={['click']}
        placement="bottomCenter"
      >
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: color, marginRight: 4 }}>{text}</span>
          <DownOutlined style={{ fontSize: '12px', color: '#999' }} />
        </div>
      </Dropdown>
    );
  };

  const columns: ColumnsType<Coach> = [
    {
      title: '教练ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <Avatar
            src={record.avatar}
            style={{
              marginRight: 8,
              backgroundColor: record.gender === CoachGender.MALE ? '#1890ff' : '#eb2f96'
            }}
            icon={<UserOutlined />}
            size={32}
          />
          <span>
            {text}
            {record.gender === CoachGender.MALE ?
              <span style={{ color: '#1890ff', marginLeft: 5 }}>♂</span> :
              <span style={{ color: '#eb2f96', marginLeft: 5 }}>♀</span>
            }
          </span>
        </div>
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      align: 'center',
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      render: (phone) => (
        <div>{phone}</div>
      ),
    },
    {
      title: '入职日期',
      dataIndex: 'hireDate',
      key: 'hireDate',
      align: 'center',
      render: text => dayjs(text).format('YYYY-MM-DD'),
    },
    {
      title: '教龄',
      dataIndex: 'experience',
      key: 'experience',
      align: 'center',
      render: (years) => `${years}年`,
    },
    {
      title: <div style={{ textAlign: 'center' }}>证书</div>,
      dataIndex: 'certifications',
      key: 'certifications',
      ellipsis: true,
      width: 200,
      align: 'center',
      render: (certifications) => {
        if (!certifications ||
            (Array.isArray(certifications) && certifications.length === 0) ||
            (typeof certifications === 'string' && certifications.trim() === '')) {
          return <div style={{ color: '#999', textAlign: 'center' }}>无</div>;
        }

        if (Array.isArray(certifications)) {
          return <div style={{ textAlign: 'center' }}>{certifications.join('、')}</div>;
        }

        return <div style={{ textAlign: 'center' }}>{certifications}</div>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status, record) => renderStatusTag(status, record),
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
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
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<InfoCircleOutlined />}
              onClick={() => onViewDetail(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
      }}
    />
  );
};

export default CoachTable;