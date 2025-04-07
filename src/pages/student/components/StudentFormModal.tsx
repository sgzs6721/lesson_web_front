import React from 'react';
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
  Divider,
  TimePicker,
  Tag, 
  Table
} from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseGroup, ScheduleTime } from '@/pages/student/types/student';
import { courseOptions, courseTypeOptions, weekdayOptions } from '@/pages/student/constants/options';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

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
  startAddCourseGroup
}) => {
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
          columns={[
            {
              title: '报名课程',
              dataIndex: 'courses',
              render: (courses) => {
                const courseValue = courses && courses.length > 0 ? courses[0] : '';
                return courseOptions.find(c => c.value === courseValue)?.label || '-';
              }
            },
            {
              title: '课程类型',
              dataIndex: 'courseType',
              render: (type) => courseTypeOptions.find(t => t.value === type)?.label || '-'
            },
            {
              title: '教练',
              dataIndex: 'coach'
            },
            {
              title: '状态',
              dataIndex: 'status',
              render: (status) => {
                let text = '';
                switch (status) {
                  case 'active': text = '在学'; break;
                  case 'inactive': text = '停课'; break;
                  case 'pending': text = '待处理'; break;
                  default: text = status;
                }
                return <Tag color={
                  status === 'active' ? 'green' : 
                  status === 'inactive' ? 'red' : 'orange'
                }>{text}</Tag>;
              }
            },
            {
              title: '固定排课时间',
              dataIndex: 'scheduleTimes',
              render: (times: ScheduleTime[]) => times && times.length > 0 
                ? times.map(t => `周${t.weekday} ${t.time}`).join('、') 
                : '无'
            },
            {
              title: '操作',
              width: 150,
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
          <Col span={12}>
            <Form.Item
              label="报名课程"
              required
            >
              <Select 
                placeholder="请选择课程"
                value={group.courses && group.courses.length > 0 ? group.courses[0] : undefined}
                onChange={(value) => updateCourseGroup(index, 'courses', [value])}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {courseOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <TeamOutlined /> {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="课程类型"
            >
              <Input 
                value={group.courseType ? courseTypeOptions.find(t => t.value === group.courseType)?.label || group.courseType : ''}
                disabled 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上课教练"
            >
              <Input 
                value={group.coach} 
                disabled 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="状态"
              required
            >
              <Select 
                placeholder="请选择"
                value={group.status}
                onChange={(value) => updateCourseGroup(index, 'status', value)}
                style={{ width: '100%' }}
              >
                <Option value="active">在学</Option>
                <Option value="inactive">停课</Option>
                <Option value="pending">待处理</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              label="有效期至"
              required
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择有效期"
                format="YYYY-MM-DD"
                value={dayjs(group.expireDate)}
                onChange={(date) => updateCourseGroup(index, 'expireDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 排课时间 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text strong>固定排课时间</Text>
            <Button 
              type="link" 
              onClick={() => {
                const newScheduleTimes = [...(group.scheduleTimes || []), { weekday: '一', time: '15:00' }];
                updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
              }} 
              icon={<PlusOutlined />}
            >
              添加时间
            </Button>
          </div>
          {(group.scheduleTimes || []).map((scheduleTime, timeIndex) => (
            <Row gutter={16} key={timeIndex} style={{ marginBottom: 16 }}>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  value={scheduleTime.weekday}
                  onChange={(value) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].weekday = value;
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                >
                  {weekdayOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={10}>
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  value={dayjs(scheduleTime.time, 'HH:mm')}
                  onChange={(time) => {
                    const newScheduleTimes = [...(group.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].time = time ? time.format('HH:mm') : '00:00';
                    updateCourseGroup(index, 'scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => {
                    // 允许删除任何排课时间，不再有最少数量限制
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

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => cancelAddCourseGroup()}>
              取消
            </Button>
            <Button type="primary" onClick={() => confirmAddCourseGroup()}>
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
          <Col span={12}>
            <Form.Item
              label="报名课程"
              required
            >
              <Select 
                placeholder="请选择课程"
                value={tempCourseGroup.courses && tempCourseGroup.courses.length > 0 ? tempCourseGroup.courses[0] : undefined}
                onChange={(value) => updateTempCourseGroup('courses', [value])}
                style={{ width: '100%' }}
                showSearch
                optionFilterProp="children"
              >
                {courseOptions.map(option => (
                  <Option key={option.value} value={option.value}>
                    <TeamOutlined /> {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="课程类型"
            >
              <Input 
                value={tempCourseGroup.courseType ? courseTypeOptions.find(t => t.value === tempCourseGroup.courseType)?.label || tempCourseGroup.courseType : ''}
                disabled 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="上课教练"
            >
              <Input 
                value={tempCourseGroup.coach} 
                disabled 
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="状态"
              required
            >
              <Select 
                placeholder="请选择"
                value={tempCourseGroup.status}
                onChange={(value) => updateTempCourseGroup('status', value)}
                style={{ width: '100%' }}
              >
                <Option value="active">在学</Option>
                <Option value="inactive">停课</Option>
                <Option value="pending">待处理</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              label="有效期至"
              required
            >
              <DatePicker 
                style={{ width: '100%' }} 
                placeholder="选择有效期"
                format="YYYY-MM-DD"
                value={dayjs(tempCourseGroup.expireDate)}
                onChange={(date) => updateTempCourseGroup('expireDate', date ? date.format('YYYY-MM-DD') : '')}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* 排课时间 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text strong>固定排课时间</Text>
            <Button 
              type="link" 
              onClick={() => {
                const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || []), { weekday: '一', time: '15:00' }];
                updateTempCourseGroup('scheduleTimes', newScheduleTimes);
              }} 
              icon={<PlusOutlined />}
            >
              添加时间
            </Button>
          </div>
          {(tempCourseGroup.scheduleTimes || []).map((scheduleTime, timeIndex) => (
            <Row gutter={16} key={timeIndex} style={{ marginBottom: 16 }}>
              <Col span={10}>
                <Select
                  style={{ width: '100%' }}
                  value={scheduleTime.weekday}
                  onChange={(value) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].weekday = value;
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                >
                  {weekdayOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col span={10}>
                <TimePicker
                  style={{ width: '100%' }}
                  format="HH:mm"
                  value={dayjs(scheduleTime.time, 'HH:mm')}
                  onChange={(time) => {
                    const newScheduleTimes = [...(tempCourseGroup.scheduleTimes || [])];
                    newScheduleTimes[timeIndex].time = time ? time.format('HH:mm') : '00:00';
                    updateTempCourseGroup('scheduleTimes', newScheduleTimes);
                  }}
                />
              </Col>
              <Col span={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <Space>
            <Button onClick={() => cancelAddCourseGroup()}>
              取消
            </Button>
            <Button type="primary" onClick={() => confirmAddCourseGroup()}>
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
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      okText={editingStudent ? '保存' : '添加'}
      cancelText="取消"
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Form
        form={form}
        layout="vertical"
        name="studentForm"
        initialValues={{
          gender: 'male',
          status: 'active',
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
              <Select placeholder="请选择">
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
              rules={[{ required: true, message: '请输入年龄' }]}
            >
              <Input type="number" placeholder="请输入年龄" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '24px 0' }} />
        
        {/* 课程信息 */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
              <Title level={5} style={{ margin: 0, marginRight: 16 }}>报名课程</Title>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => startAddCourseGroup()}
                disabled={currentEditingGroupIndex !== null || tempCourseGroup !== null}
              >
                添加课程
              </Button>
            </div>
            
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
    </Modal>
  );
};

export default StudentFormModal;