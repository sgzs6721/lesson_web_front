import React, { useState, useEffect } from 'react';
import { Card, Typography, Space } from 'antd';
import dayjs from 'dayjs';
import type { AttendanceRecord, FilterParams, AttendanceStatistics } from './types';
import StatisticsCard from './components/StatisticsCard';
import FilterForm from './components/FilterForm';
import AttendanceTable from './components/AttendanceTable';
import { COURSE_OPTIONS, CAMPUS_OPTIONS } from './constants';

const { Title } = Typography;

const AttendanceManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterParams, setFilterParams] = useState<FilterParams>({
    searchText: '',
    selectedCourse: '',
    selectedCampus: '',
    selectedStatus: '',
    dateRange: null,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    fetchAttendanceData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    filterData();
  }, [attendanceData, filterParams]);

  // 模拟获取考勤数据
  const fetchAttendanceData = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const today = dayjs();
      const mockData: AttendanceRecord[] = [];

      for (let i = 0; i < 100; i++) {
        const date = today.subtract(i % 30, 'day');
        const courseIndex = i % 5;
        const campusIndex = i % 5;
        const status = i % 10 === 0 ? 'absent' : i % 7 === 0 ? 'late' : i % 11 === 0 ? 'leave' : 'present';
        
        // 生成打卡时间
        let checkInTime;
        let checkOutTime;
        
        if (status === 'present') {
          checkInTime = '08:55';
          checkOutTime = '10:25';
        } else if (status === 'late') {
          checkInTime = '09:15';
          checkOutTime = '10:25';
        } else if (status === 'leave') {
          checkInTime = undefined;
          checkOutTime = undefined;
        } else {
          checkInTime = undefined;
          checkOutTime = undefined;
        }

        mockData.push({
          id: `A${10000 + i}`,
          studentId: `S${20000 + (i % 50)}`,
          studentName: `学员${(i % 50) + 1}`,
          courseId: COURSE_OPTIONS[courseIndex].value,
          courseName: COURSE_OPTIONS[courseIndex].label,
          coachId: `coach${(i % 5) + 1}`,
          coachName: `教练${(i % 5) + 1}`,
          campusId: CAMPUS_OPTIONS[campusIndex].value,
          campusName: CAMPUS_OPTIONS[campusIndex].label,
          scheduleId: `SCH${30000 + i}`,
          date: date.format('YYYY-MM-DD'),
          startTime: '09:00',
          endTime: '10:30',
          status,
          checkInTime,
          checkOutTime,
          remarks: status === 'leave' ? '家长请假' : status === 'absent' ? '未到课' : undefined,
        });
      }

      setAttendanceData(mockData);
      setTotal(mockData.length);
    } catch (error) {
      console.error('Failed to fetch attendance data', error);
    } finally {
      setLoading(false);
    }
  };

  // 过滤数据
  const filterData = () => {
    let filtered = [...attendanceData];
    
    if (filterParams.searchText) {
      filtered = filtered.filter(
        record => 
          record.studentName.includes(filterParams.searchText) || 
          record.studentId.includes(filterParams.searchText) ||
          record.courseName.includes(filterParams.searchText)
      );
    }
    
    if (filterParams.selectedCourse) {
      filtered = filtered.filter(record => record.courseId === filterParams.selectedCourse);
    }
    
    if (filterParams.selectedCampus) {
      filtered = filtered.filter(record => record.campusId === filterParams.selectedCampus);
    }
    
    if (filterParams.selectedStatus) {
      filtered = filtered.filter(record => record.status === filterParams.selectedStatus);
    }
    
    if (filterParams.dateRange) {
      const [startDate, endDate] = filterParams.dateRange;
      filtered = filtered.filter(record => 
        record.date >= startDate && record.date <= endDate
      );
    }
    
    // 分页
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);
    
    setFilteredData(paginatedData);
    setTotal(filtered.length);
  };

  // 获取考勤统计信息
  const getStatistics = (): AttendanceStatistics => {
    const total = attendanceData.length;
    const present = attendanceData.filter(record => record.status === 'present').length;
    const absent = attendanceData.filter(record => record.status === 'absent').length;
    const late = attendanceData.filter(record => record.status === 'late').length;
    const leave = attendanceData.filter(record => record.status === 'leave').length;
    
    const presentRate = total > 0 ? Math.round((present / total) * 100) : 0;
    const absentRate = total > 0 ? Math.round((absent / total) * 100) : 0;
    const lateRate = total > 0 ? Math.round((late / total) * 100) : 0;
    const leaveRate = total > 0 ? Math.round((leave / total) * 100) : 0;
    
    return { total, present, absent, late, leave, presentRate, absentRate, lateRate, leaveRate };
  };

  const handleFilter = (values: FilterParams) => {
    setFilterParams({
      ...values,
      currentPage: 1,
      pageSize,
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilterParams({
      searchText: '',
      selectedCourse: '',
      selectedCampus: '',
      selectedStatus: '',
      dateRange: null,
      currentPage: 1,
      pageSize,
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    setFilterParams(prev => ({
      ...prev,
      currentPage: page,
      pageSize: size,
    }));
  };

  const cardStyle = {
    marginTop: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  };

  return (
    <div className="p-4">
      <Title level={4} className="mb-4">打卡消课记录</Title>
      <StatisticsCard statistics={getStatistics()} />
      <Card style={cardStyle}>
        <FilterForm onFilter={handleFilter} onReset={handleReset} />
        <AttendanceTable
          loading={loading}
          data={filteredData}
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