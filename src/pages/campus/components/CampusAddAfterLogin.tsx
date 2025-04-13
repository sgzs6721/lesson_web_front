import React from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, Typography, message } from 'antd';
import { HomeOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHasCampus, setCampusModalVisible } from '@/redux/slices/authSlice';
import { API } from '@/api';
import type { CampusCreateParams } from '@/api/campus/types';

const { Option } = Select;

interface CampusAddAfterLoginProps {
  visible: boolean;
  loading: boolean;
  form: any;
  onCancel: () => void;
  onSuccess?: () => void;
}

const CampusAddAfterLogin: React.FC<CampusAddAfterLoginProps> = ({
  visible,
  loading,
  form,
  onCancel,
  onSuccess
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // 直接使用表单的所有值
      console.log('准备创建校区:', values);

      // 调用API创建校区
      await API.campus.create(values);

      // 校区创建成功
      message.success('校区创建成功');

      // 更新状态
      dispatch(setHasCampus(true));
      dispatch(setCampusModalVisible(false));

      // 重置表单
      form.resetFields();

      // 调用成功回调
      if (onSuccess) {
        onSuccess();
      }

      // 跳转到首页
      navigate('/dashboard');
    } catch (error: any) {
      console.error('创建校区失败:', error);
      message.error(error.message || '创建校区失败，请重试');
    }
  };

  return (
    <Modal
      title={<div style={{ fontSize: '18px', fontWeight: 'bold' }}>添加校区</div>}
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      width={800}
      okText="添加"
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
          status: 'OPERATING',
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
              <Select placeholder="请选择状态">
                <Option value="OPERATING">营业中</Option>
                <Option value="CLOSED">已关闭</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 登录模态框中不显示这些字段 */}
        {window.location.pathname === '/' ? null : (
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
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="contactPerson"
              label="联系人"
            >
              <Input placeholder="请输入联系人" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="联系电话"
              rules={[{ required: true, message: '请输入联系电话' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CampusAddAfterLogin;
