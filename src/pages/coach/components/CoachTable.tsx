import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo } from '../utils/formatters';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

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
}

const CoachTable: React.FC<CoachTableProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewDetail
}) => {
  // 渲染状态标签
  const renderStatusTag = (status: string) => {
    const { color, text } = getStatusTagInfo(status);
    return <span style={{ color: color }}>{text}</span>;
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
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.avatar && (
            <img 
              src={record.avatar} 
              alt={text} 
              style={{ 
                width: 32, 
                height: 32, 
                marginRight: 8, 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          )}
          <span>
            {text} 
            {record.gender === 'male' ? 
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
      title: '证书',
      dataIndex: 'certifications',
      key: 'certifications',
      ellipsis: true,
      width: 200,
      align: 'left',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: renderStatusTag,
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