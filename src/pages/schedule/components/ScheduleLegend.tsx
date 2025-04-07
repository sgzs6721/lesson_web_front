import React from 'react';
import { Coach } from '../types/schedule';

interface ScheduleLegendProps {
  coaches: Coach[];
  selectedCoach: string[];
  onCoachChange: (coaches: string[]) => void;
}

const ScheduleLegend: React.FC<ScheduleLegendProps> = ({
  coaches,
  selectedCoach,
  onCoachChange
}) => {
  const toggleAllCoaches = () => {
    if (selectedCoach.length > 0) {
      // 如果已有选中教练，清空选择
      onCoachChange([]);
    } else {
      // 如果没有选中教练，选中所有教练
      onCoachChange(coaches.map(coach => coach.id));
    }
  };

  const toggleCoach = (coachId: string) => {
    if (selectedCoach.includes(coachId)) {
      // 如果已选中，则移除
      onCoachChange(selectedCoach.filter(id => id !== coachId));
    } else {
      // 如果未选中，则添加
      onCoachChange([...selectedCoach, coachId]);
    }
  };

  return (
    <div className="legend-section">
      <div className="legend">
        <div
          className={`legend-item ${selectedCoach.length === 0 ? 'active' : ''}`}
          onClick={toggleAllCoaches}
        >
          <div className="legend-color" style={{ backgroundColor: '#cccccc' }}></div>
          <span>全部</span>
        </div>
        {coaches.map(coach => (
          <div
            key={coach.id}
            className={`legend-item ${selectedCoach.includes(coach.id) ? 'active' : ''}`}
            onClick={() => toggleCoach(coach.id)}
          >
            <div className="legend-color" style={{ backgroundColor: coach.color }}></div>
            <span>{coach.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleLegend; 