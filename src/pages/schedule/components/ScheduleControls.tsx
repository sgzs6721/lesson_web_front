import React from 'react';
import { Select, Form, Space } from 'antd';

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
  return (
    <div className="schedule-controls">
      <Form layout="inline">
        <Space className="filter-group">
          <Form.Item label="教练:">
            <Select
              placeholder="选择教练"
              value={selectedCoach}
              onChange={onCoachChange}
              allowClear
              mode="multiple"
              maxTagCount={2}
              options={coaches.map(coach => ({
                value: coach.id,
                label: coach.name
              }))}
            />
          </Form.Item>
          <Form.Item label="课程:">
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
          <Form.Item label="类型:">
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
        </Space>
      </Form>
    </div>
  );
};

export default ScheduleControls; 