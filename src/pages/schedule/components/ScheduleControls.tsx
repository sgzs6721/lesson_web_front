import React from 'react';
import { Select, Form, Tag } from 'antd';

interface Coach {
  id: string;
  name: string;
  color: string;
}

interface CourseType {
  id: string;
  name: string;
  color: string;
}

interface ScheduleControlsProps {
  coaches: Coach[];
  courseTypes: CourseType[];
  selectedCoach: string[];
  selectedCourseType: string[];
  selectedType: string[];
  onCoachChange: (coachIds: string[]) => void;
  onCourseTypeChange: (courseTypeIds: string[]) => void;
  onTypeChange: (typeIds: string[]) => void;
}

const ScheduleControls: React.FC<ScheduleControlsProps> = ({
  coaches,
  courseTypes,
  selectedCoach,
  selectedCourseType,
  selectedType = [],
  onCoachChange,
  onCourseTypeChange,
  onTypeChange
}) => {
  // 创建自定义下拉选项渲染函数，显示教练颜色图例
  const renderCoachOption = (option: any) => {
    const { data, value } = option;
    const isSelected = selectedCoach.includes(value);
    
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '8px 12px',
        borderRadius: '4px',
        backgroundColor: isSelected ? '#f0f7ff' : 'transparent'
      }}>
        {isSelected && <span style={{ color: '#4096ff', fontWeight: 'bold', marginRight: '6px' }}>✓</span>}
        <span style={{ 
          display: 'inline-block', 
          width: '20px', 
          height: '20px', 
          backgroundColor: data.color, 
          marginRight: '8px', 
          borderRadius: '2px'
        }} />
        <span>{data.label}</span>
      </div>
    );
  };

  // 自定义标签渲染，带颜色
  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const coach = coaches.find(c => c.id === value);
    const color = coach?.color || '#ccc';
    
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ 
          display: 'inline-flex',
          alignItems: 'center',
          padding: '1px 8px',
          paddingLeft: '4px',
          backgroundColor: '#f7f9fa',
          borderColor: '#e9e9e9',
          color: '#333',
          margin: '2px',
          borderRadius: '4px'
        }}
      >
        <span 
          style={{ 
            display: 'inline-block',
            width: '20px',
            height: '20px',
            backgroundColor: color,
            marginRight: '6px',
            borderRadius: '2px'
          }}
        />
        {label}
      </Tag>
    );
  };

  return (
    <div className="schedule-controls">
      <Form className="filter-form">
        <div className="filter-group">
          <Form.Item label="教练:" className="filter-item">
            <Select
              placeholder="选择教练"
              value={selectedCoach}
              onChange={onCoachChange}
              allowClear
              mode="multiple"
              maxTagCount={2}
              tagRender={tagRender}
              listHeight={270}
              dropdownStyle={{ padding: '8px 0' }}
              dropdownMatchSelectWidth={false}
              dropdownClassName="coach-dropdown"
              optionLabelProp="label"
              optionFilterProp="label"
            >
              {coaches.map(coach => (
                <Select.Option 
                  key={coach.id} 
                  value={coach.id} 
                  label={coach.name}
                  data={coach}
                >
                  {renderCoachOption({ data: { label: coach.name, color: coach.color }, value: coach.id })}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="课程:" className="filter-item">
            <Select
              placeholder="选择课程"
              value={selectedCourseType}
              onChange={onCourseTypeChange}
              allowClear
              mode="multiple"
              maxTagCount={2}
              options={courseTypes.map(type => ({
                value: type.id,
                label: type.name
              }))}
            />
          </Form.Item>
          <Form.Item label="类型:" className="filter-item">
            <Select
              placeholder="选择类型"
              value={selectedType}
              onChange={onTypeChange}
              allowClear
              mode="multiple"
              maxTagCount={2}
              options={[
                { value: 'type1', label: '少儿街舞' },
                { value: 'type2', label: '有氧训练' },
                { value: 'type3', label: '力量训练' },
                { value: 'type4', label: '高温瑜伽' },
                { value: 'type5', label: '初级瑜伽' },
                { value: 'type6', label: '私教课程' }
              ]}
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default ScheduleControls; 