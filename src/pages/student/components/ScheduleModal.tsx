import React from 'react';
import { Modal, Table, Typography, Tag, Badge, Divider, Button, Row, Col, Card, Statistic } from 'antd';
import { Student, ClassSchedule } from '../types/student';
import { ScheduleOutlined } from '@ant-design/icons';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface ScheduleModalProps {
  visible: boolean;
  student: Student | null;
  schedules: ClassSchedule[];
  onCancel: () => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  visible,
  student,
  schedules,
  onCancel
}) => {
  // 获取状态对应的标签
  const renderStatusTag = (status: 'COMPLETED' | 'UPCOMING' | 'CANCELED') => {
    switch(status) {
      case 'COMPLETED':
        return <Tag color="green">已完成</Tag>;
      case 'UPCOMING':
        return <Tag color="blue">待上课</Tag>;
      case 'CANCELED':
        return <Tag color="red">已取消</Tag>;
      default:
        return null;
    }
  };

  // 表格列定义
  const columns: ColumnsType<ClassSchedule> = [
    {
      title: '上课日期',
      key: 'date',
      align: 'center',
      render: (_: unknown, record: ClassSchedule) => (
        <span>
          {dayjs(record.date).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '上课时间',
      key: 'time',
      align: 'center',
      render: (_: unknown, record: ClassSchedule) => (
        <span>
          <Tag color="blue">周{record.weekday}</Tag> {record.startTime} - {record.endTime}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: renderStatusTag
    },
  ];

  // 获取课程名称
  const getCourseName = () => {
    if (!student) return ''
    const course = student.course;
    const courseValue = Array.isArray(course) ? course[0] : course;
    return courseOptions.find(c => c.value === courseValue)?.label;
  }

  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          <ScheduleOutlined style={{ marginRight: 8 }} />
          {student?.name} 的课程表
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>
      ]}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />

      {student && (
        <div>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="剩余课时"
                  value={student.remainingClasses.split('/')[0]}
                  suffix={`/ ${student.remainingClasses.split('/')[1]}`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="教练"
                  value={student.coach}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="有效期至"
                  value={student.expireDate}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      )}

      <Table
        dataSource={schedules}
        columns={columns}
        rowKey={record => `${record.date}-${record.startTime}`}
        pagination={false}
      />
    </Modal>
  );
};

export default ScheduleModal;