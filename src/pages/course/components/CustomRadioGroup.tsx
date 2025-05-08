import React, { useEffect } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { CourseStatus } from '../types/course';
import './CustomRadioGroup.css';

interface CustomRadioGroupProps {
  value?: string;
  onChange?: (e: RadioChangeEvent) => void;
  disabled?: boolean;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ value, onChange, disabled = false }) => {
  // 添加调试日志
  useEffect(() => {
    console.log('CustomRadioGroup 收到的 value 值:', value);
  }, [value]);

  const handleClick = (selectedValue: string) => {
    if (onChange && !disabled) {
      const event = {
        target: {
          value: selectedValue
        }
      } as RadioChangeEvent;
      onChange(event);
    }
  };

  // 检查所有可能的状态值格式
  const normalizedValue = String(value).toUpperCase();
  const isPublished = 
    value === CourseStatus.PUBLISHED || 
    value === '1' || 
    normalizedValue === 'PUBLISHED' || 
    normalizedValue === '1';
    
  const isSuspended = 
    value === CourseStatus.SUSPENDED || 
    normalizedValue === 'SUSPENDED';
    
  const isTerminated = 
    value === CourseStatus.TERMINATED || 
    normalizedValue === 'TERMINATED';

  console.log('状态判断结果:', { 
    value, 
    normalizedValue,
    isPublished, 
    isSuspended, 
    isTerminated, 
    PUBLISHED: CourseStatus.PUBLISHED,
    SUSPENDED: CourseStatus.SUSPENDED,
    TERMINATED: CourseStatus.TERMINATED
  });

  return (
    <div className={`custom-radio-group-container ${disabled ? 'disabled' : ''}`}>
      {/* 隐藏的原始单选框，用于与Form.Item集成 */}
      <Radio.Group value={value} onChange={onChange} style={{ display: 'none' }} disabled={disabled}>
        <Radio value={CourseStatus.PUBLISHED}>已发布</Radio>
        <Radio value={CourseStatus.SUSPENDED}>已暂停</Radio>
        <Radio value={CourseStatus.TERMINATED}>已终止</Radio>
      </Radio.Group>

      {/* 自定义样式的单选框 */}
      <div className="custom-radio-group">
        <div
          className={`custom-radio-button active-status ${isPublished ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => handleClick(CourseStatus.PUBLISHED)}
        >
          <CheckCircleOutlined className="radio-icon" /> 已发布
        </div>
        <div
          className={`custom-radio-button pending-status ${isSuspended ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => handleClick(CourseStatus.SUSPENDED)}
        >
          <ClockCircleOutlined className="radio-icon" /> 已暂停
        </div>
        <div
          className={`custom-radio-button inactive-status ${isTerminated ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={() => handleClick(CourseStatus.TERMINATED)}
        >
          <CloseCircleOutlined className="radio-icon" /> 已终止
        </div>
      </div>
    </div>
  );
};

export default CustomRadioGroup;
