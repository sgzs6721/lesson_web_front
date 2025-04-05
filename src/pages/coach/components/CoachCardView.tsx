import React from 'react';
import { List, Card, Avatar, Row, Col, Divider, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Coach } from '../types/coach';
import { getStatusTagInfo } from '../utils/formatters';

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
    return <span style={{ color, padding: '2px 8px', border: `1px solid ${color}`, borderRadius: '10px', fontSize: '12px' }}>{text}</span>;
  };

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: 3,
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
            style={{ width: '100%', height: '100%' }}
            onClick={() => onViewDetail(coach)}
            actions={[
              <Tooltip title="编辑">
                <EditOutlined key="edit" onClick={(e) => {
                  e.stopPropagation();
                  onEdit(coach);
                }} />
              </Tooltip>,
              <Tooltip title="删除">
                <DeleteOutlined 
                  key="delete" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(coach.id);
                  }}
                />
              </Tooltip>,
            ]}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                size={64} 
                src={coach.avatar}
                style={{ marginRight: 16 }}
              />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Row gutter={[8, 4]} justify="space-between">
                  <Col span={14}>
                    <div style={{ fontWeight: 'bold', fontSize: 16, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {coach.name}
                      {coach.gender === 'male' ? 
                        <span style={{ color: '#1890ff', marginLeft: 5 }}>♂</span> : 
                        <span style={{ color: '#eb2f96', marginLeft: 5 }}>♀</span>
                      }
                      <span style={{ fontWeight: 'normal', fontSize: 14, marginLeft: 8 }}>{coach.age}岁</span>
                    </div>
                    <div style={{ color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{coach.jobTitle}</div>
                  </Col>
                  <Col span={10} style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12 }}>ID: {coach.id}</div>
                    <div>{renderStatusTag(coach.status)}</div>
                  </Col>
                </Row>
                <Divider style={{ margin: '8px 0' }} />
                <div style={{ fontSize: 12 }}>
                  <div style={{ marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <PhoneOutlined style={{ marginRight: 4 }} />{coach.phone}
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <ClockCircleOutlined style={{ marginRight: 4 }} />教龄：{coach.experience}年
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default CoachCardView; 