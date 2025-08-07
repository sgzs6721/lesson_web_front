import React from 'react';
import { Modal, Button, Row, Col, Typography, Space, Card, Divider, Tag } from 'antd';
import { 
  ClockCircleOutlined, 
  FileTextOutlined, 
  CalendarOutlined, 
  TeamOutlined, 
  TagOutlined,
  DollarOutlined,
  BookOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Course } from '../types/course';
import { categoryOptions } from '../constants/courseOptions';
import { renderStatusTag } from '../constants/tableColumns';

const { Text } = Typography;

interface CourseDetailModalProps {
  visible: boolean;
  course: Course | null;
  onCancel: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  visible,
  course,
  onCancel
}) => {
  // 获取课程类型名称
  const getTypeName = (type: string | undefined) => {
    if (!type) return '';
    try {
      const category = categoryOptions.find(c => c.value.toString() === type || c.label === type);
      return category ? category.label : type;
    } catch (error) {
      console.error('获取课程类型名称出错:', error);
      return type;
    }
  };

  // 获取教练名称
  const getCoachNames = (coaches: { id: number; name: string }[] | undefined) => {
    if (!coaches || coaches.length === 0) return '暂无教练';
    return coaches.map(coach => coach.name).join(', ');
  };

  // 计算平均课时费
  const getAverageCoachFee = (coachFees: Record<number, number> | undefined) => {
    if (!coachFees || Object.keys(coachFees).length === 0) return 0;
    const fees = Object.values(coachFees);
    const total = fees.reduce((sum, fee) => sum + fee, 0);
    return total / fees.length;
  };

  if (!course) return null;

  // 定义标签样式
  const labelStyle = {
    color: '#8c8c8c',
    fontSize: '13px',
    marginBottom: '4px',
    display: 'block'
  };

  // 定义值样式
  const valueStyle = {
    fontSize: '15px',
    color: '#262626',
    fontWeight: 500,
    lineHeight: '24px'
  };

  // 定义标题样式
  const sectionTitleStyle = {
    borderLeft: '3px solid #1890ff',
    paddingLeft: '8px',
    fontSize: '15px',
    fontWeight: 600,
    marginBottom: '12px',
    color: '#262626'
  };

  // 课时信息项的样式
  const courseInfoItemStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 0',
    textAlign: 'center' as const,
    flex: 1,
    width: '100%'
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px' }}>
          课程详情
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      bodyStyle={{ padding: '14px', maxHeight: '75vh', overflowY: 'auto' }}
    >
      {/* 基本信息标题 */}
      <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>
        <Space>
          <BookOutlined />
          <span>基本信息</span>
        </Space>
      </div>
      
      {/* 基本信息内容 */}
      <Card 
        style={{ marginBottom: '20px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '20px' }}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '4px'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 600 }}>
                {course.name}
              </div>
              <div>
                {renderStatusTag(course.status)}
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div>
              <span style={{ ...labelStyle, marginBottom: '6px' }}>课程类型</span>
              <div style={{ fontSize: '14px' }}>
                <TagOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                {getTypeName(course.type)}
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div>
              <span style={{ ...labelStyle, marginBottom: '6px' }}>是否多教师教学</span>
              <div style={{ fontSize: '14px' }}>
                <TeamOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                {course.isMultiTeacher ? (
                  <Tag color="blue" icon={<CheckCircleOutlined />}>是</Tag>
                ) : (
                  <Tag color="default">否</Tag>
                )}
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div>
              <span style={{ ...labelStyle, marginBottom: '6px' }}>上课教练</span>
              <div style={{ fontSize: '14px' }}>
                <UserOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                {getCoachNames(course.coaches)}
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div>
              <span style={{ ...labelStyle, marginBottom: '6px' }}>创建时间</span>
              <div style={{ fontSize: '14px' }}>
                <CalendarOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                {dayjs(course.createdTime).format('YYYY-MM-DD HH:mm')}
              </div>
            </div>
          </Col>
          
          <Col span={12}>
            <div>
              <span style={{ ...labelStyle, marginBottom: '6px' }}>更新时间</span>
              <div style={{ fontSize: '14px' }}>
                <CalendarOutlined style={{ marginRight: '8px', color: '#8c8c8c' }} />
                {dayjs(course.updateTime).format('YYYY-MM-DD HH:mm')}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 课时信息标题 */}
      <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>
        <Space>
          <ClockCircleOutlined />
          <span>课时信息</span>
        </Space>
      </div>
      
      {/* 课时信息内容 */}
      <Card
        style={{ marginBottom: '20px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          borderRadius: '4px',
          background: '#f7f9fc',
          padding: '16px'
        }}>
          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>每次消耗</div>
            <div style={{ fontSize: '18px', color: '#1890ff', fontWeight: 600, textAlign: 'center' }}>
              {course.unitHours || 0} 小时
            </div>
          </div>
          
          <Divider type="vertical" style={{ height: '45px', margin: '0 16px', background: '#e8e8e8' }} />
          
          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>总课时</div>
            <div style={{ fontSize: '18px', color: '#52c41a', fontWeight: 600, textAlign: 'center' }}>
              {course.totalHours || 0} 小时
            </div>
          </div>
          
          <Divider type="vertical" style={{ height: '45px', margin: '0 16px', background: '#e8e8e8' }} />
          
          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>课程价格</div>
            <div style={{ fontSize: '18px', color: '#fa8c16', fontWeight: 600, textAlign: 'center' }}>
              ¥{course.price || 0}
            </div>
          </div>
          
          <Divider type="vertical" style={{ height: '45px', margin: '0 16px', background: '#e8e8e8' }} />
          
          <div style={courseInfoItemStyle}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', textAlign: 'center' }}>课时费</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#f5222d', textAlign: 'center' }}>
              ¥{course.coachFee || 0}
            </div>
          </div>
        </div>
      </Card>

      {/* 教练课时费详情 - 仅当是多教师教学时显示 */}
      {course.isMultiTeacher && course.coachFees && Object.keys(course.coachFees).length > 0 && (
        <>
          <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>
            <Space>
              <DollarOutlined />
              <span>教练课时费详情</span>
            </Space>
          </div>
          
          <Card
            size="small"
            title={
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                  各个教练课时费
                </span>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 400 }}>
                  平均课时费: ¥{getAverageCoachFee(course.coachFees).toFixed(2)}
                </span>
              </div>
            }
            style={{ marginBottom: '20px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
            className="coach-fee-card"
          >
            <div style={{ padding: '8px 0' }}>
              {course.coaches && course.coaches.map((coach) => {
                const coachFee = course.coachFees?.[coach.id] || 0;
                return (
                  <div key={coach.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <span style={{ fontSize: '14px', color: '#262626' }}>
                      {coach.name}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#f5222d' }}>
                      ¥{coachFee}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}

      {/* 课程描述 - 始终显示 */}
      <div style={{ ...sectionTitleStyle, marginBottom: '16px' }}>
        <Space>
          <FileTextOutlined />
          <span>课程描述</span>
        </Space>
      </div>
      
      <Card
        style={{ marginBottom: '14px', borderRadius: '8px', border: '1px solid #f0f0f0' }}
        bodyStyle={{ padding: '16px' }}
      >
        <div style={{ 
          minHeight: '40px',
          lineHeight: '22px',
          fontSize: '14px',
          color: course.description ? '#262626' : '#8c8c8c'
        }}>
          {course.description || '暂无描述'}
        </div>
      </Card>
    </Modal>
  );
};

export default CourseDetailModal;