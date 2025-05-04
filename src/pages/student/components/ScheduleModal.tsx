import React from 'react';
import { Modal, Table, Typography, Tag, Badge, Divider, Button, Row, Col, Card, Statistic } from 'antd';
import { Student, ClassSchedule } from '../types/student';
import { ScheduleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

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
          <Tag color="blue" style={{ 
            fontSize: '12px', 
            padding: '1px 5px', 
            borderRadius: '3px',
            fontWeight: '500',
            minWidth: '45px',
            marginRight: '8px'
          }}>周{record.weekday}</Tag>
          <span style={{ fontSize: '12px' }}>{record.startTime} - {record.endTime}</span>
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
  
  // 渲染固定排课时间
  const renderFixedSchedules = () => {
    if (!student || !student.courses || student.courses.length === 0) return null;
    
    // 收集所有课程的固定排课时间
    let allSchedules: { weekday: string, time: string, endTime: string }[] = [];
    for (const course of student.courses) {
      if (!course.fixedSchedule) continue;
      
      try {
        const parsedSchedule = JSON.parse(course.fixedSchedule);
        if (Array.isArray(parsedSchedule)) {
          const schedules = parsedSchedule.map(item => {
            let weekday = item.weekday;
            if (/^[1-7]$/.test(String(weekday))) {
              const weekdayMap = ['', '一', '二', '三', '四', '五', '六', '日'];
              weekday = weekdayMap[Number(weekday)];
            }
            return {
              weekday,
              time: item.from,
              endTime: item.to
            };
          });
          allSchedules = [...allSchedules, ...schedules];
        }
      } catch (e) {
        console.error('解析固定排课时间失败:', e);
      }
    }
    
    if (allSchedules.length === 0) return null;
    
    // 星期几颜色映射
    const weekdayColorMap: Record<string, {bg: string, border: string, text: string}> = {
      '一': {bg: '#e6f7ff', border: '#91d5ff', text: '#1890ff'},
      '二': {bg: '#f6ffed', border: '#b7eb8f', text: '#52c41a'},
      '三': {bg: '#fff2f0', border: '#ffccc7', text: '#ff4d4f'},
      '四': {bg: '#fff7e6', border: '#ffd591', text: '#fa8c16'},
      '五': {bg: '#f9f0ff', border: '#d3adf7', text: '#722ed1'},
      '六': {bg: '#e6fffb', border: '#87e8de', text: '#13c2c2'},
      '日': {bg: '#f5f5f5', border: '#d9d9d9', text: '#8c8c8c'}
    };
    
    return (
      <div style={{ marginTop: 32 }}>
        <Divider style={{ margin: '8px 0 24px 0' }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ minWidth: '85px' }}>
            <Text strong style={{ fontSize: '14px', color: '#333' }}>
              固定排课:
            </Text>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '16px',
              marginLeft: '5px'
            }}>
              {allSchedules.map((schedule, index) => {
                const weekdayStyle = weekdayColorMap[schedule.weekday] || {bg: '#f5f5f5', border: '#d9d9d9', text: '#595959'};
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '30px',
                      border: `1px solid ${weekdayStyle.border}`,
                      borderRadius: '4px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                      width: 'calc(50% - 8px)',
                      maxWidth: '220px',
                      minWidth: '170px'
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        backgroundColor: weekdayStyle.bg,
                        color: weekdayStyle.text,
                        fontWeight: '500',
                        padding: '0',
                        margin: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        borderRight: `1px solid ${weekdayStyle.border}`,
                        minWidth: '70px'
                      }}
                    >
                      星期{schedule.weekday}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 12px',
                        flex: 1,
                        justifyContent: 'flex-start'
                      }}
                    >
                      <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', marginRight: '6px' }} />
                      <span style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
                        {schedule.time} - {schedule.endTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        style={{ marginTop: 24 }}
      />
      
      {renderFixedSchedules()}
    </Modal>
  );
};

export default ScheduleModal;