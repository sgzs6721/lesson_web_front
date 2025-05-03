import React from 'react';
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
  Button,
  message,
  Spin
} from 'antd';
import { FormInstance } from 'antd/lib/form';

import { Student, CourseSummary } from '../types/student';
import { courseOptions } from '../constants/options';
import dayjs from 'dayjs';
import { PlusOutlined } from '@ant-design/icons';
import QuickAddStudentModal from './QuickAddStudentModal';
import { SimpleCourse } from '@/api/course/types';

const { Option, OptGroup } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface RefundTransferModalProps {
  visible: boolean;
  form: FormInstance;
  operationType: 'refund' | 'transfer' | 'transferClass';
  student: Student | null;
  studentCourses: CourseSummary[];
  transferStudentSearchResults: Student[];
  isSearchingTransferStudent: boolean;
  selectedTransferStudent: Student | null;
  onCancel: () => void;
  onOk: () => void;
  onSearchTransferStudent: (value: string) => void;
  onSelectTransferStudent: (student: Student) => void;
  students: Student[];
  isQuickAddStudentModalVisible: boolean;
  quickAddStudentForm: FormInstance;
  showQuickAddStudentModal: () => void;
  handleQuickAddStudentOk: () => void;
  handleQuickAddStudentCancel: () => void;
  courseList?: SimpleCourse[];
}

