import React from 'react';
import { Modal, Form, DatePicker, Input, Select, Button, Divider } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { FormInstance } from 'antd/lib/form';
import { COURSE_TYPES, PAYMENT_METHOD, PAYMENT_STATUS, PAYMENT_TYPE } from '../constants/paymentTypes';

const { Option } = Select;

interface PaymentEditModalProps {
  visible: boolean;
  loading: boolean;
  form: FormInstance;
  editingId: string | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const PaymentEditModal: React.FC<PaymentEditModalProps> = ({
  visible,
  loading,
  form,
  editingId,
  onCancel,
  onSubmit
}) => {
  return (
    <Modal
      title={editingId ? "编辑付款记录" : "添加付款记录"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onSubmit}>
          保存
        </Button>,
      ]}
      maskClosable={false}
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="日期"
          name="date"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            placeholder="选择日期"
            locale={locale}
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          label="学员姓名"
          name="studentName"
          rules={[{ required: true, message: '请输入学员姓名' }]}
        >
          <Input placeholder="请输入学员姓名" />
        </Form.Item>

        <Form.Item
          name="studentId"
          hidden
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="课程"
          name="course"
          rules={[{ required: true, message: '请选择课程' }]}
        >
          <Select
            placeholder="请选择课程"
            className="custom-select"
            popupClassName="custom-select-dropdown"
            showSearch={false}
            virtual={false}
          >
            <Option value={COURSE_TYPES.JUNIOR}>{COURSE_TYPES.JUNIOR}</Option>
            <Option value={COURSE_TYPES.INTERMEDIATE}>{COURSE_TYPES.INTERMEDIATE}</Option>
            <Option value={COURSE_TYPES.ADVANCED}>{COURSE_TYPES.ADVANCED}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="金额"
          name="amount"
          rules={[
            { required: true, message: '请输入金额' },
            { type: 'number', min: 0, message: '金额必须大于等于0' }
          ]}
        >
          <Input type="number" prefix="¥" suffix="CNY" />
        </Form.Item>

        <Form.Item
          label="课时类型"
          name="paymentType"
          rules={[{ required: true, message: '请选择课时类型' }]}
        >
          <Select
            placeholder="请选择课时类型"
            className="custom-select"
            popupClassName="custom-select-dropdown"
            showSearch={false}
            virtual={false}
          >
            <Option value={PAYMENT_TYPE.TYPE_30}>{PAYMENT_TYPE.TYPE_30}</Option>
            <Option value={PAYMENT_TYPE.TYPE_50}>{PAYMENT_TYPE.TYPE_50}</Option>
            <Option value={PAYMENT_TYPE.TYPE_100}>{PAYMENT_TYPE.TYPE_100}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="缴费类型"
          name="paymentMethod"
          rules={[{ required: true, message: '请选择缴费类型' }]}
        >
          <Select
            placeholder="请选择缴费类型"
            className="custom-select"
            popupClassName="custom-select-dropdown"
            showSearch={false}
            virtual={false}
          >
            <Option value={PAYMENT_METHOD.NEW}>{PAYMENT_METHOD.NEW}</Option>
            <Option value={PAYMENT_METHOD.REFUND}>{PAYMENT_METHOD.REFUND}</Option>
            <Option value={PAYMENT_METHOD.RENEWAL}>{PAYMENT_METHOD.RENEWAL}</Option>
            <Option value={PAYMENT_METHOD.SUPPLEMENT}>{PAYMENT_METHOD.SUPPLEMENT}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="支付状态"
          name="status"
          rules={[{ required: true, message: '请选择支付状态' }]}
        >
          <Select
            placeholder="请选择支付状态"
            className="custom-select"
            popupClassName="custom-select-dropdown"
            showSearch={false}
            virtual={false}
          >
            <Option value={PAYMENT_STATUS.WECHAT}>{PAYMENT_STATUS.WECHAT}</Option>
            <Option value={PAYMENT_STATUS.CASH}>{PAYMENT_STATUS.CASH}</Option>
            <Option value={PAYMENT_STATUS.ALIPAY}>{PAYMENT_STATUS.ALIPAY}</Option>
            <Option value={PAYMENT_STATUS.BANK}>{PAYMENT_STATUS.BANK}</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentEditModal; 