import React from 'react';
import { Modal, Button, Row, Col, Typography, Tag } from 'antd';
import { BookOutlined, ClockCircleOutlined, FileImageOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Course } from '../types/course';
import { categoryOptions, coachOptions } from '../constants/courseOptions';
import { renderStatusTag } from '../constants/tableColumns';

const { Title } = Typography;

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
  // 获取课程分类名称
  const getCategoryName = (categoryId: string | undefined) => {
    if (!categoryId) return '';
    const category = categoryOptions.find(c => c.value === categoryId);
    return category ? category.label : categoryId;
  };

  // 获取教练名称
  const getCoachNames = (coachIds: string[] | undefined) => {
    if (!coachIds || coachIds.length === 0) return '';
    // 只取第一个教练
    const id = coachIds[0];
    const coach = coachOptions.find(c => c.value === id);
    return coach ? coach.label : id;
  };

  if (!course) return null;

  return (
    <Modal
      title="课程详情"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
      width={800}
    >
      <div>
        <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 16, paddingBottom: 8 }}></div>
        
        {/* 课程基本信息 */}
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
            <BookOutlined style={{ marginRight: 8 }} /> 基本信息
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>课程名称</div>
                <div style={{ fontSize: 14 }}>{course.name}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>课程类型</div>
                <div style={{ fontSize: 14 }}>{getCategoryName(course.category)}</div>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>课程状态</div>
                <div>{renderStatusTag(course.status)}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>上课教练</div>
                <div style={{ fontSize: 14 }}>{getCoachNames(course.coaches)}</div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* 课程课时信息 */}
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
            <ClockCircleOutlined style={{ marginRight: 8 }} /> 课时信息
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>每次消耗课时</div>
                <div style={{ fontSize: 14 }}>{course.hoursPerClass} 小时</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>课筹单价(元)</div>
                <div style={{ fontSize: 14, color: '#f5222d' }}>¥{course.unitPrice}</div>
              </div>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>总课时</div>
                <div style={{ fontSize: 14 }}>{course.totalHours} 小时</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>已销课时</div>
                <div style={{ fontSize: 14 }}>{course.consumedHours} 小时</div>
              </div>
            </Col>
          </Row>
        </div>
        
        {/* 课程描述和时间信息 */}
        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
            <FileImageOutlined style={{ marginRight: 8 }} /> 课程描述
          </Title>
          <div style={{ padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4, minHeight: 60 }}>
            {course.description || '暂无描述'}
          </div>
        </div>

        {/* 时间信息 */}
        <div>
          <Title level={5} style={{ marginBottom: 12, color: '#1890ff' }}>
            <CalendarOutlined style={{ marginRight: 8 }} /> 时间信息
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>创建时间</div>
                <div style={{ fontSize: 14 }}>{dayjs(course.createdAt).format('YYYY-MM-DD HH:mm')}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>更新时间</div>
                <div style={{ fontSize: 14 }}>{dayjs(course.updatedAt).format('YYYY-MM-DD HH:mm')}</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default CourseDetailModal; 