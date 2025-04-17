import React from 'react';
import { List, Card, Avatar, Row, Col, Divider, Tooltip, Tag, Button, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PhoneOutlined, ClockCircleOutlined, UserOutlined, IdcardOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';
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
}

const CoachCardView: React.FC<CoachCardViewProps> = ({
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
    return (
      <Tag
        color={color}
        style={{
          borderRadius: '20px',
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
  };
  
  // 渲染职位标签
  const renderJobTitleTag = (jobTitle: string) => {
    return (
      <Tag
        color="blue"
        style={{
          borderRadius: '20px',
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
                <div className="coach-status-badge">
                  <div className="coach-age-wrapper">
                    <span className="coach-age-premium">{coach.age}岁</span>
                  </div>
                  {renderStatusTag(coach.status)}
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