import { useState, useEffect } from 'react';
import { 
  StatCard, 
  CoachStats, 
  StatsItem, 
  ClassCardInfo,
  AttendanceRecord, 
  PeriodType, 
  CoachStatsViewType 
} from '../types/dashboard';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState<PeriodType>('week');
  const [coachStats, setCoachStats] = useState<CoachStats[]>([]);
  const [coachStatsView, setCoachStatsView] = useState<CoachStatsViewType>('week');
  const [classCards, setClassCards] = useState<ClassCardInfo[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  // 加载初始数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
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
        value: activePeriod === 'day' ? 4 : activePeriod === 'week' ? 5 : 8,
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
    return [
      { number: 3, unit: '个', label: '上课老师' },
      { number: 3, unit: '个', label: '上课班级' },
      { number: 11, unit: '人', label: '上课学员' },
      { number: 11, unit: '次', label: '打卡次数' },
      { number: 11, unit: '个', label: '消耗课时' },
      { number: 3, unit: '人', label: '请假人数' },
      { number: 950, unit: '元', label: '老师课酬' },
      { number: 2902, unit: '元', label: '消耗费用' },
    ];
  };

  // 初始化课程卡片数据
  useEffect(() => {
    setClassCards([
      {
        id: '1',
        coachName: '杨教练',
        title: '杨大冬课程',
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.05)',
        lessonCount: 8,
        coachSalary: 300,
        salesAmount: 1056.60,
        students: [
          { name: '张小明', time: '15:30-16:30', status: '已完成' },
          { name: '李华', time: '16:40-17:40', status: '已完成' },
          { name: '王芳', time: '18:00-19:00', status: '已完成' },
          { name: '赵强', time: '19:10-20:10', status: '已完成' },
          { name: '刘洋', time: '10:00-11:00', status: '已完成' },
          { name: '周明', time: '11:10-12:10', status: '请假' },
          { name: '郑伟', time: '12:20-13:20', status: '已完成' },
          { name: '黄霞', time: '13:30-14:30', status: '已完成' },
        ]
      },
      {
        id: '2',
        coachName: '苗教练',
        title: '苗寒青课程',
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.05)',
        lessonCount: 3,
        coachSalary: 270,
        salesAmount: 824.60,
        students: [
          { name: '刘明', time: '10:00-11:00', status: '已完成' },
          { name: '郑华', time: '11:10-12:10', status: '请假' },
          { name: '周丽', time: '14:00-15:00', status: '已完成' },
        ]
      },
      {
        id: '3',
        coachName: '武教练',
        title: '武文册课程',
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.05)',
        lessonCount: 7,
        coachSalary: 380,
        salesAmount: 1021.10,
        students: [
          { name: '陈刚', time: '13:00-14:00', status: '已完成' },
          { name: '吴婷', time: '14:10-15:10', status: '已完成' },
          { name: '黄伟', time: '15:20-16:20', status: '已完成' },
          { name: '杨洁', time: '16:30-17:30', status: '已完成' },
          { name: '王鑫', time: '9:00-10:00', status: '已完成' },
          { name: '赵丽', time: '10:10-11:10', status: '请假' },
          { name: '张飞', time: '11:20-12:20', status: '已完成' },
        ]
      }
    ]);
  }, []);

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
    getStatCards,
    getStatsBarItems,
    togglePeriodView,
    toggleDataOverviewPeriod,
    calculateTotals,
    handleBatchPunch,
    toggleAttendanceSelection,
    toggleSelectAll
  };
}; 