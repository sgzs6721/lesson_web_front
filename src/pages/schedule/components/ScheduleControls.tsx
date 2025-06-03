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
  // 简化的教练标签渲染函数
  const tagRender = (props: any) => {
    const { label, value, closable, onClose } = props;
    const coach = coaches.find(c => c.id === value);
    const color = coach?.color || '#1890ff';
    
    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{ 
          backgroundColor: `${color}15`,
          borderColor: `${color}40`,
          color: color,
          borderRadius: '4px',
          margin: '2px 4px 2px 0',
          fontSize: '12px',
          lineHeight: '20px',
          height: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0 8px'
        }}
      >
        <span 
          style={{ 
            display: 'inline-block',
            width: '8px',
            height: '8px',
            backgroundColor: color,
            marginRight: '4px',
            borderRadius: '50%'
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
              maxTagCount={3}
              tagRender={tagRender}
              style={{ minWidth: '200px' }}
              dropdownStyle={{ maxHeight: '300px' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
            >
              {coaches.map(coach => (
                <Select.Option 
                  key={coach.id} 
                  value={coach.id}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span 
                      style={{ 
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        backgroundColor: coach.color,
                        marginRight: '8px',
                        borderRadius: '50%'
                      }}
                    />
                    {coach.name}
                  </div>
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
              maxTagCount={3}
              style={{ minWidth: '200px' }}
              dropdownStyle={{ maxHeight: '300px' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
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
              maxTagCount={3}
              style={{ minWidth: '200px' }}
              dropdownStyle={{ maxHeight: '300px' }}
              getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
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