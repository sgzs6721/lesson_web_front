import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  StatCard,
  CoachStats,
  StatsItem,
  ClassCardInfo,
  AttendanceRecord,
  PeriodType,
  CoachStatsViewType
} from '../types/dashboard';
// API import removed as we're using the shared getCampusList function
import { Campus } from '@/api/campus/types';
import { getCampusList } from '@/components/CampusSelector';
import { dashboardApi, TodayDataResponse, DashboardOverviewVO, CourseDetailVO, OverviewDataResponse, CoursesDataResponse } from '@/api/dashboard';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('week');
  const [coachStats, setCoachStats] = useState<CoachStats[]>([]);
  const [coachStatsView, setCoachStatsView] = useState<CoachStatsViewType>('week');
  const [classCards, setClassCards] = useState<ClassCardInfo[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [campusList, setCampusList] = useState<Campus[]>([]);
  const [campusTotal, setCampusTotal] = useState<number>(0);
  const [overviewData, setOverviewData] = useState<DashboardOverviewVO | null>(null);
  const [courseDetailsData, setCourseDetailsData] = useState<CourseDetailVO[]>([]);
  const [separateOverviewData, setSeparateOverviewData] = useState<DashboardOverviewVO | null>(null);
  const [separateCoursesData, setSeparateCoursesData] = useState<CourseDetailVO[]>([]);

  // 转换课程详情为课程卡片格式
  const convertCourseDetailsToClassCards = (courseDetails: CourseDetailVO[]): ClassCardInfo[] => {
    const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#1abc9c'];
    
    return courseDetails.map((course, index) => ({
      id: `course-${index}`,
      coachName: course.coachName,
      title: course.courseName,
      borderColor: colors[index % colors.length],
      backgroundColor: `${colors[index % colors.length]}10`, // 添加透明度
      lessonCount: course.hours,
      coachSalary: course.remuneration,
      salesAmount: course.salesAmount,
      students: course.studentAttendances.map(attendance => ({
        name: attendance.studentName,
        time: attendance.timeSlot,
        status: attendance.status as '已完成' | '请假' | '未打卡' | 'empty'
      }))
    }));
  };

  // 获取校区列表数据 - 使用共享的getCampusList函数
  const fetchCampusList = async () => {
    try {
      // 使用共享的获取函数，避免重复调用API
      const campusData = await getCampusList('Dashboard组件');
      console.log('从getCampusList获取的校区数据:', campusData);

      // 更新状态
      setCampusList(campusData);
      setCampusTotal(campusData.length);
    } catch (error) {
      console.error('获取校区列表失败:', error);
      message.error('获取校区列表失败');
    }
  };

  // 获取今日数据
  const fetchTodayData = async () => {
    try {
      console.log('开始获取今日数据...');
      const response: TodayDataResponse = await dashboardApi.getTodayData();
      console.log('今日数据API响应:', response);

      if (response.code === 0 || response.code === 200) {
        const { overview, courseDetails } = response.data;
        
        // 更新总览数据
        setOverviewData(overview);
        
        // 更新课程详情数据
        setCourseDetailsData(courseDetails);
        
        // 转换课程详情为课程卡片格式
        const convertedClassCards = convertCourseDetailsToClassCards(courseDetails);
        setClassCards(convertedClassCards);
        
        console.log('今日数据更新成功');
        console.log('总览数据:', overview);
        console.log('课程详情数据:', courseDetails);
        console.log('转换后的课程卡片:', convertedClassCards);
        message.success('今日数据已刷新');
      } else {
        console.error('获取今日数据失败:', response.message);
        message.error(`获取今日数据失败: ${response.message}`);
      }
    } catch (error) {
      console.error('获取今日数据异常:', error);
      message.error('获取今日数据失败，请稍后重试');
      
      // 如果API调用失败，设置默认数据
      console.log('API调用失败，使用默认数据');
      
      // 设置默认的总览数据
      setOverviewData({
        teacherCount: 0,
        classCount: 0,
        studentCount: 0,
        checkinCount: 0,
        consumedHours: 0,
        leaveCount: 0,
        teacherRemuneration: 0,
        consumedFees: 0,
        totalRevenue: 0,
        totalRevenueChangePercent: 0,
        totalProfit: 0,
        totalProfitChangePercent: 0,
        totalStudents: 0,
        totalStudentsChangePercent: 0,
        totalCoaches: 0,
        partTimeCoaches: 0,
        fullTimeCoaches: 0,
        currentWeekClassHoursRatio: '0/0',
        currentWeekSalesAmount: 0,
        currentWeekPayingStudents: 0,
        currentWeekNewPayingStudents: 0,
        currentWeekRenewalPayingStudents: 0,
        currentWeekPaymentAmount: 0,
        currentWeekNewStudentPaymentAmount: 0,
        currentWeekRenewalPaymentAmount: 0,
        currentWeekAttendanceRate: 0,
        currentWeekAttendanceRateChangePercent: 0,
      });
      
      // 设置默认的课程详情数据（空数组）
      setCourseDetailsData([]);
      setClassCards([]);
    }
  };

  // 获取数据总览
  const fetchOverviewData = async () => {
    try {
      console.log('开始获取数据总览...');
      const response: OverviewDataResponse = await dashboardApi.getOverviewData();
      console.log('数据总览API响应:', response);

      if (response.code === 0 || response.code === 200) {
        setSeparateOverviewData(response.data);
        console.log('数据总览更新成功');
      } else {
        console.error('获取数据总览失败:', response.message);
        message.error(`获取数据总览失败: ${response.message}`);
      }
    } catch (error) {
      console.error('获取数据总览异常:', error);
      message.error('获取数据总览失败，请稍后重试');
    }
  };

  // 获取课程详情
  const fetchCoursesData = async () => {
    try {
      console.log('开始获取课程详情...');
      const response: CoursesDataResponse = await dashboardApi.getCoursesData();
      console.log('课程详情API响应:', response);

      if (response.code === 0 || response.code === 200) {
        setSeparateCoursesData(response.data);
        console.log('课程详情更新成功');
      } else {
        console.error('获取课程详情失败:', response.message);
        message.error(`获取课程详情失败: ${response.message}`);
      }
    } catch (error) {
      console.error('获取课程详情异常:', error);
      message.error('获取课程详情失败，请稍后重试');
    }
  };

  // 异步加载初始数据，不阻塞页面渲染
  useEffect(() => {
    let isMounted = true; // 用于防止组件卸载后设置状态

    const initData = async () => {
      // 开始加载数据
      if (isMounted) setLoading(true);

      try {
        // 并行获取数据
        await Promise.all([
          fetchCampusList().catch(err => console.error('获取校区列表失败:', err)),
          fetchTodayData().catch(err => console.error('获取今日数据失败:', err)),
          fetchOverviewData().catch(err => console.error('获取数据总览失败:', err)),
          fetchCoursesData().catch(err => console.error('获取课程详情失败:', err))
        ]);

        // 完成加载
        if (isMounted) setLoading(false);
      } catch (error) {
        console.error('初始化数据失败:', error);
        if (isMounted) {
          message.error('初始化数据失败');
          setLoading(false);
        }
      }
    };

    // 开始加载数据，但不阻塞渲染
    initData();

    // 清理函数
    return () => {
      isMounted = false;
    };
  }, []);

  // 获取教练统计数据
  useEffect(() => {
    // 样本数据
    const coachStatsData = {
      day: [
        { id: '1', name: '李教练', completedLessons: 8, completedAmount: 960, pendingLessons: 2, pendingAmount: 240, hourlyRate: 120, estimatedSalary: 960, type: '全职' as const, colorClass: 'rgba(231, 76, 60, 0.7)' },
        { id: '2', name: '王教练', completedLessons: 6, completedAmount: 603, pendingLessons: 3, pendingAmount: 301.5, hourlyRate: 100.5, estimatedSalary: 603, type: '全职' as const, colorClass: 'rgba(52, 152, 219, 0.7)' },
        { id: '3', name: '张教练', completedLessons: 4, completedAmount: 442, pendingLessons: 1, pendingAmount: 110.5, hourlyRate: 110.5, estimatedSalary: 442, type: '兼职' as const, colorClass: 'rgba(46, 204, 113, 0.7)' },
        { id: '4', name: '刘教练', completedLessons: 5, completedAmount: 650.62, pendingLessons: 2, pendingAmount: 260.25, hourlyRate: 130.123, estimatedSalary: 650, type: '兼职' as const, colorClass: 'rgba(243, 156, 18, 0.7)' },
      ],
      week: [
        { id: '1', name: '李教练', completedLessons: 24, completedAmount: 2880, pendingLessons: 8, pendingAmount: 960, hourlyRate: 120, estimatedSalary: 2880, type: '全职' as const, colorClass: 'rgba(231, 76, 60, 0.7)' },
        { id: '2', name: '王教练', completedLessons: 18, completedAmount: 1809, pendingLessons: 10, pendingAmount: 1005, hourlyRate: 100.5, estimatedSalary: 1800, type: '全职' as const, colorClass: 'rgba(52, 152, 219, 0.7)' },
        { id: '3', name: '张教练', completedLessons: 16, completedAmount: 1768, pendingLessons: 12, pendingAmount: 1326, hourlyRate: 110.5, estimatedSalary: 1760, type: '兼职' as const, colorClass: 'rgba(46, 204, 113, 0.7)' },
        { id: '4', name: '刘教练', completedLessons: 14, completedAmount: 1821.72, pendingLessons: 7, pendingAmount: 910.86, hourlyRate: 130.123, estimatedSalary: 1820, type: '兼职' as const, colorClass: 'rgba(243, 156, 18, 0.7)' },
      ],
      month: [
        { id: '1', name: '李教练', completedLessons: 86, completedAmount: 10320, pendingLessons: 14, pendingAmount: 1680, hourlyRate: 120, estimatedSalary: 10320, type: '全职' as const, colorClass: 'rgba(231, 76, 60, 0.7)' },
        { id: '2', name: '王教练', completedLessons: 62, completedAmount: 6200, pendingLessons: 18, pendingAmount: 1800, hourlyRate: 100, estimatedSalary: 6200, type: '全职' as const, colorClass: 'rgba(52, 152, 219, 0.7)' },
        { id: '3', name: '张教练', completedLessons: 54, completedAmount: 5940, pendingLessons: 16, pendingAmount: 1760, hourlyRate: 110, estimatedSalary: 5940, type: '兼职' as const, colorClass: 'rgba(46, 204, 113, 0.7)' },
        { id: '4', name: '刘教练', completedLessons: 48, completedAmount: 6240, pendingLessons: 12, pendingAmount: 1560, hourlyRate: 130, estimatedSalary: 6240, type: '兼职' as const, colorClass: 'rgba(243, 156, 18, 0.7)' },
      ]
    };

    if (coachStatsView === 'week' || coachStatsView === 'month') {
      setCoachStats(coachStatsData[coachStatsView]);
    } else {
      setCoachStats(coachStatsData.day);
    }
  }, [coachStatsView]);

  // 获取统计卡片数据
  const getStatCards = (): StatCard[] => {
    return [
      {
        id: '1',
        title: '学员数',
        value: activePeriod === 'day' ? 85 : activePeriod === 'week' ? 320 : 1250,
        subtitle: '活跃学员',
        period: activePeriod,
        growthPercent: 5.2,
        growthPositive: true,
        icon: 'user-graduate'
      },
      {
        id: '2',
        title: '课程数',
        value: activePeriod === 'day' ? 24 : activePeriod === 'week' ? 156 : 620,
        subtitle: '已开展课程',
        period: activePeriod,
        growthPercent: 3.8,
        growthPositive: true,
        icon: 'book'
      },
      {
        id: '3',
        title: '教练数',
        value: activePeriod === 'day' ? 12 : activePeriod === 'week' ? 18 : 25,
        subtitle: '在职教练',
        period: activePeriod,
        growthPercent: 1.2,
        growthPositive: true,
        icon: 'user-tie'
      },
      {
        id: '4',
        title: '校区数',
        value: campusTotal || (activePeriod === 'day' ? 4 : activePeriod === 'week' ? 5 : 8),
        subtitle: '运营校区',
        period: activePeriod,
        growthPercent: 0,
        growthPositive: false,
        icon: 'building'
      }
    ];
  };

  // 获取统计条数据
  const getStatsBarItems = (): StatsItem[] => {
    // 如果有API数据，使用API数据；否则使用默认数据
    if (overviewData) {
      return [
        { number: overviewData.teacherCount, unit: '个', label: '上课老师' },
        { number: overviewData.classCount, unit: '个', label: '上课班级' },
        { number: overviewData.studentCount, unit: '人', label: '上课学员' },
        { number: overviewData.checkinCount, unit: '次', label: '打卡次数' },
        { number: overviewData.consumedHours, unit: '个', label: '消耗课时' },
        { number: overviewData.leaveCount, unit: '人', label: '请假人数' },
        { number: overviewData.teacherRemuneration, unit: '元', label: '老师课酬' },
        { number: overviewData.consumedFees, unit: '元', label: '消耗费用' },
      ];
    }
    
    // 默认数据（API数据加载失败时使用）
    return [
      { number: 0, unit: '个', label: '上课老师' },
      { number: 0, unit: '个', label: '上课班级' },
      { number: 0, unit: '人', label: '上课学员' },
      { number: 0, unit: '次', label: '打卡次数' },
      { number: 0, unit: '个', label: '消耗课时' },
      { number: 0, unit: '人', label: '请假人数' },
      { number: 0, unit: '元', label: '老师课酬' },
      { number: 0, unit: '元', label: '消耗费用' },
    ];
  };

  // 课程卡片数据现在从API获取，不再使用硬编码数据

  // 初始化出勤记录数据
  useEffect(() => {
    setAttendanceRecords([
      {
        id: '1',
        studentName: '张小明',
        time: '14:00-16:00',
        coach: '李教练',
        remainingLessons: '12/24',
        courseType: '未打卡',
        salesAmount: '¥2,400',
        remainingAmount: '¥2,400',
        status: '未打卡',
        isChecked: false,
        isDisabled: false
      },
      {
        id: '2',
        studentName: '李华',
        time: '10:00-11:00',
        coach: '王教练',
        remainingLessons: '15/30',
        courseType: '已打卡',
        salesAmount: '¥180',
        remainingAmount: '¥2,700',
        status: '已打卡',
        isChecked: false,
        isDisabled: true
      },
      {
        id: '3',
        studentName: '王芳',
        time: '16:00-17:00',
        coach: '张教练',
        remainingLessons: '8/20',
        courseType: '已请假',
        salesAmount: '¥1,600',
        remainingAmount: '¥1,600',
        status: '已请假',
        isChecked: false,
        isDisabled: true
      },
      {
        id: '4',
        studentName: '刘强',
        time: '09:00-10:00',
        coach: '李教练',
        remainingLessons: '5/20',
        courseType: '未打卡',
        salesAmount: '¥1,800',
        remainingAmount: '¥1,800',
        status: '未打卡',
        isChecked: false,
        isDisabled: false
      },
      {
        id: '5',
        studentName: '周丽',
        time: '11:00-12:00',
        coach: '王教练',
        remainingLessons: '3/12',
        courseType: '未打卡',
        salesAmount: '¥1,200',
        remainingAmount: '¥1,200',
        status: '未打卡',
        isChecked: false,
        isDisabled: false
      }
    ]);
  }, []);

  // 切换期间视图
  const togglePeriodView = (view: CoachStatsViewType) => {
    setCoachStatsView(view);
  };

  // 切换数据总览视图
  const toggleDataOverviewPeriod = (period: PeriodType) => {
    setActivePeriod(period);
  };

  // 计算教练统计总数
  const calculateTotals = (period: CoachStatsViewType) => {
    if (period === 'week') {
      return {
        completed: 72,
        completedAmount: 8260,
        pending: 37,
        pendingAmount: 4200,
        salary: 8260
      };
    } else {
      return {
        completed: 250,
        completedAmount: 28700,
        pending: 60,
        pendingAmount: 6800,
        salary: 28700
      };
    }
  };

  // 批量打卡
  const handleBatchPunch = () => {
    let punchedCount = 0;

    const updatedRecords = attendanceRecords.map(record => {
      // 只处理"未打卡"且被选中的记录
      if (record.isChecked && record.status === '未打卡' && !record.isDisabled) {
        punchedCount++;
        return {
          ...record,
          status: '已打卡' as const,
          isDisabled: true,
          isChecked: false
        };
      }
      return record;
    });

    setAttendanceRecords(updatedRecords);
    return punchedCount;
  };

  // 选择/取消选择出勤记录
  const toggleAttendanceSelection = (id: string, isChecked: boolean) => {
    setAttendanceRecords(
      attendanceRecords.map(record =>
        record.id === id ? { ...record, isChecked } : record
      )
    );
  };

  // 全选/取消全选
  const toggleSelectAll = (isChecked: boolean) => {
    setAttendanceRecords(
      attendanceRecords.map(record =>
        !record.isDisabled ? { ...record, isChecked } : record
      )
    );
  };

  return {
    loading,
    activePeriod,
    coachStats,
    coachStatsView,
    classCards,
    attendanceRecords,
    campusList,
    campusTotal,
    overviewData,
    courseDetailsData,
    separateOverviewData,
    separateCoursesData,
    getStatCards,
    getStatsBarItems,
    togglePeriodView,
    toggleDataOverviewPeriod,
    calculateTotals,
    handleBatchPunch,
    toggleAttendanceSelection,
    toggleSelectAll,
    fetchCampusList,
    fetchTodayData,
    fetchOverviewData,
    fetchCoursesData
  };
};