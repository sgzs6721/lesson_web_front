import React from 'react';
import { Modal, Form, Input, Radio, Select, DatePicker, Row, Col, Divider, Avatar } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { avatarOptions } from '../constants/avatarOptions';
import { Gender } from '../types/coach';

const { Option } = Select;
const { TextArea } = Input;

interface CoachEditModalProps {
  visible: boolean;
  loading: boolean;
  form: FormInstance;
  editingCoach: any; // 可以是null或教练对象
  selectedAvatar: string;
  onSubmit: () => void;
  onCancel: () => void;
  onAvatarSelect: (avatar: string) => void;
  onGenderChange: (value: any) => void;
}

const CoachEditModal: React.FC<CoachEditModalProps> = ({
  visible,
  loading,
  form,
  editingCoach,
  selectedAvatar,
  onSubmit,
  onCancel,
  onAvatarSelect,
  onGenderChange
}) => {
  return (
    <Modal
      title={editingCoach ? '编辑教练信息' : '添加教练'}
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      confirmLoading={loading}
      okText={editingCoach ? '保存' : '添加'}
      cancelText="取消"
    >
      <Divider style={{ margin: '0 0 24px 0' }} />
      <Form
        form={form}
        layout="vertical"
        name="coachForm"
        initialValues={{
          status: 'active',
          experience: 1,
          age: 25,
          performanceBonus: 0,
          commission: 0,
          dividend: 0,
        }}
      >
        <Divider orientation="left">基本信息</Divider>
        
        <Row gutter={24} justify="space-between">
          <Col span={16}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入教练姓名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="请输入教练姓名" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Radio.Group onChange={onGenderChange}>
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
                  rules={[{ required: true, message: '请输入年龄' }]}
                >
                  <Input type="number" placeholder="请输入年龄" />
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

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="jobTitle"
                  label="职位"
                  rules={[{ required: true, message: '请输入职位' }]}
                >
                  <Select placeholder="请选择职位">
                    <Option value="高级教练">高级教练</Option>
                    <Option value="中级教练">中级教练</Option>
                    <Option value="初级教练">初级教练</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="experience"
                  label="教龄(年)"
                  rules={[{ required: true, message: '请输入教龄' }]}
                >
                  <Input type="number" placeholder="请输入教龄" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="hireDate"
                  label="入职日期"
                  rules={[{ required: true, message: '请选择入职日期' }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                >
                  <Select placeholder="请选择状态">
                    <Option value="active">在职</Option>
                    <Option value="vacation">休假中</Option>
                    <Option value="resigned">已离职</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item
              name="certifications"
              label="持有证书"
              extra="每行输入一个证书"
            >
              <TextArea rows={4} placeholder="请输入持有的证书，每行一个" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="选择头像">
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <Avatar
                  size={100}
                  src={selectedAvatar}
                  style={{ marginBottom: 16 }}
                />
              </div>
              <div style={{ height: 310, overflow: 'auto', border: '1px solid #d9d9d9', borderRadius: 2, padding: 8 }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>男性头像</div>
                  <Row gutter={[8, 8]} justify="space-between">
                    {avatarOptions.male.map(avatar => (
                      <Col span={7} key={avatar.id} style={{ marginBottom: 12 }}>
                        <Avatar
                          size={48}
                          src={avatar.url}
                          style={{ 
                            cursor: 'pointer',
                            border: selectedAvatar === avatar.url ? '2px solid #1890ff' : 'none'
                          }}
                          onClick={() => onAvatarSelect(avatar.url)}
                        />
                      </Col>
                    ))}
                  </Row>
                  
                  <Divider style={{ margin: '12px 0' }} />
                  
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>女性头像</div>
                  <Row gutter={[8, 8]} justify="space-between">
                    {avatarOptions.female.map(avatar => (
                      <Col span={7} key={avatar.id} style={{ marginBottom: 12 }}>
                        <Avatar
                          size={48}
                          src={avatar.url}
                          style={{ 
                            cursor: 'pointer',
                            border: selectedAvatar === avatar.url ? '2px solid #1890ff' : 'none'
                          }}
                          onClick={() => onAvatarSelect(avatar.url)}
                        />
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Form.Item>
          </Col>
        </Row>
        
        <Divider orientation="left" style={{ marginTop: 16 }}>薪资信息</Divider>
        
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Form.Item
              name="baseSalary"
              label="基本工资"
              rules={[{ required: true, message: '请输入基本工资' }]}
            >
              <Input type="number" placeholder="请输入基本工资" prefix="¥" suffix="元" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="socialSecurity"
              label="社保费"
              rules={[{ required: true, message: '请输入社保费' }]}
            >
              <Input type="number" placeholder="请输入社保费" prefix="¥" suffix="元" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="hourlyRate"
              label="课时费"
              rules={[{ required: true, message: '请输入课时费' }]}
            >
              <Input type="number" placeholder="请输入课时费" prefix="¥" suffix="元/时" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Form.Item
              name="performanceBonus"
              label="绩效奖金"
              rules={[{ required: true, message: '请输入绩效奖金' }]}
            >
              <Input type="number" placeholder="请输入绩效奖金" prefix="¥" suffix="元" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="commission"
              label="提成"
              rules={[{ required: true, message: '请输入提成' }]}
            >
              <Input type="number" placeholder="请输入提成比例" suffix="%" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="dividend"
              label="分红"
              rules={[{ required: true, message: '请输入分红' }]}
            >
              <Input type="number" placeholder="请输入分红" prefix="¥" suffix="元" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CoachEditModal; 