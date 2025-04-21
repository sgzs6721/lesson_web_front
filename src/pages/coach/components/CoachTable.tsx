import React from 'react';
import { Table, Button, Space, Tooltip, Avatar, Dropdown, Tag, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, InfoCircleOutlined, UserOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo, getJobTitleTagInfo } from '../utils/formatters';
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
  rowLoading?: Record<string, boolean>; // 每一行的加载状态，用于状态变更时显示加载效果
}

const CoachTable: React.FC<CoachTableProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewDetail,
  onStatusChange,
  rowLoading = {}
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

        // 将证书数据转换为数组
        let certArray: string[] = [];
        if (Array.isArray(certifications)) {
          certArray = certifications.filter(c => c.trim());
        } else if (typeof certifications === 'string') {
          certArray = certifications.split(/[,，\n\r]/).map(c => c.trim()).filter(c => c);
        }

        if (certArray.length === 0) {
          return <div style={{ color: '#999', textAlign: 'center' }}>无</div>;
        }

        // 限制最多显示2个证书，超出部分显示+N
        const maxShow = 2;
        const hasMore = certArray.length > maxShow;
        const visibleCerts = certArray.slice(0, maxShow);

        // 创建Tooltip内容，每个证书一行，美化样式
        const tooltipContent = (
          <div style={{
            textAlign: 'left',
            padding: '0',
            minWidth: '220px',
            maxWidth: '260px',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e8e8e8',
            backgroundColor: '#fff'
          }}>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#f5f5f5',
              color: '#333',
              fontSize: '13px',
              fontWeight: 'bold',
              letterSpacing: '0.5px',
              borderBottom: '1px solid #e8e8e8'
            }}>
              证书列表
            </div>
            <div style={{
              padding: '8px 12px',
              backgroundColor: '#fff',
              maxHeight: '180px',
              overflowY: 'auto'
            }}>
              {certArray.length > 0 ? certArray.map((cert, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '6px 10px',
                    margin: '4px 0',
                    backgroundColor: '#f6ffed',
                    border: '1px solid #b7eb8f',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#52c41a',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{
                    width: '5px',
                    height: '5px',
                    backgroundColor: '#52c41a',
                    borderRadius: '50%',
                    marginRight: '8px'
                  }}></div>
                  {cert}
                </div>
              )) : (
                <div style={{
                  padding: '8px',
                  textAlign: 'center',
                  color: '#999',
                  fontStyle: 'italic',
                  fontSize: '12px'
                }}>
                  暂无证书信息
                </div>
              )}
            </div>
          </div>
        );

        return (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'nowrap',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            gap: '4px'
          }}>
            <Tooltip title={tooltipContent} placement="top" styles={{ body: { padding: 0, backgroundColor: 'transparent', boxShadow: 'none' } }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {visibleCerts.map((cert, index) => (
                  <Tag
                    key={index}
                    color="green"
                    style={{
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      lineHeight: '1.3',
                      height: '18px',
                      margin: '0 2px',
                      whiteSpace: 'nowrap',
                      maxWidth: '80px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {cert}
                  </Tag>
                ))}
                {hasMore && (
                  <Tag
                    color="default"
                    style={{
                      padding: '1px 5px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      lineHeight: '1.3',
                      height: '18px',
                      margin: '0 2px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    +{certArray.length - maxShow}
                  </Tag>
                )}
              </div>
            </Tooltip>
          </div>
        );
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