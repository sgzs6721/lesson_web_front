import React, { useMemo } from 'react';
import { Modal, Form, Input, Radio, Select, DatePicker, Row, Col, Divider, Avatar, Spin } from 'antd';
import { UserOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { avatarOptions } from '../constants/avatarMap';
import './CoachEditModal.css';

const { TextArea } = Input;

// 手机号验证函数
const validatePhoneNumber = (_: any, value: string) => {
  // 如果值为空，由required规则处理
  if (!value || value.trim() === '') {
    return Promise.resolve();
  }

  // 去除空格和特殊字符
  const cleanValue = value.replace(/[\s-]/g, '');

  // 基本格式检查：11位数字，以1开头
  if (!/^1[3-9]\d{9}$/.test(cleanValue)) {
    return Promise.reject(new Error('请输入正确的11位手机号码'));
  }

  return Promise.resolve();
};

// 身份证号验证函数
const validateIdCard = (_: any, value: string) => {
  // 如果值为空，由required规则处理
  if (!value || value.trim() === '') {
    return Promise.resolve();
  }

  // 去除空格和特殊字符
  const cleanValue = value.replace(/[\s-]/g, '');

  // 检查长度：15位或18位
  if (cleanValue.length !== 15 && cleanValue.length !== 18) {
    return Promise.reject(new Error('身份证号必须是15位或18位'));
  }

  // 18位身份证号验证
  if (cleanValue.length === 18) {
    // 检查前17位是否都是数字
    const first17 = cleanValue.substring(0, 17);
    if (!/^\d{17}$/.test(first17)) {
      return Promise.reject(new Error('身份证号前17位必须是数字'));
    }

    // 检查最后一位校验码
    const lastChar = cleanValue.charAt(17);
    const validLastChars = '0123456789X';
    if (!validLastChars.includes(lastChar.toUpperCase())) {
      return Promise.reject(new Error('身份证号最后一位校验码不正确'));
    }

    // 验证出生日期
    const year = parseInt(cleanValue.substring(6, 10));
    const month = parseInt(cleanValue.substring(10, 12));
    const day = parseInt(cleanValue.substring(12, 14));
    
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
      return Promise.reject(new Error('身份证号中的出生日期不正确'));
    }

    // 验证年份范围（1900-当前年份）
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return Promise.reject(new Error('身份证号中的出生年份不正确'));
    }
  }

  // 15位身份证号验证（老身份证）
  if (cleanValue.length === 15) {
    if (!/^\d{15}$/.test(cleanValue)) {
      return Promise.reject(new Error('15位身份证号必须全部是数字'));
    }

    // 验证出生日期
    const year = parseInt('19' + cleanValue.substring(6, 8));
    const month = parseInt(cleanValue.substring(8, 10));
    const day = parseInt(cleanValue.substring(10, 12));
    
    const birthDate = new Date(year, month - 1, day);
    if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
      return Promise.reject(new Error('身份证号中的出生日期不正确'));
    }
  }

  return Promise.resolve();
};

// 入职日期验证函数 - 确保不能比执教日期早
const validateHireDate = (form: FormInstance) => (_: any, value: any) => {
  if (!value) {
    return Promise.resolve();
  }

  const hireDate = value.toDate ? value.toDate() : new Date(value);
  const coachingDate = form.getFieldValue('coachingDate');
  
  if (coachingDate) {
    const coachingDateObj = coachingDate.toDate ? coachingDate.toDate() : new Date(coachingDate);
    
    if (hireDate < coachingDateObj) {
      return Promise.reject(new Error('入职日期不能比执教日期早'));
    }
  }

  return Promise.resolve();
};

