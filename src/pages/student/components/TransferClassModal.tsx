import React from 'react';
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

  React.useEffect(() => {
    if (visible) {
      // 在模态框打开后，设置表单初始化标志
      setFormInitialized(true);
    } else {
      setFormInitialized(false);
    }
  }, [visible]);

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
        
        // 如果有有效的过期日期，设置validUntil字段
        if (expireDate && expireDate.isValid()) {
          values.validUntil = expireDate;
        }
        
        console.log('设置转班表单值:', values);
        form.setFieldsValue(values);
      } else {
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          operationType: 'transferClass'
        });
      }
    }
  }, [visible, student, studentCourses, form]);

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
        onValuesChange={(changedValues) => {
          // 监听refundClassHours的变化
          if ('refundClassHours' in changedValues && changedValues.refundClassHours > 0) {
            console.log('表单值变化，更新最大可转课时:', changedValues.refundClassHours);
            setMaxTransferHours(changedValues.refundClassHours);
          }
        }}
      >
        {/* 隐藏字段 - 操作类型 */}
        <Form.Item name="operationType" hidden>
          <Input type="hidden" />
        </Form.Item>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="studentName"
              label="学员姓名"
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
              rules={[{ required: true, message: '请选择原课程' }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item name="_courseId" hidden>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="toCourseId"
              label="新课程"
              rules={[{ required: true, message: '请选择新课程' }]}
            >
              <Select 
                placeholder="请选择新课程"
                style={{ width: '100%' }}
                dropdownStyle={{ zIndex: 1060 }}
                getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
              >
                {(courseList && courseList.length > 0) ? 
                  courseList.map(course => {
                    const originalCourseId = form.getFieldValue('_courseId');
                    const isOriginalCourse = String(course.id) === String(originalCourseId);
                    console.log('比较课程:', {
                      courseName: course.name,
                      courseId: course.id,
                      originalCourseId,
                      isOriginalCourse
                    });
                    return (
                      <Option 
                        key={course.id} 
                        value={course.id}
                        disabled={isOriginalCourse}
                        className={isOriginalCourse ? 'original-course-option' : ''}
                      >
                        {course.name} {isOriginalCourse ? '(当前课程)' : ''}
                      </Option>
                    );
                  }) : 
                  studentCourses.map(course => {
                    const originalCourseId = form.getFieldValue('_courseId');
                    const isOriginalCourse = String(course.id) === String(originalCourseId);
                    console.log('比较课程:', {
                      courseName: course.name,
                      courseId: course.id,
                      originalCourseId,
                      isOriginalCourse
                    });
                    return (
                      <Option 
                        key={course.id} 
                        value={course.id}
                        disabled={isOriginalCourse}
                        className={isOriginalCourse ? 'original-course-option' : ''}
                      >
                        {course.name} {isOriginalCourse ? '(当前课程)' : ''}
                      </Option>
                    );
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="transferClassHours"
              label="转班课时"
              rules={[{ required: true, message: '请输入转班课时' }]}
            >
              <InputNumber 
                min={1} 
                max={maxTransferHours || undefined}
                style={{ width: '100%' }} 
                onChange={(value) => {
                  // 确保不超过剩余课时
                  if (value && value > maxTransferHours) {
                    form.setFieldsValue({transferClassHours: maxTransferHours});
                  }
                }}
              />
            </Form.Item>
            <div style={{ marginTop: '-20px', marginBottom: '20px', fontSize: '12px', color: '#999' }}>
              最大可转课时: {maxTransferHours}
            </div>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priceDifference"
              label="补差价"
              tooltip="负数表示退还差价，正数表示需要补交差价"
              initialValue={0}
            >
              <InputNumber 
                style={{ width: '100%' }} 
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: string | undefined) => {
                  const parsed = value ? value.replace(/[^\d.-]/g, '') : '0';
                  return parseFloat(parsed);
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="validUntil"
              label="有效期至"
              rules={[{ required: true, message: '请选择有效期' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY年MM月DD日"
                placeholder="请选择日期"
                onChange={(date) => {
                  console.log('有效期变更为:', date ? date.format('YYYY-MM-DD') : '未选择');
                }}
              />
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