import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Row, 
  Col, 
  Divider
} from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Student, CourseSummary } from '../types/student';
import { API } from '@/api';
import { Constant } from '@/api/constants/types';

const { Option } = Select;
const { TextArea } = Input;

interface RefundModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  studentCourses: CourseSummary[];
  onCancel: () => void;
  onOk: () => void;
  submitting?: boolean;
}

const RefundModal: React.FC<RefundModalProps> = ({
  visible,
  form,
  student,
  studentCourses,
  onCancel,
  onOk,
  submitting = false
}) => {
  const [handlingFeeTypes, setHandlingFeeTypes] = useState<Constant[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<Constant[]>([]);
  const [loading, setLoading] = useState({
    handlingFeeTypes: false,
    paymentMethods: false
  });

  useEffect(() => {
    if (visible) {
      const fetchHandlingFeeTypes = async () => {
        setLoading(prev => ({ ...prev, handlingFeeTypes: true }));
        try {
          const data = await API.constants.getListByType('HANDLING_FEE_TYPE');
          setHandlingFeeTypes(data || []);
        } catch (error) {
          console.error('获取手续费类型失败:', error);
        } finally {
          setLoading(prev => ({ ...prev, handlingFeeTypes: false }));
        }
      };

      const fetchPaymentMethods = async () => {
        setLoading(prev => ({ ...prev, paymentMethods: true }));
        try {
          const data = await API.constants.getListByType('PAYMENT_TYPE');
          setPaymentMethods(data || []);
        } catch (error) {
          console.error('获取退费方式失败:', error);
        } finally {
          setLoading(prev => ({ ...prev, paymentMethods: false }));
        }
      };

      fetchHandlingFeeTypes();
      fetchPaymentMethods();
    }
  }, [visible]);

  useEffect(() => {
    if (visible && student) {
      if (studentCourses && studentCourses.length > 0) {
        const defaultCourse = studentCourses[0];
        
        let remainingHours = 0;
        if (student.courses && student.courses.length > 0) {
          const coursesInfo = student.courses.find(c => String(c.courseId) === String(defaultCourse.id));
          if (coursesInfo && coursesInfo.remainingHours !== undefined) {
            remainingHours = coursesInfo.remainingHours;
          }
        }
        
        if (remainingHours === 0 && defaultCourse.remainingClasses) {
          const parts = defaultCourse.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) {
            remainingHours = Number(parts[0]);
          }
        }
        
        if (remainingHours === 0 && student.remainingClasses) {
          const parts = student.remainingClasses.split('/');
          if (parts.length > 0 && !isNaN(Number(parts[0]))) {
            remainingHours = Number(parts[0]);
          }
        }
        
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          fromCourseId: defaultCourse.name,
          _courseId: defaultCourse.id,
          refundClassHours: remainingHours,
          operationType: 'refund',
          handlingFeeTypeId: undefined,
          serviceFee: 0,
        });
      } else {
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          operationType: 'refund',
          handlingFeeTypeId: undefined,
          serviceFee: 0,
        });
      }
    } else if (!visible) {
        form.resetFields(); 
    }
  }, [visible, student, studentCourses, form]);

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>退费</span>}
      open={visible}
      onOk={() => {
        console.log('确认提交按钮点击');
        form.setFieldsValue({ operationType: 'refund' });
        onOk();
      }}
      onCancel={onCancel}
      width={800}
      okText="确认提交"
      cancelText="取消"
      confirmLoading={submitting}
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
              label="退费课程"
              rules={[{ required: true, message: '请选择退费课程' }]}
            >
              <Input 
                style={{ width: '100%' }} 
                disabled={true}
              />
            </Form.Item>
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
              name="handlingFeeTypeId"
              label="手续费"
              rules={[{ required: true, message: '请选择手续费类型' }]}
            >
              <Select 
                style={{ width: '100%' }} 
                loading={loading.handlingFeeTypes}
                placeholder="选择手续费类型"
                dropdownMatchSelectWidth={true}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
                onChange={(selectedFeeTypeIdValue) => {
                  const selectedType = handlingFeeTypes.find(type => type.id === selectedFeeTypeIdValue);
                  let feeAmount = 0;

                  if (selectedType) {
                    const parsedAmount = parseFloat(selectedType.constantValue.replace(/[^0-9.]/g, ''));
                    if (!isNaN(parsedAmount)) {
                      feeAmount = parsedAmount;
                    } else {
                      const parsedFromKey = selectedType.constantKey ? parseFloat(selectedType.constantKey.replace(/[^0-9.]/g, '')) : NaN;
                      if(!isNaN(parsedFromKey)){
                        feeAmount = parsedFromKey;
                      } else {
                         console.warn(`Fee amount not parseable from constantValue ('${selectedType.constantValue}') or constantKey for type ID ${selectedFeeTypeIdValue}. Defaulting to 0.`);
                      }
                    }
                  }
                  
                  form.setFieldsValue({ serviceFee: feeAmount });

                  setTimeout(() => {
                    const refundAmount = form.getFieldValue('refundAmount') || 0;
                    const currentServiceFee = form.getFieldValue('serviceFee') || 0;
                    const otherFee = form.getFieldValue('otherFee') || 0;
                    const actualRefund = refundAmount - currentServiceFee - otherFee;
                    form.setFieldsValue({ actualRefund: Math.max(0, actualRefund) });
                  }, 0);
                }}
              >
                {handlingFeeTypes.map(type => (
                  <Option key={type.id} value={type.id}>
                    {type.constantValue}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="serviceFee" hidden initialValue={0}>
                 <InputNumber /> 
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
                loading={loading.paymentMethods}
                dropdownMatchSelectWidth={true}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              >
                {paymentMethods.map(method => (
                  <Option key={method.id} value={method.id}>
                    {method.constantValue}
                  </Option>
                ))}
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
      </Form>
    </Modal>
  );
};

export default RefundModal; 