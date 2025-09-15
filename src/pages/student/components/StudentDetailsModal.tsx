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
  AuditOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { getStatusInfo } from '@/pages/student/utils/student';
import { getPaymentList } from '@/api/payment';
import { getPayTypeIcon } from '@/pages/payment/constants/tableColumns';

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
  sharingInfoList?: Array<{
    sourceCourseId: number;
    sourceCourseName: string;
    targetCourseId: number;
    targetCourseName: string;
    coachId: number;
    coachName: string;
  }>;
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
  const [paymentRecords, setPaymentRecords] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState<boolean>(false);

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

  // 打开时拉取该学员的缴费记录
  useEffect(() => {
    const fetchPayments = async () => {
      if (!visible || !student || !student.id) {
        setPaymentRecords([]);
        return;
      }
      try {
        setLoadingPayments(true);
        const campusId = Number(localStorage.getItem('currentCampusId')) || 1;
        const res = await getPaymentList({
          studentId: Number(student.id),
          campusId,
          pageNum: 1,
          pageSize: 20,
        } as any);
        const list = Array.isArray(res.list) ? res.list : [];
        setPaymentRecords(list);
      } catch (e) {
        setPaymentRecords([]);
      } finally {
        setLoadingPayments(false);
      }
    };
    fetchPayments();
  }, [visible, student]);

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
      destroyOnHidden
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
              padding: '12px 16px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  size={56} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: gender === 'MALE' ? '#1890ff' : '#eb2f96',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '22px'
                  }}
                />
                <div style={{ marginLeft: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                      {name}
                    </Title>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: '13px', marginRight: 16, display: 'flex', alignItems: 'center', color: '#555' }}>
                      <IdcardOutlined style={{ marginRight: 8 }} />
                      {student.id}
                    </Text>
                    <Text style={{ fontSize: '13px', marginRight: 16, display: 'flex', alignItems: 'center', color: '#555' }}>
                      {gender === 'MALE' ? <span style={{ color: '#1890ff', marginRight: 6, fontSize: '14px' }}>♂</span> : <span style={{ color: '#eb2f96', marginRight: 6, fontSize: '14px' }}>♀</span>}
                      {ageText}
                    </Text>
                    <Text style={{ fontSize: '13px', display: 'flex', alignItems: 'center', color: '#555', marginRight: 16 }}>
                      <PhoneOutlined style={{ marginRight: 6 }} />
                      {getPhone()}
                    </Text>
                    {/* 顶部校区信息 */}
                    <Text style={{ fontSize: '13px', display: 'flex', alignItems: 'center', color: '#555' }}>
                      <EnvironmentOutlined style={{ marginRight: 6 }} />
                      {student.campusName || '-'}
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
                
                <Row gutter={[16, 16]}>
                {processedCourses.map((course, index) => (
                  <Col span={12} key={course.studentCourseId || course.courseId || index}>
                    <Card 
                      variant="borderless"
                      style={{
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                      }}
                      styles={{ body: { padding: '20px 24px' } }}
                    >
                      <div style={{ marginBottom: 16 }}>
                        {/* 第一行：课程名称 */}
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span 
                              style={{ 
                                fontSize: '16px', 
                                fontWeight: '600',
                                marginRight: 8,
                                color: '#1d39c4'
                              }}
                            >
                              {('courseName' in course) ? course.courseName : `课程${course.courseId}`}
                            </span>
                          </div>
                          <div>
                            {(() => {
                              const info = getStatusInfo(course.status || 'STUDYING');
                              return (
                                <Tag color={info.color} style={{ height: 22, display: 'inline-flex', alignItems: 'center' }}>
                                  {info.text}
                                </Tag>
                              );
                            })()}
                          </div>
                        </div>

                        {/* 第二行：课程类型标签 + 教练 + 课时信息 */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
                          <Tag 
                            color='blue' 
                            style={{ 
                              fontSize: '13px', 
                              marginRight: 12, 
                              padding: '1px 10px', 
                              borderRadius: '4px',
                              fontWeight: '500'
                            }}
                          >
                            {('courseTypeName' in course) ? course.courseTypeName : '标准课程'}
                          </Tag>

                          {/* 教练信息紧跟在标签右侧（取消加粗） */}
                          <span style={{ display: 'inline-flex', alignItems: 'center', color: '#595959', marginRight: 16 }}>
                            <AuditOutlined style={{ fontSize: '14px', color: '#8c8c8c', marginRight: 8 }} />
                            <Text type="secondary" style={{ marginRight: 8 }}>教练:</Text>
                            <Text style={{ color: '#1d39c4', fontWeight: 400 }}>{('coachName' in course) ? course.coachName : '-'}</Text>
                          </span>

                          {/* 课时信息（右对齐 + 新样式） */}
                          {('remainingHours' in course && course.remainingHours !== undefined) && (
                            <span style={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              marginLeft: 'auto',
                              color: '#8c8c8c',
                              fontSize: '14px',
                              fontWeight: 400
                            }}>
                              <ClockCircleOutlined style={{ fontSize: '14px', color: '#bfbfbf', marginRight: 6 }} />
                              {course.remainingHours}/{('totalHours' in course) ? course.totalHours || 0 : 0}课时
                            </span>
                          )}
                        </div>

                        {/* 共享课程信息 */}
                        {course.sharingInfoList && course.sharingInfoList.length > 0 && (
                          <div style={{ 
                            marginTop: '12px', 
                            padding: '8px 12px', 
                            backgroundColor: '#f0f9ff', 
                            borderRadius: '6px',
                            border: '1px solid #91d5ff'
                          }}>
                            <div style={{ fontSize: '13px', color: 'rgba(0, 0, 0, 0.85)' }}>
                              <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>共享课程：</span>
                              <span style={{ fontWeight: '500', marginRight: '12px' }}>
                                {course.sharingInfoList[0].targetCourseName || '-'}
                              </span>
                              <span style={{ color: 'rgba(0, 0, 0, 0.65)' }}>教练：</span>
                              <span style={{ fontWeight: '500' }}>
                                {course.sharingInfoList[0].coachName || '-'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </Card>
                  </Col>
                ))}
                </Row>
              </Col>
            </Row>
          )}

          {/* 缴费记录 */}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TransactionOutlined style={{ color: '#52c41a' }} />
              缴费记录
            </div>
            {loadingPayments ? (
              <div style={{ padding: '12px', color: '#8c8c8c', border: '1px dashed #f0f0f0', borderRadius: 8 }}>加载中...</div>
            ) : paymentRecords.length > 0 ? (
              <div style={{ border: '1px solid #f0f0f0', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1fr 1fr', background: '#fafafa', padding: '8px 12px', fontWeight: 600, color: '#555', textAlign: 'center' }}>
                  <div>缴费类型</div>
                  <div>缴费方式</div>
                  <div>缴费金额</div>
                  <div>正课</div>
                  <div>赠课</div>
                  <div>缴费日期</div>
                </div>
                {paymentRecords.map((p: any, idx: number) => {
                  // 类型标签
                  const paymentType = String(p.paymentType || '-');
                  let typeColor = 'default';
                  let typeText = paymentType;
                  const upper = paymentType.toUpperCase();
                  if (upper === 'NEW' || paymentType === '新增') { typeColor = 'green'; typeText = '新增'; }
                  else if (upper === 'RENEW' || paymentType === '续费') { typeColor = 'blue'; typeText = '续费'; }
                  else if (upper === 'MAKEUP' || upper === 'SUPPLEMENT' || paymentType === '补费') { typeColor = 'orange'; typeText = '补费'; }
                  else if (upper === 'REFUND' || paymentType === '退费') { typeColor = 'red'; typeText = '退费'; }

                  // 支付方式图标（与列表页一致）
                  const payType = String(p.payType || p.paymentMethod || '-');
                  const payIcon = getPayTypeIcon(payType);

                  // 正课课时（提取数字部分）
                  const lessonHours = p.hours || parseFloat(String(p.lessonChange || '').replace(/[^\d.-]/g, '')) || 0;
                  const lessonColor = lessonHours < 0 ? '#cf1322' : '#3f8600';
                  
                  // 赠课课时
                  const giftHours = p.giftHours || p.giftedHours || 0;

                  return (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr 1fr 1fr', padding: '10px 12px', borderTop: '1px solid #f5f5f5', fontSize: 14, color: '#262626', alignItems: 'center', textAlign: 'center' }}>
                      <div>
                        {typeText !== '-' ? (
                          <Tag 
                            color={typeColor as any}
                            style={{ minWidth: 80, textAlign: 'center', margin: 0 }}
                          >
                            {typeText}
                          </Tag>
                        ) : '-'}
                      </div>
                      <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          {payIcon}
                        </span>
                      </div>
                      <div>
                        {p.amount ? `¥${Number(p.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` : '-'}
                      </div>
                      <div style={{ color: lessonColor, fontWeight: 400 }}>
                        {lessonHours}
                      </div>
                      <div style={{ color: '#722ed1', fontWeight: 400 }}>
                        {giftHours}
                      </div>
                      <div>{p.date || p.paymentTime || p.createdTime || '-'}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '12px', color: '#8c8c8c', border: '1px dashed #f0f0f0', borderRadius: 8 }}>暂无缴费记录</div>
            )}
          </div>
          
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
