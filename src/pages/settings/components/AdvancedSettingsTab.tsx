import React from 'react';
import { Form, Switch, InputNumber, Select, Button, Row, Col, Divider } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import FormCard from './FormCard';
import { IAdvancedSettings } from '../types';
import { LOG_LEVELS } from '../constants';

const { Option } = Select;

interface IAdvancedSettingsTabProps {
  form: FormInstance<IAdvancedSettings>;
  onSave: (values: IAdvancedSettings) => void;
}

const AdvancedSettingsTab: React.FC<IAdvancedSettingsTabProps> = ({
  form,
  onSave
}) => {
  return (
    <FormCard>
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="缓存设置"
              name="enableCache"
              valuePropName="checked"
            >
              <Switch /> <span style={{ marginLeft: 8 }}>启用系统缓存</span>
            </Form.Item>
            
            <Form.Item
              name="cacheExpirationTime"
              label="缓存过期时间（分钟）"
              rules={[{ required: true, message: '请输入缓存过期时间' }]}
            >
              <InputNumber min={1} max={1440} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="日志设置"
              name="enableLogs"
              valuePropName="checked"
            >
              <Switch /> <span style={{ marginLeft: 8 }}>启用系统日志</span>
            </Form.Item>
            
            <Form.Item
              name="logLevel"
              label="日志级别"
              rules={[{ required: true, message: '请选择日志级别' }]}
            >
              <Select placeholder="请选择日志级别">
                {LOG_LEVELS.map(level => (
                  <Option key={level.value} value={level.value}>{level.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider />
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="maxUploadFileSize"
              label="最大上传文件大小（MB）"
              rules={[{ required: true, message: '请输入最大上传文件大小' }]}
            >
              <InputNumber min={1} max={100} style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="maxSessionDuration"
              label="最大会话持续时间（分钟）"
              rules={[{ required: true, message: '请输入最大会话持续时间' }]}
            >
              <InputNumber min={5} max={1440} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="维护模式"
              name="enableMaintenance"
              valuePropName="checked"
            >
              <Switch /> <span style={{ marginLeft: 8 }}>启用系统维护模式</span>
            </Form.Item>
            
            <Form.Item
              label="用户注册"
              name="enableUserRegistration"
              valuePropName="checked"
            >
              <Switch /> <span style={{ marginLeft: 8 }}>允许新用户注册</span>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider />
        
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </FormCard>
  );
};

export default AdvancedSettingsTab; 