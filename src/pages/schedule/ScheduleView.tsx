import { useState, useEffect } from 'react';
import {
  Calendar,
  Badge,
  Card,
  Select,
  Row,
  Col,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  DatePicker,
  message,
  Spin,
  Tooltip,
  Popconfirm,
  Tag,
  Radio,
  Space
} from 'antd';
import type { CalendarMode } from 'antd/es/calendar/generateCalendar';
import {
  PlusOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { BadgeProps } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 定义课程安排数据类型
interface ScheduleItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  coachId: string;
  coachName: string;
  campusId: string;
  campusName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'normal' | 'canceled' | 'completed';
  studentCount: number;
  maxStudents: number;
  remarks?: string;
  color: string;
}

// 模拟课程数据
const courseOptions = [
  { value: 'c1', label: '青少年篮球训练A班' },
  { value: 'c2', label: '网球精英班' },
  { value: 'c3', label: '少儿游泳入门班' },
  { value: 'c4', label: '成人健身基础班' },
  { value: 'c5', label: '瑜伽初级班' },
  { value: 'c6', label: '跆拳道精英班' },
];

// 模拟教练数据
const coachOptions = [
  { value: 'coach1', label: '张教练' },
  { value: 'coach2', label: '李教练' },
  { value: 'coach3', label: '王教练' },
  { value: 'coach4', label: '刘教练' },
  { value: 'coach5', label: '陈教练' },
];

// 模拟校区数据
const campusOptions = [
  { value: 'campus1', label: '北京中关村校区' },
  { value: 'campus2', label: '北京望京校区' },
  { value: 'campus3', label: '上海徐汇校区' },
  { value: 'campus4', label: '上海浦东校区' },
  { value: 'campus5', label: '广州天河校区' },
  { value: 'campus6', label: '深圳南山校区' },
];

// 颜色映射
const colorMap = {
  'c1': '#f50',
  'c2': '#2db7f5',
  'c3': '#87d068',
  'c4': '#722ed1',
  'c5': '#eb2f96',
  'c6': '#faad14',
};

