import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register, login } from '@/redux/slices/authSlice';
import './Modal.css'; // 引入模态框样式

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  // 可以添加 onSubmit 回调来处理注册逻辑
  // onSubmit: (data: { orgName: string; phone: string; pass: string }) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose /*, onSubmit*/ }) => {
  const dispatch = useDispatch(); // 获取 dispatch
  const navigate = useNavigate(); // 获取 navigate
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState(''); // 机构联系电话 (主联系方式)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 新增：确认密码
  const [representativeName, setRepresentativeName] = useState(''); // 新增：机构负责人
  const [description, setDescription] = useState(''); // 新增：机构描述 (可选)
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 新增：loading 状态
  const [success, setSuccess] = useState(false); // 新增：注册成功状态

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(false);
    setLoading(true); // 开始 loading

    try {
      // Basic validation
      if (!orgName || !phone || !password || !confirmPassword || !representativeName) {
        setError('请填写所有必填项（机构描述除外）');
        setLoading(false);
        return;
      }
      // 密码匹配验证
      if (password !== confirmPassword) {
        setError('两次输入的密码不一致');
        setLoading(false);
        return;
      }
      // 机构联系电话格式校验
      if (!/^1\d{10}$/.test(phone)) {
        setError('请输入有效的11位机构联系电话');
        setLoading(false);
        return;
      }

      // 调用注册 action
      const result = await dispatch(register({
        orgName,
        phone,
        password,
        representativeName,
        description
      }) as any);

      if (result.payload === true) {
        // 注册成功，立即进行登录
        setSuccess(true);
        
        try {
          // 使用注册时的手机号和密码进行自动登录
          const loginResult = await dispatch(login({
            username: phone,
            password
          }) as any);

          if (loginResult.payload) {
            // 登录成功，跳转到dashboard
            setTimeout(() => {
              onClose(); // 关闭注册模态框
              navigate('/dashboard'); // 直接跳转到dashboard
              
              // 重置表单
              setOrgName('');
              setPhone('');
              setPassword('');
              setConfirmPassword('');
              setRepresentativeName('');
              setDescription('');
              setSuccess(false);
            }, 2000);
          } else {
            // 登录失败
            setError('自动登录失败，请手动登录');
            setSuccess(false);
            setLoading(false);
          }
        } catch (loginErr: any) {
          setError('自动登录失败，请手动登录');
          setSuccess(false);
          setLoading(false);
        }
      } else {
        setError('注册失败，请稍后再试');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || '注册失败，请稍后再试');
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
          {success ? (
            <div className="success-message">
              <p>注册成功！正在自动登录系统...</p>
              <p>即将进入管理后台</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="register-orgName">机构名称 <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  id="register-orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="请输入机构名称"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-representativeName">机构负责人 <span className="required-asterisk">*</span></label>
                <input
                  type="text"
                  id="register-representativeName"
                  value={representativeName}
                  onChange={(e) => setRepresentativeName(e.target.value)}
                  placeholder="请输入负责人姓名"
                  required
                  disabled={loading}
                />
              </div>
               <div className="form-group">
                <label htmlFor="register-phone">机构联系电话 <span className="required-asterisk">*</span></label>
                <input
                  type="tel"
                  id="register-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="用于登录的手机号码"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-password">设置密码 <span className="required-asterisk">*</span></label>
                <input
                  type="password"
                  id="register-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="register-confirmPassword">确认密码 <span className="required-asterisk">*</span></label>
                <input
                  type="password"
                  id="register-confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  required
                  disabled={loading}
                />
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