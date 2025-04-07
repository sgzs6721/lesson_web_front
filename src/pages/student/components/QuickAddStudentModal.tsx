import React from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Row,
  Col,
  InputNumber,
  Alert
} from 'antd';
import { FormInstance } from 'antd/lib/form';

interface QuickAddStudentModalProps {
  visible: boolean;
  form: FormInstance;
  onOk: () => void;
  onCancel: () => void;
}

const QuickAddStudentModal: React.FC<QuickAddStudentModalProps> = ({
  visible,
  form,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={
        <span style={{ fontSize: '20px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
          添加新学员
        </span>
      }
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
      okText="确认添加"
      cancelText="取消"
      bodyStyle={{ padding: '24px 32px' }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ gender: 'male' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="学员姓名"
              rules={[{ required: true, message: '请输入学员姓名' }]}
            >
              <Input placeholder="请输入学员姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Radio.Group>
                <Radio value="male">男</Radio>
                <Radio value="female">女</Radio>
              </Radio.Group>
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
                { type: 'number', min: 1, max: 100, message: '年龄必须在1-100之间' }
              ]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="请输入年龄" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[
                { required: true, message: '请输入联系电话' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
              ]}
            >
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
        </Row>
        <Alert
          message="注意：此处添加的学员信息仅包含基本信息，可在学员管理页面进行详细编辑。"
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Form>
    </Modal>
  );
};

export default QuickAddStudentModal;