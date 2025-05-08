import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Typography,
  Button,
  Space,
  TimePicker,
  Tag,
  Table,
  Spin,
  message
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseGroup, ScheduleTime } from '@/pages/student/types/student';
import { courseTypeOptions, weekdayOptions, studentStatusOptions } from '@/pages/student/constants/options';
import { SimpleCourse } from '@/api/course/types';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './EnrollmentModal.css';

const { Option } = Select;
const { Title, Text } = Typography;

// 辅助函数：检查是否有重复的排课时间，返回冲突的时间段或null
const hasDuplicateScheduleTime = (scheduleTimes: ScheduleTime[], newTime: ScheduleTime): ScheduleTime | null => {
  const conflictTime = scheduleTimes.find(time =>
    time.weekday === newTime.weekday &&
    time.time === newTime.time &&
    time.endTime === newTime.endTime
  );
  return conflictTime || null;
};

// 辅助函数：生成不冲突的时间段，将开始时间推后1小时
const generateNonConflictingTime = (scheduleTimes: ScheduleTime[], baseTime: ScheduleTime): ScheduleTime => {
  let newTime = { ...baseTime };
  let isConflict = true;
  let attempts = 0;
  const maxAttempts = 24; // 最多尝试24次，避免无限循环

  while (isConflict && attempts < maxAttempts) {
    // 解析当前时间
    const [hours, minutes] = newTime.time.split(':').map(Number);

    // 计算新的开始时间（推后1小时）
    let newHours = hours + 1;
    if (newHours >= 24) {
      newHours = newHours % 24;
    }

    // 格式化新的开始时间
    const newStartTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    // 如果有结束时间，也相应调整
    let newEndTime = undefined;
    if (newTime.endTime) {
      const [endHours, endMinutes] = newTime.endTime.split(':').map(Number);
      let newEndHours = endHours + 1;
      if (newEndHours >= 24) {
        newEndHours = newEndHours % 24;
      }
      newEndTime = `${String(newEndHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }

    // 更新时间
    newTime = {
      ...newTime,
      time: newStartTime,
      endTime: newEndTime
    };

    // 检查新时间是否冲突
    isConflict = !!hasDuplicateScheduleTime(scheduleTimes, newTime);
    attempts++;
  }

  return newTime;
};

interface StudentFormModalProps {
  visible: boolean;
  form: FormInstance;
  editingStudent: Student | null;
  courseGroups: CourseGroup[];
  tempCourseGroup: CourseGroup | null;
  currentEditingGroupIndex: number | null;
  isEditing: boolean;
  onCancel: () => void;
  onSubmit: () => Promise<boolean>;
  updateTempCourseGroup: (field: keyof CourseGroup, value: any) => void;
  updateCourseGroup: (index: number, field: keyof CourseGroup, value: any) => void;
  confirmAddCourseGroup: () => boolean;
  cancelAddCourseGroup: () => void;
  editCourseGroup: (index: number) => boolean;
  removeCourseGroup: (key: string) => void;
  startAddCourseGroup: () => boolean;
  courseList: SimpleCourse[];
  loadingCourses: boolean;
  loading: boolean;
}

const StudentFormModal: React.FC<StudentFormModalProps> = ({
  visible,
  form,
  editingStudent,
  courseGroups,
  tempCourseGroup,
  currentEditingGroupIndex,
  isEditing,
  onCancel,
  onSubmit,
  updateTempCourseGroup,
  updateCourseGroup,
  confirmAddCourseGroup,
  cancelAddCourseGroup,
  editCourseGroup,
  removeCourseGroup,
  startAddCourseGroup,
  courseList,
  loadingCourses,
  loading
}) => {
  const [courseSearchValue, setCourseSearchValue] = useState('');

  useEffect(() => {
    setCourseSearchValue('');
  }, [visible, currentEditingGroupIndex, tempCourseGroup]);

  // 获取已选择的课程ID列表，用于禁用已选课程
  const getSelectedCourseIds = (excludeIndex?: number): string[] => {
    return courseGroups
      .filter((_, index) => index !== excludeIndex) // 排除当前正在编辑的课程组
      .map(group => group.courses && group.courses.length > 0 ? String(group.courses[0]) : '')
      .filter(id => id); // 过滤掉空值
  };
  // 渲染课程组表格
  const renderCourseGroupTable = () => {
    // 如果没有有效数据（至少有一条记录且有课程信息），则不渲染表格
    const hasValidData = courseGroups.some(group =>
      group.courses && group.courses.length > 0 && group.courses[0]
    );

    if (!hasValidData) {
      return null;
    }

    return (
      <div style={{ marginBottom: 16 }}>
        <Table
          dataSource={courseGroups.filter(group => group.courses && group.courses.length > 0 && group.courses[0])}
          rowKey="key"
          pagination={false}
          size="small"
          className="centered-table"
          columns={[
            {
              title: '报名课程',
              dataIndex: 'courses',
              align: 'center',
              render: (courses, record) => {
                const courseId = courses && courses.length > 0 ? String(courses[0]) : '';
                console.log('表格中的课程ID:', courseId);

                // 1. 首先检查是否有originalCourseName属性（在选择课程时保存的）
                if (record.originalCourseName) {
                  return record.originalCourseName;
                }

                // 2. 尝试从课程列表中查找 - 使用精确匹配
                const foundCourse = courseList.find(c => String(c.id) === courseId);
                if (foundCourse) {
                  return foundCourse.name;
                }

                // 3. 尝试从课程列表中查找 - 使用数字匹配
                if (courseId && !isNaN(Number(courseId))) {
                  const numericCourse = courseList.find(c => Number(c.id) === Number(courseId));
                  if (numericCourse) {
                    return numericCourse.name;
                  }
                }

                // 4. 如果找不到，尝试从模拟数据中查找
                const mockCourseNames = {
                  'basketball': '篮球训练',
                  'swimming': '游泳课程',
                  'tennis': '网球培训',
                  'painting': '绘画班',
                  'piano': '钢琴培训'
                };

                // 5. 如果是数字ID，显示为"未知课程"
                if (courseId && !isNaN(Number(courseId))) {
                  return `未知课程 (ID: ${courseId})`;
                }

                return mockCourseNames[courseId as keyof typeof mockCourseNames] || courseId || '-';
              }
            },
            {
              title: '课程类型',
              dataIndex: 'courseType',
              align: 'center',
              render: (type) => courseTypeOptions.find(t => t.value === type)?.label || type || '-'
            },
            {
              title: '教练',
              dataIndex: 'coach',
              align: 'center'
            },
            {
              title: '固定排课时间',
              dataIndex: 'scheduleTimes',
              align: 'center',
              render: (times: ScheduleTime[]) => times && times.length > 0
                ? (
                  <div>
                    {times.map((t, index) => {
                      // Find the label corresponding to the stored weekday value
                      const weekdayLabel = weekdayOptions.find(opt => opt.value === t.weekday)?.label || `周${t.weekday}`; // Fallback if not found
                      return (
                        <div key={index} style={{ marginBottom: index < times.length - 1 ? '4px' : 0 }}>
                          {`${weekdayLabel} ${t.time}${t.endTime ? `-${t.endTime}` : ''}`}
                        </div>
                      );
                    })}
                  </div>
                )
                : '无'
            },
            {
              title: '操作',
              width: 150,
              align: 'center',
              render: (_, __, index) => (
                <Space>
                  <Button
                    type="link"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => editCourseGroup(index)}
                    disabled={isEditing} // 如果正在编辑，禁用按钮
                  >
                    编辑
                  </Button>
                  <Button
                    type="link"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeCourseGroup(courseGroups[index].key)}
                    disabled={isEditing} // 如果正在编辑，禁用按钮
                  >
                    删除
                  </Button>
                </Space>
              )
            }
          ]}
        />
      </div>
    );
  };

  // 渲染课程编辑表单 - 针对已有课程组的编辑
  const renderCourseEditForm = (group: CourseGroup, index: number) => {
    return (
      <div
        key={group.key}
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          background: '#fafafa'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>报名课程</Title>
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="报名课程"
              required
            >
              <Select
                placeholder={courseSearchValue ? undefined : "请选择课程"}
                value={group.courses && group.courses.length > 0 ? group.courses[0] : undefined}
                onChange={(value) => {
                  console.log('选择课程，原始值:', value, '类型:', typeof value);

                  // Ensure value is treated as string for comparison
                  const selectedCourseId = value ? String(value) : null;
                  console.log('转换后的课程ID:', selectedCourseId);

                  // 查找匹配的课程 - 精确匹配
                  let selectedCourse = courseList.find(c => String(c.id) === selectedCourseId);

                  // 如果没找到，尝试数字匹配
                  if (!selectedCourse && selectedCourseId && !isNaN(Number(selectedCourseId))) {
                    selectedCourse = courseList.find(c => Number(c.id) === Number(selectedCourseId));
                  }

                  console.log('找到的课程:', selectedCourse);

                  if (selectedCourse) {
                    const courseId = String(selectedCourse.id);
                    console.log('使用课程ID:', courseId);

                    // 保存完整课程对象到控制台，便于调试
                    console.log('课程完整信息:', selectedCourse);

                    // Provide default empty string if typeName is missing
                    const courseType = selectedCourse.typeName || '';
                    // Provide default or handle missing coaches gracefully
                    const coachName = selectedCourse.coaches && selectedCourse.coaches.length > 0
                                      ? selectedCourse.coaches[0].name
                                      : '无'; // Or handle as needed, e.g., ''

                    updateCourseGroup(index, 'courses', [courseId]);
                    updateCourseGroup(index, 'courseType', courseType);
                    updateCourseGroup(index, 'coach', coachName);
                    // 保存原始课程名称，用于后续API调用和显示
                    updateCourseGroup(index, 'originalCourseName', selectedCourse.name);
                    // 保存原始教练名称，如果有的话
                    if (selectedCourse.coaches && selectedCourse.coaches.length > 0) {
                      updateCourseGroup(index, 'originalCoachName', selectedCourse.coaches[0].name);
                    }

                  } else {
                    // Clear fields if no course is selected or found
                    updateCourseGroup(index, 'courses', selectedCourseId ? [selectedCourseId] : []);
                    updateCourseGroup(index, 'courseType', '');
                    updateCourseGroup(index, 'coach', '');
                    // 如果有课程ID但找不到对应课程，设置一个默认名称
                    if (selectedCourseId) {
                      updateCourseGroup(index, 'originalCourseName', `未知课程 (ID: ${selectedCourseId})`);
                    } else {
                      updateCourseGroup(index, 'originalCourseName', undefined);
                    }
                  }
                  setCourseSearchValue('');
                }}
                style={{ width: '100%' }}
                showSearch
                allowClear
                onSearch={setCourseSearchValue}
                optionFilterProp="children"
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement || document.body}
                dropdownStyle={{ zIndex: 1060 }}
                loading={loadingCourses}
              >
                {courseList && courseList.length > 0 ? (
                  courseList
                    .filter(course => course.status === 'PUBLISHED' || course.status === '1')
                    .map(course => {
                    // 获取已选课程ID列表，排除当前正在编辑的课程组
                    const selectedCourseIds = getSelectedCourseIds(currentEditingGroupIndex !== null ? currentEditingGroupIndex : undefined);
                    // 检查当前课程是否已被选择
                    const isDisabled = selectedCourseIds.includes(String(course.id));

                    return (
                      <Option
                        key={course.id}
                        value={course.id.toString()}
                        disabled={isDisabled}
                      >
                        {course.name}
                      </Option>
                    );
                  })
                ) : (
                  // 如果课程列表为空，显示模拟数据
                  (() => {
                    const mockCourses = [
                      { id: "basketball", name: "篮球训练" },
                      { id: "swimming", name: "游泳课程" },
                      { id: "tennis", name: "网球培训" },
                      { id: "painting", name: "绘画班" },
                      { id: "piano", name: "钢琴培训" }
                    ];
                    // 获取已选课程ID列表
                    const selectedCourseIds = getSelectedCourseIds();

                    return mockCourses.map(course => (
                      <Option
                        key={course.id}
                        value={course.id}
                        disabled={selectedCourseIds.includes(String(course.id))}
                      >
                        {course.name}
                      </Option>
                    ));
                  })()
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="课程类型"
            >
              <Input
                value={group.courseType || ''}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="上课教练"
            >
              <Input
                value={group.coach || ''}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="报名日期"
              required
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="选择报名日期"
                format="YYYY-MM-DD"
                value={dayjs(group.enrollDate)}
                onChange={(date) => updateCourseGroup(index, 'enrollDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 排课时间 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text strong>固定排课时间（非必填）</Text>
            <Button
              type="link"
              onClick={() => {
                const baseTime = { weekday: '一', time: '15:00', endTime: '16:00' };
                const currentScheduleTimes = group.scheduleTimes || [];

                // 检查是否有重复的排课时间
                const conflictTime = hasDuplicateScheduleTime(currentScheduleTimes, baseTime);

                if (conflictTime) {
                  // 生成不冲突的时间段
                  const nonConflictingTime = generateNonConflictingTime(currentScheduleTimes, baseTime);
                  const newScheduleTimes = [...currentScheduleTimes, nonConflictingTime];
                  updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                } else {
                  // 没有冲突，直接添加
                  const newScheduleTimes = [...currentScheduleTimes, baseTime];
                  updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                }
              }}
              icon={<PlusOutlined />}
            >
              添加时间
            </Button>
          </div>
          {(group.scheduleTimes || []).map((scheduleTime, timeIndex) => (
            <Row gutter={16} key={timeIndex} style={{ marginBottom: 16, alignItems: 'center' }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  value={scheduleTime.weekday}
                  onChange={(value) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    const oldTime = {...newScheduleTimes[timeIndex]};
                    const newTime = {...oldTime, weekday: value};

                    // 检查修改后是否会与其他时间段重复
                    const otherTimes = newScheduleTimes.filter((_, idx) => idx !== timeIndex);
                    if (hasDuplicateScheduleTime(otherTimes, newTime)) {
                      message.warning('修改后的排课时间与已有时间重复');
                      return;
                    }

                    newScheduleTimes[timeIndex].weekday = value;
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                  getPopupContainer={triggerNode => triggerNode.parentNode || document.body}
                >
                  {weekdayOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={7}>
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  value={scheduleTime.time ? dayjs(scheduleTime.time, 'HH:mm') : null}
                  onChange={(time) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    const oldTime = {...newScheduleTimes[timeIndex]};
                    const newTime = {...oldTime, time: time ? time.format('HH:mm') : '00:00'};

                    // 检查修改后是否会与其他时间段重复
                    const otherTimes = newScheduleTimes.filter((_, idx) => idx !== timeIndex);
                    const conflictTime = hasDuplicateScheduleTime(otherTimes, newTime);

                    if (conflictTime) {
                      // 生成不冲突的时间段
                      const nonConflictingTime = generateNonConflictingTime(otherTimes, newTime);

                      // 更新时间
                      newScheduleTimes[timeIndex] = nonConflictingTime;
                    } else {
                      // 没有冲突，直接更新
                      newScheduleTimes[timeIndex].time = time ? time.format('HH:mm') : '00:00';
                    }

                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={1} style={{ textAlign: 'center' }}>
                -
              </Col>
              <Col span={7}>
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  value={scheduleTime.endTime ? dayjs(scheduleTime.endTime, 'HH:mm') : null}
                  onChange={(time) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    const oldTime = {...newScheduleTimes[timeIndex]};
                    const newTime = {...oldTime, endTime: time ? time.format('HH:mm') : undefined};

                    // 检查修改后是否会与其他时间段重复
                    const otherTimes = newScheduleTimes.filter((_, idx) => idx !== timeIndex);
                    const conflictTime = hasDuplicateScheduleTime(otherTimes, newTime);

                    if (conflictTime) {
                      // 生成不冲突的时间段
                      const nonConflictingTime = generateNonConflictingTime(otherTimes, newTime);

                      // 更新时间
                      newScheduleTimes[timeIndex] = nonConflictingTime;
                    } else {
                      // 没有冲突，直接更新
                      newScheduleTimes[timeIndex].endTime = time ? time.format('HH:mm') : undefined;
                    }

                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    newScheduleTimes.splice(timeIndex, 1);
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
            </Row>
          ))}
          {(group.scheduleTimes || []).length === 0 && (
            <Text type="secondary">暂无排课时间，点击上方"添加时间"按钮添加</Text>
          )}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <Space>
            <Button
              onClick={() => {
                setCourseSearchValue('');
                cancelAddCourseGroup();
              }}
              size="small"
              className="enrollment-cancel-btn"
            >
              取消
            </Button>
            <Button
              onClick={() => {
                if (confirmAddCourseGroup()) {
                  setCourseSearchValue('');
                }
              }}
              size="small"
              className="enrollment-confirm-btn"
            >
              确定
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  // 渲染临时课程编辑表单 - 针对新添加的课程
  const renderTempCourseEditForm = () => {
    if (!tempCourseGroup) return null;

    return (
      <div
        key={tempCourseGroup.key}
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '16px',
          background: '#fafafa'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
          <Title level={5} style={{ margin: 0 }}>报名课程</Title>
        </div>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="报名课程"
              required
            >
              <Select
                placeholder={courseSearchValue ? undefined : "请选择课程"}
                value={tempCourseGroup.courses && tempCourseGroup.courses.length > 0 ? tempCourseGroup.courses[0] : undefined}
                onChange={(value) => {
                  console.log('选择临时课程，原始值:', value, '类型:', typeof value);

                  // Ensure value is treated as string for comparison
                  const selectedCourseId = value ? String(value) : null;
                  console.log('转换后的课程ID:', selectedCourseId);

                  // 查找匹配的课程 - 精确匹配
                  let selectedCourse = courseList.find(c => String(c.id) === selectedCourseId);

                  // 如果没找到，尝试数字匹配
                  if (!selectedCourse && selectedCourseId && !isNaN(Number(selectedCourseId))) {
                    selectedCourse = courseList.find(c => Number(c.id) === Number(selectedCourseId));
                  }

                  console.log('找到的课程:', selectedCourse);

                  if (selectedCourse) {
                    const courseId = String(selectedCourse.id);
                    console.log('使用课程ID:', courseId);

                    // 保存完整课程对象到控制台，便于调试
                    console.log('课程完整信息:', selectedCourse);

                    // Provide default empty string if typeName is missing
                    const courseType = selectedCourse.typeName || '';
                    // Provide default or handle missing coaches gracefully
                    const coachName = selectedCourse.coaches && selectedCourse.coaches.length > 0
                                      ? selectedCourse.coaches[0].name
                                      : '无'; // Or handle as needed, e.g., ''

                    // 更新临时课程组数据
                    updateTempCourseGroup('courses', [courseId]);
                    updateTempCourseGroup('courseType', courseType);
                    updateTempCourseGroup('coach', coachName);
                    // 保存原始课程名称，用于后续API调用和显示
                    updateTempCourseGroup('originalCourseName', selectedCourse.name);
                    // 保存原始教练名称，如果有的话
                    if (selectedCourse.coaches && selectedCourse.coaches.length > 0) {
                      updateTempCourseGroup('originalCoachName', selectedCourse.coaches[0].name);
                    }
                  } else {
                    // Clear fields if no course is selected or found
                    updateTempCourseGroup('courses', selectedCourseId ? [selectedCourseId] : []);
                    updateTempCourseGroup('courseType', '');
                    updateTempCourseGroup('coach', '');
                    // 如果有课程ID但找不到对应课程，设置一个默认名称
                    if (selectedCourseId) {
                      updateTempCourseGroup('originalCourseName', `未知课程 (ID: ${selectedCourseId})`);
                    } else {
                      updateTempCourseGroup('originalCourseName', undefined);
                    }
                  }
                  setCourseSearchValue('');
                }}
                style={{ width: '100%' }}
                showSearch
                allowClear
                onSearch={setCourseSearchValue}
                optionFilterProp="children"
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement || document.body}
                dropdownStyle={{ zIndex: 1060 }}
                loading={loadingCourses}
              >
                {courseList && courseList.length > 0 ? (
                  courseList
                    .filter(course => course.status === 'PUBLISHED' || course.status === '1')
                    .map(course => {
                    // 获取已选课程ID列表，排除当前正在编辑的课程组
                    const selectedCourseIds = getSelectedCourseIds(currentEditingGroupIndex !== null ? currentEditingGroupIndex : undefined);
                    // 检查当前课程是否已被选择
                    const isDisabled = selectedCourseIds.includes(String(course.id));

                    return (
                      <Option
                        key={course.id}
                        value={course.id.toString()}
                        disabled={isDisabled}
                      >
                        {course.name}
                      </Option>
                    );
                  })
                ) : (
                  // 如果课程列表为空，显示模拟数据
                  (() => {
                    const mockCourses = [
                      { id: "basketball", name: "篮球训练" },
                      { id: "swimming", name: "游泳课程" },
                      { id: "tennis", name: "网球培训" },
                      { id: "painting", name: "绘画班" },
                      { id: "piano", name: "钢琴培训" }
                    ];
                    // 获取已选课程ID列表
                    const selectedCourseIds = getSelectedCourseIds();

                    return mockCourses.map(course => (
                      <Option
                        key={course.id}
                        value={course.id}
                        disabled={selectedCourseIds.includes(String(course.id))}
                      >
                        {course.name}
                      </Option>
                    ));
                  })()
                )}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="课程类型"
            >
              <Input
                value={tempCourseGroup.courseType || ''}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="上课教练"
            >
              <Input
                value={tempCourseGroup.coach || ''}
                disabled
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="报名日期"
              required
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="选择报名日期"
                format="YYYY-MM-DD"
                value={dayjs(tempCourseGroup.enrollDate)}
                onChange={(date) => updateTempCourseGroup('enrollDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 排课时间 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text strong>固定排课时间（非必填）</Text>
            <Button
              type="link"
              onClick={() => {
                const baseTime = { weekday: '一', time: '15:00', endTime: '16:00' };
                const currentScheduleTimes = tempCourseGroup.scheduleTimes || [];

                // 检查是否有重复的排课时间
                const conflictTime = hasDuplicateScheduleTime(currentScheduleTimes, baseTime);

                if (conflictTime) {
                  // 生成不冲突的时间段
                  const nonConflictingTime = generateNonConflictingTime(currentScheduleTimes, baseTime);
                  const newScheduleTimes = [...currentScheduleTimes, nonConflictingTime];
                  updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                } else {
                  // 没有冲突，直接添加
                  const newScheduleTimes = [...currentScheduleTimes, baseTime];
                  updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                }
              }}
              icon={<PlusOutlined />}
            >
              添加时间
            </Button>
          </div>
          {(tempCourseGroup.scheduleTimes || []).map((scheduleTime, timeIndex) => (
            <Row gutter={16} key={timeIndex} style={{ marginBottom: 16, alignItems: 'center' }}>
              <Col span={6}>
                <Select
                  style={{ width: '100%' }}
                  value={scheduleTime.weekday}
                  onChange={(value) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    const oldTime = {...newScheduleTimes[timeIndex]};
                    const newTime = {...oldTime, weekday: value};

                    // 检查修改后是否会与其他时间段重复
                    const otherTimes = newScheduleTimes.filter((_, idx) => idx !== timeIndex);
                    if (hasDuplicateScheduleTime(otherTimes, newTime)) {
                      message.warning('修改后的排课时间与已有时间重复');
                      return;
                    }

                    newScheduleTimes[timeIndex].weekday = value;
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                  getPopupContainer={triggerNode => triggerNode.parentNode || document.body}
                >
                  {weekdayOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={7}>
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  value={scheduleTime.time ? dayjs(scheduleTime.time, 'HH:mm') : null}
                  onChange={(time) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    const oldTime = {...newScheduleTimes[timeIndex]};
                    const newTime = {...oldTime, time: time ? time.format('HH:mm') : '00:00'};

                    // 检查修改后是否会与其他时间段重复
                    const otherTimes = newScheduleTimes.filter((_, idx) => idx !== timeIndex);
                    const conflictTime = hasDuplicateScheduleTime(otherTimes, newTime);

                    if (conflictTime) {
                      // 生成不冲突的时间段
                      const nonConflictingTime = generateNonConflictingTime(otherTimes, newTime);

                      // 更新时间
                      newScheduleTimes[timeIndex] = nonConflictingTime;
                    } else {
                      // 没有冲突，直接更新
                      newScheduleTimes[timeIndex].time = time ? time.format('HH:mm') : '00:00';
                    }

                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={1} style={{ textAlign: 'center' }}>
                -
              </Col>
              <Col span={7}>
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  value={scheduleTime.endTime ? dayjs(scheduleTime.endTime, 'HH:mm') : null}
                  onChange={(time) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    const oldTime = {...newScheduleTimes[timeIndex]};
                    const newTime = {...oldTime, endTime: time ? time.format('HH:mm') : undefined};

                    // 检查修改后是否会与其他时间段重复
                    const otherTimes = newScheduleTimes.filter((_, idx) => idx !== timeIndex);
                    const conflictTime = hasDuplicateScheduleTime(otherTimes, newTime);

                    if (conflictTime) {
                      // 生成不冲突的时间段
                      const nonConflictingTime = generateNonConflictingTime(otherTimes, newTime);

                      // 更新时间
                      newScheduleTimes[timeIndex] = nonConflictingTime;
                    } else {
                      // 没有冲突，直接更新
                      newScheduleTimes[timeIndex].endTime = time ? time.format('HH:mm') : undefined;
                    }

                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    newScheduleTimes.splice(timeIndex, 1);
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
            </Row>
          ))}
          {(tempCourseGroup.scheduleTimes || []).length === 0 && (
            <Text type="secondary">暂无排课时间，点击上方"添加时间"按钮添加</Text>
          )}
        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <Space>
            <Button
              onClick={() => {
                setCourseSearchValue('');
                cancelAddCourseGroup();
              }}
              size="small"
              className="enrollment-cancel-btn"
            >
              取消
            </Button>
            <Button
              onClick={() => {
                if (confirmAddCourseGroup()) {
                  setCourseSearchValue('');
                }
              }}
              size="small"
              className="enrollment-confirm-btn"
            >
              确定
            </Button>
          </Space>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
          {editingStudent ? '编辑学员' : '添加学员'}
        </span>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      confirmLoading={loading}
      maskClosable={!loading}
      keyboard={!loading}
      footer={[
        <Button
          key="back"
          onClick={onCancel}
          disabled={loading}
          className="enrollment-cancel-btn"
        >
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onSubmit}
          loading={loading}
          className="enrollment-confirm-btn"
        >
          {editingStudent ? '更新学员' : '添加学员'}
        </Button>
      ]}
    >
      <Spin spinning={loading} tip="正在提交...">
        <Form
          form={form}
          layout="vertical"
          name="studentForm"
          initialValues={{
            gender: 'male',
            status: undefined
          }}
        >
          <Title level={5}>基本信息</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="学员姓名"
                rules={[{ required: true, message: '请输入学员姓名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="请输入学员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="gender"
                label="性别"
                rules={[{ required: true, message: '请选择性别' }]}
              >
                <Select
                  placeholder="请选择性别"
                  style={{ width: '100%' }}
                  getPopupContainer={triggerNode => triggerNode.parentNode || document.body}
                >
                  <Option value="male">男</Option>
                  <Option value="female">女</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="age"
                label="年龄"
                rules={[
                  { required: true, message: '请输入年龄' },
                  { type: 'number', min: 1, message: '年龄必须是正整数', transform: (value) => Number(value) },
                ]}
                className="age-form-item"
              >
                <Input type="number" placeholder="请输入年龄" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
                rules={[
                  { required: true, message: '请输入联系电话' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号码' }
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
          </Row>

          {/* <Divider style={{ margin: '24px 0' }} /> */}

          {/* 课程信息 */}
          <Row gutter={16} style={{ marginTop: '24px' }}>
            <Col span={24}>
              <Space align="center" size="middle" style={{ marginBottom: 16 }}>
                <Title level={5} style={{ margin: 0 }}>报名课程</Title>
                <Button
                  type="default"
                  icon={<PlusOutlined />}
                  onClick={() => startAddCourseGroup()}
                  disabled={currentEditingGroupIndex !== null || tempCourseGroup !== null}
                >
                  添加课程
                </Button>
              </Space>

              {/* 显示已确认的课程组表格 */}
              {courseGroups.length > 0 && renderCourseGroupTable()}

              {/* 显示当前编辑中的已有课程组表单 */}
              {currentEditingGroupIndex !== null &&
                renderCourseEditForm(courseGroups[currentEditingGroupIndex], currentEditingGroupIndex)}

              {/* 显示正在添加的临时课程组表单 */}
              {tempCourseGroup && renderTempCourseEditForm()}
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default StudentFormModal;