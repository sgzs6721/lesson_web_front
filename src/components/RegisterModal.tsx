import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '@/redux/slices/authSlice';
import './Modal.css'; // 引入模态框样式

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess?: (phone: string) => void; // 新增：注册成功回调，传递手机号
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onRegisterSuccess }) => {
  const dispatch = useDispatch(); // 获取 dispatch
  const navigate = useNavigate(); // 获取 navigate
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState(''); // 机构联系电话 (主联系方式)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 新增：确认密码
  const [representativeName, setRepresentativeName] = useState(''); // 新增：机构负责人
  const [description, setDescription] = useState(''); // 新增：机构描述 (可选)
  
  // 添加各字段的错误状态
  const [orgNameError, setOrgNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [representativeNameError, setRepresentativeNameError] = useState('');
  const [error, setError] = useState(''); // 通用错误信息
  
  const [loading, setLoading] = useState(false); // 新增：loading 状态
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // 新增：显示成功模态框状态

  // 验证手机号格式
  const validatePhone = (value: string) => {
    if (!value) {
      return true; // 空值视为有效
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    return value.length === 11 && phoneRegex.test(value);
  };

  // 验证机构名称
  const validateOrgName = (value: string) => {
    if (!value) {
      return false;
    }
    
    return value.length > 0 && value.length <= 12;
  };

  // 验证密码格式
  const validatePassword = (value: string) => {
    if (!value) {
      return false;
    }
    
    return value.length >= 8;
  };

  // 验证确认密码
  const validateConfirmPassword = (value: string) => {
    if (!value) {
      return false;
    }
    
    return value === password;
  };

  // 验证负责人姓名
  const validateRepresentativeName = (value: string) => {
    if (!value) {
      return false;
    }
    
    return value.length > 0;
  };
  
  // 检查表单是否有效 - 纯函数不设置状态
  const isFormValid = () => {
    const isPhoneValid = validatePhone(phone);
    const isOrgNameValid = validateOrgName(orgName);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isRepresentativeNameValid = validateRepresentativeName(representativeName);
    
    return isPhoneValid && 
           isOrgNameValid && 
           isPasswordValid && 
           isConfirmPasswordValid && 
           isRepresentativeNameValid;
  };
  
  // 手机号输入处理 - 简化逻辑
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入数字，且最多11位
    if (value === '' || (/^\d+$/.test(value) && value.length <= 11)) {
      setPhone(value);
      
      // 只在有实际值时验证
      if (value && value.length === 11) {
        const isValid = /^1[3-9]\d{9}$/.test(value);
        setPhoneError(isValid ? '' : '请输入正确的手机号格式');
      } else if (value && value.length > 0) {
        setPhoneError('手机号必须是11位');
      } else {
        setPhoneError('');
      }
    }
  };
  
  // 机构名称输入处理
  const handleOrgNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrgName(value);
    // 简单验证
    if (value && value.length > 12) {
      setOrgNameError('机构名称不能超过12个字');
    } else {
      setOrgNameError('');
    }
  };
  
  // 密码输入处理
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // 验证密码
    if (value && value.length > 0 && value.length < 8) {
      setPasswordError('密码长度至少为8位');
    } else {
      setPasswordError('');
    }
    
    // 如果已经输入了确认密码，验证一致性
    if (confirmPassword) {
      setConfirmPasswordError(value === confirmPassword ? '' : '两次输入的密码不一致');
    }
  };
  
  // 确认密码输入处理
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value) {
      setConfirmPasswordError(value === password ? '' : '两次输入的密码不一致');
    } else {
      setConfirmPasswordError('');
    }
  };
  
  // 负责人姓名输入处理
  const handleRepresentativeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRepresentativeName(value);
    setRepresentativeNameError(''); // 简单清除错误
  };

  // 处理立即登录按钮点击
  const handleLoginNow = () => {
    console.log('点击立即登录按钮，手机号:', phone);
    if (onRegisterSuccess) {
      // 重置表单
      resetForm();
      // 关闭成功模态框
      setShowSuccessModal(false);
      // 关闭注册模态框并调用注册成功回调（打开登录模态框）
      onClose();
      onRegisterSuccess(phone);
    }
  };

  // 处理稍后登录按钮点击
  const handleLoginLater = () => {
    console.log('点击稍后登录按钮');
    // 重置表单
    resetForm();
    // 关闭成功模态框和注册模态框
    setShowSuccessModal(false);
    onClose();
  };

  // 重置表单函数
  const resetForm = () => {
    setOrgName('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setRepresentativeName('');
    setDescription('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(false);
    setLoading(true); // 开始 loading

    console.log('点击注册按钮，开始处理表单提交');

    try {
      // 使用验证函数再次验证表单
      if (!isFormValid()) {
        setLoading(false);
        return;
      }

      // 检查手机号的合法性（如果有值）
      if (phone && (phone.length !== 11 || !validatePhone(phone))) {
        setPhoneError('请输入正确的手机号码格式');
        setLoading(false);
        return;
      }

      // 调用注册 action
      console.log('准备调用注册 action');
      const registerParams = {
        password,
        institutionName: orgName,
        institutionDescription: description || undefined, // 如果为空字符串则设为undefined
        managerName: representativeName,
        managerPhone: phone
      };
      console.log('注册参数:', registerParams);

      const result = await dispatch(register(registerParams) as any);
      console.log('注册 action 返回结果:', result);

      // 检查注册结果
      console.log('检查注册结果:', result);

      if (result.type && result.type.endsWith('/fulfilled')) {
        // 注册成功
        console.log('注册成功');
        setSuccess(true);
        setLoading(false);
        
        // 显示成功模态框
        setShowSuccessModal(true);
      } else if (result.type && result.type.endsWith('/rejected')) {
        // 注册失败 - 上方已显示错误，这里不再显示
        console.error('注册失败:', result.error);
        setLoading(false);
      }
    } catch (err: any) {
      console.error('注册过程出错:', err);
      // 只显示网络相关错误
      const errMsg = err.message || '注册失败，请稍后再试';
      if (errMsg.includes('网络') || errMsg.includes('连接') || errMsg.includes('超时')) {
        setError(errMsg);
      }
      setLoading(false);
    }
  };

  // 添加 ESC 键关闭功能
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}> {/* 可能需要更大宽度 */}
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h3 className="modal-title">注册机构账号</h3>
        </div>
        <div className="modal-body">
          {showSuccessModal ? (
            <div className="success-modal">
              <div className="success-icon">✓</div>
              <h4 className="success-title">注册成功！</h4>
              <p className="success-message">您的机构账号已创建成功</p>
              <p className="success-institution">机构名称: {orgName}</p>
              <p className="success-phone">登录手机号: {phone}</p>
              <div className="button-group">
                <button
                  type="button"
                  className="later-btn"
                  onClick={handleLoginLater}
                >
                  稍后登录
                </button>
                <button
                  type="button"
                  className="login-now-btn"
                  onClick={handleLoginNow}
                >
                  立即登录
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="register-orgName">机构名称 <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  id="register-orgName"
                  value={orgName}
                  onChange={handleOrgNameChange}
                  placeholder="请输入机构名称"
                  required
                  disabled={loading}
                />
                {orgNameError && <p className="error-message">{orgNameError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="register-representativeName">机构负责人 <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  id="register-representativeName"
                  value={representativeName}
                  onChange={handleRepresentativeNameChange}
                  placeholder="请输入负责人姓名"
                  required
                  disabled={loading}
                />
                {representativeNameError && <p className="error-message">{representativeNameError}</p>}
              </div>
               <div className="form-group">
                <label htmlFor="register-phone">机构联系电话 <span className="required-asterisk">*</span></label>
                <input
                  type="tel"
                  id="register-phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="用于登录的手机号码"
                  required
                  disabled={loading}
                />
                {phoneError && <p className="error-message">{phoneError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="register-password">设置密码 <span className="required-asterisk">*</span></label>
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="请输入密码（至少8位）"
                  required
                  disabled={loading}
                />
                {passwordError && <p className="error-message">{passwordError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="register-confirmPassword">确认密码 <span className="required-asterisk">*</span></label>
                <input
                  type="password"
                  id="register-confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="请再次输入密码"
                  required
                  disabled={loading}
                />
                {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
              </div>
              <div className="form-group">
                <label htmlFor="register-description">机构描述</label>
                <textarea
                  id="register-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="选填，简单介绍一下您的机构"
                  rows={3}
                  disabled={loading}
                />
              </div>
              {/* 只显示网络相关错误，其他业务错误由顶部消息通知显示 */}
              {error && <p className="error-message">{error}</p>}
              <div className="button-group">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={onClose}
                  disabled={loading}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !isFormValid()}
                >
                  {loading ? '注册中...' : '注册'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;