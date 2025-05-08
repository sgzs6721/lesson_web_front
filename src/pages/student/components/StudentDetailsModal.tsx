import React, { useEffect, useState } from 'react';
import { Modal, Tag, Divider, Typography, Row, Col, Card, Avatar, Button } from 'antd';
import { Student, CourseInfo } from '@/pages/student/types/student';
import { 
  InfoCircleOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  BookOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  IdcardOutlined,
  CalendarOutlined,
  AuditOutlined
} from '@ant-design/icons';
import { getStatusInfo } from '@/pages/student/utils/student';

const { Title, Text } = Typography;

// 固定课表时间接口
interface ScheduleTimeItem {
  weekday: string;
  from: string;
  to: string;
}

// 添加StudentListItem接口以适配list接口返回的数据格式
interface ListCourse {
  courseId: number;
  courseName?: string;
  courseTypeName?: string;
  coachName?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  fixedSchedule?: string; // 原始固定排课时间字符串
  fixedScheduleTimes?: ScheduleTimeItem[];
  remainingHours?: number;
  totalHours?: number;
  // 添加其他可能的字段
  enrollmentDate?: string;
  studentCourseId?: number;
  courseTypeId?: number;
}

interface StudentListItem {
  id: string | number;
  studentName?: string;
  studentGender?: string;
  studentAge?: number;
  studentPhone?: string;
  campusId?: number;
  campusName?: string;
  institutionId?: number;
  institutionName?: string;
  courses?: ListCourse[];
  createdTime?: string;
  [key: string]: any; // 允许其他属性
}

type StudentData = Student | StudentListItem;

