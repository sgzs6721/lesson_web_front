import React from 'react';
import { CoachSimpleInfo } from '@/api/schedule/types';

interface ScheduleLegendProps {
  coaches: CoachSimpleInfo[];
  selectedCoach: string | null;
  onCoachSelect: (coachName: string | null) => void;
}

const ScheduleLegend: React.FC<ScheduleLegendProps> = ({ coaches, selectedCoach, onCoachSelect }) => {
  // 为教练生成颜色映射
  const generateCoachColors = (coaches: CoachSimpleInfo[]) => {
    const colors = [
      '#e74c3c', // 红色
      '#3498db', // 蓝色
      '#2ecc71', // 绿色
      '#f39c12', // 橙色
      '#9b59b6', // 紫色
      '#1abc9c', // 青绿色
      '#34495e', // 深灰色
      '#e67e22', // 橙红色
    ];
    
    return coaches.reduce((acc, coach, index) => {
      acc[coach.name] = colors[index % colors.length];
      return acc;
    }, {} as Record<string, string>);
  };

  const coachColors = generateCoachColors(coaches);

  if (!coaches || coaches.length === 0) {
    return null;
  }

  return (
    <div className="legend">
      {/* 全部选项 */}
      <div 
        className={`legend-item ${selectedCoach === null ? 'active' : ''}`}
        onClick={() => onCoachSelect(null)}
      >
        <div 
          className="legend-color" 
          style={{ backgroundColor: '#666' }}
        />
        <span>全部</span>
      </div>
      
      {/* 教练选项 */}
      {coaches.map((coach) => (
        <div 
          key={coach.id} 
          className={`legend-item ${selectedCoach === coach.name ? 'active' : ''}`}
          onClick={() => onCoachSelect(coach.name)}
        >
          <div 
            className="legend-color" 
            style={{ backgroundColor: coachColors[coach.name] }}
          />
          <span>{coach.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ScheduleLegend; 