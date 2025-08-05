import React from 'react';
import { Table, Button, Space, Tooltip, Avatar, Dropdown, Tag, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, UserOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo, getJobTitleTagInfo } from '../utils/formatters';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { CoachGender } from '../../../api/coach/types';
import StandardPagination from '@/components/common/StandardPagination';

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
  rowLoading?: Record<string, boolean>; // 每一行的加载状态，用于状态变更时显示加载效果
  sortField?: string;
  sortOrder?: 'ascend' | 'descend';
  onSortChange?: (field: string, order: 'ascend' | 'descend') => void;
}

const CoachTable: React.FC<CoachTableProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewDetail,
  onStatusChange,
  rowLoading = {},
  sortField,
  sortOrder,
  onSortChange
}) => {
  // 从身份证号计算年龄
  const calculateAgeFromIdNumber = (idNumber: string): number => {
    if (!idNumber || idNumber.length < 6) return 0;
    
    try {
      // 提取出生年份
      const year = parseInt(idNumber.substring(6, 10));
      const currentYear = new Date().getFullYear();
      return currentYear - year;
    } catch (error) {
      console.error('计算年龄失败:', error);
      return 0;
    }
  };

  // 从执教日期计算教龄
  const calculateTeachingExperience = (coachingDate: string): number => {
    if (!coachingDate) return 0;
    
    try {
      const startDate = new Date(coachingDate);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
      const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears;
    } catch (error) {
      console.error('计算教龄失败:', error);
      return 0;
    }
  };
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

    // 判断当前教练是否处于状态变更中
    const isStatusChanging = rowLoading[record.id];

    // 自定义加载图标
    const antIcon = <LoadingOutlined style={{ fontSize: 16, color: '#1890ff' }} spin />;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {isStatusChanging ? (
          <Spin indicator={antIcon} size="small" />
        ) : (
          <Dropdown
            menu={{ items, onClick: handleStatusChange }}
            trigger={['click']}
            placement="bottom"
            disabled={isStatusChanging}
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: color, marginRight: 4 }}>{text}</span>
              <DownOutlined style={{ fontSize: '12px', color: '#999' }} />
            </div>
          </Dropdown>
        )}
      </div>
    );
  };

  const columns: ColumnsType<Coach> = [
    {
      title: '教练ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
      sortOrder: sortField === 'id' ? sortOrder : null,
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
      title: '类型',
      dataIndex: 'workType',
      key: 'workType',
      align: 'center',
      render: (workType) => {
        const typeInfo = workType === 'FULLTIME' 
          ? { color: 'green', text: '全职' }
          : { color: 'orange', text: '兼职' };
        return (
          <Tag
            color={typeInfo.color}
            style={{
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '11px',
              lineHeight: '1.3',
              height: '18px',
              margin: '2px',
            }}
          >
            {typeInfo.text}
          </Tag>
        );
      },
    },
    {
      title: '职位',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      align: 'center',
      render: (jobTitle) => {
        const { color, text } = getJobTitleTagInfo(jobTitle);
        return (
          <Tag
            color={color}
            style={{
              padding: '1px 5px',
              borderRadius: '3px',
              fontSize: '11px',
              lineHeight: '1.3',
              height: '18px',
              margin: '2px',
            }}
          >
            {text}
          </Tag>
        );
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
      align: 'center',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortField === 'age' ? sortOrder : null,
      render: (age) => {
        return age > 0 ? `${age}岁` : '-';
      },
    },
    {
      title: '教龄',
      dataIndex: 'experience',
      key: 'experience',
      align: 'center',
      sorter: true,
      sortDirections: ['ascend', 'descend'],
      sortOrder: sortField === 'experience' ? sortOrder : null,
      render: (experience) => {
        return experience > 0 ? `${experience}年` : '-';
      },
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
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        onChange={(pagination, filters, sorter) => {
          if (onSortChange && sorter && typeof sorter === 'object' && 'field' in sorter) {
            const field = sorter.field as string;
            const order = sorter.order as 'ascend' | 'descend';
            onSortChange(field, order);
          }
        }}
        sortDirections={['ascend', 'descend']}
      />
      <StandardPagination
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        onChange={pagination.onChange}
      />
    </>
  );
};

export default CoachTable;