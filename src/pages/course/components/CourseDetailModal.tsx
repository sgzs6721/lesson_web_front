import React from 'react';
import { Modal, Button, Row, Col, Typography, Tag } from 'antd';
import { BookOutlined, ClockCircleOutlined, FileImageOutlined, CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Course, CourseType, CourseStatus } from '../types/course';
import { categoryOptions } from '../constants/courseOptions';
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
  // 获取课程类型名称
  const getTypeName = (type: string | undefined) => {
    if (!type) return '';
    // 尝试将type转换为对应的枚举值
    try {
      // 根据categoryOptions的结构来比较
      const category = categoryOptions.find(c => c.value.toString() === type || c.label === type);
      return category ? category.label : type;
    } catch (error) {
      console.error('获取课程类型名称出错:', error);
      return type;
    }
  };

  // 获取教练名称
  const getCoachNames = (coaches: { id: number; name: string }[] | undefined) => {
    if (!coaches || coaches.length === 0) return '';
    return coaches.map(coach => coach.name).join(', ');
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
                <div style={{ fontSize: 14 }}>{getTypeName(course.type)}</div>
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
                <div style={{ fontSize: 14 }}>{course.unitHours} 小时</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 12, padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>课筹单价(元)</div>
                <div style={{ fontSize: 14, color: '#f5222d' }}>¥{course.price}</div>
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
                <div style={{ fontSize: 14 }}>{dayjs(course.createdTime).format('YYYY-MM-DD HH:mm')}</div>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: '8px 12px', backgroundColor: '#f9f9f9', borderRadius: 4 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#666' }}>更新时间</div>
                <div style={{ fontSize: 14 }}>{dayjs(course.updateTime).format('YYYY-MM-DD HH:mm')}</div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default CourseDetailModal;