interface StudentDetailsModalProps {
  visible: boolean;
  student: StudentData | null;
  onCancel: () => void;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  visible,
  student,
  onCancel
}) => {
  const [processedCourses, setProcessedCourses] = useState<ListCourse[]>([]);

  // 处理课程数据，解析fixedSchedule
  useEffect(() => {
    if (student && student.courses && student.courses.length > 0) {
      const processed = student.courses.map(course => {
        // 创建一个新的课程对象，避免修改原始数据
        const newCourse = { ...course } as ListCourse;
        
        // 如果已经有fixedScheduleTimes，则直接使用
        if (newCourse.fixedScheduleTimes && newCourse.fixedScheduleTimes.length > 0) {
          return newCourse;
        }
        
        // 如果有fixedSchedule字符串，尝试解析
        if (newCourse.fixedSchedule) {
          try {
            const scheduleData = JSON.parse(newCourse.fixedSchedule);
            if (Array.isArray(scheduleData)) {
              newCourse.fixedScheduleTimes = scheduleData.map((item: any) => {
                // 将数字weekday转换为对应的中文
                let weekday = item.weekday;
                if (/^[1-7]$/.test(String(weekday))) {
                  const weekdayMap = ['', '一', '二', '三', '四', '五', '六', '日'];
                  weekday = weekdayMap[Number(weekday)];
                }
                
                return {
                  weekday: weekday,
                  from: item.from,
                  to: item.to
                };
              });
              console.log('解析固定排课时间成功:', newCourse.fixedScheduleTimes);
            }
          } catch (e) {
            console.error('解析固定排课时间失败:', e, newCourse.fixedSchedule);
            newCourse.fixedScheduleTimes = [];
          }
        }
        
        return newCourse;
      });
      
      setProcessedCourses(processed as ListCourse[]);
    } else {
      setProcessedCourses([]);
    }
  }, [student]);

  // 处理不同数据源的状态值
  const getStatus = () => {
    if (!student) return null;
    
    if ('status' in student && student.status) {
      return getStatusInfo(student.status);
    }
    
    if (student.courses && student.courses.length > 0) {
      const courseStatus = student.courses[0].status;
      return getStatusInfo(courseStatus || 'NORMAL');
    }
    
    return getStatusInfo('NORMAL');
  };

  const status = getStatus();

  // 适配不同数据源的姓名、性别、年龄
  const getName = (): string => {
    if (!student) return '';
    return 'name' in student ? student.name : 
           'studentName' in student ? student.studentName || '' : '';
  };
  
  const getGender = (): string => {
    if (!student) return 'MALE';
    return 'gender' in student ? student.gender : 
           'studentGender' in student ? student.studentGender || 'MALE' : 'MALE';
  };
  
  const getAge = (): number => {
    if (!student) return 0;
    return 'age' in student ? student.age : 
           'studentAge' in student ? student.studentAge || 0 : 0;
  };
  
  const name = getName();
  const gender = getGender();
  const age = getAge();
  
  // 计算年龄和性别显示
  const genderIcon = gender === 'MALE' ? 
    <span style={{ color: '#1890ff', marginRight: 4, fontSize: '14px' }}>♂</span> : 
    <span style={{ color: '#eb2f96', marginRight: 4, fontSize: '14px' }}>♀</span>;
  const ageText = age ? `${age}岁` : '-';

  // 获取电话号码
  const getPhone = (): string => {
    if (!student) return '-';
    return 'phone' in student ? student.phone : 
           'studentPhone' in student ? student.studentPhone || '-' : '-';
  };

  // 打印课程状态用于调试
  React.useEffect(() => {
    if (student && student.courses && student.courses.length > 0) {
      console.log('课程状态:', student.courses[0].status);
    }
  }, [student]);

  // 状态标签颜色映射
  const statusColorMap: Record<string, string> = {
    'NORMAL': '#52c41a',
    'STUDYING': '#52c41a',
    'EXPIRED': '#ff4d4f',
    'GRADUATED': '#1890ff',
    'WAITING_PAYMENT': '#fa8c16',
    'WAITING_CLASS': '#722ed1',
    'WAITING_RENEWAL': '#13c2c2',
    'REFUNDED': '#f5222d',
    'PENDING': '#faad14',
    'INACTIVE': '#8c8c8c'
  };

  // 状态标签文本映射
  const statusTextMap: Record<string, string> = {
    'NORMAL': '学习中',
    'STUDYING': '学习中',
    'EXPIRED': '过期',
    'GRADUATED': '结业',
    'WAITING_PAYMENT': '待缴费',
    'WAITING_CLASS': '待上课',
    'WAITING_RENEWAL': '待续费',
    'REFUNDED': '已退费',
    'PENDING': '待开课',
    'INACTIVE': '停课'
  };

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
    <Modal
      title={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-start',
          padding: 0,
          margin: 0,
          width: '100%'
        }}>
          <InfoCircleOutlined style={{ marginRight: 10, color: '#1890ff', fontSize: 20 }} />
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>学员详情</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
      centered
      styles={{ 
        body: { padding: '24px 32px' },
        header: { 
          borderBottom: '1px solid #f0f0f0',
          padding: '16px 24px 16px 16px', 
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'flex-start'
        },
        mask: { }
      }}
    >
      {!student ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
          请选择学员查看详情
        </div>
      ) : (
        <>
          <div 
            style={{ 
              borderRadius: '12px',
              background: gender === 'MALE' ? '#e6f7ff' : '#fff0f6',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  size={80} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: gender === 'MALE' ? '#1890ff' : '#eb2f96',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '32px'
                  }}
                />
                <div style={{ marginLeft: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title level={3} style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>
                      {name}
                    </Title>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: '15px', marginRight: 24, display: 'flex', alignItems: 'center', color: '#555' }}>
                      <IdcardOutlined style={{ marginRight: 8 }} />
                      {student.id}
                    </Text>
                    <Text style={{ fontSize: '15px', marginRight: 24, display: 'flex', alignItems: 'center', color: '#555' }}>
                      {gender === 'MALE' ? 
                        <span style={{ color: '#1890ff', marginRight: 8, fontSize: '16px' }}>♂</span> : 
                        <span style={{ color: '#eb2f96', marginRight: 8, fontSize: '16px' }}>♀</span>}
                      {ageText}
                    </Text>
                    <Text style={{ fontSize: '15px', display: 'flex', alignItems: 'center', color: '#555' }}>
                      <PhoneOutlined style={{ marginRight: 8 }} />
                      {getPhone()}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {processedCourses.length > 0 && (
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <div style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#333',
                  justifyContent: 'flex-start',
                  width: '100%',
                  textAlign: 'left'
                }}>
                  <BookOutlined style={{ color: '#1890ff', marginRight: 12, fontSize: '20px' }} />
                  所有课程
                </div>
                
                {processedCourses.map((course, index) => (
                  <Card 
                    key={course.studentCourseId || course.courseId || index} 
                    bordered={false}
                    style={{
                      marginBottom: index !== processedCourses.length - 1 ? 16 : 0,
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                    bodyStyle={{ padding: '20px 24px' }}
                  >
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span 
                            style={{ 
                              fontSize: '16px', 
                              fontWeight: '600',
                              marginRight: 16,
                              color: '#262626'
                            }}
                          >
                            {('courseName' in course) ? course.courseName : `课程${course.courseId}`}
                          </span>
                          <Tag 
                            color='blue' 
                            style={{ 
                              fontSize: '13px', 
                              marginRight: 10, 
                              padding: '1px 10px', 
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}
                          >
                            {('courseTypeName' in course) ? course.courseTypeName : '标准课程'}
                          </Tag>
                          
                          {('remainingHours' in course && course.remainingHours !== undefined) && (
                            <span style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              color: '#595959',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              marginRight: 10,
                              backgroundColor: '#f0f0f0',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              <ClockCircleOutlined style={{ fontSize: '14px', color: '#8c8c8c', marginRight: 4 }} />
                              {course.remainingHours}/{('totalHours' in course) ? course.totalHours || 0 : 0}课时
                            </span>
                          )}
                        </div>
                        
                        <div>
                          {(() => {
                            // 处理状态展示
                            const statusUpperCase = (course.status || '').toUpperCase();
                            const statusColor = statusColorMap[statusUpperCase] || '#d9d9d9';
                            const statusText = statusTextMap[statusUpperCase] || (course.status || '未知');
                            
                            // 根据不同状态设置不同样式
                            switch (statusUpperCase) {
                              case 'GRADUATED':
                                return (
                                  <Tag 
                                    color="#1890ff" 
                                    style={{ 
                                      fontSize: '13px', 
                                      padding: '1px 10px', 
                                      borderRadius: '4px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {statusText}
                                  </Tag>
                                );
                              case 'EXPIRED':
                                return (
                                  <Tag 
                                    color="#ff4d4f" 
                                    style={{ 
                                      fontSize: '13px', 
                                      padding: '1px 10px', 
                                      borderRadius: '4px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {statusText}
                                  </Tag>
                                );
                              case 'WAITING_PAYMENT':
                                return (
                                  <Tag 
                                    color="#fa8c16" 
                                    style={{ 
                                      fontSize: '13px', 
                                      padding: '1px 10px', 
                                      borderRadius: '4px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {statusText}
                                  </Tag>
                                );
                              case 'WAITING_CLASS':
                                return (
                                  <Tag 
                                    color="#722ed1" 
                                    style={{ 
                                      fontSize: '13px', 
                                      padding: '1px 10px', 
                                      borderRadius: '4px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {statusText}
                                  </Tag>
                                );
                              case 'WAITING_RENEWAL':
                                return (
                                  <Tag 
                                    color="#13c2c2" 
                                    style={{ 
                                      fontSize: '13px', 
                                      padding: '1px 10px', 
                                      borderRadius: '4px',
                                      fontWeight: '500'
                                    }}
                                  >
                                    {statusText}
                                  </Tag>
                                );
                              case 'REFUNDED':
                              return (
                                <Tag 
                                    color="#f5222d" 
                                  style={{ 
                                    fontSize: '13px', 
                                    padding: '1px 10px', 
                                    borderRadius: '4px',
                                    fontWeight: '500'
                                  }}
                                >
                                  {statusText}
                                </Tag>
                              );
                              default:
                            return (
                              <Tag 
                                color={statusColor} 
                                style={{ 
                                  fontSize: '13px', 
                                  padding: '1px 10px', 
                                  borderRadius: '4px',
                                  fontWeight: '500'
                                }}
                              >
                                {statusText}
                              </Tag>
                            );
                            }
                          })()}
                        </div>
                      </div>
                      
                      <Row gutter={[24, 16]} style={{ fontSize: '14px' }}>
                        <Col span={12}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <AuditOutlined style={{ fontSize: '14px', color: '#8c8c8c', marginRight: 8 }} />
                            <Text type="secondary" style={{ marginRight: 8 }}>教练:</Text>
                            <Text strong>{('coachName' in course) ? course.coachName : '-'}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <EnvironmentOutlined style={{ fontSize: '14px', color: '#8c8c8c', marginRight: 8 }} />
                            <Text type="secondary" style={{ marginRight: 8 }}>校区:</Text>
                            <Text strong>{student.campusName || '-'}</Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarOutlined style={{ fontSize: '14px', color: '#8c8c8c', marginRight: 8 }} />
                            <Text type="secondary" style={{ marginRight: 8 }}>开始日期:</Text>
                            <Text strong>
                              {('enrollmentDate' in course) ? course.enrollmentDate : 
                                ('startDate' in course) ? course.startDate : '-'}
                            </Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarOutlined style={{ fontSize: '14px', color: '#8c8c8c', marginRight: 8 }} />
                            <Text type="secondary" style={{ marginRight: 8 }}>结束日期:</Text>
                            <Text strong>{('endDate' in course) ? course.endDate : '-'}</Text>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    
                    {(course.fixedScheduleTimes && course.fixedScheduleTimes.length > 0) && (
                      <div style={{ marginTop: 16 }}>
                        <div 
                          style={{ 
                            borderTop: '1px solid #f0f0f0',
                            paddingTop: 16,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Text style={{ fontSize: '12px', fontWeight: '500', color: '#262626', minWidth: '70px', marginRight: '10px' }}>
                            固定排课:
                          </Text>
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              margin: '-5px',
                              justifyContent: 'flex-start'
                            }}>
                             {course.fixedScheduleTimes?.map((time: ScheduleTimeItem, timeIndex: number) => {
                               const weekdayStyle = weekdayColorMap[time.weekday] || {bg: '#f5f5f5', border: '#d9d9d9', text: '#595959'};
                               return (
                                 <div 
                                   key={timeIndex} 
                                   style={{ 
                                     padding: '5px',
                                     width: '48%',
                                     minWidth: '220px',
                                     boxSizing: 'border-box'
                                   }}
                                 >
                                   <div style={{
                                     display: 'flex',
                                     alignItems: 'center',
                                     width: '100%',
                                     height: '28px',
                                     backgroundColor: '#fff',
                                     borderRadius: '4px',
                                     border: `1px solid ${weekdayStyle.border}`,
                                     padding: '0',
                                     overflow: 'hidden',
                                     boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                                   }}>
                                     <div
                                       style={{
                                         color: weekdayStyle.text,
                                         fontWeight: '500',
                                         backgroundColor: weekdayStyle.bg,
                                         padding: '0',
                                         margin: '0',
                                         height: '100%',
                                         display: 'flex',
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         fontSize: '12px',
                                         borderRight: `1px solid ${weekdayStyle.border}`,
                                         minWidth: '70px'
                                       }}
                                     >
                                       星期{time.weekday}
                                     </div>
                                     <div style={{ 
                                       display: 'flex', 
                                       alignItems: 'center',
                                       padding: '0 12px',
                                       flex: 1
                                     }}>
                                       <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', marginRight: '6px' }} />
                                       <span style={{ fontWeight: '500', color: '#555', fontSize: '12px' }}>{time.from} - {time.to}</span>
                                     </div>
                                   </div>
                                 </div>
                               );
                             })}
                           </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </Col>
            </Row>
          )}
          
          <style dangerouslySetInnerHTML={{
            __html: `
              .ant-modal-content {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
              }
              .detail-item {
                display: flex;
                align-items: center;
                font-size: 14px;
              }
              .detail-icon {
                color: #8c8c8c;
                margin-right: 6px;
                font-size: 14px;
              }
              .detail-label {
                color: #8c8c8c;
                margin-right: 8px;
                flex-shrink: 0;
              }
              .detail-value {
                color: #262626;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            `
          }} />
        </>
      )}
    </Modal>
  );
};

export default StudentDetailsModal;
