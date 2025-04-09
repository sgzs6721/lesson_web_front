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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // 新增：loading 状态
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setSuccess(false);
    setLoading(true); // 开始 loading

    console.log('点击注册按钮，开始处理表单提交');

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
      console.log('准备调用注册 action');
      const registerParams = {
        phone,
        password,
        realName: representativeName,
        institutionName: orgName,
        institutionType: 'TRAINING',
        institutionDescription: description,
        managerName: representativeName,
        managerPhone: phone
      };
      console.log('注册参数:', registerParams);

      const result = await dispatch(register(registerParams) as any);
      console.log('注册 action 返回结果:', result);

      // 检查注册结果
      console.log('检查注册结果:', result);

      if (result.payload && !result.error) {
        // 注册成功
        console.log('注册成功');
        setSuccess(true);
        
        // 调用注册成功回调，传递手机号
        if (onRegisterSuccess) {
          console.log('调用注册成功回调，传递手机号:', phone);
          onRegisterSuccess(phone);
        }
        
        // 延迟关闭模态框，让用户看到成功消息
        setTimeout(() => {
          onClose(); // 关闭注册模态框
          
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
        // 注册失败
        console.error('注册失败:', result.error);
        setError(result.error?.message || '注册失败，请稍后再试');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('注册过程出错:', err);
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
              <p>注册成功！</p>
              <p>即将跳转到登录页面</p>
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