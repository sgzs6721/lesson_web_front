import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Typography, Space, message } from 'antd';
import dayjs from 'dayjs';
import type { AttendanceRecord, FilterParams, AttendanceStatistics } from './types';
import StatisticsCard from './components/StatisticsCard';
import FilterForm from './components/FilterForm';
import AttendanceTable from './components/AttendanceTable';
import { COURSE_OPTIONS, CAMPUS_OPTIONS } from './constants';
import { getAttendanceStatistics, getAttendanceList } from '@/api/attendance';
import { getCourseSimpleList } from '@/api/course';
import type { SimpleCourse } from '@/api/course/types';
import type { AttendanceListRequest, AttendanceRecordItem } from '@/api/attendance';
import type { AttendanceStatRequest } from './types';
import './AttendanceManagement.css';
import './components/FilterForm.css';

const { Title } = Typography;

const AttendanceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [courses, setCourses] = useState<SimpleCourse[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics>({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    leave: 0,
    presentRate: 0,
    absentRate: 0,
    lateRate: 0,
    leaveRate: 0,
  });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseList = await getCourseSimpleList();
        setCourses(courseList.map(c => ({ ...c, value: c.id, label: c.name })));
      } catch (error) {
        message.error('获取课程列表失败');
      }
    };
    fetchCourses();
  }, []);

  // 使用ref来避免重复调用
  const isInitialMount = useRef(true);
  const lastFetchParams = useRef<string>('');

  // 将API返回的记录转换为本地格式
  const transformApiRecord = (apiRecord: AttendanceRecordItem, index: number): AttendanceRecord => {
    return {
      id: `${apiRecord.date}-${apiRecord.studentName || apiRecord.student || 'unknown'}-${index}`,
      date: apiRecord.date || '',
      studentName: apiRecord.studentName || apiRecord.student || '',
      courseName: apiRecord.courseName || apiRecord.course || '',
      checkTime: apiRecord.checkTime || '',
      classTime: apiRecord.classTime || '',
      coachName: apiRecord.coachName || '',
      status: apiRecord.type || '',
      remarks: apiRecord.notes,
    };
  };

  // 构建请求参数
  const buildRequestParams = useCallback(() => {
    const campusId = Number(localStorage.getItem('currentCampusId')) || 1;
    
    const listParams: AttendanceListRequest = {
      pageNum: currentPage,
      pageSize: pageSize,
      campusId,
    };

    const statParams: AttendanceStatRequest = {
      pageNum: currentPage,
      pageSize: pageSize,
      campusId,
    };

    if (searchText) {
      listParams.keyword = searchText;
      statParams.keyword = searchText;
    }
    if (selectedCourse && selectedCourse.length > 0) {
      listParams.courseIds = selectedCourse.map(id => Number(id));
      statParams.courseIds = selectedCourse.map(id => Number(id));
    }
    if (selectedStatus) {
      listParams.status = selectedStatus;
      statParams.status = selectedStatus;
    }
    if (dateRange) {
      listParams.startDate = dateRange[0];
      listParams.endDate = dateRange[1];
      statParams.startDate = dateRange[0];
      statParams.endDate = dateRange[1];
    }

    return { listParams, statParams };
  }, [currentPage, pageSize, searchText, selectedCourse, selectedStatus, dateRange]);

  // 获取数据的函数
  const fetchData = useCallback(async () => {
    const { listParams, statParams } = buildRequestParams();
    
    // 生成参数的唯一标识，避免相同参数重复请求
    const paramsKey = JSON.stringify({ listParams, statParams });
    if (lastFetchParams.current === paramsKey && !isInitialMount.current) {
      return;
    }
    lastFetchParams.current = paramsKey;

    console.log('开始获取考勤数据，参数:', { listParams, statParams });

    try {
      setLoading(true);
      setStatisticsLoading(true);

      // 并行请求两个API
      const [listResponse, statResponse] = await Promise.all([
        getAttendanceList(listParams),
        getAttendanceStatistics(statParams)
      ]);

      // 处理列表数据
      const transformedData = listResponse.list.map((apiRecord, index) => 
        transformApiRecord(apiRecord, index)
      );
      setAttendanceData(transformedData);
      setTotal(listResponse.total);

      // 处理统计数据
      const stats = {
        total: statResponse.studentCount || 0,
        present: statResponse.totalAttendance || 0,
        absent: 0,
        late: 0,
        leave: statResponse.totalLeave || 0,
        presentRate: statResponse.attendanceRate || 0,
        absentRate: 0,
        lateRate: 0,
        leaveRate: 0,
      };
      setStatistics(stats);

      console.log('考勤数据获取成功');
    } catch (error) {
      console.error('获取考勤数据失败:', error);
      message.error('获取考勤数据失败');
      setAttendanceData([]);
      setTotal(0);
      setStatistics({
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        leave: 0,
        presentRate: 0,
        absentRate: 0,
        lateRate: 0,
        leaveRate: 0,
      });
    } finally {
      setLoading(false);
      setStatisticsLoading(false);
      isInitialMount.current = false;
    }
  }, [buildRequestParams]);

  // 只在依赖项变化时调用
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = (values: FilterParams) => {
    setSearchText(values.searchText);
    setSelectedCourse(Array.isArray(values.selectedCourse) ? values.selectedCourse : []);
    setSelectedStatus(values.selectedStatus);
    setDateRange(values.dateRange);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedCourse([]);
    setSelectedStatus('');
    setDateRange(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  return (
    <div className="attendance-management">
      <Card className="attendance-management-card">
        <div className="attendance-header">
          <Title level={4} className="page-title">出勤记录</Title>
        </div>
        
        <FilterForm
          onFilter={handleFilter}
          onReset={handleReset}
          courses={courses}
        />
        <StatisticsCard statistics={statistics} loading={statisticsLoading} />
        <AttendanceTable
          loading={loading}
          data={attendanceData}
          total={total}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  );
};

export default AttendanceManagement; 