import React from 'react';
import { List, Card, Tag, Typography, Badge, Tooltip, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined, ClockCircleOutlined, DollarOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { Course } from '../types/course';
import dayjs from 'dayjs';
import { renderStatusTag } from '../constants/tableColumns';

const { Paragraph } = Typography;

interface CourseCardListProps {
  data: Course[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  total: number;
  onEdit: (record: Course) => void;
  onDelete: (id: string, name: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
}

const CourseCardList: React.FC<CourseCardListProps> = ({
  data,
  loading,
  currentPage,
  pageSize,
  total,
  onEdit,
  onDelete,
  onPageChange
}) => {
  // 获取教练名称
  const getCoachNames = (coaches?: { id: number; name: string }[]) => {
    if (!coaches || coaches.length === 0) return '暂无教练';
    return coaches.map(coach => coach.name).join(', ');
  };

  // 获取进度百分比
  const getProgress = (consumed: number, total: number) => {
    if (total === 0) return 0;
    return Math.min(Math.round((consumed / total) * 100), 100);
  };

  return (
    <>
      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 4
        }}
        dataSource={data}
        loading={loading}
        pagination={false}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              style={{ 
                width: '100%',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s'
              }}
              cover={
                <div style={{ 
                  background: 'linear-gradient(135deg, #1a2980, #26d0ce)',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 20px',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                    <h3 style={{ 
                      margin: 0, 
                      color: 'white', 
                      fontSize: '20px', 
                      fontWeight: 600,
                      textAlign: 'center',
                      textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                      marginRight: '10px'
                    }}>
                      {item.name}
                    </h3>
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: 'white',
                      fontWeight: 500
                    }}>
                      {getProgress(item.consumedHours || 0, item.totalHours)}%
                    </div>
                  </div>
                </div>
              }
            >
              <div style={{ padding: '0 16px 16px 16px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c', 
                  margin: '0',
                  padding: '0',
                  lineHeight: '1',
                  textAlign: 'left',
                  position: 'relative',
                  top: '-6px'
                }}>
                  更新时间: {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '10px',
                  marginBottom: '12px',
                  borderBottom: '1px solid #f0f0f0',
                  paddingBottom: '12px',
                  alignItems: 'center'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <Tag color="blue">{item.type}</Tag>
                    {renderStatusTag(item.status)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px',
                  }}>
                    <Tooltip title="编辑课程">
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<EditOutlined style={{ color: '#1890ff', fontSize: '16px' }} />} 
                        onClick={() => onEdit(item)}
                      />
                    </Tooltip>
                    <Tooltip title="删除课程">
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DeleteOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />} 
                        onClick={() => onDelete(item.id, item.name)}
                      />
                    </Tooltip>
                  </div>
                </div>
              
                <div className="course-stats">
                  <div className="stat-item">
                    <TeamOutlined style={{ fontSize: '14px', color: '#722ed1', marginRight: '8px' }} />
                    <div style={{ fontWeight: 500, width: '60px', textAlign: 'justify', textAlignLast: 'justify', whiteSpace: 'nowrap' }}>教练</div>
                    <div style={{ margin: '0 8px 0 8px' }}>：</div>
                    <div style={{ flex: 1, textAlign: 'right', paddingRight: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ color: '#1890ff', fontWeight: 500 }}>{getCoachNames(item.coaches)}</span>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <BookOutlined style={{ fontSize: '14px', color: '#52c41a', marginRight: '8px' }} />
                    <div style={{ fontWeight: 500, width: '60px', textAlign: 'justify', textAlignLast: 'justify', whiteSpace: 'nowrap' }}>总课时</div>
                    <div style={{ margin: '0 8px 0 8px' }}>：</div>
                    <div style={{ flex: 1, textAlign: 'right', paddingRight: '24px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 600, color: '#52c41a' }}>{item.totalHours}</span>
                      <span style={{ fontSize: '12px', marginLeft: '4px', color: '#595959' }}>小时</span>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <ClockCircleOutlined style={{ fontSize: '14px', color: '#fa8c16', marginRight: '8px' }} />
                    <div style={{ fontWeight: 500, width: '60px', textAlign: 'justify', textAlignLast: 'justify', whiteSpace: 'nowrap' }}>已销课时</div>
                    <div style={{ margin: '0 8px 0 8px' }}>：</div>
                    <div style={{ flex: 1, textAlign: 'right', paddingRight: '24px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 600, color: '#fa8c16' }}>{item.consumedHours || 0}</span>
                      <span style={{ fontSize: '12px', marginLeft: '4px', color: '#595959' }}>小时</span>
                    </div>
                  </div>
                  
                  <div className="stat-item">
                    <DollarOutlined style={{ fontSize: '14px', color: '#f5222d', marginRight: '8px' }} />
                    <div style={{ fontWeight: 500, width: '60px', textAlign: 'justify', textAlignLast: 'justify', whiteSpace: 'nowrap' }}>课时费</div>
                    <div style={{ margin: '0 8px 0 8px' }}>：</div>
                    <div style={{ flex: 1, textAlign: 'right', paddingRight: '24px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 600, color: '#f5222d' }}>¥ {item.price}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  textAlign: 'right',
                  fontSize: '12px', 
                  color: '#8c8c8c', 
                  marginTop: '12px',
                  padding: '8px 0 0',
                  borderTop: '1px dashed #f0f0f0',
                  display: 'none'
                }}>
                  更新时间: {dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                

                
                <div style={{ 
                  fontSize: '12px', 
                  color: '#8c8c8c', 
                  marginTop: '12px',
                  display: 'none',
                  justifyContent: 'space-between',
                  borderTop: '1px dashed #f0f0f0',
                  paddingTop: '12px'
                }}>
                  <div>
                    进度: <span style={{ fontWeight: 500, color: '#1890ff' }}>{getProgress(item.consumedHours || 0, item.totalHours)}%</span>
                  </div>
                  <div>
                    更新: {dayjs(item.updateTime).format('YYYY-MM-DD')}
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '16px', 
                  display: 'none',
                  justifyContent: 'flex-end', 
                  gap: '8px',
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: '12px'
                }}>
                  <Tooltip title="编辑课程">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<EditOutlined style={{ color: '#1890ff', fontSize: '16px' }} />} 
                      onClick={() => onEdit(item)}
                    />
                  </Tooltip>
                  <Tooltip title="删除课程">
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DeleteOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />} 
                      onClick={() => onDelete(item.id, item.name)}
                    />
                  </Tooltip>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <style>
        {`
        .course-stats {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 12px;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          padding: 6px 0;
          font-size: 14px;
          color: #595959;
          white-space: nowrap;
          min-width: 0;
        }
        `}
      </style>
    </>
  );
};

export default CourseCardList;