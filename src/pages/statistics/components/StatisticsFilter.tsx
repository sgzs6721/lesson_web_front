import React from 'react';
import { Select, Button } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

interface StatisticsFilterProps {
  campus: string;
  onCampusChange: (value: string) => void;
  onApplyFilters: (filters: any) => void;
  onResetFilters: () => void;
}

const StatisticsFilter: React.FC<StatisticsFilterProps> = ({
  campus,
  onCampusChange,
  onApplyFilters,
  onResetFilters
}) => {
  return (
    <div className="filter-section">
      <div className="filter-item">
        <label htmlFor="campusFilter">校区：</label>
        <Select
          id="campusFilter"
          value={campus}
          onChange={onCampusChange}
          style={{ width: 180 }}
        >
          <Option value="all">所有校区</Option>
          <Option value="headquarters">总部校区</Option>
          <Option value="east">东城校区</Option>
          <Option value="west">西城校区</Option>
          <Option value="south">南城校区</Option>
          <Option value="north">北城校区</Option>
        </Select>
      </div>
      <div className="filter-item">
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => onApplyFilters({ campus })}
        >
          应用筛选
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          icon={<ReloadOutlined />}
          onClick={onResetFilters}
        >
          重置
        </Button>
      </div>
    </div>
  );
};

export default StatisticsFilter; 