// 执教日期验证函数 - 确保不能比入职日期晚
const validateCoachingDate = (form: FormInstance) => (_: any, value: any) => {
  if (!value) {
    return Promise.resolve();
  }

  const coachingDate = value.toDate ? value.toDate() : new Date(value);
  const hireDate = form.getFieldValue('hireDate');
  
  if (hireDate) {
    const hireDateObj = hireDate.toDate ? hireDate.toDate() : new Date(hireDate);
    
    if (coachingDate > hireDateObj) {
      return Promise.reject(new Error('执教日期不能比入职日期晚'));
    }
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
  // 监听gender和workType字段变化
  const gender = Form.useWatch('gender', form);
  const workType = Form.useWatch('workType', form);
  


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

  // 使用默认的 Spin 组件样式

  return (
    <Modal
      title={
        <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'left' }}>
          {editingCoach ? '编辑教练信息' : '添加教练'}
        </div>
      }
      open={visible}
      onOk={(loading || detailLoading) ? undefined : onSubmit}
      onCancel={(loading || detailLoading) ? undefined : onCancel}
      width={800}
      confirmLoading={loading || detailLoading}
      okText={editingCoach ? '保存' : '添加'}
      cancelText="取消"
      maskClosable={!(loading || detailLoading)}
      closable={!(loading || detailLoading)}
      keyboard={!(loading || detailLoading)}
    >
      <Spin spinning={loading || detailLoading}>
        <Form
          form={form}
          layout="vertical"
          name="coachForm"
          initialValues={{
            status: 'ACTIVE',
            workType: 'FULLTIME',
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
              background: 'transparent',
              zIndex: 1001
            }}>
              <h3 className="section-title" style={{ margin: 0 }}>基本信息</h3>
            </div>
          </div>

          <Row gutter={24} justify="space-between">
            <Col span={16}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="gender"
                    label="性别"
                    htmlFor="coach_gender"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <div id="coach_gender" style={{ display: 'flex', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          border: '2px solid #d9d9d9',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#fff',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        className={gender === 'MALE' ? 'gender-option-selected' : 'gender-option'}
                        onClick={() => {
                          form.setFieldsValue({ gender: 'MALE' });
                          onGenderChange({ target: { value: 'MALE' } });
                          // 如果当前选中的头像不是男性头像，则选择第一个男性头像作为默认
                          if (!selectedAvatar || !avatarOptions.male.some(avatar => avatar.url === selectedAvatar)) {
                            onAvatarSelect(avatarOptions.male[0].url);
                          }
                        }}
                      >
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: gender === 'MALE' ? '#1890ff' : '#666'
                        }}>
                          男
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: gender === 'MALE' ? '#1890ff' : '#999',
                          marginTop: '1px'
                        }}>
                          Male
                        </div>
                        {gender === 'MALE' && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '12px',
                            height: '12px',
                            background: '#1890ff',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          border: '2px solid #d9d9d9',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#fff',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        className={gender === 'FEMALE' ? 'gender-option-selected' : 'gender-option'}
                        onClick={() => {
                          form.setFieldsValue({ gender: 'FEMALE' });
                          onGenderChange({ target: { value: 'FEMALE' } });
                          // 如果当前选中的头像不是女性头像，则选择第一个女性头像作为默认
                          if (!selectedAvatar || !avatarOptions.female.some(avatar => avatar.url === selectedAvatar)) {
                            onAvatarSelect(avatarOptions.female[0].url);
                          }
                        }}
                      >
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: gender === 'FEMALE' ? '#eb2f96' : '#666'
                        }}>
                          女
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: gender === 'FEMALE' ? '#eb2f96' : '#999',
                          marginTop: '1px'
                        }}>
                          Female
                        </div>
                        {gender === 'FEMALE' && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '12px',
                            height: '12px',
                            background: '#eb2f96',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="workType"
                    label="工作类型"
                    htmlFor="coach_work_type"
                    rules={[{ required: true, message: '请选择工作类型' }]}
                  >
                    <div id="coach_employment_type" style={{ display: 'flex', gap: '8px' }}>
                      <div
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          border: '2px solid #d9d9d9',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#fff',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        className={workType === 'FULLTIME' ? 'employment-option-selected' : 'employment-option'}
                        onClick={() => {
                          form.setFieldsValue({ workType: 'FULLTIME' });
                        }}
                      >
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: workType === 'FULLTIME' ? '#52c41a' : '#666'
                        }}>
                          全职
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: workType === 'FULLTIME' ? '#52c41a' : '#999',
                          marginTop: '1px'
                        }}>
                          Full-time
                        </div>
                        {workType === 'FULLTIME' && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '12px',
                            height: '12px',
                            background: '#52c41a',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          border: '2px solid #d9d9d9',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.3s ease',
                          backgroundColor: '#fff',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        className={workType === 'PARTTIME' ? 'employment-option-selected' : 'employment-option'}
                        onClick={() => {
                          form.setFieldsValue({ workType: 'PARTTIME' });
                        }}
                      >
                        <div style={{ 
                          fontSize: '13px', 
                          fontWeight: '500',
                          color: workType === 'PARTTIME' ? '#fa8c16' : '#666'
                        }}>
                          兼职
                        </div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: workType === 'PARTTIME' ? '#fa8c16' : '#999',
                          marginTop: '1px'
                        }}>
                          Part-time
                        </div>
                        {workType === 'PARTTIME' && (
                          <div style={{
                            position: 'absolute',
                            top: '6px',
                            left: '6px',
                            width: '12px',
                            height: '12px',
                            background: '#fa8c16',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '8px',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="姓名"
                    htmlFor="coach_name"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[{ required: true, message: '请输入教练姓名' }]}
                  >
                    <Input id="coach_name" prefix={<UserOutlined />} placeholder="请输入教练姓名" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="idNumber"
                    label="身份证号"
                    htmlFor="coach_id_number"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: '请输入身份证号' },
                      { validator: validateIdCard }
                    ]}
                  >
                    <Input 
                      id="coach_id_number" 
                      prefix={<IdcardOutlined />} 
                      placeholder="请输入身份证号" 
                      maxLength={18}
                    />
                  </Form.Item>
                </Col>
              </Row>



              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="coachingDate"
                    label="执教日期"
                    htmlFor="coach_coaching_date"
                    rules={[
                      { required: true, message: '请选择执教日期' },
                      { validator: validateCoachingDate(form) }
                    ]}
                  >
                    <DatePicker 
                      id="coach_coaching_date" 
                      style={{ width: '100%' }}
                      onChange={() => {
                        // 当执教日期改变时，重新验证入职日期
                        form.validateFields(['hireDate']);
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="hireDate"
                    label="入职日期"
                    htmlFor="coach_hire_date"
                    rules={[
                      { required: true, message: '请选择入职日期' },
                      { validator: validateHireDate(form) }
                    ]}
                  >
                    <DatePicker 
                      id="coach_hire_date" 
                      style={{ width: '100%' }}
                      onChange={() => {
                        // 当入职日期改变时，重新验证执教日期
                        form.validateFields(['coachingDate']);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="phone"
                    label="联系电话"
                    htmlFor="coach_phone"
                    validateTrigger={['onChange', 'onBlur']}
                    rules={[
                      { required: true, message: '请输入联系电话' },
                      { validator: validatePhoneNumber }
                    ]}
                  >
                    <Input 
                      id="coach_phone" 
                      prefix={<PhoneOutlined />} 
                      placeholder="请输入联系电话" 
                      maxLength={11}
                    />
                  </Form.Item>
                </Col>
                <Col span={8}>
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
                <Col span={8}>
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
              >
                <TextArea id="coach_certifications" rows={4} placeholder="请输入持有的证书，每行一个" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="选择头像" htmlFor="coach_avatar">
                <div id="coach_avatar" style={{ textAlign: 'center', marginBottom: 8 }}>
                  <Avatar
                    size={85}
                    src={selectedAvatar || (gender === 'MALE' ? avatarOptions.male[0]?.url : gender === 'FEMALE' ? avatarOptions.female[0]?.url : undefined)}
                    style={avatarStyle}
                    icon={!selectedAvatar && !gender && <UserOutlined />}
                  />
                </div>
                <div style={{ border: '1px solid #d9d9d9', borderRadius: 2, padding: 8, marginTop: 4 }}>
                  <div>
                    {!gender && (
                      <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        请先选择性别
                      </div>
                    )}
                    
                    {gender === 'MALE' && (
                      <>
                        <Row gutter={[8, 8]} justify="space-between">
                          {avatarOptions.male.map(avatar => (
                            <Col span={7} key={avatar.id} style={{ marginBottom: 12 }}>
                              <Avatar
                                size={48}
                                src={avatar.url}
                                style={{
                                  cursor: 'pointer',
                                  border: (selectedAvatar || avatarOptions.male[0].url) === avatar.url ? '2px solid #1890ff' : 'none'
                                }}
                                onClick={() => onAvatarSelect(avatar.url)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                    
                    {gender === 'FEMALE' && (
                      <>
                        <Row gutter={[8, 8]} justify="space-between">
                          {avatarOptions.female.map(avatar => (
                            <Col span={7} key={avatar.id} style={{ marginBottom: 12 }}>
                              <Avatar
                                size={48}
                                src={avatar.url}
                                style={{
                                  cursor: 'pointer',
                                  border: (selectedAvatar || avatarOptions.female[0].url) === avatar.url ? '2px solid #1890ff' : 'none'
                                }}
                                onClick={() => onAvatarSelect(avatar.url)}
                              />
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
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
              background: 'transparent',
              zIndex: 1001
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
                name="guaranteedHours"
                label="保底课时"
                htmlFor="coach_guaranteed_hours"
                rules={[{ required: true, message: '请输入保底课时' }]}
              >
                <Input id="coach_guaranteed_hours" type="number" placeholder="请输入保底课时" suffix="时" />
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
            <Col span={6}>
              <Form.Item
                name="socialInsurance"
                label="社保费"
                htmlFor="coach_social_insurance"
                rules={[{ required: true, message: '请输入社保费' }]}
              >
                <Input id="coach_social_insurance" type="number" placeholder="请输入社保费" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="performanceBonus"
                label="绩效奖金"
                htmlFor="coach_performance_bonus"
                rules={[{ required: true, message: '请输入绩效奖金' }]}
              >
                <Input id="coach_performance_bonus" type="number" placeholder="请输入绩效奖金" prefix="¥" suffix="元" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="commission"
                label="提成"
                htmlFor="coach_commission"
                rules={[{ required: true, message: '请输入提成' }]}
              >
                <Input id="coach_commission" type="number" placeholder="请输入提成比例" suffix="%" />
              </Form.Item>
            </Col>
            <Col span={6}>
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
      </Spin>
    </Modal>
  );
};

export default CoachEditModal;