const ScheduleView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [filteredScheduleData, setFilteredScheduleData] = useState<ScheduleItem[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'view'>('add');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>('');
  const [selectedCoach, setSelectedCoach] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [calendarView, setCalendarView] = useState<CalendarMode>('month');
  
  const [form] = Form.useForm();

  useEffect(() => {
    fetchScheduleData();
  }, []);

  useEffect(() => {
    filterScheduleData();
  }, [scheduleData, selectedCampus, selectedCoach, selectedCourse]);

  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据 - 过去和未来30天的课程安排
      const today = dayjs();
      const startDate = today.subtract(15, 'day');
      
      const mockData: ScheduleItem[] = [];
      
      // 为每个课程生成多个日程
      courseOptions.forEach((course, courseIndex) => {
        const courseId = course.value;
        
        // 每个课程在不同校区和不同教练下的安排
        for (let campusIndex = 0; campusIndex < 3; campusIndex++) {
          const campusId = campusOptions[campusIndex % campusOptions.length].value;
          const campusName = campusOptions[campusIndex % campusOptions.length].label;
          
          const coachId = coachOptions[(courseIndex + campusIndex) % coachOptions.length].value;
          const coachName = coachOptions[(courseIndex + campusIndex) % coachOptions.length].label;
          
          // 生成30天的排课
          for (let day = 0; day < 30; day++) {
            // 每个课程每周安排2-3次
            if (day % 3 === courseIndex % 3 || day % 7 === courseIndex % 7) {
              const currentDate = startDate.add(day, 'day');
              const dateStr = currentDate.format('YYYY-MM-DD');
              
              // 上午和下午各一个时间段
              const timeSlots = [
                { start: '09:00', end: '10:30' },
                { start: '14:00', end: '15:30' },
                { start: '19:00', end: '20:30' },
              ];
              
              const timeSlot = timeSlots[(courseIndex + day) % timeSlots.length];
              
              // 已完成、取消或正常状态
              let status: 'completed' | 'canceled' | 'normal';
              if (currentDate.isBefore(today, 'day')) {
                status = Math.random() > 0.1 ? 'completed' : 'canceled';
              } else {
                status = Math.random() > 0.05 ? 'normal' : 'canceled';
              }
              
              mockData.push({
                id: `s${mockData.length + 1}`,
                title: course.label,
                courseId,
                courseName: course.label,
                coachId,
                coachName,
                campusId,
                campusName,
                date: dateStr,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
                status,
                studentCount: Math.floor(Math.random() * 15) + 5,
                maxStudents: 20,
                remarks: Math.random() > 0.7 ? '特别备注：需要携带装备' : undefined,
                color: colorMap[courseId as keyof typeof colorMap] || '#1890ff',
              });
            }
          }
        }
      });
      
      setScheduleData(mockData);
    } catch (error) {
      message.error('获取课程安排失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterScheduleData = () => {
    let filtered = [...scheduleData];
    
    if (selectedCampus) {
      filtered = filtered.filter(item => item.campusId === selectedCampus);
    }
    
    if (selectedCoach) {
      filtered = filtered.filter(item => item.coachId === selectedCoach);
    }
    
    if (selectedCourse) {
      filtered = filtered.filter(item => item.courseId === selectedCourse);
    }
    
    setFilteredScheduleData(filtered);
  };

  const handleReset = () => {
    setSelectedCampus('');
    setSelectedCoach('');
    setSelectedCourse('');
    filterScheduleData();
  };

  const showAddModal = (date?: Dayjs) => {
    setModalType('add');
    form.resetFields();
    
    if (date) {
      form.setFieldsValue({
        date: date,
      });
    } else {
      form.setFieldsValue({
        date: dayjs(),
      });
    }
    
    setIsModalVisible(true);
  };

  const showViewModal = (schedule: ScheduleItem) => {
    setModalType('view');
    setSelectedSchedule(schedule);
    
    form.setFieldsValue({
      ...schedule,
      date: dayjs(schedule.date),
      time: [dayjs(`${schedule.date} ${schedule.startTime}`), dayjs(`${schedule.date} ${schedule.endTime}`)],
    });
    
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    if (modalType === 'view') {
      if (selectedSchedule && selectedSchedule.status !== 'completed') {
        form.validateFields()
          .then(values => {
            const updatedSchedule: ScheduleItem = {
              ...selectedSchedule,
              courseId: values.courseId,
              courseName: courseOptions.find(c => c.value === values.courseId)?.label || '',
              coachId: values.coachId,
              coachName: coachOptions.find(c => c.value === values.coachId)?.label || '',
              campusId: values.campusId,
              campusName: campusOptions.find(c => c.value === values.campusId)?.label || '',
              date: values.date.format('YYYY-MM-DD'),
              startTime: values.time[0].format('HH:mm'),
              endTime: values.time[1].format('HH:mm'),
              status: values.status,
              remarks: values.remarks,
              color: colorMap[values.courseId as keyof typeof colorMap] || '#1890ff',
            };
            
            // 更新数据
            setScheduleData(prev => 
              prev.map(item => item.id === updatedSchedule.id ? updatedSchedule : item)
            );
            
            message.success('课程安排已更新');
            setIsModalVisible(false);
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      } else {
        setIsModalVisible(false);
      }
    } else {
      form.validateFields()
        .then(values => {
          const courseInfo = courseOptions.find(c => c.value === values.courseId);
          const coachInfo = coachOptions.find(c => c.value === values.coachId);
          const campusInfo = campusOptions.find(c => c.value === values.campusId);
          
          const newSchedule: ScheduleItem = {
            id: `s${Date.now()}`,
            title: courseInfo?.label || '',
            courseId: values.courseId,
            courseName: courseInfo?.label || '',
            coachId: values.coachId,
            coachName: coachInfo?.label || '',
            campusId: values.campusId,
            campusName: campusInfo?.label || '',
            date: values.date.format('YYYY-MM-DD'),
            startTime: values.time[0].format('HH:mm'),
            endTime: values.time[1].format('HH:mm'),
            status: 'normal',
            studentCount: 0,
            maxStudents: values.maxStudents || 20,
            remarks: values.remarks,
            color: colorMap[values.courseId as keyof typeof colorMap] || '#1890ff',
          };
          
          // 添加新数据
          setScheduleData(prev => [newSchedule, ...prev]);
          
          message.success('课程安排已添加');
          setIsModalVisible(false);
        })
        .catch(info => {
          console.log('Validate Failed:', info);
        });
    }
  };

  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      // 删除数据
      setScheduleData(prev => prev.filter(item => item.id !== selectedSchedule.id));
      message.success('课程安排已删除');
      setIsModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const dateCellRender = (value: Dayjs) => {
    const date = value.format('YYYY-MM-DD');
    const listData = filteredScheduleData.filter(item => item.date === date);
    
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.slice(0, 3).map(item => (
          <li key={item.id} onClick={() => showViewModal(item)} style={{ margin: '2px 0' }}>
            <Badge
              status={getBadgeStatus(item.status)}
              text={
                <Tooltip title={`${item.startTime}-${item.endTime} ${item.courseName}`}>
                  <span style={{ fontSize: '12px' }}>
                    {item.startTime.substring(0, 5)} {item.courseName.substring(0, 6)}...
                  </span>
                </Tooltip>
              }
            />
          </li>
        ))}
        {listData.length > 3 && (
          <li>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              +{listData.length - 3} 更多...
            </Text>
          </li>
        )}
      </ul>
    );
  };

  // 获取徽章状态
  const getBadgeStatus = (status: string): BadgeProps['status'] => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'canceled':
        return 'error';
      case 'normal':
        return 'processing';
      default:
        return 'default';
    }
  };

  const onPanelChange = (value: Dayjs) => {
    setSelectedDate(value);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'canceled':
        return '已取消';
      case 'completed':
        return '已完成';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'processing';
      case 'canceled':
        return 'error';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="schedule-view">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>课程日程表</Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showAddModal()}
          >
            添加课程安排
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <Select
              placeholder="选择校区"
              style={{ width: '100%' }}
              value={selectedCampus}
              onChange={value => setSelectedCampus(value)}
              allowClear
            >
              {campusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Select
              placeholder="选择教练"
              style={{ width: '100%' }}
              value={selectedCoach}
              onChange={value => setSelectedCoach(value)}
              allowClear
            >
              {coachOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Select
              placeholder="选择课程"
              style={{ width: '100%' }}
              value={selectedCourse}
              onChange={value => setSelectedCourse(value)}
              allowClear
            >
              {courseOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} style={{ textAlign: 'right' }}>
            <Space>
              <Radio.Group 
                value={calendarView} 
                onChange={e => setCalendarView(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="week">周</Radio.Button>
                <Radio.Button value="day">日</Radio.Button>
              </Radio.Group>
              <Button onClick={handleReset}>重置筛选</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bodyStyle={{ padding: '24px 0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Calendar 
            dateCellRender={dateCellRender}
            onPanelChange={onPanelChange}
            onSelect={date => showAddModal(date)}
            mode={calendarView}
          />
        )}
      </Card>

      <Modal
        title={modalType === 'add' ? '添加课程安排' : '课程安排详情'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        footer={
          modalType === 'view' && selectedSchedule && selectedSchedule.status === 'completed'
            ? [
                <Button key="close" onClick={handleModalCancel}>
                  关闭
                </Button>
              ]
            : modalType === 'view'
            ? [
                <Popconfirm
                  key="delete"
                  title="确定要删除此课程安排吗？"
                  onConfirm={handleDeleteSchedule}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger>
                    删除
                  </Button>
                </Popconfirm>,
                <Button key="cancel" onClick={handleModalCancel}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={handleModalOk}>
                  保存修改
                </Button>
              ]
            : undefined
        }
      >
        <Form
          form={form}
          layout="vertical"
          name="scheduleForm"
          initialValues={{
            maxStudents: 20,
          }}
        >
          {modalType === 'view' && selectedSchedule && (
            <div style={{ marginBottom: 16 }}>
              <Tag color={getStatusColor(selectedSchedule.status)}>
                {getStatusText(selectedSchedule.status)}
              </Tag>
              {selectedSchedule.status !== 'canceled' && (
                <span style={{ marginLeft: 8 }}>
                  当前学员: {selectedSchedule.studentCount}/{selectedSchedule.maxStudents}
                </span>
              )}
            </div>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="courseId"
                label="课程"
                rules={[{ required: true, message: '请选择课程' }]}
              >
                <Select 
                  placeholder="请选择课程"
                  disabled={modalType === 'view' && selectedSchedule?.status === 'completed'}
                >
                  {courseOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coachId"
                label="教练"
                rules={[{ required: true, message: '请选择教练' }]}
              >
                <Select 
                  placeholder="请选择教练"
                  disabled={modalType === 'view' && selectedSchedule?.status === 'completed'}
                >
                  {coachOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="campusId"
                label="校区"
                rules={[{ required: true, message: '请选择校区' }]}
              >
                <Select 
                  placeholder="请选择校区"
                  disabled={modalType === 'view' && selectedSchedule?.status === 'completed'}
                >
                  {campusOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="日期"
                rules={[{ required: true, message: '请选择日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabled={modalType === 'view' && selectedSchedule?.status === 'completed'}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="time"
            label="时间段"
            rules={[{ required: true, message: '请选择时间段' }]}
          >
            <TimePicker.RangePicker 
              format="HH:mm"
              style={{ width: '100%' }}
              disabled={modalType === 'view' && selectedSchedule?.status === 'completed'}
            />
          </Form.Item>

          {modalType === 'add' && (
            <Form.Item
              name="maxStudents"
              label="最大学员数"
              rules={[{ required: true, message: '请输入最大学员数' }]}
            >
              <Input type="number" prefix={<TeamOutlined />} />
            </Form.Item>
          )}

          {modalType === 'view' && selectedSchedule?.status !== 'completed' && (
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Option value="normal">正常</Option>
                <Option value="canceled">已取消</Option>
                {dayjs(selectedSchedule?.date).isBefore(dayjs(), 'day') && (
                  <Option value="completed">已完成</Option>
                )}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="remarks"
            label="备注"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入备注信息"
              disabled={modalType === 'view' && selectedSchedule?.status === 'completed'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleView; 