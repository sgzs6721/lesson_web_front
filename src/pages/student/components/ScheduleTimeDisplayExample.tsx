import React from 'react';
import { Card } from 'antd';
import ScheduleTimeDisplay from './ScheduleTimeDisplay';

const ScheduleTimeDisplayExample: React.FC = () => {
  // 模拟数据
  const schedules = [
    { weekday: '一', time: '15:00', endTime: '16:00' },
    { weekday: '二', time: '16:00', endTime: '17:00' },
    { weekday: '五', time: '16:00', endTime: '17:00' }
  ];

  return (
    <Card title="固定排课示例" style={{ width: '100%', maxWidth: 800 }}>
      <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ minWidth: '80px', fontWeight: 'bold', fontSize: '14px' }}>固定排课:</span>
          <div>
            {schedules.map((schedule, index) => (
              <div key={index} style={{ display: 'inline-block', margin: '0 10px 0 0', verticalAlign: 'middle' }}>
                <span style={{ color: '#1890ff', fontWeight: 'bold', marginRight: '5px' }}>星期{schedule.weekday}</span>
                <span style={{ color: '#595959' }}>{schedule.time} - {schedule.endTime}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 使用我们新创建的组件展示同样的数据 */}
        <ScheduleTimeDisplay schedules={schedules} />
      </div>
    </Card>
  );
};

export default ScheduleTimeDisplayExample; 