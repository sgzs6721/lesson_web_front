import React from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
        <Radio value="active">开课中</Radio>
        <Radio value="inactive">已停课</Radio>
        <Radio value="pending">待开课</Radio>
      </Radio.Group>

      {/* 自定义样式的单选框 */}
      <div className="custom-radio-group">
        <div
          className={`custom-radio-button active-status ${value === 'active' ? 'active' : ''}`}
          onClick={() => handleClick('active')}
        >
          <CheckCircleOutlined className="radio-icon" /> 开课中
        </div>
        <div
          className={`custom-radio-button inactive-status ${value === 'inactive' ? 'active' : ''}`}
          onClick={() => handleClick('inactive')}
        >
          <CloseCircleOutlined className="radio-icon" /> 已停课
        </div>
        <div
          className={`custom-radio-button pending-status ${value === 'pending' ? 'active' : ''}`}
          onClick={() => handleClick('pending')}
        >
          <ClockCircleOutlined className="radio-icon" /> 待开课
        </div>
      </div>
    </div>
  );
};

export default CustomRadioGroup;
