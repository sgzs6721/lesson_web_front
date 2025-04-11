import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // 引入 useDispatch 和 useSelector
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { login } from '@/redux/slices/authSlice'; // 引入 login action
import './Modal.css'; // 引入模态框样式

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhone?: string; // 新增：初始手机号
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, initialPhone = '' }) => {
  const dispatch = useDispatch(); // 获取 dispatch
  const navigate = useNavigate(); // 获取 navigate
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false); // 添加 loading 状态
  const [success, setSuccess] = useState(false); // 新增：登录成功状态

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

  const handleSubmit = async (e: React.FormEvent) => { // 标记为 async
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true); // 开始 loading

    // 再次验证表单
    if (!isFormValid()) {
      setLoading(false);
      return;
    }

    try {
      console.log('正在尝试登录...');
      // 调用 login action
      const resultAction = await dispatch(login({ phone, password }) as any);
      console.log('登录结果:', resultAction);
      
      // 检查是否登录成功
      if (resultAction.type.endsWith('/fulfilled')) {
        // 登录成功
        setSuccess(true);
        // 显示成功信息2秒后关闭
        setTimeout(() => {
          onClose(); // 登录成功，关闭模态框
          navigate('/dashboard'); // 跳转到 dashboard
        }, 2000);
      } else if (resultAction.type.endsWith('/rejected')) {
        // 服务器返回的错误信息，但不在模态框内显示密码错误
        const errorMessage = resultAction.payload || '登录失败，请检查手机号或密码';
        
        // 只有网络相关错误才在模态框内显示
        if (errorMessage.includes('超时')) {
          setError(`服务器响应超时，请检查网络连接或稍后再试`);
        } 
        // 检查是否是网络错误
        else if (errorMessage.includes('网络') || errorMessage.includes('连接')) {
          setError(`网络连接问题，请检查您的网络设置`);
        }
        // 密码错误等业务错误由顶部消息通知显示，这里不再重复显示
        else {
          setError(''); // 清空错误信息，避免重复显示
        }
      }
    } catch (err: any) {
      // 登录失败处理，只显示网络相关错误
      console.error('登录过程中出现错误:', err);
      const errMsg = err.message || '登录失败，请检查网络连接';
      // 只显示网络相关错误
      if (errMsg.includes('网络') || errMsg.includes('连接') || errMsg.includes('超时')) {
        setError(errMsg);
      } else {
        setError(''); // 清空错误信息，避免重复显示
      }
    } finally {
      setLoading(false); // 结束 loading
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
                  type="tel" // 使用 tel 类型以便移动端键盘
                  id="login-phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="请输入手机号"
                  required
                  disabled={loading} // loading 时禁用输入
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
                  disabled={loading} // loading 时禁用输入
                  onKeyDown={handlePasswordKeyDown}
                />
              </div>
              {passwordError && <p className="error-message">{passwordError}</p>}
              {/* 只有在有本地表单验证错误或网络错误时才显示错误信息 */}
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
  );
};

export default LoginModal; 