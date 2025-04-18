import React, { useMemo } from 'react';
import { Modal, Form, Input, Radio, Select, DatePicker, Row, Col, Divider, Avatar, Spin } from 'antd';
import { UserOutlined, PhoneOutlined, LoadingOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { avatarOptions } from '../constants/avatarOptions';
import { Gender } from '../types/coach';
import './CoachEditModal.css';
import dayjs from 'dayjs';

const { TextArea } = Input;

// 手机号验证函数
const validatePhoneNumber = (_: any, value: string) => {
  if (!value) {
    return Promise.reject(new Error('请输入联系电话'));
  }

  // 基本格式检查：11位数字，以1开头
  if (!/^1\d{10}$/.test(value)) {
    return Promise.reject(new Error('手机号必须是11位数字且以1开头'));
  }

  // 运营商前缀检查
  const validPrefixes = [
    // 移动
    '134', '135', '136', '137', '138', '139', '150', '151', '152', '157', '158', '159',
    '182', '183', '184', '187', '188', '147', '178', '198',
    // 联通
    '130', '131', '132', '155', '156', '185', '186', '145', '146', '166', '175', '176',
    // 电信
    '133', '153', '180', '181', '189', '177', '173', '199',
    // 虚拟运营商
    '170', '171'
  ];

  const prefix = value.substring(0, 3);
  if (!validPrefixes.includes(prefix)) {
    return Promise.reject(new Error('请输入有效的手机号码前缀'));
  }

  return Promise.resolve();
};

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
  formLoading?: boolean; // 表单提交时的加载状态
  detailLoading?: boolean; // 加载详情时的加载状态
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
  onGenderChange,
  detailLoading = false
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

  // 自定义加载图标，使其更大更明显
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>
          {editingCoach ? '编辑教练信息' : '添加教练'}
        </div>
      }
      open={visible}
      onOk={loading ? undefined : onSubmit}
      onCancel={loading ? undefined : onCancel}
      width={800}
      confirmLoading={loading}
      okText={editingCoach ? '保存' : '添加'}
      cancelText="取消"
      maskClosable={!loading}
      closable={!loading}
      keyboard={!loading}
    >
      <div className="coach-modal-content-wrapper" style={{ position: 'relative' }}>
        {loading && (
          <div className="coach-modal-loading-mask" onClick={(e) => e.stopPropagation()}>
            <Spin
              indicator={antIcon}
              tip={loading && !detailLoading ? "正在保存中...请稍候" : "正在加载数据...请稍候"}
              size="large"
            />
          </div>
        )}
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
                    htmlFor="coach_name"
                    rules={[{ required: true, message: '请输入教练姓名' }]}
                  >
                    <Input id="coach_name" prefix={<UserOutlined />} placeholder="请输入教练姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="性别"
                    htmlFor="coach_gender"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <Radio.Group id="coach_gender" onChange={onGenderChange}>
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
                    htmlFor="coach_age"
                    rules={[{ required: true, message: '请输入年龄' }]}
                  >
                    <Input id="coach_age" type="number" placeholder="请输入年龄" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    htmlFor="coach_phone"
                    rules={[
                      { validator: validatePhoneNumber }
                    ]}
                  >
                    <Input id="coach_phone" prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="jobTitle"
                    label="职位"
                    htmlFor="coach_job_title"
                    rules={[{ required: true, message: '请输入职位' }]}
                  >
                    <Select
                      id="coach_job_title"
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
                    htmlFor="coach_experience"
                    rules={[{ required: true, message: '请输入教龄' }]}
                  >
                    <Input id="coach_experience" type="number" placeholder="请输入教龄" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="hireDate"
                    label="入职日期"
                    htmlFor="coach_hire_date"
                    rules={[{ required: true, message: '请选择入职日期' }]}
                  >
                    <DatePicker id="coach_hire_date" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="状态"
                    htmlFor="coach_status"
                    rules={[{ required: true, message: '请选择状态' }]}
                  >
                    <Select
                      id="coach_status"
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
                htmlFor="coach_certifications"
                extra="每行输入一个证书"
              >
                <TextArea id="coach_certifications" rows={4} placeholder="请输入持有的证书，每行一个" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="选择头像" htmlFor="coach_avatar">
                <div id="coach_avatar" style={{ textAlign: 'center', marginBottom: 16 }}>
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
                htmlFor="coach_base_salary"
                rules={[{ required: true, message: '请输入基本工资' }]}
              >
                <Input id="coach_base_salary" type="number" placeholder="请输入基本工资" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="socialInsurance"
                label="社保费"
                htmlFor="coach_social_insurance"
                rules={[{ required: true, message: '请输入社保费' }]}
              >
                <Input id="coach_social_insurance" type="number" placeholder="请输入社保费" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="classFee"
                label="课时费"
                htmlFor="coach_class_fee"
                rules={[{ required: true, message: '请输入课时费' }]}
              >
                <Input id="coach_class_fee" type="number" placeholder="请输入课时费" prefix="¥" suffix="元/时" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col span={8}>
              <Form.Item
                name="performanceBonus"
                label="绩效奖金"
                htmlFor="coach_performance_bonus"
                rules={[{ required: true, message: '请输入绩效奖金' }]}
              >
                <Input id="coach_performance_bonus" type="number" placeholder="请输入绩效奖金" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="commission"
                label="提成"
                htmlFor="coach_commission"
                rules={[{ required: true, message: '请输入提成' }]}
              >
                <Input id="coach_commission" type="number" placeholder="请输入提成比例" suffix="%" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="dividend"
                label="分红"
                htmlFor="coach_dividend"
                rules={[{ required: true, message: '请输入分红' }]}
              >
                <Input id="coach_dividend" type="number" placeholder="请输入分红" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default CoachEditModal;