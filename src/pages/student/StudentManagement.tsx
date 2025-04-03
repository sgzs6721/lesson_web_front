import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Modal,
  Form,
  message,
  Tooltip,
  Tag,
  Typography,
  Row,
  Col,
  Divider,
  Popover,
  Calendar,
  Statistic,
  TimePicker,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  ReloadOutlined,
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  InfoCircleOutlined,
  ScheduleOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { MonthPicker } = DatePicker;
const { TextArea } = Input;

// 定义课表接口
interface ClassSchedule {
  date: string;
  weekday: string;
  startTime: string;
  endTime: string;
  courseName: string;
  coach: string;
  status: 'completed' | 'upcoming' | 'canceled';
}

// 定义上课记录接口
interface ClassRecord {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  courseName: string;
  coach: string;
  content: string;
  feedback: string;
}

// 添加排课日期和时间选择接口
interface ScheduleTime {
  weekday: string;
  time: string;
}

// 在接口部分添加缴费记录相关接口
interface PaymentRecord {
  id: string;
  studentId: string;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  regularClasses: number;
  bonusClasses: number;
  validUntil: string;
  gift: string;
  remarks: string;
}

interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  phone: string;
  courseType: string;
  course: string | string[];
  coach: string;
  lastClassDate: string;
  enrollDate: string;
  expireDate: string;
  remainingClasses: string; // 剩余课时
  status: 'active' | 'inactive' | 'pending';
  scheduleTimes?: ScheduleTime[]; // 添加排课时间
  payments?: PaymentRecord[]; // 添加缴费记录
}

const StudentManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [enrollMonth, setEnrollMonth] = useState<dayjs.Dayjs | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
  const [isClassRecordModalVisible, setIsClassRecordModalVisible] = useState<boolean>(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [studentSchedule, setStudentSchedule] = useState<{student: Student | null, schedules: ClassSchedule[]}>({
    student: null,
    schedules: []
  });
  const [studentClassRecords, setStudentClassRecords] = useState<{
    student: Student | null;
    records: ClassRecord[];
  }>({
    student: null,
    records: [],
  });
  const [form] = Form.useForm();

  // 添加排课时间相关状态
  const [scheduleTimes, setScheduleTimes] = useState<ScheduleTime[]>([]);

  // 缴费相关状态
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [paymentForm] = Form.useForm();
  // 添加课时预览状态
  const [currentClassHours, setCurrentClassHours] = useState<number>(0);
  const [newClassHours, setNewClassHours] = useState<number>(0);
  const [totalClassHours, setTotalClassHours] = useState<number>(0);
  const [newValidUntil, setNewValidUntil] = useState<string>('—');

  // 课程类型列表
  const courseTypeOptions = [
    { value: 'sports', label: '体育类' },
    { value: 'art', label: '艺术类' },
    { value: 'academic', label: '学术类' },
  ];

  // 模拟课程列表
  const courseOptions = [
    { value: 'basketball', label: '篮球训练', type: 'sports', coaches: ['王教练', '李教练'], description: '专业篮球训练，提高球技和团队协作能力。' },
    { value: 'swimming', label: '游泳课程', type: 'sports', coaches: ['张教练', '刘教练'], description: '专业游泳教学，从零基础到自由泳、蛙泳等多种泳姿。' },
    { value: 'tennis', label: '网球培训', type: 'sports', coaches: ['赵教练', '钱教练'], description: '网球基础教学，培养灵活反应和协调能力。' },
    { value: 'painting', label: '绘画班', type: 'art', coaches: ['孙教练', '周教练'], description: '儿童创意绘画，激发艺术潜能和想象力。' },
    { value: 'piano', label: '钢琴培训', type: 'art', coaches: ['吴教练', '郑教练'], description: '一对一钢琴教学，从基础到进阶的专业指导。' },
    { value: 'dance', label: '舞蹈课程', type: 'art', coaches: ['冯教练', '陈教练'], description: '儿童舞蹈培训，包括芭蕾、街舞、中国舞等多种风格。' },
    { value: 'math', label: '数学辅导', type: 'academic', coaches: ['杨教练', '朱教练'], description: '小学数学思维训练，培养逻辑思维和解题能力。' },
    { value: 'english', label: '英语班', type: 'academic', coaches: ['秦教练', '许教练'], description: '趣味英语学习，提高听说读写综合能力。' },
  ];

  // 课程类型描述
  const typeDescriptions: Record<string, string[]> = {
    sports: [
      '适合对体育运动有兴趣的学生',
      '提供专业的体育培训和指导',
      '包括篮球、足球、游泳等多种运动项目',
      '注重身体素质和团队协作能力的培养'
    ],
    art: [
      '适合对艺术有浓厚兴趣的学生',
      '提供专业的艺术技巧训练',
      '包括绘画、音乐、舞蹈等多种艺术形式',
      '注重创造力和艺术表现力的培养'
    ],
    academic: [
      '适合需要提高学习成绩的学生',
      '提供针对性的学科辅导',
      '包括数学、英语、物理等多个学科',
      '注重学习方法和思维能力的培养'
    ]
  };

  // 周几选项
  const weekdayOptions = [
    { value: '一', label: '周一' },
    { value: '二', label: '周二' },
    { value: '三', label: '周三' },
    { value: '四', label: '周四' },
    { value: '五', label: '周五' },
    { value: '六', label: '周六' },
    { value: '日', label: '周日' },
  ];

  // 缴费类型选项
  const paymentTypeOptions = [
    { value: 'new', label: '新生报名' },
    { value: 'renew', label: '续费' },
    { value: 'upgrade', label: '升级课程' },
    { value: 'transfer', label: '转课' },
    { value: 'makeup', label: '补费' },
  ];

  // 支付方式选项
  const paymentMethodOptions = [
    { value: 'wechat', label: '微信支付' },
    { value: 'alipay', label: '支付宝' },
    { value: 'cash', label: '现金' },
    { value: 'card', label: '刷卡' },
    { value: 'transfer', label: '转账' },
  ];

  // 在已有代码中添加赠品选项列表
  const giftOptions = [
    { value: 'bag', label: '背包' },
    { value: 'bottle', label: '水杯' },
    { value: 'notebook', label: '笔记本' },
    { value: 'tshirt', label: 'T恤' },
    { value: 'cap', label: '帽子' },
  ];

  useEffect(() => {
    fetchStudents();
  }, [currentPage, pageSize, searchText, selectedStatus, selectedCourse, enrollMonth, sortOrder]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Student[] = Array(50)
        .fill(null)
        .map((_, index) => {
          const courseItem = courseOptions[index % courseOptions.length];
          const totalClasses = 20 + (index % 10);
          const remainingClasses = Math.max(1, totalClasses - (index % totalClasses));
          return {
            id: `ST${100000 + index}`,
            name: `学员${index + 1}`,
            gender: index % 2 === 0 ? 'male' : 'female',
            age: 6 + (index % 15),
            phone: `13${String(9000000000 + index).substring(0, 10)}`,
            courseType: courseItem.type,
            course: courseItem.value,
            coach: courseItem.coaches[index % 2],
            lastClassDate: dayjs().subtract(index % 30, 'day').format('YYYY-MM-DD'),
            enrollDate: dayjs().subtract(index % 180, 'day').format('YYYY-MM-DD'),
            expireDate: dayjs().add(180 - (index % 180), 'day').format('YYYY-MM-DD'),
            remainingClasses: `${remainingClasses}/${totalClasses}`,
            status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'inactive' : 'active',
          };
        });

      // 过滤数据
      let filteredData = mockData;
      
      if (searchText) {
        filteredData = filteredData.filter(
          student => 
            student.name.includes(searchText) || 
            student.id.includes(searchText) ||
            student.phone.includes(searchText)
        );
      }
      
      if (selectedStatus) {
        filteredData = filteredData.filter(student => student.status === selectedStatus);
      }
      
      if (selectedCourse) {
        filteredData = filteredData.filter(student => student.course === selectedCourse);
      }
      
      if (enrollMonth) {
        const year = enrollMonth.year();
        const month = enrollMonth.month() + 1;
        filteredData = filteredData.filter(student => {
          const studentDate = dayjs(student.enrollDate);
          return studentDate.year() === year && studentDate.month() + 1 === month;
        });
      }

      // 排序
      if (sortOrder) {
        filteredData = [...filteredData].sort((a, b) => {
          const dateA = new Date(a.enrollDate).getTime();
          const dateB = new Date(b.enrollDate).getTime();
          return sortOrder === 'ascend' ? dateA - dateB : dateB - dateA;
        });
      }

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = filteredData.slice(start, end);
      
      setTotal(filteredData.length);
      setStudents(paginatedData);
    } catch (error) {
      message.error('获取学员列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedStatus('');
    setSelectedCourse('');
    setEnrollMonth(null);
    setSortOrder(undefined);
    setCurrentPage(1);
    fetchStudents();
  };

  const showAddModal = () => {
    form.resetFields();
    setEditingStudent(null);
    // 设置默认排课时间
    setScheduleTimes([
      { weekday: '一', time: '15:00' },
      { weekday: '三', time: '16:00' }
    ]);
    setIsModalVisible(true);
  };
  
  const showEditModal = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue({
      ...record,
      enrollDate: dayjs(record.enrollDate),
      expireDate: dayjs(record.expireDate),
    });
    // 设置排课时间
    setScheduleTimes(record.scheduleTimes || []);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields()
      .then(values => {
        // 处理多选课程
        const courseValue = Array.isArray(values.course) ? values.course[0] : values.course;
        
        const formattedValues = {
          ...values,
          // 如果是多选，保存整个数组
          course: values.course,
          enrollDate: values.enrollDate.format('YYYY-MM-DD'),
          expireDate: values.expireDate.format('YYYY-MM-DD'),
          scheduleTimes: scheduleTimes.length > 0 ? scheduleTimes : undefined,
        };

        if (editingStudent) {
          // 编辑现有学员
          setStudents(prevStudents => 
            prevStudents.map(student => 
              student.id === editingStudent.id 
                ? { ...student, ...formattedValues } 
                : student
            )
          );
          message.success('学员信息已更新');
        } else {
          // 添加新学员
          // 获取课程对应的教练 - 使用第一个课程的教练
          const selectedCourseInfo = courseOptions.find(c => c.value === courseValue);
          const coach = selectedCourseInfo?.coaches[0] || '';
          
          const newStudent: Student = {
            id: `ST${100000 + Math.floor(Math.random() * 900000)}`,
            ...formattedValues,
            coach,
            lastClassDate: '',
            courseType: selectedCourseInfo?.type || '',
            remainingClasses: '20/20', // 默认20课时
          };
          setStudents(prevStudents => [newStudent, ...prevStudents]);
          setTotal(prev => prev + 1);
          message.success('学员添加成功');
        }

        form.resetFields();
        setIsModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const showDeleteModal = (id: string) => {
    setStudentToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (studentToDelete) {
      setStudents(students.filter(student => student.id !== studentToDelete));
      setTotal(prev => prev - 1);
      message.success('学员已删除');
      setIsDeleteModalVisible(false);
      setStudentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setStudentToDelete(null);
  };

  const handleExport = () => {
    // 创建导出数据
    const exportData = students.map(student => ({
      ID: student.id,
      姓名: student.name,
      性别: student.gender === 'male' ? '男' : '女',
      年龄: student.age,
      联系电话: student.phone,
      课程类型: courseTypeOptions.find(t => t.value === student.courseType)?.label || student.courseType,
      教练: student.coach,
      剩余课时: student.remainingClasses,
      最近上课时间: student.lastClassDate ? dayjs(student.lastClassDate).format('YYYY-MM-DD') : '未上课',
      报名日期: dayjs(student.enrollDate).format('YYYY-MM-DD'),
      有效期至: dayjs(student.expireDate).format('YYYY-MM-DD'),
      状态: student.status === 'active' ? '在学' : 
            student.status === 'inactive' ? '停课' : 
            student.status === 'pending' ? '待处理' : student.status
    }));
    
    // 转换为CSV内容
    const headers = Object.keys(exportData[0]);
    const csvContent = [
      // 添加标题行
      headers.join(','),
      // 添加数据行
      ...exportData.map(row => 
        headers.map(header => {
          // 处理包含逗号的单元格数据
          const cell = row[header as keyof typeof row];
          const cellStr = String(cell);
          return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
        }).join(',')
      )
    ].join('\n');
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // 设置下载属性
    link.setAttribute('href', url);
    link.setAttribute('download', `学员列表_${dayjs().format('YYYYMMDD')}.csv`);
    link.style.visibility = 'hidden';
    
    // 添加到文档并触发点击
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    message.success('导出成功');
  };

  const handleCourseChange = (value: string | string[]) => {
    // 如果是多选，value会是一个字符串数组
    const courseValue = Array.isArray(value) ? value[0] : value;
    
    if (courseValue) {
      const selectedCourseInfo = courseOptions.find(c => c.value === courseValue);
      if (selectedCourseInfo) {
        form.setFieldsValue({
          coach: selectedCourseInfo.coaches[0],
          courseType: selectedCourseInfo.type
        });
      }
    }
  };

  // 处理课程类型点击
  const handleCourseTypeClick = (courseType: string, record?: Student) => {
    // 获取课程类型信息
    const typeInfo = courseTypeOptions.find(t => t.value === courseType);
    if (!typeInfo) return;
    
    // 根据课程类型设置不同的颜色
    let color = '';
    let borderColor = '';
    let bgColor = '';
    
    switch(courseType) {
      case 'sports':
        color = '#389e0d';
        borderColor = '#b7eb8f';
        bgColor = '#f6ffed';
        break;
      case 'art':
        color = '#722ed1';
        borderColor = '#d3adf7';
        bgColor = '#f9f0ff';
        break;
      case 'academic':
        color = '#fa8c16';
        borderColor = '#ffd591';
        bgColor = '#fff7e6';
        break;
      default:
        color = '#1890ff';
        borderColor = '#91d5ff';
        bgColor = '#e6f7ff';
    }

    // 获取相关课程
    const typeCourses = courseOptions.filter(c => c.type === courseType);
    
    // 获取排课信息
    let courseSchedules = '';
    if (record && record.scheduleTimes && record.scheduleTimes.length > 0) {
      // 如果是具体学员，显示其个人排课信息
      courseSchedules = record.scheduleTimes.map(schedule => `周${schedule.weekday} ${schedule.time}`).join('、');
    } else if (scheduleTimes.length > 0) {
      // 在添加/编辑模态框中显示当前设置的排课信息
      courseSchedules = scheduleTimes.map(schedule => `周${schedule.weekday} ${schedule.time}`).join('、');
    }

    // 构建课程描述内容
    const descriptions = typeDescriptions[courseType] || [];
    
    // 显示类型信息
    Modal.info({
      title: <div style={{ color }}>{typeInfo.label}课程说明</div>,
      content: (
        <div>
          <Divider style={{ borderColor, margin: '12px 0' }} />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>可选课程：</div>
            {typeCourses.map((course, index) => (
              <Tag 
                key={index} 
                style={{ 
                  backgroundColor: bgColor, 
                  border: `1px solid ${borderColor}`,
                  color,
                  margin: '0 8px 8px 0'
                }}
              >
                {course.label}
              </Tag>
            ))}
          </div>
          {courseSchedules && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8 }}>固定上课时间：</div>
              <div style={{ color }}>{courseSchedules}</div>
            </div>
          )}
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8 }}>课程说明：</div>
            <ul style={{ paddingLeft: 20, marginBottom: 0 }}>
              {descriptions.map((desc: string, index: number) => (
                <li key={index} style={{ margin: '8px 0', color: 'rgba(0, 0, 0, 0.65)' }}>
                  <span style={{ 
                    backgroundColor: bgColor, 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    border: `1px solid ${borderColor}`,
                    color
                  }}>
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ),
      maskClosable: true,
      width: 400,
      icon: null,
      okText: '关闭'
    });
  };

  // 学员课表相关函数
  const showScheduleModal = (student: Student) => {
    // 生成模拟课表数据
    const mockSchedules: ClassSchedule[] = [];
    const weekdayMap: Record<string, string> = {
      'Mon': '一',
      'Tue': '二',
      'Wed': '三',
      'Thu': '四',
      'Fri': '五',
      'Sat': '六',
      'Sun': '日'
    };
    
    // 获取主课程（如果是数组则取第一个）
    const mainCourse = Array.isArray(student.course) ? student.course[0] : student.course;
    
    // 生成过去的已完成课程
    for (let i = 1; i <= 3; i++) {
      const date = dayjs().subtract(i * 7, 'day');
      const weekdayEn = date.format('ddd');
      
      mockSchedules.push({
        date: date.format('YYYY-MM-DD'),
        weekday: weekdayMap[weekdayEn] || weekdayEn,
        startTime: '15:00',
        endTime: '16:30',
        courseName: courseOptions.find(c => c.value === mainCourse)?.label || mainCourse,
        coach: student.coach,
        status: 'completed'
      });
    }
    
    // 生成未来的即将到来的课程
    for (let i = 1; i <= 4; i++) {
      const date = dayjs().add(i * 7, 'day');
      const weekdayEn = date.format('ddd');
      
      mockSchedules.push({
        date: date.format('YYYY-MM-DD'),
        weekday: weekdayMap[weekdayEn] || weekdayEn,
        startTime: '15:00',
        endTime: '16:30',
        courseName: courseOptions.find(c => c.value === mainCourse)?.label || mainCourse,
        coach: student.coach,
        status: 'upcoming'
      });
    }
    
    // 添加一个取消的课程
    const cancelDate = dayjs().add(2, 'day');
    const cancelWeekdayEn = cancelDate.format('ddd');
    
    mockSchedules.push({
      date: cancelDate.format('YYYY-MM-DD'),
      weekday: weekdayMap[cancelWeekdayEn] || cancelWeekdayEn,
      startTime: '15:00',
      endTime: '16:30',
      courseName: courseOptions.find(c => c.value === mainCourse)?.label || mainCourse,
      coach: student.coach,
      status: 'canceled'
    });
    
    // 按日期排序
    mockSchedules.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setStudentSchedule({
      student,
      schedules: mockSchedules
    });
    setIsScheduleModalVisible(true);
  };
  
  const handleScheduleModalCancel = () => {
    setIsScheduleModalVisible(false);
    setStudentSchedule({ student: null, schedules: [] });
  };

  // 上课记录相关函数
  const showClassRecordModal = (student: Student) => {
    // 生成模拟数据
    const mockRecords: ClassRecord[] = [];
    
    // 获取主课程（如果是数组则取第一个）
    const mainCourse = Array.isArray(student.course) ? student.course[0] : student.course;
    
    // 生成过去10节课的记录
    const today = dayjs();
    
    for (let i = 0; i < 10; i++) {
      const date = today.subtract(i * 7, 'day').format('YYYY-MM-DD');
      
      mockRecords.push({
        id: i.toString(),
        date,
        startTime: '16:00',
        endTime: '17:00',
        courseName: courseOptions.find(c => c.value === mainCourse)?.label || '未知课程',
        coach: student.coach,
        content: `专项训练${i + 1}：${['基本功训练', '力量训练', '耐力训练', '技巧训练', '比赛模拟'][i % 5]}`,
        feedback: `学生表现${['优秀', '良好', '一般', '需要加强'][i % 4]}，${['积极参与课堂活动', '注意力有所提高', '技能有所进步', '需要更多练习'][i % 4]}`
      });
    }
    
    // 按日期排序，最新的排在前面
    mockRecords.sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());
    
    setStudentClassRecords({
      student,
      records: mockRecords
    });
    setIsClassRecordModalVisible(true);
  };
  
  const handleClassRecordModalCancel = () => {
    setIsClassRecordModalVisible(false);
  };

  // 表头居中样式
  const columnStyle: React.CSSProperties = {
    textAlign: 'center',
  };

  // 课程类型列
  const renderCourseType = (text: string, record: Student) => {
    const typeInfo = courseTypeOptions.find(t => t.value === text);
    
    return (
      <Tag
        color={
          text === 'sports' ? 'green' :
          text === 'art' ? 'purple' :
          text === 'academic' ? 'orange' : 'blue'
        }
      >
        {typeInfo?.label || text}
      </Tag>
    );
  };

  // 添加排课时间
  const addScheduleTime = () => {
    setScheduleTimes([...scheduleTimes, { weekday: '一', time: '15:00' }]);
  };
  
  // 更新排课时间
  const updateScheduleTime = (index: number, field: 'weekday' | 'time', value: string) => {
    const newTimes = [...scheduleTimes];
    newTimes[index][field] = value;
    setScheduleTimes(newTimes);
  };
  
  // 删除排课时间
  const removeScheduleTime = (index: number) => {
    const newTimes = [...scheduleTimes];
    newTimes.splice(index, 1);
    setScheduleTimes(newTimes);
  };

  // 显示缴费模态框
  const showPaymentModal = (student: Student) => {
    setCurrentStudent(student);
    paymentForm.resetFields();
    
    // 设置初始值
    paymentForm.setFieldsValue({
      courseType: student.courseType,
      student: student.id,
      transactionDate: dayjs(),
      validUntil: dayjs().add(180, 'day'),
      regularClasses: 0,
      bonusClasses: 0,
    });
    
    // 设置课时预览初始值
    const remainingHours = parseInt(student.remainingClasses.split('/')[0]) || 0;
    setCurrentClassHours(remainingHours);
    setNewClassHours(0);
    setTotalClassHours(remainingHours);
    setNewValidUntil(dayjs().add(180, 'day').format('YYYY-MM-DD'));
    
    setIsPaymentModalVisible(true);
  };

  // 处理课时变化
  const handleClassHoursChange = () => {
    const regularClasses = paymentForm.getFieldValue('regularClasses') || 0;
    const bonusClasses = paymentForm.getFieldValue('bonusClasses') || 0;
    setNewClassHours(regularClasses + bonusClasses);
    setTotalClassHours(currentClassHours + regularClasses + bonusClasses);
  };

  // 处理缴费提交
  const handlePaymentOk = () => {
    paymentForm.validateFields()
      .then(values => {
        const paymentRecord: PaymentRecord = {
          id: `PAY${Date.now()}`,
          studentId: currentStudent?.id || '',
          paymentType: values.paymentType,
          amount: values.amount,
          paymentMethod: values.paymentMethod,
          transactionDate: values.transactionDate.format('YYYY-MM-DD'),
          regularClasses: values.regularClasses || 0,
          bonusClasses: values.bonusClasses || 0,
          validUntil: values.validUntil.format('YYYY-MM-DD'),
          gift: values.gift || '',
          remarks: values.remarks || '',
        };

        // 更新学生信息
        if (currentStudent) {
          // 计算新的剩余课时
          const originalRemaining = parseInt(currentStudent.remainingClasses.split('/')[0]) || 0;
          const originalTotal = parseInt(currentStudent.remainingClasses.split('/')[1]) || 0;
          const newRemaining = originalRemaining + values.regularClasses + values.bonusClasses;
          const newTotal = originalTotal + values.regularClasses + values.bonusClasses;

          setStudents(prevStudents => 
            prevStudents.map(student => 
              student.id === currentStudent.id 
                ? { 
                    ...student, 
                    expireDate: values.validUntil.format('YYYY-MM-DD'),
                    remainingClasses: `${newRemaining}/${newTotal}`,
                    payments: [...(student.payments || []), paymentRecord]
                  } 
                : student
            )
          );
        }

        message.success('缴费信息已保存');
        setIsPaymentModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 关闭缴费模态框
  const handlePaymentCancel = () => {
    setIsPaymentModalVisible(false);
    setCurrentStudent(null);
    paymentForm.resetFields();
  };

  // 处理有效期变化
  const handleValidUntilChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setNewValidUntil(date.format('YYYY-MM-DD'));
    } else {
      setNewValidUntil('—');
    }
  };

  const columns: ColumnsType<Student> = [
    {
      title: '学员ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
      render: (text, record) => (
        <span>
          {record.gender === 'male' ? 
            <span style={{ color: '#1890ff', marginRight: 5 }}>♂</span> : 
            <span style={{ color: '#eb2f96', marginRight: 5 }}>♀</span>
          }
          {text}
        </span>
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 70,
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      key: 'courseType',
      align: 'center',
      width: 120,
      render: renderCourseType
    },
    {
      title: '教练',
      dataIndex: 'coach',
      key: 'coach',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
    },
    {
      title: '剩余课时',
      dataIndex: 'remainingClasses',
      key: 'remainingClasses',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
    },
    {
      title: '最近上课时间',
      dataIndex: 'lastClassDate',
      key: 'lastClassDate',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
      render: text => text ? dayjs(text).format('YYYY-MM-DD') : '未上课',
    },
    {
      title: '报名日期',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
      render: text => dayjs(text).format('YYYY-MM-DD'),
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      onHeaderCell: () => ({
        style: columnStyle,
      }),
      render: status => {
        let color = '';
        let text = '';
        
        switch (status) {
          case 'active':
            color = 'green';
            text = '在学';
            break;
          case 'inactive':
            color = 'red';
            text = '停课';
            break;
          case 'pending':
            color = 'orange';
            text = '待处理';
            break;
          default:
            color = 'default';
            text = status;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => showEditModal(record)}
              type="primary"
              size="small"
              ghost
            />
          </Tooltip>
          <Tooltip title="课程记录">
            <Button
              icon={<FileTextOutlined />}
              onClick={() => showClassRecordModal(record)}
              type="primary"
              size="small"
              style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
            />
          </Tooltip>
          <Tooltip title="缴费">
            <Button
              icon={<DollarOutlined />}
              onClick={() => showPaymentModal(record)}
              type="primary"
              size="small"
              style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              icon={<DeleteOutlined />}
              onClick={() => showDeleteModal(record.id)}
              type="primary"
              danger
              size="small"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="student-management">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={4}>学员管理</Title>
        </Col>
        <Col>
          <Space>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              添加学员
            </Button>
            <Button 
              icon={<ExportOutlined />} 
              onClick={handleExport}
            >
              导出
            </Button>
          </Space>
        </Col>
      </Row>

      <Card style={{ marginBottom: 16 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={4}>
            <Input
              placeholder="搜索学员名称/ID/电话"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="选择状态"
              style={{ width: '100%' }}
              value={selectedStatus}
              onChange={value => setSelectedStatus(value)}
              allowClear
            >
              <Option value="active">在学</Option>
              <Option value="inactive">停课</Option>
              <Option value="pending">待处理</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
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
          <Col xs={24} md={4}>
            <MonthPicker
              style={{ width: '100%' }}
              placeholder="选择报名年月"
              value={enrollMonth}
              onChange={value => setEnrollMonth(value)}
            />
          </Col>
          <Col xs={24} md={4}>
            <Select
              placeholder="排序方式"
              style={{ width: '100%' }}
              value={sortOrder}
              onChange={value => setSortOrder(value)}
              allowClear
            >
              <Option value="ascend">
                <Space>
                  <SortAscendingOutlined />
                  报名日期升序
                </Space>
              </Option>
              <Option value="descend">
                <Space>
                  <SortDescendingOutlined />
                  报名日期降序
                </Space>
              </Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <Button icon={<ReloadOutlined />} onClick={handleReset} style={{ width: '100%' }}>
              重置
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </Card>

      <Modal
        title={editingStudent ? '编辑学员' : '添加学员'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={700}
        okText={editingStudent ? '保存' : '添加'}
        cancelText="取消"
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        <Form
          form={form}
          layout="vertical"
          name="studentForm"
          initialValues={{
            gender: 'male',
            status: 'active',
            enrollDate: dayjs(),
            expireDate: dayjs().add(180, 'day'),
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="学员姓名"
                rules={[{ required: true, message: '请输入学员姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入学员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select placeholder="请选择">
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[{ required: true, message: '请输入年龄' }]}
              >
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[{ required: true, message: '请输入联系电话' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="course"
                label="报名课程"
                rules={[{ required: true, message: '请选择课程' }]}
              >
                <Select 
                  placeholder="请选择课程"
                  onChange={handleCourseChange}
                  mode="multiple"
                >
                  {courseOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <TeamOutlined /> {option.label}
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="courseType"
                label="课程类型"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="coach"
                label="上课教练"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择">
                  <Option value="active">在学</Option>
                  <Option value="inactive">停课</Option>
                  <Option value="pending">待处理</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="enrollDate"
                label="报名日期"
                rules={[{ required: true, message: '请选择报名日期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="选择报名日期"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="expireDate"
                label="有效期至"
                rules={[{ required: true, message: '请选择有效期' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  placeholder="选择有效期"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 排课时间 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Typography.Text strong>固定排课时间</Typography.Text>
              <Button type="link" onClick={addScheduleTime} icon={<PlusOutlined />}>
                添加时间
              </Button>
            </div>
            {scheduleTimes.map((scheduleTime, index) => (
              <Row gutter={16} key={index} style={{ marginBottom: 16 }}>
                <Col span={10}>
                  <Select
                    style={{ width: '100%' }}
                    value={scheduleTime.weekday}
                    onChange={(value) => updateScheduleTime(index, 'weekday', value)}
                  >
                    {weekdayOptions.map(option => (
                      <Option key={option.value} value={option.value}>{option.label}</Option>
                    ))}
                  </Select>
                </Col>
                <Col span={10}>
                  <TimePicker
                    style={{ width: '100%' }}
                    format="HH:mm"
                    value={dayjs(scheduleTime.time, 'HH:mm')}
                    onChange={(time) => updateScheduleTime(index, 'time', time ? time.format('HH:mm') : '00:00')}
                  />
                </Col>
                <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => removeScheduleTime(index)}
                  />
                </Col>
              </Row>
            ))}
          </div>
        </Form>
      </Modal>

      <Modal
        title="删除确认"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除此学员吗？此操作不可恢复。</p>
      </Modal>

      <Modal
        title={
          <span>
            <ScheduleOutlined /> {studentSchedule.student?.name} 的课程表
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {(() => {
                const course = studentSchedule.student?.course;
                const courseValue = Array.isArray(course) ? course[0] : course;
                return courseOptions.find(c => c.value === courseValue)?.label;
              })()}
            </Tag>
          </span>
        }
        open={isScheduleModalVisible}
        onCancel={handleScheduleModalCancel}
        width={700}
        footer={[
          <Button key="close" onClick={handleScheduleModalCancel}>
            关闭
          </Button>
        ]}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <div style={{ marginBottom: 16 }}>
          <Row gutter={24} align="middle">
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="剩余课时"
                  value={studentSchedule.student?.remainingClasses.split('/')[0]}
                  suffix={`/ ${studentSchedule.student?.remainingClasses.split('/')[1]}`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="教练"
                  value={studentSchedule.student?.coach}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic
                  title="有效期至"
                  value={studentSchedule.student?.expireDate}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
          </Row>
        </div>
        
        <Table
          dataSource={studentSchedule.schedules}
          rowKey={record => `${record.date}-${record.startTime}`}
          pagination={false}
          columns={[
            {
              title: '上课日期',
              key: 'date',
              align: 'center',
              render: (_, record) => (
                <span>
                  {dayjs(record.date).format('YYYY-MM-DD')}
                </span>
              ),
            },
            {
              title: '上课时间',
              key: 'time',
              align: 'center',
              render: (_, record) => (
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
              render: (status) => {
                switch(status) {
                  case 'completed':
                    return <Tag color="green">已完成</Tag>;
                  case 'upcoming':
                    return <Tag color="blue">待上课</Tag>;
                  case 'canceled':
                    return <Tag color="red">已取消</Tag>;
                  default:
                    return null;
                }
              }
            },
          ]}
        />
      </Modal>

      <Modal
        title={
          <span>
            <FileTextOutlined /> {studentClassRecords.student?.name} 的课程记录
          </span>
        }
        open={isClassRecordModalVisible}
        onCancel={handleClassRecordModalCancel}
        width={800}
        footer={[
          <Button key="close" onClick={handleClassRecordModalCancel}>
            关闭
          </Button>
        ]}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Table
          dataSource={studentClassRecords.records}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          columns={[
            {
              title: '日期',
              dataIndex: 'date',
              key: 'date',
              width: 120,
              align: 'center',
            },
            {
              title: '时间',
              key: 'time',
              width: 120,
              align: 'center',
              render: (_, record) => `${record.startTime} - ${record.endTime}`,
            },
            {
              title: '教练',
              dataIndex: 'coach',
              key: 'coach',
              width: 100,
              align: 'center',
            },
            {
              title: '课程',
              dataIndex: 'content',
              key: 'content',
              width: 200,
            },
            {
              title: '备注',
              dataIndex: 'feedback',
              key: 'feedback',
            },
          ]}
        />
      </Modal>

      {/* 缴费模态框 */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>缴费登记</span>}
        open={isPaymentModalVisible}
        onOk={handlePaymentOk}
        onCancel={handlePaymentCancel}
        width={900}
        okText="确认提交"
        cancelText="取消"
        bodyStyle={{ padding: '24px 32px' }}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Row gutter={32}>
          <Col span={15}>
            <Form
              form={paymentForm}
              layout="vertical"
              initialValues={{
                transactionDate: dayjs(),
                validUntil: dayjs().add(180, 'day'),
                regularClasses: 0,
                bonusClasses: 0,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="courseType"
                    label="课程类型"
                    rules={[{ required: true, message: '请选择课程类型' }]}
                  >
                    <Select placeholder="请选择课程类型">
                      {courseTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="student"
                    label="选择学员"
                    rules={[{ required: true, message: '请选择学员' }]}
                  >
                    <Select placeholder="请选择学员" disabled>
                      <Option value={currentStudent?.id}>{currentStudent?.name}</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="paymentType"
                    label="缴费类型"
                    rules={[{ required: true, message: '请选择缴费类型' }]}
                  >
                    <Select placeholder="请选择缴费类型">
                      {paymentTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="paymentMethod"
                    label="支付方式"
                    rules={[{ required: true, message: '请选择支付方式' }]}
                  >
                    <Select placeholder="请选择支付方式">
                      {paymentMethodOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="amount"
                    label="缴费金额"
                    rules={[{ required: true, message: '请输入金额' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="请输入金额"
                      prefix="¥"
                      precision={2}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="transactionDate"
                    label="交易日期"
                    rules={[{ required: true, message: '请选择交易日期' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="YYYY-MM-DD"
                      placeholder="年/月/日"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="regularClasses"
                    label="正课课时"
                    rules={[{ required: true, message: '请输入正课课时数' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="请输入课时数"
                      onChange={handleClassHoursChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="bonusClasses"
                    label="赠送课时"
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={0}
                      placeholder="请输入赠送课时"
                      onChange={handleClassHoursChange}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="validUntil"
                    label="有效期"
                    rules={[{ required: true, message: '请选择有效期' }]}
                  >
                    <DatePicker 
                      style={{ width: '100%' }} 
                      format="YYYY-MM-DD"
                      placeholder="年/月/日"
                      onChange={handleValidUntilChange}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gift"
                    label="赠品"
                  >
                    <Select 
                      mode="multiple"
                      placeholder="请选择赠品" 
                      style={{ width: '100%' }}
                      optionLabelProp="label"
                    >
                      {giftOptions.map(option => (
                        <Option key={option.value} value={option.value} label={option.label}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="remarks"
                label="备注"
              >
                <TextArea rows={4} placeholder="请输入备注信息" />
              </Form.Item>
            </Form>
          </Col>
          
          <Col span={9}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>缴费预览</div>
            </div>
            <div style={{ background: '#f5f5f5', padding: '20px', height: 'calc(100% - 44px)', borderRadius: '4px', overflowY: 'auto' }}>
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>学员姓名：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{currentStudent?.name || '—'}</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>课程类型：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                  {courseTypeOptions.find(t => t.value === currentStudent?.courseType)?.label || '—'}
                </div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>当前剩余课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{currentClassHours} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>当前有效期至：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{currentStudent?.expireDate || '—'}</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次缴费金额：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>¥{paymentForm.getFieldValue('amount') || '0.00'}</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费日期：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                  {paymentForm.getFieldValue('transactionDate')?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD')}
                </div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次赠送课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{paymentForm.getFieldValue('bonusClasses') || 0} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次新增课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{newClassHours} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>变更后总课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{totalClassHours} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>新有效期至：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{newValidUntil}</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>赠品：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right', wordBreak: 'break-all' }}>
                  {paymentForm.getFieldValue('gift')?.map((g: string) => 
                    giftOptions.find(opt => opt.value === g)?.label).join('、') || '无'}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default StudentManagement; 