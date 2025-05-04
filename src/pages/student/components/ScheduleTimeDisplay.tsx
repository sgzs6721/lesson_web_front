import React from 'react';
import { Typography, Row, Col } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ScheduleTime {
  weekday: string;
  time: string;
  endTime?: string;
}

interface ScheduleTimeDisplayProps {
  schedules: ScheduleTime[];
}

/**
 * 固定排课时间显示组件
 */
const ScheduleTimeDisplay: React.FC<ScheduleTimeDisplayProps> = ({ schedules }) => {
  if (!schedules || schedules.length === 0) {
    return null;
  }

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
    <div style={{ 
      padding: '20px 0 15px 0',
      borderTop: '1px solid #f0f0f0',
      marginTop: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ minWidth: '90px' }}>
          <Text style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            color: '#333',
          }}>
            固定排课:
          </Text>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '16px',
            marginLeft: '5px'
          }}>
            {schedules.map((schedule, index) => {
              // 获取星期几对应的样式
              const weekday = schedule.weekday.replace(/^[周星期]/, '');
              const weekdayStyle = weekdayColorMap[weekday] || {bg: '#f5f5f5', border: '#d9d9d9', text: '#595959'};
              
              // 时间显示值
              const timeDisplay = schedule.endTime 
                ? `${schedule.time} - ${schedule.endTime}` 
                : schedule.time;
              
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '30px',
                    border: `1px solid ${weekdayStyle.border}`,
                    borderRadius: '4px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    width: 'calc(50% - 8px)',
                    maxWidth: '220px',
                    minWidth: '170px'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: weekdayStyle.bg,
                      color: weekdayStyle.text,
                      fontWeight: '500',
                      padding: '0',
                      margin: '0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      borderRight: `1px solid ${weekdayStyle.border}`,
                      minWidth: '70px'
                    }}
                  >
                    星期{weekday}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      flex: 1,
                      justifyContent: 'flex-start'
                    }}
                  >
                    <ClockCircleOutlined style={{ fontSize: '12px', color: '#8c8c8c', marginRight: '6px' }} />
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#333' }}>
                      {timeDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTimeDisplay; 