const RefundTransferModal: React.FC<RefundTransferModalProps> = ({
  visible,
  form,
  operationType,
  student,
  studentCourses,
  transferStudentSearchResults,
  isSearchingTransferStudent,
  selectedTransferStudent,
  onCancel,
  onOk,
  onSearchTransferStudent,
  onSelectTransferStudent,
  students,
  isQuickAddStudentModalVisible,
  quickAddStudentForm,
  showQuickAddStudentModal,
  handleQuickAddStudentOk,
  handleQuickAddStudentCancel,
  courseList
}) => {

  // 添加状态跟踪最大可转课时
  const [maxTransferHours, setMaxTransferHours] = React.useState(0);
  // 在表单字段值变化时触发回调
  const [formInitialized, setFormInitialized] = React.useState(false);

  React.useEffect(() => {
    if (visible && operationType === 'transferClass') {
      // 在模态框打开后，设置表单初始化标志
      setFormInitialized(true);
    } else {
      setFormInitialized(false);
    }
  }, [visible, operationType]);

  // 监听refundClassHours字段变化，自动设置transferClassHours
  React.useEffect(() => {
    if (formInitialized && operationType === 'transferClass') {
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
  }, [formInitialized, form, operationType]);

  // 监听student和studentCourses变化，更新最大可转课时
  React.useEffect(() => {
    if (visible && student && operationType === 'transferClass' && studentCourses.length > 0) {
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
  }, [visible, student, studentCourses, operationType]);

  // 计算去重后的学员列表，用于下拉选择
  const uniqueStudents = React.useMemo(() => {
    const allStudentsMap = new Map<string, Student>();

    // 优先添加搜索结果
    transferStudentSearchResults.forEach(s => allStudentsMap.set(s.id, s));

    // 添加当前选中的学员（如果不在 Map 中）
    if (selectedTransferStudent && !allStudentsMap.has(selectedTransferStudent.id)) {
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

    // 确保当前选中的学员一定在列表里，即使他是转出学员（虽然逻辑上不应该，但做个保护）
    if (selectedTransferStudent && !allStudentsMap.has(selectedTransferStudent.id)) {
       allStudentsMap.set(selectedTransferStudent.id, selectedTransferStudent);
    }

    return Array.from(allStudentsMap.values());
  }, [transferStudentSearchResults, selectedTransferStudent, students, student]);

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
            expireDate = dayjs(defaultCourse.expireDate);
            if (!expireDate.isValid()) {
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
              expireDate = dayjs(coursesInfo.endDate);
              if (!expireDate.isValid()) {
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
            expireDate = dayjs(student.expireDate);
            if (!expireDate.isValid()) {
              console.log('无效的日期格式:', student.expireDate);
              expireDate = null;
            }
          } catch (error) {
            console.error('解析student.expireDate失败:', error);
          }
        }
        
        // 更新最大可转课时状态
        if (remainingHours > 0) {
          console.log('Modal打开时设置最大可转课时状态:', remainingHours);
          setMaxTransferHours(remainingHours);
        }
        
        // 设置表单值
        const values = {
          studentName: student.name,
          studentId: student.id,
          fromCourseId: defaultCourse.name, // 使用课程名称
          _courseId: defaultCourse.id, // 隐藏字段保存课程ID
          refundClassHours: remainingHours
        };
        
        console.log('Modal打开时设置表单值:', values);
        form.setFieldsValue(values);
        
        // 如果是转班模式，立即设置转班课时
        if (operationType === 'transferClass') {
          console.log('Modal打开时设置转班课时:', remainingHours);
          const transferClassValues: any = {
            transferClassHours: remainingHours > 0 ? remainingHours : 1
          };
          
          // 如果有有效的过期日期，设置validUntil字段
          if (expireDate && expireDate.isValid()) {
            console.log('设置有效期至:', expireDate.format('YYYY-MM-DD'));
            transferClassValues.validUntil = expireDate;
          }
          
          form.setFieldsValue(transferClassValues);
          
          // 延迟检查，确保设置成功
          setTimeout(() => {
            const currentValidUntil = form.getFieldValue('validUntil');
            console.log('延迟检查有效期设置:', currentValidUntil ? 
              (currentValidUntil.format ? currentValidUntil.format('YYYY-MM-DD') : currentValidUntil) : 
              '未设置');
          }, 100);
        }
      } else {
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id
        });
      }
    }
  }, [visible, student, studentCourses, form, operationType]);

  // 获取标题文本
  const getTitleText = () => {
    switch (operationType) {
      case 'refund':
        return '退费';
      case 'transfer':
        return '转课';
      case 'transferClass':
        return '转班';
      default:
        return '操作';
    }
  };

  // 添加提交loading状态
  const [submitLoading, setSubmitLoading] = React.useState(false);
  // 添加蒙板状态
  const [spinning, setSpinning] = React.useState(false);

  return (
    <>
      <Modal
        title={
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            {getTitleText()}
          </span>
        }
        open={visible}
        onOk={() => {
          console.log('确认提交按钮点击');
          // 设置提交中状态
          setSubmitLoading(true);
          // 显示蒙板
          setSpinning(true);
          // 在调用onOk之前，确保operationType字段被正确设置
          form.setFieldsValue({ operationType });
          console.log('提交前确认operationType:', operationType);
          // 调用提交方法
          onOk();
          // 延迟关闭loading状态（因为onOk是异步的，但不会返回Promise）
          setTimeout(() => {
            setSubmitLoading(false);
            // 蒙板状态应该在接口调用完成后由接口响应关闭
            // 但为避免蒙板永久显示，这里也设置一个超时关闭
            setTimeout(() => {
              setSpinning(false);
            }, 5000); // 5秒后自动关闭蒙板，避免接口失败时蒙板无法关闭
          }, 2000);
        }}
        onCancel={onCancel}
        width={800}
        okText="确认提交"
        cancelText="取消"
        confirmLoading={submitLoading}
        okButtonProps={{
          style: {
            // 这里可以添加默认状态下的样式
            // 例如 background: '#1890ff', borderColor: '#1890ff'
            // 如果希望完全使用默认样式，可以留空或移除style，但需要CSS覆盖
          },
          className: 'no-hover-button' 
        }}
        afterOpenChange={(open) => {
          if (open && student) {
            // 模态框打开后立即设置学生信息
            // 获取课程信息
            if (studentCourses && studentCourses.length > 0) {
              const defaultCourse = studentCourses[0];
              
              // 获取剩余课时
              let remainingHours = 0;
              if (student.courses && student.courses.length > 0) {
                const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
                if (coursesInfo && coursesInfo.remainingHours !== undefined) {
                  remainingHours = coursesInfo.remainingHours;
                  console.log('Modal打开时从courses获取剩余课时:', remainingHours);
                }
              }
              
              // 如果没有找到精确课时，从课程概要中获取
              if (remainingHours === 0 && defaultCourse.remainingClasses) {
                const parts = defaultCourse.remainingClasses.split('/');
                if (parts.length > 0 && !isNaN(Number(parts[0]))) {
                  remainingHours = Number(parts[0]);
                  console.log('Modal打开时从remainingClasses获取剩余课时:', remainingHours);
                }
              }
              
              // 如果仍未找到，尝试从学生对象直接获取
              if (remainingHours === 0 && student.remainingClasses) {
                const parts = student.remainingClasses.split('/');
                if (parts.length > 0 && !isNaN(Number(parts[0]))) {
                  remainingHours = Number(parts[0]);
                  console.log('Modal打开时从student对象获取剩余课时:', remainingHours);
                }
              }
              
              // 获取有效期信息
              let expireDate = null;
              
              // 尝试从defaultCourse获取有效期
              if (defaultCourse.expireDate) {
                console.log('从defaultCourse获取有效期:', defaultCourse.expireDate);
                try {
                  expireDate = dayjs(defaultCourse.expireDate);
                  if (!expireDate.isValid()) {
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
                    expireDate = dayjs(coursesInfo.endDate);
                    if (!expireDate.isValid()) {
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
                  expireDate = dayjs(student.expireDate);
                  if (!expireDate.isValid()) {
                    console.log('无效的日期格式:', student.expireDate);
                    expireDate = null;
                  }
                } catch (error) {
                  console.error('解析student.expireDate失败:', error);
                }
              }
              
              // 更新最大可转课时状态
              if (remainingHours > 0) {
                console.log('Modal打开时设置最大可转课时状态:', remainingHours);
                setMaxTransferHours(remainingHours);
              }
              
              // 设置表单值
              const values = {
                studentName: student.name,
                studentId: student.id,
                fromCourseId: defaultCourse.name, // 使用课程名称
                _courseId: defaultCourse.id, // 隐藏字段保存课程ID
                refundClassHours: remainingHours
              };
              
              console.log('Modal打开时设置表单值:', values);
              form.setFieldsValue(values);
              
              // 如果是转班模式，立即设置转班课时
              if (operationType === 'transferClass') {
                console.log('Modal打开时设置转班课时:', remainingHours);
                const transferClassValues: any = {
                  transferClassHours: remainingHours > 0 ? remainingHours : 1
                };
                
                // 如果有有效的过期日期，设置validUntil字段
                if (expireDate && expireDate.isValid()) {
                  console.log('设置有效期至:', expireDate.format('YYYY-MM-DD'));
                  transferClassValues.validUntil = expireDate;
                }
                
                form.setFieldsValue(transferClassValues);
                
                // 延迟检查，确保设置成功
                setTimeout(() => {
                  const currentValidUntil = form.getFieldValue('validUntil');
                  console.log('延迟检查有效期设置:', currentValidUntil ? 
                    (currentValidUntil.format ? currentValidUntil.format('YYYY-MM-DD') : currentValidUntil) : 
                    '未设置');
                }, 100);
              }
            } else {
              form.setFieldsValue({
                studentName: student.name,
                studentId: student.id
              });
            }
          }
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
          
          {/* 退费模块 */}
          {operationType === 'refund' && (
            <>
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
                    label="退费课程"
                    rules={[{ required: true, message: '请选择退费课程' }]}
                  >
                    <Input 
                      style={{ width: '100%' }} 
                      disabled={true}
                    />
                  </Form.Item>
                  {/* 隐藏字段保存课程ID */}
                  <Form.Item
                    name="_courseId"
                    hidden={true}
                  >
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="refundClassHours"
                    label="退费课时"
                    rules={[{ required: true, message: '请输入退费课时' }]}
                  >
                    <Input 
                      style={{ width: '100%' }} 
                      disabled={true}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="refundAmount"
                    label="退款金额"
                    rules={[{ required: true, message: '请输入退款金额' }]}
                  >
                    <InputNumber 
                      min={0}
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      onChange={() => {
                        setTimeout(() => {
                          const refundAmount = form.getFieldValue('refundAmount') || 0;
                          const serviceFee = form.getFieldValue('serviceFee') || 0;
                          const otherFee = form.getFieldValue('otherFee') || 0;
                          const actualRefund = refundAmount - serviceFee - otherFee;
                          form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                        }, 0);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="serviceFee"
                    label="手续费"
                    initialValue={0}
                    rules={[{ required: true, message: '请输入手续费' }]}
                  >
                    <InputNumber 
                      min={0} 
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      onChange={() => {
                        setTimeout(() => {
                          const refundAmount = form.getFieldValue('refundAmount') || 0;
                          const serviceFee = form.getFieldValue('serviceFee') || 0;
                          const otherFee = form.getFieldValue('otherFee') || 0;
                          const actualRefund = refundAmount - serviceFee - otherFee;
                          form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                        }, 0);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="otherFee"
                    label="其它费用扣除"
                    initialValue={0}
                    rules={[{ required: true, message: '请输入其它费用' }]}
                    tooltip="如教材费、器材费等不予退还的费用"
                  >
                    <InputNumber 
                      min={0} 
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      onChange={() => {
                        setTimeout(() => {
                          const refundAmount = form.getFieldValue('refundAmount') || 0;
                          const serviceFee = form.getFieldValue('serviceFee') || 0;
                          const otherFee = form.getFieldValue('otherFee') || 0;
                          const actualRefund = refundAmount - serviceFee - otherFee;
                          form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                        }, 0);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="refundMethod"
                    label="退费方式"
                    rules={[{ required: true, message: '请选择退费方式' }]}
                  >
                    <Select
                      placeholder="请选择退费方式"
                      dropdownMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                    >
                      <Option value="WECHAT">微信支付</Option>
                      <Option value="ALIPAY">支付宝</Option>
                      <Option value="CASH">现金</Option>
                      <Option value="CARD">刷卡</Option>
                      <Option value="BANK_TRANSFER">转账</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="actualRefund"
                    label="实际退费金额"
                    initialValue={0}
                    tooltip="实际退费金额 = 退款金额 - 手续费 - 其它费用扣除"
                  >
                    <InputNumber 
                      min={0}
                      style={{ width: '100%' }} 
                      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: string | undefined) => {
                        const parsed = value ? value.replace(/[^\d.]/g, '') : '0';
                        return parseFloat(parsed);
                      }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="reason"
                label="退费原因"
                rules={[{ required: true, message: '请输入退费原因' }]}
              >
                <TextArea rows={4} placeholder="请输入退费原因" />
              </Form.Item>
            </>
          )}
          
          {/* 转课模块 */}
          {operationType === 'transfer' && (
            <>
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
                            <div style={{ marginTop: 8 }}>
                              <Button 
                                size="small" 
                                type="primary"
                                onClick={showQuickAddStudentModal}
                              >
                                添加新学员
                              </Button>
                            </div>
                          </div>
                        )
                      }
                      dropdownRender={menu => (
                        <div>
                          {menu}
                          <Divider style={{ margin: '4px 0' }} />
                          <div style={{ padding: '8px', textAlign: 'center' }}>
                            <Button 
                              type="link" 
                              size="small"
                              icon={<PlusOutlined />}
                              onClick={showQuickAddStudentModal}
                            >
                              添加新学员
                            </Button>
                          </div>
                        </div>
                      )}
                    >
                      {/* 使用去重后的学员列表渲染选项 */}
                      {uniqueStudents.map(s => (
                        <Option key={s.id} value={s.id}>
                          {s.name} ({s.id}) - {s.phone}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="toCourseId"
                    label="课程名称"
                    rules={[{ required: true, message: '请选择课程名称' }]}
                  >
                    <Select 
                      placeholder="请选择课程名称"
                      style={{ width: '100%' }}
                      dropdownStyle={{ zIndex: 1060 }}
                      getPopupContainer={triggerNode => triggerNode.parentNode as HTMLElement}
                    >
                      {courseOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="transferClassHours"
                    label="转课课时"
                    rules={[{ required: true, message: '请输入转课课时' }]}
                  >
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
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
                    />
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
            </>
          )}
          
          {/* 转班模块 */}
          {operationType === 'transferClass' && (
            <>
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
            </>
          )}
        </Form>
      </Modal>

      <QuickAddStudentModal
        visible={isQuickAddStudentModalVisible}
        form={quickAddStudentForm}
        onOk={handleQuickAddStudentOk}
        onCancel={handleQuickAddStudentCancel}
      />
    </>
  );
};

export default RefundTransferModal; 