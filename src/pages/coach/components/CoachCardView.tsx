import React from 'react';
import { List, Card, Avatar, Row, Col, Divider, Tooltip, Tag, Button, Space, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, PhoneOutlined, ClockCircleOutlined, UserOutlined, IdcardOutlined, CalendarOutlined, TrophyOutlined, SafetyCertificateOutlined, DownOutlined } from '@ant-design/icons';
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
}

const CoachCardView: React.FC<CoachCardViewProps> = ({
  data,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewDetail,
  onStatusChange
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
    const handleStatusChange = ({ key }: { key: string }) => {
      if (key !== status) {
        onStatusChange(coach.id, key);
      }
    };

    return (
      <Dropdown
        menu={{ items, onClick: handleStatusChange }}
        trigger={['click']}
        placement="bottomCenter"
      >
        <div
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={(e) => e.stopPropagation()} // 阻止点击事件传播到卡片
        >
          <Tag
            color={color}
            style={{
              borderRadius: '4px',
              fontSize: '11px',
              padding: '0 8px',
              fontWeight: 600,
              marginRight: 4,
              border: 'none',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {text}
          </Tag>
          <DownOutlined style={{ fontSize: '10px', color: '#999' }} />
        </div>
      </Dropdown>
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

  // 渲染证书标签
  const renderCertifications = (certifications: string[] | string) => {
    if (!certifications || (Array.isArray(certifications) && certifications.length === 0)) {
      return <span className="no-cert">暂无证书</span>;
    }

    const certArray = Array.isArray(certifications)
      ? certifications
      : typeof certifications === 'string'
        ? certifications.split('，')
        : [];

    if (certArray.length === 0) {
      return <span className="no-cert">暂无证书</span>;
    }

    return (
      <div className="cert-tags">
        {certArray.map((cert, index) => (
          <Tag color="blue" key={index} className="cert-tag">
            {cert}
          </Tag>
        ))}
      </div>
    );
  };

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
        xl: 4,
        xxl: 4
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
                <div className="coach-status-badge" style={{ gap: '20px' }}>
                  <div className="coach-age-wrapper" style={{ marginLeft: '-15px' }}>
                    <span className="coach-age-premium">{coach.age}岁</span>
                  </div>
                  {renderStatusTag(coach.status, coach)}
                </div>
              </div>

              <div className="coach-job-title-display">
                {renderJobTitleTag(coach.jobTitle)}
              </div>

              <div className="coach-info-content">
                <div className="coach-info-item">
                  <PhoneOutlined className="info-icon" />
                  <span className="info-label">电话：</span>
                  <span className="info-value">{coach.phone}</span>
                </div>

                <div className="coach-info-item">
                  <IdcardOutlined className="info-icon" />
                  <span className="info-label">ID：</span>
                  <span className="info-value">{coach.id}</span>
                </div>

                <div className="coach-info-item">
                  <TrophyOutlined className="info-icon" />
                  <span className="info-label">教龄：</span>
                  <span className="info-value">{coach.experience}年</span>
                </div>

                <div className="coach-info-item">
                  <CalendarOutlined className="info-icon" />
                  <span className="info-label">入职：</span>
                  <span className="info-value">{formatDate(coach.hireDate)}</span>
                </div>

                <div className="coach-info-item coach-certifications">
                  <SafetyCertificateOutlined className="info-icon" />
                  <span className="info-label">证书：</span>
                  <span className="info-value">
                    {Array.isArray(coach.certifications) && coach.certifications.length > 0
                      ? <Tag color="blue" className="cert-tag">{coach.certifications[0]}</Tag>
                      : <span className="no-cert">暂无证书</span>}
                  </span>
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