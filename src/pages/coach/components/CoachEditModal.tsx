import React, { useMemo } from 'react';
import { Modal, Form, Input, Radio, Select, DatePicker, Row, Col, Divider, Avatar, Spin } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { avatarOptions } from '../constants/avatarOptions';
import { Gender } from '../types/coach';
import './CoachEditModal.css';

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
  // 监听gender字段变化
  const gender = Form.useWatch('gender', form);
  
  // 使用useMemo处理头像背景色，避免在表单未准备好时使用form.getFieldValue
  const avatarStyle = useMemo(() => {
    // 如果有选择头像，则不需要设置背景色
    if (selectedAvatar) {
      return { marginBottom: 16 };
    }
    
    // 使用监听到的gender值，如果不存在则使用默认值
    const currentGender = gender || 'MALE';
    
    return {
      marginBottom: 16,
      backgroundColor: currentGender === 'MALE' ? '#1890ff' : '#eb2f96'
    };
  }, [selectedAvatar, gender]);

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>
          {editingCoach ? '编辑教练信息' : '添加教练'}
        </div>
      }
      open={visible}
      onOk={onSubmit}
      onCancel={onCancel}
      width={800}
      confirmLoading={loading}
      okText={editingCoach ? '保存' : '添加'}
      cancelText="取消"
    >
      <Spin spinning={loading} tip="加载中...">
        <Form
          form={form}
          layout="vertical"
          name="coachForm"
          initialValues={{
            status: 'ACTIVE',
            experience: 1,
            age: 25,
            // campusId 从 banner 组件获取
            baseSalary: 0,
            socialInsurance: 0,
            classFee: 0,
            performanceBonus: 0,
            commission: 0,
            dividend: 0,
          }}
        >
          <div style={{ 
            height: '1px', 
            background: '#f0f0f0', 
            margin: '10px 0 24px 0',
            position: 'relative'
          }}>
            {/* 基本信息背景覆盖 */}
            <div style={{ 
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '0 15px',
              background: '#fff',
              zIndex: 1
            }}>
              <h3 className="section-title" style={{ margin: 0 }}>基本信息</h3>
            </div>
          </div>

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
                      <Radio value="MALE">男</Radio>
                      <Radio value="FEMALE">女</Radio>
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
                    <Select
                      placeholder="请选择职位"
                      style={{ width: '100%' }}
                      options={[
                        { value: '高级教练', label: '高级教练' },
                        { value: '中级教练', label: '中级教练' },
                        { value: '初级教练', label: '初级教练' }
                      ]}
                      popupMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      className="job-title-select"
                    />
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
                    <Select
                      placeholder="请选择状态"
                      style={{ width: '100%' }}
                      options={[
                        { value: 'ACTIVE', label: '在职' },
                        { value: 'VACATION', label: '休假中' },
                        { value: 'RESIGNED', label: '已离职' }
                      ]}
                      popupMatchSelectWidth={true}
                      getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      className="status-select"
                    />
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
                    style={avatarStyle}
                    icon={!selectedAvatar && <UserOutlined />}
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

          {/* 分隔线 */}
          <div style={{ 
            height: '1px', 
            background: '#f0f0f0', 
            margin: '36px 0 10px 0',
            position: 'relative'
          }}>
            {/* 薪资信息背景覆盖 */}
            <div style={{ 
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '0 15px',
              background: '#fff',
              zIndex: 1
            }}>
              <h3 className="section-title" style={{ margin: 0 }}>薪资信息</h3>
            </div>
          </div>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
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
                name="socialInsurance"
                label="社保费"
                rules={[{ required: true, message: '请输入社保费' }]}
              >
                <Input type="number" placeholder="请输入社保费" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="classFee"
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
      </Spin>
    </Modal>
  );
};

export default CoachEditModal;