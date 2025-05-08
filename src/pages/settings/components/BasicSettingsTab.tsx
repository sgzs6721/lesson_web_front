import React from 'react';
import { Form, Input, Select, Upload, Button, Row, Col, Divider } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { UploadFile } from 'antd/lib/upload/interface';
import FormCard from './FormCard';
import { IBasicSettings } from '../types';
import { SYSTEM_THEMES, SYSTEM_LANGUAGES } from '../constants';

interface IBasicSettingsTabProps {
  form: FormInstance<IBasicSettings>;
  logoFileList: UploadFile[];
  handleLogoChange: (info: { fileList: UploadFile[] }) => void;
  beforeUpload: (file: File) => boolean;
  onSave: (values: IBasicSettings) => void;
}

const BasicSettingsTab: React.FC<IBasicSettingsTabProps> = ({
  form,
  logoFileList,
  handleLogoChange,
  beforeUpload,
  onSave
}) => {
  // 自定义 Upload 组件的值转换函数
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList || [];
  };

  // 确保 logoFileList 始终是数组
  const safeLogoFileList = Array.isArray(logoFileList) ? logoFileList : [];
  
  // 空的文件列表数组
  const emptyFileList: UploadFile[] = [];

  return (
    <FormCard title="基础设置">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="institutionTitle"
              label="主页标题"
              rules={[{ required: true, message: '请输入主页标题' }]}
            >
              <Input placeholder="请输入主页标题" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="institutionSubtitle"
              label="主页副标题"
              rules={[{ required: true, message: '请输入主页副标题' }]}
            >
              <Input placeholder="请输入主页副标题" />
            </Form.Item>
          </Col>
        </Row>
      
        <Divider />
        
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="systemLogo"
              label="系统Logo"
              extra="推荐尺寸: 200x50px, 支持PNG, JPG格式"
            >
              <Upload
                listType="picture-card"
                fileList={safeLogoFileList}
                onChange={handleLogoChange}
                beforeUpload={beforeUpload}
                maxCount={1}
              >
                {safeLogoFileList.length >= 1 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>上传</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="theme"
              label="系统主题"
              rules={[{ required: true, message: '请选择系统主题' }]}
            >
              <Select 
                placeholder="请选择系统主题"
                options={SYSTEM_THEMES}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="favicon"
              label="系统图标"
              extra="推荐尺寸: 32x32px, 支持ICO, PNG格式"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={beforeUpload}
                fileList={emptyFileList}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="language"
              label="系统语言"
              rules={[{ required: true, message: '请选择系统语言' }]}
            >
              <Select 
                placeholder="请选择系统语言"
                options={SYSTEM_LANGUAGES}
              />
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

export default BasicSettingsTab; 