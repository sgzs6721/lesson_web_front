import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Typography, Row, Col, Spin, Divider } from 'antd';
import { HomeOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { Campus } from '../types/campus';

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
  // 监听编辑校区变化，确保状态值正确设置
  useEffect(() => {
    if (editingCampus && editingCampus.status) {
      console.log('编辑校区变化，状态值:', editingCampus.status);
      // 使用 setTimeout 来避免循环引用
      setTimeout(() => {
        // 检查当前表单值是否与 editingCampus 中的状态值不同
        const currentStatus = form.getFieldValue('status');
        if (currentStatus !== editingCampus.status) {
          form.setFieldValue('status', editingCampus.status);
        }
      }, 0);
    }
  }, [editingCampus]);

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
      okButtonProps={{ disabled: loading }}
      maskClosable={!loading} // 在加载时禁止点击蒙板关闭
      styles={{ body: { padding: '0 24px 24px' } }}
    >

      <Divider style={{ margin: '0 0 24px 0' }} />
      <Spin spinning={loading} tip="加载中...">
        <Form
          form={form}
          layout="vertical"
          name="campusForm"
          initialValues={{
            status: 'OPERATING', // 默认状态为营业中
            monthlyRent: 0,
            propertyFee: 0,
            utilityFee: 0,
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
              <Select
                placeholder="请选择状态"
                popupMatchSelectWidth={true}
                getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
              >
                <Option value="OPERATING">营业中</Option>
                <Option value="CLOSED">已关闭</Option>
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
              name="utilityFee"
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
      </Spin>
    </Modal>
  );
};

export default CampusEditModal;