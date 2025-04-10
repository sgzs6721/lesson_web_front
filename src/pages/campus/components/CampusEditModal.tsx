import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Typography, Row, Col } from 'antd';
import { HomeOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { Campus } from '../types/campus';

const { Title } = Typography;
const { Option } = Select;

interface CampusEditModalProps {
  visible: boolean;
  loading: boolean;
  form: any;
  editingCampus: Campus | null;
  onCancel: () => void;
  onSubmit: () => void;
}

const CampusEditModal: React.FC<CampusEditModalProps> = ({
  visible,
  loading,
  form,
  editingCampus,
  onCancel,
  onSubmit
}) => {
  return (
    <Modal
      title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>{editingCampus ? '编辑校区' : '添加校区'}</div>}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      okText={editingCampus ? '保存' : '添加'}
      cancelText="取消"
      confirmLoading={loading}
    >
      <div style={{ borderBottom: '1px solid #e8e8e8', paddingBottom: '16px', marginBottom: '24px' }}>
        <Typography.Title level={5} style={{ margin: 0 }}>基本信息</Typography.Title>
      </div>
      <Form
        form={form}
        layout="vertical"
        name="campusForm"
        initialValues={{
          status: 'open',
          monthlyRent: 0,
          propertyFee: 0,
          utilitiesFee: 0,
        }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="校区名称"
              rules={[{ required: true, message: '请输入校区名称' }]}
            >
              <Input prefix={<HomeOutlined />} placeholder="请输入校区名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="address"
              label="地址"
              rules={[{ required: true, message: '请输入地址' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="请输入地址" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="open">营业中</Option>
                <Option value="closed">已关闭</Option>
                <Option value="renovating">装修中</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="monthlyRent"
              label="月租金"
              rules={[{ required: true, message: '请输入月租金' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="请输入月租金"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="propertyFee"
              label="物业费"
              rules={[{ required: true, message: '请输入物业费' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="请输入物业费"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="utilitiesFee"
              label="固定水电费"
              rules={[{ required: true, message: '请输入固定水电费' }]}
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="请输入固定水电费"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contactPerson"
              label="联系人"
            >
              <Input placeholder="请输入联系人" disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
            >
              <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" disabled />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CampusEditModal; 