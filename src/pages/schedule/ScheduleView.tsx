import React, { useState, useEffect } from 'react';
import { Card, message, Spin, Typography } from 'antd';
import ScheduleGrid from './components/ScheduleGrid';
import ScheduleLegend from './components/ScheduleLegend';
import { FixedScheduleData, CoachSimpleInfo, ScheduleCourseInfo } from '@/api/schedule/types';
import { API } from '@/api';
import './schedule.css';

const { Title } = Typography;

const ScheduleView: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<FixedScheduleData | null>(null);
  const [coachList, setCoachList] = useState<CoachSimpleInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const filterScheduleByActiveStudents = (data: FixedScheduleData, activeStudentNames: Set<string>): FixedScheduleData => {
    const filteredSchedule: FixedScheduleData['schedule'] = {};

    for (const timeSlot of data.timeSlots) {
      const dayMap = data.schedule[timeSlot] || {};
      const newDayMap: Record<string, ScheduleCourseInfo[]> = {};

      for (const day of data.days) {
        const coursesForDay = dayMap[day] || [];
        const filteredCourses = coursesForDay
          .map((course) => {
            const students = (course.studentName || '')
              .split(',')
              .map((s) => s.trim())
              .filter((s) => s.length > 0);

            const keptStudents = students.filter((name) => activeStudentNames.has(name));

            if (keptStudents.length === 0) {
              return null; // 该课程下无符合条件学员，移除此课程块
            }

            return {
              ...course,
              studentName: keptStudents.join(', '),
            } as ScheduleCourseInfo;
          })
          .filter((c): c is ScheduleCourseInfo => c !== null);

        if (filteredCourses.length > 0) {
          newDayMap[day] = filteredCourses;
        }
      }

      filteredSchedule[timeSlot] = newDayMap;
    }

    return {
      ...data,
      schedule: filteredSchedule,
    };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 从localStorage获取当前校区ID
      const currentCampusId = localStorage.getItem('currentCampusId');
      if (!currentCampusId) {
        message.error('请先选择校区');
        return;
      }

      // 并行调用三个API：课表、教练、学员（仅学习中）
      const [scheduleResponse, coachResponse, activeStudentsResponse] = await Promise.all([
        API.schedule.getFixedSchedule(Number(currentCampusId)),
        API.schedule.getCoachSimpleList(Number(currentCampusId)),
        API.student.getList({
          campusId: Number(currentCampusId),
          status: 'STUDYING',
          pageNum: 1,
          pageSize: 1000,
        }),
      ]);

      // 构建“学习中”的学员姓名集合
      const activeStudentNames = new Set<string>((activeStudentsResponse.list || []).map((s) => s.name).filter(Boolean));

      // 基于学员状态过滤课表中的学员显示
      const filteredSchedule = filterScheduleByActiveStudents(scheduleResponse, activeStudentNames);

      setScheduleData(filteredSchedule);
      setCoachList(coachResponse);
    } catch (error) {
      console.error('获取课表数据失败:', error);
      message.error('获取课表数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCoachFilter = (coachId: number | null) => {
    setSelectedCoach(coachId);
  };

  return (
    <div className="schedule-view">
      <Spin spinning={loading}>
        <Card className="schedule-management-card">
          <Title level={4} className="page-title" style={{ marginBottom: 16 }}>
            固定课表
          </Title>
          <div className="schedule-content">
            {scheduleData ? (
              <>
                <ScheduleLegend 
                  coaches={coachList} 
                  selectedCoach={selectedCoach}
                  onCoachSelect={handleCoachFilter}
                />
                <ScheduleGrid 
                  scheduleData={scheduleData} 
                  selectedCoach={selectedCoach}
                  coachList={coachList}
                />
              </>
            ) : (
              !loading && (
                <div className="schedule-placeholder">
                  暂无课表数据
                </div>
              )
            )}
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ScheduleView; 