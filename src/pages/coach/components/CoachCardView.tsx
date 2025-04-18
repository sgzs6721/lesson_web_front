import React from 'react';
import { List, Card, Avatar, Row, Col, Divider, Tooltip, Tag, Button, Space, Dropdown, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PhoneOutlined, ClockCircleOutlined, UserOutlined, IdcardOutlined, CalendarOutlined, TrophyOutlined, SafetyCertificateOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo } from '../utils/formatters';
import { CoachGender } from '../../../api/coach/types';
import dayjs from 'dayjs';
import './CoachCardView.css';

interface CoachCardViewProps {
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

const CoachCardView: React.FC<CoachCardViewProps> = ({
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
  const renderStatusTag = (status: string, coach: Coach) => {
    const { color, text } = getStatusTagInfo(status);

    // 如果没有提供状态变更回调，则只显示文本
    if (!onStatusChange) {
      return (
        <Tag
          color={color}
          style={{
            borderRadius: '4px',
            fontSize: '11px',
            padding: '0 8px',
            fontWeight: 600,
            marginRight: 0,
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {text}
        </Tag>
      );
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
    const handleStatusChange = (info: any) => {
      const { key, domEvent } = info;
      // 阻止事件冒泡
      if (domEvent) {
        domEvent.stopPropagation();
        domEvent.preventDefault();
      }

      if (key !== status) {
        onStatusChange(coach.id, key);
      }
    };

    // 判断当前教练是否处于状态变更中
    const isStatusChanging = rowLoading[coach.id];

    // 自定义加载图标
    const antIcon = <LoadingOutlined style={{ fontSize: 16, color: '#1890ff' }} spin />;

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {isStatusChanging ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1000 // 增加状态标签的z-index
            }}
            onClick={(e) => {
              e.stopPropagation(); // 阻止点击事件传播到卡片
              e.preventDefault(); // 阻止默认行为
            }}
          >
            <Spin indicator={antIcon} size="small" />
          </div>
        ) : (
          <Dropdown
            menu={{ items, onClick: handleStatusChange }}
            trigger={['click']}
            placement="bottom"
            disabled={isStatusChanging}
            overlayStyle={{ zIndex: 1050 }} // 增加下拉菜单的z-index
          >
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1000 // 增加状态标签的z-index
              }}
              onClick={(e) => {
                e.stopPropagation(); // 阻止点击事件传播到卡片
                e.preventDefault(); // 阻止默认行为
              }}
            >
              <Tag
                color={color}
                style={{
                  borderRadius: '4px',
                  fontSize: '11px',
                  padding: '0 8px',
                  fontWeight: 600,
                  marginRight: 0,
                  border: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                {text}
                <DownOutlined style={{ fontSize: '10px', color: '#999', marginLeft: '2px' }} />
              </Tag>
            </div>
          </Dropdown>
        )}
      </div>
    );
  };

  // 渲染职位标签
  const renderJobTitleTag = (jobTitle: string) => {
    return (
      <Tag
        color="blue"
        style={{
          borderRadius: '4px',
          fontSize: '11px',
          padding: '0 8px',
          fontWeight: 600,
          border: 'none',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {jobTitle}
      </Tag>
    );
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dayjs(dateString).format('YYYY-MM-DD');
  };

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: 3
      }}
      dataSource={data}
      loading={loading}
      pagination={{
        ...pagination,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
      }}
      renderItem={(coach) => (
        <List.Item>
          <Card
            hoverable
            className="coach-card-premium"
            onClick={() => onViewDetail(coach)}
          >
            <div className="card-background-decoration">
              <div className="card-decoration-circle"></div>
            </div>

            <div className="coach-card-content-premium">
              <div className="coach-header-section">
                <div className="coach-avatar-container-premium">
                  <Avatar
                    size={60}
                    src={coach.avatar}
                    className="premium-avatar"
                    style={{
                      backgroundColor: !coach.avatar ? (coach.gender === CoachGender.MALE ? '#1890ff' : '#eb2f96') : undefined,
                    }}
                    icon={!coach.avatar && <UserOutlined />}
                  />
                  <div className="coach-gender-badge">
                    <span className="gender-icon-badge">
                      {coach.gender === CoachGender.MALE ?
                        <span className="gender-icon male">♂</span> :
                        <span className="gender-icon female">♀</span>
                      }
                    </span>
                  </div>
                </div>

                <div className="coach-title-section">
                  <div className="coach-name-row">
                    <div className="coach-name-premium">
                      {coach.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="coach-job-title-wrapper">
                <div className="coach-status-badge" style={{ gap: '20px', position: 'relative' }}>
                  <div className="coach-age-wrapper" style={{ marginLeft: '-15px' }}>
                    <span className="coach-age-premium">{coach.age}岁</span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    {renderStatusTag(coach.status, coach)}
                  </div>
                </div>
              </div>

              <div className="coach-job-title-display">
                {renderJobTitleTag(coach.jobTitle)}
              </div>

              <div style={{ display: 'flex', gap: '32px', width: '100%' }}>
                {/* 左栏：基本信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>电话：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.phone}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>ID：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.id}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>教龄：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{coach.experience}年</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>入职：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>{formatDate(coach.hireDate)}</span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 56, flexShrink: 0}}>证书：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {Array.isArray(coach.certifications) && coach.certifications.length > 0
                        ? coach.certifications[0]
                        : <span className="no-cert">暂无证书</span>}
                    </span>
                  </div>
                </div>
                {/* 右栏：薪资信息 */}
                <div style={{ flex: 1, minWidth: 0, paddingLeft: 16, borderLeft: '1px solid #f0f0f0' }}>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>基本工资：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.baseSalary === 'number'
                        ? `¥${coach.baseSalary.toLocaleString()}`
                        : '¥0'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>社保费：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.socialInsurance === 'number'
                        ? `¥${coach.socialInsurance.toLocaleString()}`
                        : '¥0'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>课时费：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {(() => {
                        const noBreakSpace = '\u200B'; // 零宽度空格
                        if (typeof coach.classFee === 'number') {
                          const fee = coach.classFee.toLocaleString();
                          return `¥${fee}${noBreakSpace}/时`;
                        }
                        return `¥0${noBreakSpace}/时`;
                      })()}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>绩效奖：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.performanceBonus === 'number'
                        ? `¥${coach.performanceBonus.toLocaleString()}`
                        : '¥0'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>提成：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.commission === 'number'
                        ? `${coach.commission}%`
                        : '0%'}
                    </span>
                  </div>
                  <div className="coach-info-item" style={{whiteSpace: 'nowrap', display: 'flex'}}>
                    <span className="info-label" style={{minWidth: 64, flexShrink: 0}}>分红：</span>
                    <span className="info-value" style={{textAlign: 'right', flex: 1}}>
                      {typeof coach.dividend === 'number'
                        ? `¥${coach.dividend.toLocaleString()}`
                        : '¥0'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="coach-actions-premium">
                <Tooltip title="编辑">
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={<EditOutlined style={{ fontSize: '14px' }} />}
                    className="action-button edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(coach);
                    }}
                  />
                </Tooltip>
                <Tooltip title="删除">
                  <Button
                    type="text"
                    shape="circle"
                    size="small"
                    icon={<DeleteOutlined style={{ fontSize: '14px' }} />}
                    className="action-button delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(coach.id);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default CoachCardView;