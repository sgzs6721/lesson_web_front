import React from 'react';
import { CoachSimpleInfo } from '@/api/schedule/types';

interface ScheduleLegendProps {
  coaches: CoachSimpleInfo[];
  selectedCoach: number | null;
  onCoachSelect: (coachId: number | null) => void;
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
      acc[coach.id] = colors[index % colors.length];
      return acc;
    }, {} as Record<number, string>);
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
          style={{ background: 'linear-gradient(135deg, #4285f4 0%, #1a73e8 100%)' }}
        />
        <span>全部</span>
      </div>
      
      {/* 教练选项 */}
      {coaches.map((coach) => (
        <div 
          key={coach.id} 
          className={`legend-item ${selectedCoach === coach.id ? 'active' : ''}`}
          onClick={() => onCoachSelect(coach.id)}
        >
          <div 
            className="legend-color" 
            style={{ backgroundColor: coachColors[coach.id] }}
          />
          <span>{coach.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ScheduleLegend; 