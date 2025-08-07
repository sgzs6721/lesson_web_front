import React from 'react';
import { Segmented } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { CourseStatus } from '../types/course';
import './CustomRadioGroup.css';

interface CustomRadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({ value, onChange, disabled = false }) => {
  const options = [
    {
      label: (
        <div className="status-option status-published">
          <CheckCircleOutlined className="status-icon" />
          <span className="status-text">已发布</span>
        </div>
      ),
      value: CourseStatus.PUBLISHED,
    },
    {
      label: (
        <div className="status-option status-suspended">
          <ClockCircleOutlined className="status-icon" />
          <span className="status-text">已暂停</span>
        </div>
      ),
      value: CourseStatus.SUSPENDED,
    },
    {
      label: (
        <div className="status-option status-terminated">
          <CloseCircleOutlined className="status-icon" />
          <span className="status-text">已终止</span>
        </div>
      ),
      value: CourseStatus.TERMINATED,
    },
  ];

  return (
    <Segmented
      options={options}
      value={value}
      onChange={onChange}
      disabled={disabled}
      block
      className="course-status-segmented"
    />
  );
};

export default CustomRadioGroup;
