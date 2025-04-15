import React, { useEffect } from 'react';
import { Select } from 'antd';
import type { SelectProps } from 'antd';
import './CustomSelect.css';

interface CustomSelectProps extends SelectProps {
  defaultText?: string;
  forcedValue?: string;
}

/**
 * 自定义Select组件，强制显示默认值或占位符
 */
const CustomSelect: React.FC<CustomSelectProps> = ({
  defaultText,
  forcedValue,
  placeholder,
  options = [],
  value,
  ...props
}) => {
  // 强制设置默认值
  useEffect(() => {
    if (forcedValue && props.onChange) {
      // 如果有强制值，则触发onChange事件
      setTimeout(() => {
        // 确保 onChange 是函数类型
        if (typeof props.onChange === 'function') {
          props.onChange(forcedValue, {
            value: forcedValue,
            label: defaultText || options.find((opt: any) => opt.value === forcedValue)?.label || forcedValue
          });
        }
      }, 100);
    }
  }, [forcedValue, props.onChange, defaultText, options]);

  // 判断是否显示占位符
  const showPlaceholder = !value && !forcedValue;

  return (
    <Select
      placeholder={placeholder}
      options={options}
      {...props}
      className={`custom-select ${showPlaceholder ? 'show-placeholder' : ''}`}
      dropdownMatchSelectWidth={true}
      listHeight={256}
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
    />
  );
};

export default CustomSelect;
