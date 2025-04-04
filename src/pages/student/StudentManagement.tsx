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
  InputNumber,
  Dropdown,
  Radio,
  Alert
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
  DollarOutlined,
  DownOutlined,
  SwapOutlined,
  RollbackOutlined,
  TransactionOutlined,
  SyncOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入中文语言包

// 设置 dayjs 使用中文
dayjs.locale('zh-cn');

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
  courseId?: string; // 添加课程ID字段
  courseName?: string; // 添加课程名称字段
}

// 添加课程摘要接口，用于显示课程信息
interface CourseSummary {
  id?: string;
  name: string;
  type: string;
  coach: string;
  status: string;
  enrollDate: string;
  expireDate: string;
  remainingClasses?: string;
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
  courseGroups?: CourseGroup[]; // 添加课程组信息
}

// 定义报名课程组信息接口
interface CourseGroup {
  key: string;
  courses: string[];
  courseType: string;
  coach: string;
  status: 'active' | 'inactive' | 'pending';
  enrollDate: string;
  expireDate: string;
  scheduleTimes: ScheduleTime[];
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
  const [sortOrder, setSortOrder] = useState<'enrollDateAsc' | 'enrollDateDesc' | 'ageAsc' | 'ageDesc' | 'remainingClassesAsc' | 'remainingClassesDesc' | 'lastClassDateAsc' | 'lastClassDateDesc' | undefined>(undefined);
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
    { value: 'new_enrollment', label: '新报名' },
    { value: 'renewal', label: '续费' },
    { value: 'supplementary', label: '补费' },
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

  // 添加课程组状态
  const [courseGroups, setCourseGroups] = useState<CourseGroup[]>([]);

  // 当前正在编辑的课程组索引
  const [currentEditingGroupIndex, setCurrentEditingGroupIndex] = useState<number | null>(null);

  // 添加一个临时存储正在编辑的课程组
  const [tempCourseGroup, setTempCourseGroup] = useState<CourseGroup | null>(null);

  // 添加标志当前是否有正在编辑的课程
  const [isEditing, setIsEditing] = useState(false);

  // 为缴费模态框添加选择课程功能
  // 在状态部分添加所选课程状态
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<string>('');
  const [selectedPaymentCourseName, setSelectedPaymentCourseName] = useState<string>('');

  // 在组件开始处添加状态
  const [originalCourseGroup, setOriginalCourseGroup] = useState<CourseGroup | null>(null);

  // 添加退费转课模态框相关状态和函数
  const [isRefundTransferModalVisible, setIsRefundTransferModalVisible] = useState(false);
  const [refundTransferForm] = Form.useForm();

  // 添加转课相关状态
  const [transferStudentSearchText, setTransferStudentSearchText] = useState<string>('');
  const [transferStudentSearchResults, setTransferStudentSearchResults] = useState<Student[]>([]);
  const [isSearchingTransferStudent, setIsSearchingTransferStudent] = useState<boolean>(false);
  const [selectedTransferStudent, setSelectedTransferStudent] = useState<Student | null>(null);

  // 添加新学员相关状态
  const [isQuickAddStudentModalVisible, setIsQuickAddStudentModalVisible] = useState(false);
  const [quickAddStudentForm] = Form.useForm();

  // 根据关键词搜索学员
  const searchStudentsByKeyword = (keyword: string, excludeId?: string): Student[] => {
    if (!keyword.trim()) return [];
    
    return students.filter(student => 
      (excludeId ? student.id !== excludeId : true) && 
      (
        student.name.toLowerCase().includes(keyword.toLowerCase()) ||
        student.id.toLowerCase().includes(keyword.toLowerCase()) ||
        student.phone.includes(keyword)
      )
    );
  };

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
            lastClassDate: dayjs().subtract(index * 30, 'day').format('YYYY-MM-DD'),
            enrollDate: dayjs().subtract(index * 180, 'day').format('YYYY-MM-DD'),
            expireDate: dayjs().add(180 - (index % 180), 'day').format('YYYY-MM-DD'),
            remainingClasses: `${remainingClasses}/${totalClasses}`,
            status: index % 7 === 0 ? 'pending' : index % 7 === 1 ? 'inactive' : 'active',
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
          // 根据选择的排序类型进行排序
          switch(sortOrder) {
            case 'enrollDateAsc':
              return dayjs(a.enrollDate).unix() - dayjs(b.enrollDate).unix();
            case 'enrollDateDesc':
              return dayjs(b.enrollDate).unix() - dayjs(a.enrollDate).unix();
            case 'ageAsc':
              return a.age - b.age;
            case 'ageDesc':
              return b.age - a.age;
            case 'remainingClassesAsc': {
              const remainingA = parseInt(a.remainingClasses.split('/')[0], 10);
              const remainingB = parseInt(b.remainingClasses.split('/')[0], 10);
              return remainingA - remainingB;
            }
            case 'remainingClassesDesc': {
              const remainingA = parseInt(a.remainingClasses.split('/')[0], 10);
              const remainingB = parseInt(b.remainingClasses.split('/')[0], 10);
              return remainingB - remainingA;
            }
            case 'lastClassDateAsc': {
              if (!a.lastClassDate) return 1;
              if (!b.lastClassDate) return -1;
              return dayjs(a.lastClassDate).unix() - dayjs(b.lastClassDate).unix();
            }
            case 'lastClassDateDesc': {
              if (!a.lastClassDate) return 1;
              if (!b.lastClassDate) return -1;
              return dayjs(b.lastClassDate).unix() - dayjs(a.lastClassDate).unix();
            }
            default:
              return 0;
          }
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

  // 添加新的课程组 - 这里只创建一个临时的课程组
  const addCourseGroup = () => {
    const newKey = Date.now().toString(); // 使用时间戳作为唯一key
    const newGroup: CourseGroup = {
      key: newKey,
      courses: [],
      courseType: '',
      coach: '',
      status: 'active',
      enrollDate: dayjs().format('YYYY-MM-DD'),
      expireDate: dayjs().add(180, 'day').format('YYYY-MM-DD'),
      scheduleTimes: []
    };
    setTempCourseGroup(newGroup);
    setCurrentEditingGroupIndex(null); // 表示我们正在添加新的，而不是编辑已有的
  };

  // 显示添加用户模态框
  const showAddModal = () => {
    form.resetFields();
    setEditingStudent(null);
    // 初始化为空课程组列表
    setCourseGroups([]);
    setIsModalVisible(true);
  };
  
