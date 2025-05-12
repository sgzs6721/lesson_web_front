import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  Typography,
  DatePicker,
  Divider,
  Button
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '../types/student';
import { PlusOutlined } from '@ant-design/icons';
import { SimpleCourse } from '@/api/course/types';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface TransferModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  studentCourses: CourseSummary[];
  transferStudentSearchResults: Student[];
  isSearchingTransferStudent: boolean;
  selectedTransferStudent: Student | null;
  selectedCourseId?: string;
  selectedCourseName?: string;
  onCancel: () => void;
  onOk: () => void;
  onSearchTransferStudent: (value: string) => void;
  onSelectTransferStudent: (student: Student) => void;
  students: Student[];
  courseList: SimpleCourse[];
}

const TransferModal: React.FC<TransferModalProps> = ({
  visible,
  form,
  student,
  studentCourses,
  transferStudentSearchResults,
  isSearchingTransferStudent,
  selectedTransferStudent,
  selectedCourseId,
  selectedCourseName,
  onCancel,
  onOk,
  onSearchTransferStudent,
  onSelectTransferStudent,
  students,
  courseList
}) => {
  // 添加提交loading状态
  const [submitLoading, setSubmitLoading] = React.useState(false);
  // 添加有效期类型选项状态
  const [validityPeriodOptions, setValidityPeriodOptions] = useState<Constant[]>([]);
  // 添加加载有效期类型的状态
  const [loadingValidityPeriod, setLoadingValidityPeriod] = useState(false);
  // 添加最大可转课时状态
  const [maxTransferHours, setMaxTransferHours] = useState(0);
  // 添加当前转课课时状态
  const [currentTransferHours, setCurrentTransferHours] = useState(0);

  // 加载有效期类型选项
  useEffect(() => {
    if (visible) {
      fetchValidityPeriodOptions();
    }
  }, [visible]);

  // 获取有效期类型选项
  const fetchValidityPeriodOptions = async () => {
    try {
      setLoadingValidityPeriod(true);
      const data = await API.constants.getList('VALIDITY_PERIOD');
      setValidityPeriodOptions(data);
    } catch (error) {
      console.error('获取有效期类型选项失败:', error);
    } finally {
      setLoadingValidityPeriod(false);
    }
  };

  // 计算去重后的学员列表，用于下拉选择
  const uniqueStudents = React.useMemo(() => {
    const allStudentsMap = new Map<string, Student>();

    // 优先添加搜索结果，但排除当前转出学员
    transferStudentSearchResults
      .filter(s => s.id !== student?.id) // 排除转出学员
      .forEach(s => allStudentsMap.set(s.id, s));

    // 添加当前选中的学员（如果不在 Map 中且不是当前转出学员）
    if (selectedTransferStudent && 
        !allStudentsMap.has(selectedTransferStudent.id) && 
        selectedTransferStudent.id !== student?.id) {
      allStudentsMap.set(selectedTransferStudent.id, selectedTransferStudent);
    }

    // 添加所有学员（排除当前转出学员，且不在 Map 中）
    students
      .filter(s => s.id !== student?.id) // 排除转出学员
      .forEach(s => {
        if (!allStudentsMap.has(s.id)) { // 避免重复添加
          allStudentsMap.set(s.id, s);
        }
      });

    return Array.from(allStudentsMap.values());
  }, [transferStudentSearchResults, selectedTransferStudent, students, student]);

  // 当模态框可见且学生信息存在时，确保表单中的学生姓名和ID被正确设置
  useEffect(() => {
    if (visible && student && studentCourses.length > 0) {
      console.log('TransferModal初始化 - 学生:', student.name, 'selectedCourseId:', selectedCourseId, '类型:', typeof selectedCourseId);
      console.log('selectedCourseName:', selectedCourseName);
      console.log('当前学生所有课程:', JSON.stringify(studentCourses, null, 2));
      
      // 获取剩余课时
      let remainingHours = 0;
      
      // 根据selectedCourseId找到对应的课程，如果没有则使用第一个课程
      const defaultCourse = selectedCourseId 
        ? studentCourses.find(course => {
            const courseIdMatches = String(course.id) === String(selectedCourseId);
            console.log(`匹配课程ID: ${course.id}(${typeof course.id}) vs ${selectedCourseId}(${typeof selectedCourseId}) = ${courseIdMatches}`);
            console.log(`课程名称: ${course.name}`);
            return courseIdMatches;
          })
        : undefined;
      
      // 如果没有找到匹配的课程，使用第一个可用课程
      const selectedCourse = defaultCourse || (studentCourses.length > 0 ? studentCourses[0] : null);
      
      console.log('最终选择的课程:', selectedCourse ? JSON.stringify(selectedCourse, null, 2) : '无可用课程');
      
      if (!selectedCourse) {
        console.error('无法找到有效的课程进行转课操作!');
        return;
      }
      
      // 尝试从学生课程中获取剩余课时
      if (student.courses && student.courses.length > 0) {
        const coursesInfo = student.courses.find(c => {
          const courseIdMatches = String(c.courseId) === String(selectedCourse.id);
          console.log(`匹配课程细节: ${c.courseId}(${typeof c.courseId}) vs ${selectedCourse.id}(${typeof selectedCourse.id}) = ${courseIdMatches}`);
          return courseIdMatches;
        });
        
        if (coursesInfo && coursesInfo.remainingHours !== undefined) {
          remainingHours = coursesInfo.remainingHours;
          console.log('从学生courses数组中获取剩余课时:', remainingHours);
        }
      }
      
      // 从课程概要中获取
      if (remainingHours === 0 && selectedCourse.remainingClasses) {
        const parts = selectedCourse.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从课程概要中获取剩余课时:', remainingHours);
        }
      }
      
      // 从学生对象获取
      if (remainingHours === 0 && student.remainingClasses) {
        const parts = student.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从学生对象中获取剩余课时:', remainingHours);
        }
      }
      
      console.log('转课课时最终确定为:', remainingHours);
      
      // 更新最大可转课时状态
      setMaxTransferHours(remainingHours);
      // 设置当前转课课时状态
      setCurrentTransferHours(remainingHours > 0 ? remainingHours : 1);
      
      // 设置表单初始值
      const formValues = {
        studentName: student.name,
        studentId: student.id,
        fromCourseId: selectedCourseName || selectedCourse.name,
        _fromCourseId: selectedCourse.id, // 隐藏字段保存课程ID
        _courseId: selectedCourse.id, // 保持命名一致
        refundClassHours: remainingHours,
        transferClassHours: remainingHours > 0 ? remainingHours : 1, // 设置默认转课课时
        _maxClassHours: remainingHours, // 保存最大可转课时
        transferStudentName: '',
        transferCourseId: undefined
      };
      
      console.log('设置表单初始值:', formValues);
      form.setFieldsValue(formValues);
      
      // 如果有有效期选项，设置默认值
      if (validityPeriodOptions.length > 0) {
        // 默认选择第一个有效期选项
        form.setFieldsValue({
          validityPeriodId: validityPeriodOptions[0].id
        });
      }
    }
  }, [visible, student, studentCourses, form, validityPeriodOptions, selectedCourseId, selectedCourseName]);

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>转课</span>}
      open={visible}
      onOk={() => {
        console.log('确认提交按钮点击');
        // 设置提交中状态
        setSubmitLoading(true);
        // 在调用onOk之前，确保operationType字段被正确设置
        form.setFieldsValue({ operationType: 'transfer' });
        // 调用提交方法
        onOk();
        // 延迟关闭loading状态（因为onOk是异步的，但不会返回Promise）
        setTimeout(() => {
          setSubmitLoading(false);
        }, 2000);
      }}
      onCancel={onCancel}
      width={800}
      okText="确认提交"
      cancelText="取消"
      confirmLoading={submitLoading}
      okButtonProps={{
        style: {},
        className: 'no-hover-button' 
      }}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      
      <Form
        form={form}
        layout="vertical"
      >
        {/* 隐藏字段 - 操作类型 */}
        <Form.Item name="operationType" hidden>
          <Input type="hidden" />
        </Form.Item>
        
        {/* 隐藏字段保存原课程ID */}
        <Form.Item name="_courseId" hidden>
          <Input type="hidden" />
        </Form.Item>
        
        {/* 隐藏字段保存最大可转课时数 */}
        <Form.Item name="_maxClassHours" hidden>
          <Input type="hidden" />
        </Form.Item>
        
        <Title level={5} style={{ marginBottom: 16 }}>转出学员信息</Title>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="studentName"
              label="转出学员"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="studentId"
              label="学员ID"
            >
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fromCourseId"
              label="原课程"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="transferClassHours"
              label="转课课时"
              rules={[
                { required: true, message: '请输入转课课时' },
                { 
                  validator: (_, value) => {
                    if (value <= 0) {
                      return Promise.reject('转课课时必须大于0');
                    }
                    
                    // 使用状态中的最大可转课时数
                    if (maxTransferHours > 0 && value > maxTransferHours) {
                      return Promise.reject(`转课课时不能超过剩余课时(${maxTransferHours}课时)`);
                    }
                    
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <div className="input-with-unit-wrapper">
                <InputNumber 
                  min={1}
                  max={maxTransferHours || 1}
                  value={currentTransferHours}
                  style={{ width: '100%' }}
                  className="select-with-unit"
                  // 添加onChange处理，确保课时数不超过最大值
                  onChange={(value) => {
                    if (!value) return;
                    
                    let newValue = value;
                    // 使用状态中的最大课时
                    if (maxTransferHours > 0 && value > maxTransferHours) {
                      newValue = maxTransferHours;
                    }
                    
                    // 更新状态和表单字段
                    setCurrentTransferHours(newValue);
                    form.setFieldsValue({ transferClassHours: newValue });
                  }}
                />
                <div className="input-unit">课时</div>
              </div>
            </Form.Item>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '-12px' }}>
              注意：转课课时不能超过剩余课时数（{maxTransferHours || 0}课时）
            </div>
          </Col>
        </Row>
        
        <Divider style={{ margin: '12px 0' }} />
        <Title level={5} style={{ marginBottom: 16 }}>转入学员信息</Title>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="targetStudentId"
              label="转入学员"
              rules={[{ required: true, message: '请选择要转课给哪个学员' }]}
            >
              <Select
                showSearch
                placeholder="请输入学员姓名/ID/电话搜索"
                optionFilterProp="children"
                filterOption={false}
                onSearch={onSearchTransferStudent}
                loading={isSearchingTransferStudent}
                value={selectedTransferStudent?.id}
                onChange={(value) => {
                  const selected = students.find(s => s.id === value);
                  if (selected) {
                    onSelectTransferStudent(selected);
                    form.setFieldsValue({ targetStudentId: selected.id });
                  }
                }}
                style={{ width: '100%' }}
                dropdownStyle={{ zIndex: 1060 }}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                notFoundContent={
                  isSearchingTransferStudent ? (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <span>搜索中...</span>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>
                      <span>未找到匹配学员</span>
                    </div>
                  )
                }
              >
                {/* 使用去重后的学员列表渲染选项 */}
                {uniqueStudents.map(s => (
                  <Option key={s.id} value={s.id}>
                    {s.name} ({s.phone || '无电话'})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* 提示信息 */}
            <div style={{ color: '#1890ff', fontSize: '12px', marginTop: '-22px', marginBottom: '12px' }}>
              注意：如需转入新学员，请先在学员管理页面添加该学员后再进行转课。
            </div>
          </Col>
          <Col span={12}>
            <Form.Item
              name="toCourseId"
              label="转入课程"
              rules={[{ required: true, message: '请选择转课目标课程' }]}
            >
              <Select
                placeholder="请选择转课目标课程"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => 
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                }
                style={{ width: '100%' }}
                dropdownStyle={{ zIndex: 1050 }}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              >
                {courseList.map(course => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="priceDifference"
              label="价格差额"
              initialValue={0}
              rules={[{ required: true, message: '请输入价格差额' }]}
            >
              <InputNumber
                min={-10000}
                max={10000}
                precision={2}
                style={{ width: '100%' }}
                placeholder="输入负数表示需退款，正数需补款"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="validityPeriodId"
              label="有效期时长"
              rules={[{ required: true, message: '请选择有效期时长' }]}
            >
              <div className="input-with-unit-wrapper">
                <Select
                  placeholder="请选择有效期时长"
                  loading={loadingValidityPeriod}
                  style={{ width: '100%' }}
                  dropdownStyle={{ zIndex: 1060 }}
                  getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                  listHeight={300}
                  suffixIcon={<div style={{ width: '30px' }}></div>}
                  className="select-with-unit"
                  onChange={(value) => {
                    console.log('选择的有效期时长:', value);
                    form.setFieldsValue({ validityPeriodId: value });
                  }}
                >
                  {validityPeriodOptions.map(option => (
                    <Option key={option.id} value={option.id}>
                      {option.constantValue}
                    </Option>
                  ))}
                </Select>
                <div className="input-unit">月</div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          name="reason"
          label="转课原因"
          rules={[{ required: true, message: '请输入转课原因' }]}
        >
          <TextArea rows={4} placeholder="请输入转课原因" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferModal; 