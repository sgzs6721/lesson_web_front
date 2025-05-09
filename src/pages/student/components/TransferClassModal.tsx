import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  DatePicker,
  Divider
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '../types/student';
import { SimpleCourse } from '@/api/course/types';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface TransferClassModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  studentCourses: CourseSummary[];
  onCancel: () => void;
  onOk: () => void;
  courseList?: SimpleCourse[];
}

const TransferClassModal: React.FC<TransferClassModalProps> = ({
  visible,
  form,
  student,
  studentCourses,
  onCancel,
  onOk,
  courseList
}) => {
  // 添加状态跟踪最大可转课时
  const [maxTransferHours, setMaxTransferHours] = React.useState(0);
  // 在表单字段值变化时触发回调
  const [formInitialized, setFormInitialized] = React.useState(false);
  // 添加提交loading状态
  const [submitLoading, setSubmitLoading] = React.useState(false);
  // 添加有效期类型选项状态
  const [validityPeriodOptions, setValidityPeriodOptions] = useState<Constant[]>([]);
  // 添加加载有效期类型的状态
  const [loadingValidityPeriod, setLoadingValidityPeriod] = useState(false);

  React.useEffect(() => {
    if (visible) {
      // 在模态框打开后，设置表单初始化标志
      setFormInitialized(true);
      // 加载有效期类型选项
      fetchValidityPeriodOptions();
    } else {
      setFormInitialized(false);
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

  // 监听refundClassHours字段变化，自动设置transferClassHours
  React.useEffect(() => {
    if (formInitialized) {
      const refundHours = form.getFieldValue('refundClassHours');
      console.log('检测到表单初始化完成，当前剩余课时为:', refundHours);
      if (refundHours && refundHours > 0) {
        // 更新最大可转课时状态
        setMaxTransferHours(refundHours);
        // 确保转班课时设置为剩余课时
        console.log('设置转班课时为:', refundHours);
        form.setFieldsValue({
          transferClassHours: refundHours
        });
        
        // 二次确认设置成功
        setTimeout(() => {
          const currentTransferHours = form.getFieldValue('transferClassHours');
          console.log('设置后的转班课时:', currentTransferHours);
        }, 100);
      }
    }
  }, [formInitialized, form]);

  // 监听student和studentCourses变化，更新最大可转课时
  React.useEffect(() => {
    if (visible && student && studentCourses.length > 0) {
      let remainingHours = 0;
      const defaultCourse = studentCourses[0];
      
      // 尝试从学生课程中获取剩余课时
      if (student.courses && student.courses.length > 0) {
        const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
        if (coursesInfo && coursesInfo.remainingHours !== undefined) {
          remainingHours = coursesInfo.remainingHours;
          console.log('从课程信息中获取最大可转课时:', remainingHours);
        }
      }
      
      // 从课程概要中获取
      if (remainingHours === 0 && defaultCourse.remainingClasses) {
        const parts = defaultCourse.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从课程概要中获取最大可转课时:', remainingHours);
        }
      }
      
      // 从学生对象获取
      if (remainingHours === 0 && student.remainingClasses) {
        const parts = student.remainingClasses.split('/');
        if (parts.length > 0 && !isNaN(Number(parts[0]))) {
          remainingHours = Number(parts[0]);
          console.log('从学生对象中获取最大可转课时:', remainingHours);
        }
      }
      
      if (remainingHours > 0) {
        console.log('设置最大可转课时为:', remainingHours);
        setMaxTransferHours(remainingHours);
      }
    }
  }, [visible, student, studentCourses]);

  // 当模态框可见且学生信息存在时，确保表单中的学生姓名和ID被正确设置
  React.useEffect(() => {
    if (visible && student) {
      // 获取课程信息
      if (studentCourses && studentCourses.length > 0) {
        const defaultCourse = studentCourses[0];
        
        // 获取剩余课时
        let remainingHours = 0;
        if (student.courses && student.courses.length > 0) {
          const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
          if (coursesInfo && coursesInfo.remainingHours !== undefined) {
            remainingHours = coursesInfo.remainingHours;
          }
        }
        
        // 如果没有找到精确课时，从课程概要中获取
        if (remainingHours === 0 && defaultCourse.remainingClasses) {
          const parts = defaultCourse.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) {
            remainingHours = Number(parts[0]);
          }
        }
        
        // 如果仍未找到，尝试从学生对象直接获取
        if (remainingHours === 0 && student.remainingClasses) {
          const parts = student.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) {
            remainingHours = Number(parts[0]);
          }
        }
        
        // 获取有效期信息
        let expireDate = null;
        
        // 尝试从defaultCourse获取有效期
        if (defaultCourse.expireDate) {
          console.log('从defaultCourse获取有效期:', defaultCourse.expireDate);
          try {
            expireDate = defaultCourse.expireDate ? dayjs(defaultCourse.expireDate) : null;
            if (expireDate && !expireDate.isValid()) {
              console.log('无效的日期格式:', defaultCourse.expireDate);
              expireDate = null;
            }
          } catch (error) {
            console.error('解析defaultCourse.expireDate失败:', error);
          }
        }
        
        // 尝试从student.courses获取有效期
        if (!expireDate && student.courses && student.courses.length > 0) {
          const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
          if (coursesInfo && coursesInfo.endDate) {
            console.log('从coursesInfo.endDate获取有效期:', coursesInfo.endDate);
            try {
              expireDate = coursesInfo.endDate ? dayjs(coursesInfo.endDate) : null;
              if (expireDate && !expireDate.isValid()) {
                console.log('无效的日期格式:', coursesInfo.endDate);
                expireDate = null;
              }
            } catch (error) {
              console.error('解析coursesInfo.endDate失败:', error);
            }
          }
        }
        
        // 如果仍未找到，尝试从student对象直接获取
        if (!expireDate && student.expireDate) {
          console.log('从student.expireDate获取有效期:', student.expireDate);
          try {
            expireDate = student.expireDate ? dayjs(student.expireDate) : null;
            if (expireDate && !expireDate.isValid()) {
              console.log('无效的日期格式:', student.expireDate);
              expireDate = null;
            }
          } catch (error) {
            console.error('解析student.expireDate失败:', error);
          }
        }
                
        // 设置表单值
        const values: Record<string, any> = {
          studentName: student.name,
          studentId: student.id,
          fromCourseId: defaultCourse.name, // 使用课程名称
          _courseId: defaultCourse.id, // 隐藏字段保存课程ID
          refundClassHours: remainingHours,
          operationType: 'transferClass',
          transferClassHours: remainingHours > 0 ? remainingHours : 1
        };
        
        // 如果有有效期选项，设置默认值
        if (validityPeriodOptions.length > 0) {
          // 默认选择第一个有效期选项
          values.validityPeriodId = validityPeriodOptions[0].id;
        }
        
        // 如果有有效的过期日期，设置validUntil字段
        if (expireDate && expireDate.isValid()) {
          //values.validUntil = expireDate;
          // 不再设置validUntil，由用户从下拉框中选择
        }
        
        console.log('设置转班表单值:', values);
        form.setFieldsValue(values);
        setFormInitialized(true);
      } else {
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          operationType: 'transferClass'
        });
      }
    }
  }, [visible, student, studentCourses, form, validityPeriodOptions]);

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>转班</span>}
      open={visible}
      onOk={() => {
        console.log('确认提交按钮点击');
        // 设置提交中状态
        setSubmitLoading(true);
        // 在调用onOk之前，确保operationType字段被正确设置
        form.setFieldsValue({ operationType: 'transferClass' });
        // 调用提交方法
        onOk();
        // 延迟关闭loading状态
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
              name="refundClassHours"
              label="剩余课时"
            >
              <InputNumber disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="toCourseId"
              label="转入课程"
              rules={[{ required: true, message: '请选择转班目标课程' }]}
            >
              <Select
                showSearch
                placeholder="请选择转班目标课程" 
                optionFilterProp="children"
                filterOption={(input, option) => 
                  (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: '100%' }}
              >
                {courseList?.map(course => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="transferClassHours"
              label="转班课时"
              rules={[{ required: true, message: '请输入转班课时' }]}
            >
              <div className="input-with-unit-wrapper">
                <InputNumber
                  min={1}
                  max={maxTransferHours}
                  style={{ width: '100%' }}
                  disabled={maxTransferHours <= 0}
                  className="select-with-unit"
                />
                <div className="input-unit">课时</div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
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
          label="转班原因"
          rules={[{ required: true, message: '请输入转班原因' }]}
        >
          <TextArea rows={4} placeholder="请输入转班原因" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransferClassModal; 