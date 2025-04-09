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
  const [loading, setLoading] = useState(false); // 添加 loading 状态
  const [success, setSuccess] = useState(false); // 新增：登录成功状态

  // 当 initialPhone 变化时更新 phone 状态
  useEffect(() => {
    if (initialPhone) {
      console.log('设置初始手机号:', initialPhone);
      setPhone(initialPhone);
    }
  }, [initialPhone]);

  const handleSubmit = async (e: React.FormEvent) => { // 标记为 async
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true); // 开始 loading

    if (!phone || !password) {
      setError('手机号和密码不能为空');
      setLoading(false); // 结束 loading
      return;
    }

    try {
      // 假设 login action 接受 phone 和 password
      // @ts-ignore (处理 redux-thunk 的类型推断)
      const result = await dispatch(login({ phone, password }));
      
      if (result.payload) {
        // 登录成功
        setSuccess(true);
        // 显示成功信息2秒后关闭
        setTimeout(() => {
          onClose(); // 登录成功，关闭模态框
          navigate('/dashboard'); // 跳转到 dashboard
        }, 2000);
      } else {
        setError('登录失败，请检查手机号或密码');
      }
    } catch (err: any) {
      // 登录失败处理，显示错误信息
      setError(err.message || '登录失败，请检查手机号或密码');
    } finally {
      setLoading(false); // 结束 loading
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
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  required
                  disabled={loading} // loading 时禁用输入
                />
              </div>
              <div className="form-group">
                <label htmlFor="login-password">密码</label>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                  disabled={loading} // loading 时禁用输入
                />
              </div>
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
                  disabled={loading}
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