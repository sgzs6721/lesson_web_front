import React from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, EditOutlined } from '@ant-design/icons';
import { CourseStatus } from '../types/course';
import './CustomRadioGroup.css';

interface CustomRadioGroupProps {
  value?: string;
  onChange?: (e: RadioChangeEvent) => void;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ value, onChange }) => {
  const handleClick = (selectedValue: string) => {
    if (onChange) {
      const event = {
        target: {
          value: selectedValue
        }
      } as RadioChangeEvent;
      onChange(event);
    }
  };

  return (
    <div className="custom-radio-group-container">
      {/* 隐藏的原始单选框，用于与Form.Item集成 */}
      <Radio.Group value={value} onChange={onChange} style={{ display: 'none' }}>
        <Radio value={CourseStatus.PUBLISHED}>已发布</Radio>
        <Radio value={CourseStatus.SUSPENDED}>已暂停</Radio>
        <Radio value={CourseStatus.TERMINATED}>已终止</Radio>
      </Radio.Group>

      {/* 自定义样式的单选框 */}
      <div className="custom-radio-group">
        <div
          className={`custom-radio-button active-status ${value === CourseStatus.PUBLISHED ? 'active' : ''}`}
          onClick={() => handleClick(CourseStatus.PUBLISHED)}
        >
          <CheckCircleOutlined className="radio-icon" /> 已发布
        </div>
        <div
          className={`custom-radio-button pending-status ${value === CourseStatus.SUSPENDED ? 'active' : ''}`}
          onClick={() => handleClick(CourseStatus.SUSPENDED)}
        >
          <ClockCircleOutlined className="radio-icon" /> 已暂停
        </div>
        <div
          className={`custom-radio-button inactive-status ${value === CourseStatus.TERMINATED ? 'active' : ''}`}
          onClick={() => handleClick(CourseStatus.TERMINATED)}
        >
          <CloseCircleOutlined className="radio-icon" /> 已终止
        </div>
      </div>
    </div>
  );
};

export default CustomRadioGroup;
