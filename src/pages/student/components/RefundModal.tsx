import React from 'react';
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

const { Option } = Select;
const { TextArea } = Input;

interface RefundModalProps {
  visible: boolean;
  form: FormInstance;
  student: Student | null;
  studentCourses: CourseSummary[];
  onCancel: () => void;
  onOk: () => void;
}

const RefundModal: React.FC<RefundModalProps> = ({
  visible,
  form,
  student,
  studentCourses,
  onCancel,
  onOk
}) => {
  // 添加提交loading状态
  const [submitLoading, setSubmitLoading] = React.useState(false);

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
        
        // 设置表单值
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          fromCourseId: defaultCourse.name, // 使用课程名称
          _courseId: defaultCourse.id, // 隐藏字段保存课程ID
          refundClassHours: remainingHours,
          operationType: 'refund' // 确保设置operationType
        });
      } else {
        form.setFieldsValue({
          studentName: student.name,
          studentId: student.id,
          operationType: 'refund'
        });
      }
    }
  }, [visible, student, studentCourses, form]);

  return (
    <Modal
      title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>退费</span>}
      open={visible}
      onOk={() => {
        console.log('确认提交按钮点击');
        // 设置提交中状态
        setSubmitLoading(true);
        // 在调用onOk之前，确保operationType字段被正确设置
        form.setFieldsValue({ operationType: 'refund' });
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
      </Form>
    </Modal>
  );
};

export default RefundModal; 