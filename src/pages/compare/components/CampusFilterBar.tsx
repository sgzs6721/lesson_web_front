import React from 'react';
import { Select, DatePicker, Button, Space } from 'antd';
import { Dayjs } from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface CampusFilterBarProps {
  timeframe: 'month' | 'quarter' | 'year';
  dateRange: [Dayjs | null, Dayjs | null] | null;
  onTimeframeChange: (value: 'month' | 'quarter' | 'year') => void;
  onDateRangeChange: (dates: [Dayjs | null, Dayjs | null] | null) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const CampusFilterBar: React.FC<CampusFilterBarProps> = ({
  timeframe,
  dateRange,
  onTimeframeChange,
  onDateRangeChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-item">
        <label>时间范围：</label>
        <Select 
          value={timeframe} 
          onChange={onTimeframeChange}
          style={{ width: 120 }}
        >
          <Option value="month">本月</Option>
          <Option value="quarter">本季度</Option>
          <Option value="year">本年度</Option>
        </Select>
      </div>
      
      <div className="filter-item">
        <label>具体日期：</label>
        <RangePicker 
          locale={locale}
          value={dateRange as any}
          onChange={onDateRangeChange as any}
        />
      </div>
      
      <div className="filter-item">
        <Space>
          <Button type="primary" onClick={onApplyFilters}>应用筛选</Button>
          <Button onClick={onResetFilters}>重置</Button>
        </Space>
      </div>
    </div>
  );
};

export default CampusFilterBar; 