import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@/router/hooks';
import { login } from '@/redux/slices/authSlice';
import './Modal.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialPhone = '' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 登录状态

  // 当 initialPhone 变化时更新 phone 状态
  useEffect(() => {
    if (initialPhone) {
      console.log('设置初始手机号:', initialPhone);
      setPhone(initialPhone);
      if (initialPhone.length >= 11) {
        const isValid = validatePhone(initialPhone);
        setPhoneError(isValid ? '' : '请输入正确的11位手机号码');
      }
    }
  }, [initialPhone]);

  // 验证手机号格式
  const validatePhone = (value: string) => {
    if (!value) {
      return false;
    }

    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value);
  };

  // 验证密码格式
  const validatePassword = (value: string) => {
    if (!value) {
      return false;
    }

    return value.length >= 8;
  };

  // 检查表单是否有效
  const isFormValid = () => {
    return validatePhone(phone) && validatePassword(password);
  };

  // 手机号输入处理
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 只允许输入数字
    if (value === '' || /^\d+$/.test(value)) {
      setPhone(value);
      // 只有长度足够时才验证，避免用户输入过程中就显示错误
      if (value.length >= 11) {
        const isValid = validatePhone(value);
        setPhoneError(isValid ? '' : '请输入正确的11位手机号码');
      } else {
        setPhoneError('');
      }
    }
  };

  // 密码输入处理
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length > 0) {
      const isValid = validatePassword(value);
      setPasswordError(isValid ? '' : '密码长度至少为8位');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!isFormValid()) {
      setLoading(false);
      return;
    }

    try {
      console.log('正在尝试登录...');
      const resultAction = await dispatch(login({ phone, password }) as any);
      console.log('登录结果:', resultAction);

      if (resultAction.type.endsWith('/fulfilled')) {
        // 登录成功
        setSuccess(true);

        // 登录成功后直接进入系统，不再立即调用campus/list接口
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 1000);
      } else if (resultAction.type.endsWith('/rejected')) {
        const errorMessage = resultAction.payload || '登录失败，请检查手机号或密码';

        if (errorMessage.includes('超时')) {
          setError(`服务器响应超时，请检查网络连接或稍后再试`);
        } else if (errorMessage.includes('网络') || errorMessage.includes('连接')) {
          setError(`网络连接问题，请检查您的网络设置`);
        } else {
          setError('');
        }
        setLoading(false);
      }
    } catch (err: any) {
      console.error('登录过程中出现错误:', err);
      const errMsg = err.message || '登录失败，请检查网络连接';
      if (errMsg.includes('网络') || errMsg.includes('连接') || errMsg.includes('超时')) {
        setError(errMsg);
      }
      setLoading(false);
    }
  };

  // 密码输入框按回车键提交表单
  const handlePasswordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
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
    <>
      <div className={`modal-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
          <div className="modal-header">
            <h3 className="modal-title">登录</h3>
          </div>
          <div className="modal-body">
            {success ? (
              <div className="success-message">
                <p>登录成功！正在进入系统...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="login-phone">手机号</label>
                  <input
                    type="tel"
                    id="login-phone"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="请输入手机号"
                    required
                    disabled={loading}
                  />
                </div>
                {phoneError && <p className="error-message">{phoneError}</p>}
                <div className="form-group">
                  <label htmlFor="login-password">密码</label>
                  <input
                    type="password"
                    id="login-password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="请输入密码（至少8位）"
                    required
                    disabled={loading}
                    onKeyDown={handlePasswordKeyDown}
                  />
                </div>
                {passwordError && <p className="error-message">{passwordError}</p>}
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
                    {loading ? '登录中...' : '登录'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;