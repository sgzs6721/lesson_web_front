import React, { useState, useEffect } from 'react';
import { Card, message, Spin, Typography } from 'antd';
import ScheduleGrid from './components/ScheduleGrid';
import ScheduleLegend from './components/ScheduleLegend';
import { FixedScheduleData, CoachSimpleInfo } from '@/api/schedule/types';
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

  const fetchData = async () => {
    setLoading(true);
    try {
      // 从localStorage获取当前校区ID
      const currentCampusId = localStorage.getItem('currentCampusId');
      if (!currentCampusId) {
        message.error('请先选择校区');
        return;
      }

      // 并行调用两个API
      const [scheduleResponse, coachResponse] = await Promise.all([
        API.schedule.getFixedSchedule(Number(currentCampusId)),
        API.schedule.getCoachSimpleList(Number(currentCampusId))
      ]);

      setScheduleData(scheduleResponse);
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
        <Card 
          className="schedule-card" 
          title={
            <Title level={4} style={{ marginBottom: 0, fontSize: 18, fontWeight: 600 }}>
              固定课表
            </Title>
          }
        >
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