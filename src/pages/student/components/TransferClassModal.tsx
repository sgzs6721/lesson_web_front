import React from 'react';
import { Modal, Form, Input, Select, Spin, InputNumber, DatePicker, message } from 'antd';
import { Student } from '../types/student';
import { SimpleCourse } from '@/api/course/types';

interface TransferClassModalProps {
  visible: boolean;
  loading: boolean;
  form: any; // antd Form instance
  currentStudent: Student | null;
  availableCourses: SimpleCourse[]; // 可选的目标课程
  originalCourseId: string | number | null; // 原课程 ID
  maxTransferHours: number; // 最大可转课时
  onOk: () => void;
  onCancel: () => void;
}

export const TransferClassModal: React.FC<TransferClassModalProps> = ({
  visible,
  loading,
  form,
  currentStudent,
  availableCourses,
  originalCourseId,
  maxTransferHours,
  onOk,
  onCancel,
}) => {

  return (
    <>
      <Modal
        title="学员转班 (转课程)"
        open={visible}
        onOk={onOk}
        onCancel={onCancel}
        confirmLoading={loading}
        destroyOnClose
        width={600}
      >
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" name="transferClassForm">
            <Form.Item name="studentName" label="学员姓名">
              <Input readOnly />
            </Form.Item>
            <Form.Item name="fromCourseId" label="原课程">
              <Input readOnly />
            </Form.Item>
            <Form.Item name="_courseId" hidden><Input /></Form.Item>
            <Form.Item name="refundClassHours" hidden><Input /></Form.Item>

            <Form.Item
              name="toCourseId"
              label="新课程"
              rules={[{ required: true, message: '请选择新课程' }]}
            >
              <Select placeholder="请选择新课程" showSearch optionFilterProp="children">
                {availableCourses.map((course) => (
                  <Select.Option key={course.id} value={course.id}>
                    {course.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="transferClassHours"
              label="转班课时"
              rules={[{ required: true, message: '请输入转班课时' }]}
            >
              <InputNumber
                min={1}
                max={maxTransferHours > 0 ? maxTransferHours : undefined}
                style={{ width: '100%' }}
                placeholder="要转多少课时到新课程"
                onChange={(value) => {
                  if (maxTransferHours > 0 && value && value > maxTransferHours) {
                    form.setFieldsValue({transferClassHours: maxTransferHours});
                    message.warning(`最多可转 ${maxTransferHours} 课时`);
                  }
                }}
              />
            </Form.Item>
            {maxTransferHours > 0 && (
              <div style={{ marginTop: '-20px', marginBottom: '20px', fontSize: '12px', color: '#999' }}>
                当前课程最大可转课时: {maxTransferHours}
              </div>
            )}
            <Form.Item
              name="priceDifference"
              label="补差价"
              tooltip="负数表示退还差价"
              initialValue={0}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value ? parseFloat(value.replace(/[^\d.-]/g, '')) : 0}
              />
            </Form.Item>
            <Form.Item
              name="validUntil"
              label="新有效期至"
              rules={[{ required: true, message: '请选择新课程有效期' }]}
            >
              <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="请选择新课程有效期" />
            </Form.Item>
            <Form.Item
              name="reason"
              label="转班原因"
              rules={[{ required: true, message: '请输入转班原因' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入转班原因" />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}; 