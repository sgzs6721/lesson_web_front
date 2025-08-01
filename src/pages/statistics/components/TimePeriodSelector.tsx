import React from 'react';
import { Button } from 'antd';
import './TimePeriodSelector.css';

interface TimePeriodSelectorProps {
  value: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  onChange: (value: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY') => void;
  className?: string;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const timePeriods = [
    { key: 'WEEKLY', label: '周度' },
    { key: 'MONTHLY', label: '月度' },
    { key: 'QUARTERLY', label: '季度' },
    { key: 'YEARLY', label: '年度' },
  ] as const;

  return (
    <div className={`time-period-selector ${className}`}>
      {timePeriods.map(period => (
        <Button
          key={period.key}
          type={value === period.key ? 'primary' : 'default'}
          onClick={() => onChange(period.key)}
          className="time-period-button"
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};

export default TimePeriodSelector; 