  const showEditModal = (record: Student) => {
    setEditingStudent(record);
    form.setFieldsValue({
      name: record.name,
      gender: record.gender,
      age: record.age,
      phone: record.phone,
    });
    
    // 设置课程组
    const courseGroup = {
      key: '1',
      courses: Array.isArray(record.course) ? [record.course[0]] : [record.course],
      courseType: record.courseType,
      coach: record.coach,
      status: record.status,
      enrollDate: record.enrollDate,
      expireDate: record.expireDate,
      scheduleTimes: record.scheduleTimes || []  // 如果没有排课时间则使用空数组
    };
    
    setCourseGroups([courseGroup]);
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleModalOk = () => {
    // 如果有正在编辑的课程组，先完成编辑
    if (currentEditingGroupIndex !== null) {
      message.warning('请先完成当前课程组的编辑');
      return;
    }
    
    // 如果没有添加课程，显示错误提示并阻止提交
    if (courseGroups.length === 0) {
      message.error('请至少添加一个课程');
      return;
    }
    
    form.validateFields()
      .then(values => {
        // 使用第一个课程组的信息作为主要课程信息
        const primaryGroup = courseGroups[0];
        
        const formattedValues = {
          ...values,
          course: primaryGroup.courses[0], // 只取第一个课程
          courseType: primaryGroup.courseType,
          coach: primaryGroup.coach,
          status: primaryGroup.status,
          enrollDate: primaryGroup.enrollDate,
          expireDate: primaryGroup.expireDate,
          scheduleTimes: primaryGroup.scheduleTimes,
          // 添加所有课程组信息
          courseGroups: courseGroups.length > 1 ? courseGroups : undefined
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
          const newStudent: Student = {
            id: `ST${100000 + Math.floor(Math.random() * 900000)}`,
            ...formattedValues,
            lastClassDate: '',
            remainingClasses: '20/20', // 默认20课时
          };
          setStudents(prevStudents => [newStudent, ...prevStudents]);
          setTotal(prev => prev + 1);
          message.success('学员添加成功');
          
          // 检查是否需要在添加学员后重新打开转课模态框
          if (window.sessionStorage.getItem('afterAddStudent') === 'true') {
            window.sessionStorage.removeItem('afterAddStudent');
            // 如果之前有学员被选中，重新打开转课模态框
            if (currentStudent) {
              setTimeout(() => {
                showTransferModal(currentStudent);
                // 确保表单使用了最新的添加学员
                setTimeout(() => {
                  // 自动选中新添加的学员作为转课目标
                  setSelectedTransferStudent(newStudent);
                  refundTransferForm.setFieldsValue({
                    targetStudentId: newStudent.id,
                    operationType: 'transfer', // 确保转课选项被选中
                  });
                }, 100);
              }, 100);
            }
          }
        }

        form.resetFields();
        setIsModalVisible(false);
        setCourseGroups([]);
        setCurrentEditingGroupIndex(null);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 处理模态框取消
  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setCurrentEditingGroupIndex(null);
  };

  // 确认添加课程组
  const confirmAddCourseGroup = () => {
    // 如果是编辑已有的课程组
    if (currentEditingGroupIndex !== null) {
      const group = courseGroups[currentEditingGroupIndex];
      
      // 验证课程组信息
      if (!group.courses || group.courses.length === 0) {
        message.error('请选择报名课程');
        return false;
      }
      
      // 验证通过，设置为非编辑状态
      setCurrentEditingGroupIndex(null);
      setIsEditing(false); // 清除编辑标志
      return true;
    }
    
    // 如果是添加新的课程组
    if (tempCourseGroup) {
      // 验证临时课程组信息
      if (!tempCourseGroup.courses || tempCourseGroup.courses.length === 0) {
        message.error('请选择报名课程');
        return false;
      }
      
      // 验证通过，添加到课程组列表
      setCourseGroups(prev => [...prev, tempCourseGroup]);
      setTempCourseGroup(null);
      setIsEditing(false); // 清除编辑标志
      return true;
    }
    
    return false;
  };

  // 取消添加课程组
  const cancelAddCourseGroup = () => {
    // 如果是编辑现有课程组，取消编辑状态并恢复数据
    if (currentEditingGroupIndex !== null && originalCourseGroup) {
      setCourseGroups(prev => {
        const newGroups = [...prev];
        newGroups[currentEditingGroupIndex] = originalCourseGroup;
        return newGroups;
      });
      setCurrentEditingGroupIndex(null);
      setOriginalCourseGroup(null);
    }
    
    // 如果是添加新课程组，清空临时数据
    if (tempCourseGroup) {
      setTempCourseGroup(null);
    }

    setIsEditing(false); // 清除编辑标志
  };

  // 编辑课程组
  const editCourseGroup = (index: number) => {
    // 如果已经有正在编辑的课程组或临时课程组，先提示
    if (currentEditingGroupIndex !== null || tempCourseGroup !== null) {
      message.warning('请先完成当前课程的编辑');
      return;
    }
    
    // 保存当前课程组的快照，用于取消编辑时恢复
    setOriginalCourseGroup(JSON.parse(JSON.stringify(courseGroups[index])));
    
    setCurrentEditingGroupIndex(index);
    setIsEditing(true); // 设置正在编辑标志
  };

  // 更新临时课程组信息
  const updateTempCourseGroup = (field: keyof CourseGroup, value: any) => {
    if (!tempCourseGroup) return;
    
    setTempCourseGroup(prev => {
      if (!prev) return null;
      
      const updated = { ...prev, [field]: value };
      
      // 处理课程类型和教练联动
      if (field === 'courses' && value?.length > 0) {
        const courseValue = value[0];
        const selectedCourseInfo = courseOptions.find(c => c.value === courseValue);
        if (selectedCourseInfo) {
          updated.courseType = selectedCourseInfo.type;
          updated.coach = selectedCourseInfo.coaches[0];
        }
      }
      
      return updated;
    });
  };

  // 更新课程组信息 - 针对已有课程组的编辑
  const updateCourseGroup = (index: number, field: keyof CourseGroup, value: any) => {
    setCourseGroups(prev => {
      const newGroups = [...prev];
      newGroups[index] = { ...newGroups[index], [field]: value };
      
      // 处理课程类型和教练联动
      if (field === 'courses' && value?.length > 0) {
        const courseValue = value[0];
        const selectedCourseInfo = courseOptions.find(c => c.value === courseValue);
        if (selectedCourseInfo) {
          newGroups[index].courseType = selectedCourseInfo.type;
          newGroups[index].coach = selectedCourseInfo.coaches[0];
        }
      }
      
      return newGroups;
    });
  };

  // 开始添加课程组
  const startAddCourseGroup = () => {
    // 如果有正在编辑的课程组，先询问
    if (currentEditingGroupIndex !== null) {
      message.warning('请先完成当前课程组的编辑');
      return;
    }
    
    // 如果有临时课程组，先询问
    if (tempCourseGroup !== null) {
      message.warning('请先完成当前课程的添加');
      return;
    }
    
    addCourseGroup();
  };

  // 渲染课程组表格
  const renderCourseGroupTable = () => {
    // 如果没有有效数据（至少有一条记录且有课程信息），则不渲染表格
    const hasValidData = courseGroups.some(group => 
      group.courses && group.courses.length > 0 && group.courses[0]
    );
    
    if (!hasValidData) {
      return null;
    }
    
    return (
      <div style={{ marginBottom: 16 }}>
        <Table
          dataSource={courseGroups.filter(group => group.courses && group.courses.length > 0 && group.courses[0])}
          rowKey="key"
          pagination={false}
          size="small"
          columns={[
            {
              title: '报名课程',
              dataIndex: 'courses',
              render: (courses) => {
                const courseValue = courses && courses.length > 0 ? courses[0] : '';
                return courseOptions.find(c => c.value === courseValue)?.label || '-';
              }
            },
            {
              title: '课程类型',
              dataIndex: 'courseType',
              render: (type) => courseTypeOptions.find(t => t.value === type)?.label || '-'
            },
            {
              title: '教练',
              dataIndex: 'coach'
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (status) => {
                let text = '';
                switch (status) {
                  case 'active': text = '在学'; break;
                  case 'inactive': text = '停课'; break;
                  case 'pending': text = '待处理'; break;
                  default: text = status;
                }
                return <Tag color={
                  status === 'active' ? 'green' : 
                  status === 'inactive' ? 'red' : 'orange'
                }>{text}</Tag>;
              }
            },
            {
              title: '固定排课时间',
              dataIndex: 'scheduleTimes',
              render: (times: ScheduleTime[]) => times && times.length > 0 
                ? times.map(t => `周${t.weekday} ${t.time}`).join('、') 
                : '无'
            },
            {
              title: '操作',
              width: 150,
              render: (_, __, index) => (
                <Space>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={() => editCourseGroup(index)}
                    disabled={isEditing} // 如果正在编辑，禁用按钮
                  >
                    编辑
                  </Button>
                  <Button 
                    type="link" 
                    size="small" 
                    danger 
                    icon={<DeleteOutlined />}
                    onClick={() => removeCourseGroup(courseGroups[index].key)}
                    disabled={isEditing} // 如果正在编辑，禁用按钮
                  >
                    删除
                  </Button>
                </Space>
              )
            }
          ]}
        />
      </div>
    );
  };

  // 渲染课程编辑表单 - 针对已有课程组的编辑
  const renderCourseEditForm = (group: CourseGroup, index: number) => {
    return (
      <div 
        key={group.key} 
        style={{ 
          border: '1px solid #f0f0f0', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '16px',
          background: '#fafafa'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>报名课程</Typography.Title>
        </div>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="报名课程"
              required
            >
              <Select 
                placeholder="请选择课程"
                value={group.courses && group.courses.length > 0 ? group.courses[0] : undefined}
                onChange={(value) => updateCourseGroup(index, 'courses', [value])}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {courseOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <TeamOutlined /> {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="课程类型"
            >
              <Input 
                value={group.courseType ? courseTypeOptions.find(t => t.value === group.courseType)?.label || group.courseType : ''}
                disabled 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上课教练"
            >
              <Input 
                value={group.coach} 
                disabled 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="状态"
              required
            >
              <Select 
                placeholder="请选择"
                value={group.status}
                onChange={(value) => updateCourseGroup(index, 'status', value)}
                style={{ width: '100%' }}
              >
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
              label="报名日期"
              required
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择报名日期"
                format="YYYY-MM-DD"
                value={dayjs(group.enrollDate)}
                onChange={(date) => updateCourseGroup(index, 'enrollDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="有效期至"
              required
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择有效期"
                format="YYYY-MM-DD"
                value={dayjs(group.expireDate)}
                onChange={(date) => updateCourseGroup(index, 'expireDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 排课时间 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography.Text strong>固定排课时间</Typography.Text>
            <Button 
              type="link" 
              onClick={() => {
                const newScheduleTimes = [...(group.scheduleTimes || []), { weekday: '一', time: '15:00' }];
                updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
              }} 
              icon={<PlusOutlined />}
            >
              添加时间
            </Button>
          </div>
          {(group.scheduleTimes || []).map((scheduleTime, timeIndex) => (
            <Row gutter={16} key={timeIndex} style={{ marginBottom: 16 }}>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  value={scheduleTime.weekday}
                  onChange={(value) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].weekday = value;
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
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
                  onChange={(time) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].time = time ? time.format('HH:mm') : '00:00';
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => {
                    // 允许删除任何排课时间，不再有最少数量限制
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    newScheduleTimes.splice(timeIndex, 1);
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
            </Row>
          ))}
          {(group.scheduleTimes || []).length === 0 && (
            <Typography.Text type="secondary">暂无排课时间，点击上方"添加时间"按钮添加</Typography.Text>
          )}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => cancelAddCourseGroup()}>
              取消
            </Button>
            <Button type="primary" onClick={() => confirmAddCourseGroup()}>
              确定
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  // 渲染临时课程编辑表单 - 针对新添加的课程
  const renderTempCourseEditForm = () => {
    if (!tempCourseGroup) return null;
    
    return (
      <div 
        key={tempCourseGroup.key} 
        style={{ 
          border: '1px solid #f0f0f0', 
          borderRadius: '8px', 
          padding: '16px', 
          marginBottom: '16px',
          background: '#fafafa'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>报名课程</Typography.Title>
        </div>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="报名课程"
              required
            >
              <Select 
                placeholder="请选择课程"
                value={tempCourseGroup.courses && tempCourseGroup.courses.length > 0 ? tempCourseGroup.courses[0] : undefined}
                onChange={(value) => updateTempCourseGroup('courses', [value])}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {courseOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <TeamOutlined /> {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="课程类型"
            >
              <Input 
                value={tempCourseGroup.courseType ? courseTypeOptions.find(t => t.value === tempCourseGroup.courseType)?.label || tempCourseGroup.courseType : ''}
                disabled 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上课教练"
            >
              <Input 
                value={tempCourseGroup.coach} 
                disabled 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="状态"
              required
            >
              <Select 
                placeholder="请选择"
                value={tempCourseGroup.status}
                onChange={(value) => updateTempCourseGroup('status', value)}
                style={{ width: '100%' }}
              >
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
              label="报名日期"
              required
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择报名日期"
                format="YYYY-MM-DD"
                value={dayjs(tempCourseGroup.enrollDate)}
                onChange={(date) => updateTempCourseGroup('enrollDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="有效期至"
              required
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择有效期"
                format="YYYY-MM-DD"
                value={dayjs(tempCourseGroup.expireDate)}
                onChange={(date) => updateTempCourseGroup('expireDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 排课时间 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography.Text strong>固定排课时间</Typography.Text>
            <Button 
              type="link" 
              onClick={() => {
                const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || []), { weekday: '一', time: '15:00' }];
                updateTempCourseGroup('scheduleTimes', newScheduleTimes);
              }} 
              icon={<PlusOutlined />}
            >
              添加时间
            </Button>
          </div>
          {(tempCourseGroup.scheduleTimes || []).map((scheduleTime, timeIndex) => (
            <Row gutter={16} key={timeIndex} style={{ marginBottom: 16 }}>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  value={scheduleTime.weekday}
                  onChange={(value) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].weekday = value;
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
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
                  onChange={(time) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].time = time ? time.format('HH:mm') : '00:00';
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    newScheduleTimes.splice(timeIndex, 1);
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
            </Row>
          ))}
          {(tempCourseGroup.scheduleTimes || []).length === 0 && (
            <Typography.Text type="secondary">暂无排课时间，点击上方"添加时间"按钮添加</Typography.Text>
          )}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => cancelAddCourseGroup()}>
              取消
            </Button>
            <Button type="primary" onClick={() => confirmAddCourseGroup()}>
              确定
            </Button>
          </Space>
        </div>
      </div>
    );
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
    
    // 获取学生所有课程
    const courses = getStudentAllCourses(student);
    
    // 如果有课程，默认选择第一个
    if (courses.length > 0) {
      const defaultCourse = courses[0];
      setSelectedPaymentCourse(defaultCourse.id || '');
      setSelectedPaymentCourseName(defaultCourse.name);
    }
    
    // 设置初始值
    paymentForm.setFieldsValue({
      courseType: student.courseType,
      courseId: courses.length > 0 ? courses[0].id : '',
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
          courseId: values.courseId,
          courseName: selectedPaymentCourseName,
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

  // 处理课程改变
  const handlePaymentCourseChange = (courseId: string) => {
    setSelectedPaymentCourse(courseId);
    // 获取课程名称
    const courses = getStudentAllCourses(currentStudent);
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedPaymentCourseName(course.name);
    }
    
    // 获取对应课程类型
    paymentForm.setFieldsValue({
      courseType: course?.type || '',
    });
  };

  // 修改 getStudentAllCourses 函数，确保所有课程都可以选择
  const getStudentAllCourses = (student: Student | null): CourseSummary[] => {
    if (!student) return [];

    // 创建一个包含所有课程的数组
    const allCourses: CourseSummary[] = [];

    // 如果学员有多个课程组，将其添加到课程列表中
    if (student.courseGroups && student.courseGroups.length > 0) {
      student.courseGroups.forEach((group: CourseGroup) => {
        const courseId = group.courses && group.courses.length > 0 ? group.courses[0] : '';
        const courseName = courseId 
          ? courseOptions.find(c => c.value === courseId)?.label || courseId
          : '未知课程';
        
        allCourses.push({
          id: courseId,
          name: courseName,
          type: courseTypeOptions.find(t => t.value === group.courseType)?.label || group.courseType,
          coach: group.coach,
          status: group.status === 'active' ? '在学' : 
                  group.status === 'inactive' ? '停课' : '待处理',
          enrollDate: group.enrollDate,
          expireDate: group.expireDate,
          remainingClasses: student.remainingClasses
        });
      });
    } else if (student.course) {
      // 如果只有一个主课程，添加到课程列表
      const courseId = Array.isArray(student.course) ? student.course[0] : student.course;
      const courseName = courseOptions.find(c => c.value === courseId)?.label || courseId;
      
      allCourses.push({
        id: courseId,
        name: courseName,
        type: courseTypeOptions.find(t => t.value === student.courseType)?.label || student.courseType,
        coach: student.coach,
        status: student.status === 'active' ? '在学' : 
                student.status === 'inactive' ? '停课' : '待处理',
        enrollDate: student.enrollDate,
        expireDate: student.expireDate,
        remainingClasses: student.remainingClasses
      });
    }

    // 不再添加未报名的课程选项
    return allCourses;
  };

  // 显示退费模态框
  const showRefundModal = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();
    
    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );
    
    // 设置初始值
    refundTransferForm.setFieldsValue({
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      studentId: student.id,
      studentName: student.name,
      operationType: 'refund', // 设置为退费
      refundAmount: 0,
      serviceFee: 0,
      otherFee: 0,
      actualRefund: 0,
    });
    
    setIsRefundTransferModalVisible(true);
  };

  // 显示转课模态框
  const showTransferModal = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();
    setSelectedTransferStudent(null);
    setTransferStudentSearchResults([]);
    
    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );
    
    // 设置初始值
    refundTransferForm.setFieldsValue({
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      studentId: student.id,
      studentName: student.name,
      operationType: 'transfer', // 设置为转课
      transferClassHours: 1, // 默认转课课时为1
      priceDifference: 0,
    });
    
    setIsRefundTransferModalVisible(true);
  };
  
  // 显示转班模态框
  const showTransferClassModal = (student: Student) => {
    setCurrentStudent(student);
    refundTransferForm.resetFields();
    
    // 获取学生所有课程
    const courses = getStudentAllCourses(student).filter(
      // 只显示已报名的课程
      course => course.status !== '未报名'
    );
    
    // 设置初始值
    refundTransferForm.setFieldsValue({
      fromCourseId: courses.length > 0 ? courses[0].id : '',
      studentId: student.id,
      studentName: student.name,
      operationType: 'transferClass', // 设置为转班
      transferClassHours: 1, // 默认转班课时为1
      priceDifference: 0,
    });
    
    setIsRefundTransferModalVisible(true);
  };

  // 处理退费转课提交
  const handleRefundTransferOk = () => {
    refundTransferForm.validateFields()
      .then(values => {
        // 根据操作类型执行不同的逻辑
        if (values.operationType === 'refund') {
          // 退费逻辑
          message.success(`退费处理成功，实际退款金额: ¥${values.actualRefund}`);
          setIsRefundTransferModalVisible(false);
        } else if (values.operationType === 'transfer') {
          // 转课逻辑
          if (!selectedTransferStudent && !values.targetStudentId) {
            message.error('请选择要转课给哪个学员');
            return;
          }
          
          // 获取目标学员信息
          const targetStudentId = values.targetStudentId || selectedTransferStudent?.id;
          const targetStudent = students.find(s => s.id === targetStudentId);
          
          if (!targetStudent) {
            message.error('未找到目标学员信息');
            return;
          }

          // 获取课程信息
          const toCourse = courseOptions.find(c => c.value === values.toCourseId);
          const courseName = toCourse ? toCourse.label : '未知课程';
          
          const priceDifferenceInfo = values.priceDifference > 0 ? 
            `，需补差价: ¥${values.priceDifference}` : 
            (values.priceDifference < 0 ? 
              `，退还差价: ¥${Math.abs(values.priceDifference)}` : 
              '');
              
          message.success(`转课处理成功，课程转给: ${targetStudent.name}(${targetStudent.id})，课程: ${courseName}，课时: ${values.transferClassHours}${priceDifferenceInfo}`);
          
          // 模拟更新学员课程信息
          // 实际应用中这里应该调用API更新数据库
          // 这里只是示例代码
          
          setIsRefundTransferModalVisible(false);
        } else if (values.operationType === 'transferClass') {
          // 转班逻辑 - 同一学员换课程
          if (!currentStudent) {
            message.error('未找到学员信息');
            return;
          }
          
          // 获取课程信息
          const toCourse = courseOptions.find(c => c.value === values.toCourseId);
          const courseName = toCourse ? toCourse.label : '未知课程';
          
          const fromCourse = courseOptions.find(c => c.value === values.fromCourseId);
          const fromCourseName = fromCourse ? fromCourse.label : '未知课程';
          
          const priceDifferenceInfo = values.priceDifference > 0 ? 
            `，需补差价: ¥${values.priceDifference}` : 
            (values.priceDifference < 0 ? 
              `，退还差价: ¥${Math.abs(values.priceDifference)}` : 
              '');
              
          message.success(`转班处理成功，从 ${fromCourseName} 转到 ${courseName}${priceDifferenceInfo}`);
          
          // 模拟更新学员课程信息
          // 实际应用中这里应该调用API更新数据库
          // 这里只是示例代码
          
          setIsRefundTransferModalVisible(false);
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  // 关闭退费转课模态框
  const handleRefundTransferCancel = () => {
    setIsRefundTransferModalVisible(false);
    setCurrentStudent(null);
    refundTransferForm.resetFields();
  };

  // 处理学员搜索
  const handleTransferStudentSearch = (value: string) => {
    setTransferStudentSearchText(value);
    
    if (value.trim() === '') {
      setTransferStudentSearchResults([]);
      setIsSearchingTransferStudent(false);
      return;
    }
    
    setIsSearchingTransferStudent(true);
    
    // 模拟异步搜索
    setTimeout(() => {
      // 使用搜索函数查找学员
      const results = searchStudentsByKeyword(value, currentStudent?.id);
      setTransferStudentSearchResults(results);
      setIsSearchingTransferStudent(false);
    }, 300); // 减少延迟时间
  };
  
  // 处理选择转课学员
  const handleSelectTransferStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId) || null;
    setSelectedTransferStudent(student);
    
    // 重置搜索结果
    setTransferStudentSearchText('');
    setTransferStudentSearchResults([]);
  };

  // 处理快速添加学员模态框显示
  const showQuickAddStudentModal = () => {
    quickAddStudentForm.resetFields();
    setIsQuickAddStudentModalVisible(true);
  };
  
  // 处理快速添加学员提交
  const handleQuickAddStudentOk = () => {
    quickAddStudentForm.validateFields()
      .then(values => {
        // 生成学员ID（实际应用中应该由后端生成）
        const newStudentId = `ST${Math.floor(100000 + Math.random() * 900000)}`;
        
        // 创建新学员
        const newStudent: Student = {
          id: newStudentId,
          name: values.name,
          gender: values.gender,
          age: values.age,
          phone: values.phone,
          courseType: '',
          course: [],
          coach: '',
          lastClassDate: '',
          enrollDate: dayjs().format('YYYY-MM-DD'),
          expireDate: dayjs().add(1, 'year').format('YYYY-MM-DD'),
          remainingClasses: '0',
          status: 'active',
        };
        
        // 将新学员添加到学员列表
        setStudents(prevStudents => [...prevStudents, newStudent]);
        
        // 选中新添加的学员并直接设置到转课表单中
        setSelectedTransferStudent(newStudent);
        refundTransferForm.setFieldsValue({
          targetStudentId: newStudentId
        });
        
        // 刷新转课学员搜索结果，确保新学员在列表中显示
        setTransferStudentSearchResults(prevResults => {
          // 如果新学员不在结果列表中，添加它
          if (!prevResults.some(s => s.id === newStudentId)) {
            return [...prevResults, newStudent];
          }
          return prevResults;
        });
        
        // 显示成功消息
        message.success(`新学员 ${values.name} 添加成功`);
        
        // 关闭模态框
        setIsQuickAddStudentModalVisible(false);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  
  // 处理快速添加学员取消
  const handleQuickAddStudentCancel = () => {
    setIsQuickAddStudentModalVisible(false);
  };

  const columns: ColumnsType<Student> = [
    {
      title: '学员ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      sorter: (a, b) => {
        const numA = parseInt(a.id.replace(/[^\d]/g, ''), 10);
        const numB = parseInt(b.id.replace(/[^\d]/g, ''), 10);
        return numA - numB;
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
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
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      sorter: (a, b) => a.age - b.age
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
    },
    {
      title: '课程类型',
      dataIndex: 'courseType',
      key: 'courseType',
      align: 'center',
      width: 120,
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      render: renderCourseType,
      sorter: (a, b) => a.courseType.localeCompare(b.courseType)
    },
    {
      title: '教练',
      dataIndex: 'coach',
      key: 'coach',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      sorter: (a, b) => a.coach.localeCompare(b.coach)
    },
    {
      title: '剩余课时',
      dataIndex: 'remainingClasses',
      key: 'remainingClasses',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      sorter: (a, b) => {
        const remainingA = parseInt(a.remainingClasses.split('/')[0], 10);
        const remainingB = parseInt(b.remainingClasses.split('/')[0], 10);
        return remainingA - remainingB;
      }
    },
    {
      title: '最近上课时间',
      dataIndex: 'lastClassDate',
      key: 'lastClassDate',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      render: text => text ? dayjs(text).format('YYYY-MM-DD') : '未上课',
      sorter: (a, b) => {
        if (!a.lastClassDate) return 1;
        if (!b.lastClassDate) return -1;
        return dayjs(a.lastClassDate).unix() - dayjs(b.lastClassDate).unix();
      }
    },
    {
      title: '报名日期',
      dataIndex: 'enrollDate',
      key: 'enrollDate',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      render: text => dayjs(text).format('YYYY-MM-DD'),
      sorter: (a, b) => dayjs(a.enrollDate).unix() - dayjs(b.enrollDate).unix(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
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
      sorter: (a, b) => {
        const statusOrder = { active: 0, pending: 1, inactive: 2 };
        return statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 120, // 减小宽度
      onHeaderCell: () => ({
        style: { ...columnStyle, whiteSpace: 'nowrap' },
      }),
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                label: '编辑',
                icon: <EditOutlined />,
                onClick: () => showEditModal(record)
              },
              {
                key: 'record',
                label: '课程记录',
                icon: <FileTextOutlined />,
                onClick: () => showClassRecordModal(record)
              },
              {
                key: 'payment',
                label: '缴费',
                icon: <DollarOutlined />,
                onClick: () => showPaymentModal(record)
              },
              {
                key: 'refund',
                label: '退费',
                icon: <RollbackOutlined />,
                onClick: () => showRefundModal(record)
              },
              {
                key: 'transfer',
                label: '转课',
                icon: <TransactionOutlined />,
                onClick: () => showTransferModal(record)
              },
              {
                key: 'transferClass',
                label: '转班',
                icon: <SyncOutlined />,
                onClick: () => showTransferClassModal(record)
              },
              {
                key: 'delete',
                label: '删除',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => showDeleteModal(record.id)
              },
            ]
          }}
          trigger={['click']}
        >
          <Button type="link">
            操作 <DownOutlined />
          </Button>
        </Dropdown>
      ),
    },
  ];

  // 移除课程组
  const removeCourseGroup = (key: string) => {
    // 允许删除任何课程组，不再检查是否至少保留一个
    setCourseGroups(courseGroups.filter(group => group.key !== key));
  };

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
              <Option value="enrollDateAsc">
                <Space>
                  <SortAscendingOutlined />
                  报名日期升序
                </Space>
              </Option>
              <Option value="enrollDateDesc">
                <Space>
                  <SortDescendingOutlined />
                  报名日期降序
                </Space>
              </Option>
              <Option value="ageAsc">
                <Space>
                  <SortAscendingOutlined />
                  年龄升序
                </Space>
              </Option>
              <Option value="ageDesc">
                <Space>
                  <SortDescendingOutlined />
                  年龄降序
                </Space>
              </Option>
              <Option value="remainingClassesAsc">
                <Space>
                  <SortAscendingOutlined />
                  剩余课时升序
                </Space>
              </Option>
              <Option value="remainingClassesDesc">
                <Space>
                  <SortDescendingOutlined />
                  剩余课时降序
                </Space>
              </Option>
              <Option value="lastClassDateAsc">
                <Space>
                  <SortAscendingOutlined />
                  上课时间升序
                </Space>
              </Option>
              <Option value="lastClassDateDesc">
                <Space>
                  <SortDescendingOutlined />
                  上课时间降序
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
        width={800}
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
          }}
        >
          <Typography.Title level={5}>基本信息</Typography.Title>
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

          <Divider style={{ margin: '24px 0' }} />
          
          {/* 课程信息 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                <Typography.Title level={5} style={{ margin: 0, marginRight: 16 }}>报名课程</Typography.Title>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  onClick={startAddCourseGroup}
                  disabled={currentEditingGroupIndex !== null || tempCourseGroup !== null}
                >
                  添加课程
                </Button>
              </div>
              
              {/* 显示已确认的课程组表格 */}
              {courseGroups.length > 0 && renderCourseGroupTable()}
              
              {/* 显示当前编辑中的已有课程组表单 */}
              {currentEditingGroupIndex !== null && 
                renderCourseEditForm(courseGroups[currentEditingGroupIndex], currentEditingGroupIndex)}
              
              {/* 显示正在添加的临时课程组表单 */}
              {tempCourseGroup && renderTempCourseEditForm()}
            </Col>
          </Row>
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
              <Typography.Title level={5} style={{ marginBottom: 16 }}>基本信息</Typography.Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="courseId"
                    label="缴费课程"
                    rules={[{ required: true, message: '请选择缴费课程' }]}
                  >
                    <Select 
                      placeholder="请选择缴费课程" 
                      onChange={handlePaymentCourseChange}
                    >
                      {getStudentAllCourses(currentStudent).map(course => (
                        <Option key={course.id} value={course.id || ''}>
                          {course.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="courseType"
                    label="课程类型"
                    rules={[{ required: true, message: '请选择课程类型' }]}
                  >
                    <Select placeholder="请选择课程类型" disabled>
                      {courseTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>{option.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: '16px 0' }} />
              <Typography.Title level={5} style={{ marginBottom: 16 }}>缴费信息</Typography.Title>
              
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

              <Divider style={{ margin: '16px 0' }} />
              <Typography.Title level={5} style={{ marginBottom: 16 }}>课时信息</Typography.Title>
              
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
              <Typography.Title level={5} style={{ marginTop: 0, marginBottom: 8 }}>报名课程信息</Typography.Title>
              
              {getStudentAllCourses(currentStudent).map((course: CourseSummary, index: number) => (
                <div key={index} style={{ 
                  border: '1px solid #d9d9d9', 
                  borderRadius: '4px', 
                  padding: '12px', 
                  marginBottom: '12px',
                  background: course.id === selectedPaymentCourse ? '#e6f7ff' : '#fff',
                  borderColor: course.id === selectedPaymentCourse ? '#1890ff' : '#d9d9d9'
                }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography.Text strong>{course.name}</Typography.Text>
                    <Tag color={
                      course.status === '在学' ? 'green' : 
                      course.status === '停课' ? 'red' : 'orange'
                    }>{course.status}</Tag>
                  </div>
                  
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>课程类型：</span>
                    <span>{course.type}</span>
                  </div>
                  
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>教练：</span>
                    <span>{course.coach}</span>
                  </div>
                  
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>报名日期：</span>
                    <span>{course.enrollDate}</span>
                  </div>
                  
                  <div style={{ marginBottom: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>有效期至：</span>
                    <span>{course.expireDate}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>剩余课时：</span>
                    <span>{course.remainingClasses}</span>
                  </div>
                </div>
              ))}
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Typography.Title level={5} style={{ marginBottom: 8 }}>缴费详情</Typography.Title>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费课程：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>
                  {selectedPaymentCourseName}
                </div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次缴费金额：</div>
                <div style={{ color: '#f5222d', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>¥{paymentForm.getFieldValue('amount') || '0.00'}</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>缴费日期：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>
                  {paymentForm.getFieldValue('transactionDate')?.format('YYYY-MM-DD') || dayjs().format('YYYY-MM-DD')}
                </div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次正课课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{paymentForm.getFieldValue('regularClasses') || 0} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次赠送课时：</div>
                <div style={{ color: 'rgba(0, 0, 0, 0.85)', flex: '0 0 55%', textAlign: 'right' }}>{paymentForm.getFieldValue('bonusClasses') || 0} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>本次新增课时：</div>
                <div style={{ color: '#52c41a', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>{newClassHours} 课时</div>
              </div>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <Typography.Title level={5} style={{ marginBottom: 8 }}>缴费后状态</Typography.Title>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>变更后总课时：</div>
                <div style={{ color: '#1890ff', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>{totalClassHours} 课时</div>
              </div>
              
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ color: 'rgba(0, 0, 0, 0.65)', flex: '0 0 45%' }}>新有效期至：</div>
                <div style={{ color: '#1890ff', flex: '0 0 55%', textAlign: 'right', fontWeight: 'bold' }}>{newValidUntil}</div>
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

      {/* 退费转课模态框 */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>退费</span>}
        open={isRefundTransferModalVisible && refundTransferForm.getFieldValue('operationType') === 'refund'}
        onOk={handleRefundTransferOk}
        onCancel={handleRefundTransferCancel}
        width={800}
        okText="确认提交"
        cancelText="取消"
        bodyStyle={{ padding: '24px 32px' }}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Form
          form={refundTransferForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentName"
                label="学员姓名"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="学员ID"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider style={{ margin: '12px 0' }} />
          <Typography.Title level={5} style={{ marginBottom: 16 }}>退费信息</Typography.Title>
          
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="fromCourseId"
                label="原课程"
                rules={[{ required: true, message: '请选择原课程' }]}
              >
                <Select placeholder="请选择原课程">
                  {getStudentAllCourses(currentStudent)
                    .filter(course => course.status !== '未报名')
                    .map(course => (
                      <Option key={course.id} value={course.id || ''}>
                        {course.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="refundClassHours"
            label="退课课时"
            rules={[{ required: true, message: '请输入退课课时' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="refundAmount"
            label="退款金额"
            rules={[{ required: true, message: '请输入退款金额' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => {
                const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                return parseFloat(parsed);
              }}
              onChange={() => {
                // 计算实际退费金额
                setTimeout(() => {
                  const refundAmount = refundTransferForm.getFieldValue('refundAmount') || 0;
                  const serviceFee = refundTransferForm.getFieldValue('serviceFee') || 0;
                  const otherFee = refundTransferForm.getFieldValue('otherFee') || 0;
                  const actualRefund = refundAmount - serviceFee - otherFee;
                  refundTransferForm.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                }, 0);
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="serviceFee"
            label="手续费"
            initialValue={0}
            rules={[{ required: true, message: '请输入手续费' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => {
                const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                return parseFloat(parsed);
              }}
              onChange={() => {
                // 计算实际退费金额
                setTimeout(() => {
                  const refundAmount = refundTransferForm.getFieldValue('refundAmount') || 0;
                  const serviceFee = refundTransferForm.getFieldValue('serviceFee') || 0;
                  const otherFee = refundTransferForm.getFieldValue('otherFee') || 0;
                  const actualRefund = refundAmount - serviceFee - otherFee;
                  refundTransferForm.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                }, 0);
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="otherFee"
            label="其它费用扣除"
            initialValue={0}
            rules={[{ required: true, message: '请输入其它费用' }]}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => {
                const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                return parseFloat(parsed);
              }}
              onChange={() => {
                // 计算实际退费金额
                setTimeout(() => {
                  const refundAmount = refundTransferForm.getFieldValue('refundAmount') || 0;
                  const serviceFee = refundTransferForm.getFieldValue('serviceFee') || 0;
                  const otherFee = refundTransferForm.getFieldValue('otherFee') || 0;
                  const actualRefund = refundAmount - serviceFee - otherFee;
                  refundTransferForm.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                }, 0);
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="actualRefund"
            label="实际退费金额"
            initialValue={0}
          >
            <InputNumber 
              min={0} 
              style={{ width: '100%' }} 
              formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => {
                const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                return parseFloat(parsed);
              }}
              disabled
            />
          </Form.Item>
          
          <Form.Item
            name="reason"
            label="退费原因"
            rules={[{ required: true, message: '请输入退费原因' }]}
          >
            <TextArea rows={4} placeholder="请输入退费原因" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 转课模态框 */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>转课</span>}
        open={isRefundTransferModalVisible && refundTransferForm.getFieldValue('operationType') === 'transfer'}
        onOk={handleRefundTransferOk}
        onCancel={handleRefundTransferCancel}
        width={800}
        okText="确认提交"
        cancelText="取消"
        bodyStyle={{ padding: '24px 32px' }}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Form
          form={refundTransferForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentName"
                label="学员姓名"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="学员ID"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider style={{ margin: '12px 0' }} />
          <Typography.Title level={5} style={{ marginBottom: 16 }}>转课信息</Typography.Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fromCourseId"
                label="原课程"
                rules={[{ required: true, message: '请选择原课程' }]}
              >
                <Select placeholder="请选择原课程">
                  {getStudentAllCourses(currentStudent)
                    .filter(course => course.status !== '未报名')
                    .map(course => (
                      <Option key={course.id} value={course.id || ''}>
                        {course.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="targetStudentId"
                label="转课学员"
                rules={[{ required: true, message: '请选择要转课给哪个学员' }]}
              >
                <Select
                  showSearch
                  placeholder="请输入学员姓名/ID/电话搜索"
                  optionFilterProp="children"
                  filterOption={false}
                  onSearch={handleTransferStudentSearch}
                  loading={isSearchingTransferStudent}
                  notFoundContent={
                    isSearchingTransferStudent ? (
                      <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <span>搜索中...</span>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '8px 0' }}>
                        <span>未找到匹配学员</span>
                        <div style={{ marginTop: 8 }}>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={showQuickAddStudentModal}
                          >
                            添加新学员
                          </Button>
                        </div>
                      </div>
                    )
                  }
                  onChange={(value) => {
                    const student = students.find(s => s.id === value);
                    if (student) {
                      setSelectedTransferStudent(student);
                    }
                  }}
                  value={selectedTransferStudent?.id}
                  style={{ width: '100%' }}
                  dropdownRender={menu => (
                    <div>
                      {menu}
                      <Divider style={{ margin: '4px 0' }} />
                      <div style={{ padding: '8px', textAlign: 'center' }}>
                        <Button 
                          type="link" 
                          size="small"
                          icon={<PlusOutlined />}
                          onClick={showQuickAddStudentModal}
                        >
                          添加新学员
                        </Button>
                      </div>
                    </div>
                  )}
                >
                  {/* 显示所有学员，不按课程分组 */}
                  {students
                    .filter(student => student.id !== currentStudent?.id) // 排除当前学员
                    .map(student => (
                      <Select.Option key={student.id} value={student.id}>
                        {student.name} ({student.id}) - {student.phone}
                      </Select.Option>
                    ))}
                  
                  {/* 搜索结果 */}
                  {transferStudentSearchResults.length > 0 && (
                    <Select.OptGroup label="搜索结果" key="search_results">
                      {transferStudentSearchResults.map(student => (
                        <Select.Option key={student.id} value={student.id}>
                          {student.name} ({student.id}) - {student.phone}
                        </Select.Option>
                      ))}
                    </Select.OptGroup>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toCourseId"
                label="课程名称"
                rules={[{ required: true, message: '请选择课程名称' }]}
              >
                <Select placeholder="请选择课程名称">
                  {courseOptions.map(option => (
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
                name="transferClassHours"
                label="转课课时"
                rules={[{ required: true, message: '请输入转课课时' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priceDifference"
                label="补差价"
                tooltip="负数表示退还差价，正数表示需要补交差价"
                initialValue={0}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => {
                    const parsed = value ? value.replace(/[^\d.-]/g, '') : '0';
                    return parseFloat(parsed);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="reason"
            label="转课原因"
            rules={[{ required: true, message: '请输入转课原因' }]}
          >
            <TextArea rows={4} placeholder="请输入转课原因" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 转班模态框 */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>转班</span>}
        open={isRefundTransferModalVisible && refundTransferForm.getFieldValue('operationType') === 'transferClass'}
        onOk={handleRefundTransferOk}
        onCancel={handleRefundTransferCancel}
        width={800}
        okText="确认提交"
        cancelText="取消"
        bodyStyle={{ padding: '24px 32px' }}
      >
        <Divider style={{ margin: '0 0 24px 0' }} />
        
        <Form
          form={refundTransferForm}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="studentName"
                label="学员姓名"
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="studentId"
                label="学员ID"
              >
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>
          
          <Divider style={{ margin: '12px 0' }} />
          <Typography.Title level={5} style={{ marginBottom: 16 }}>转班信息</Typography.Title>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fromCourseId"
                label="原课程"
                rules={[{ required: true, message: '请选择原课程' }]}
              >
                <Select placeholder="请选择原课程">
                  {getStudentAllCourses(currentStudent)
                    .filter(course => course.status !== '未报名')
                    .map(course => (
                      <Option key={course.id} value={course.id || ''}>
                        {course.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="toCourseId"
                label="新课程名称"
                rules={[{ required: true, message: '请选择新课程名称' }]}
              >
                <Select placeholder="请选择新课程名称">
                  {courseOptions.map(option => (
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
                name="transferClassHours"
                label="转班课时"
                rules={[{ required: true, message: '请输入转班课时' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priceDifference"
                label="补差价"
                tooltip="负数表示退还差价，正数表示需要补交差价"
                initialValue={0}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value: string | undefined) => {
                    const parsed = value ? value.replace(/[^\d.-]/g, '') : '0';
                    return parseFloat(parsed);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="reason"
            label="转班原因"
            rules={[{ required: true, message: '请输入转班原因' }]}
          >
            <TextArea rows={4} placeholder="请输入转班原因" />
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 快速添加学员模态框 */}
      <Modal
        title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>添加新学员</span>}
        open={isQuickAddStudentModalVisible}
        onOk={handleQuickAddStudentOk}
        onCancel={handleQuickAddStudentCancel}
        width={600}
        okText="确认添加"
        cancelText="取消"
        bodyStyle={{ padding: '24px 32px' }}
      >
        <Form
          form={quickAddStudentForm}
          layout="vertical"
          initialValues={{ gender: 'male' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="学员姓名"
                rules={[{ required: true, message: '请输入学员姓名' }]}
              >
                <Input placeholder="请输入学员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Radio.Group>
                  <Radio value="male">男</Radio>
                  <Radio value="female">女</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[
                  { required: true, message: '请输入年龄' },
                  { type: 'number', min: 1, max: 100, message: '年龄必须在1-100之间' }
                ]}
              >
                <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>
          <Alert
            message="注意：此处添加的学员信息仅包含基本信息，可在学员管理页面进行详细编辑。"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </Form>
      </Modal>
    </div>
  );
};

export default StudentManagement; 