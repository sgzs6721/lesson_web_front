import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // 引入 useDispatch 和 useSelector
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { login, setCampusModalVisible } from '@/redux/slices/authSlice'; // 引入 login action
import { RootState } from '@/redux/store'; // 引入 RootState 类型
import { Form, Modal } from 'antd';
import CampusAddAfterLogin from '@/pages/campus/components/CampusAddAfterLogin'; // 引入登录后添加校区的模态框
import { API } from '@/api'; // 导入 API
// 不再需要直接引入 API
import './Modal.css'; // 引入模态框样式

// 添加 mock 接口返回值的类型定义
interface MockResponse {
  code: number;
  message?: string;  // 设为可选
  data: {
    total: number;
    pageNum?: number;  // 设为可选
    pageSize?: number;  // 设为可选
    pages?: number;  // 设为可选
    list?: any[];  // 设为可选
  };
}

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [noCampus, setNoCampus] = useState(false);

  // 创建校区表单
  const [campusForm] = Form.useForm();
  const [campusFormLoading] = useState(false);

  // 从campusSlice中获取校区状态
  const { showCampusModal, hasCampus, total } = useSelector((state: RootState) => state.auth);

  // 添加状态变化的监听
  useEffect(() => {
    console.log('Redux状态更新:', { showCampusModal, hasCampus, total });
  }, [showCampusModal, hasCampus, total]);

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
    setNoCampus(false);
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
        setSuccess(true);

        try {
          const campusListResponse = await API.campus.getList();
          console.log('校区列表响应:', campusListResponse);

          if ('code' in campusListResponse && 'data' in campusListResponse) {
            const mockResponse = campusListResponse as unknown as MockResponse;
            const mockData = mockResponse.data;
            if (mockData.total === 0) {
              console.log('mock接口：没有校区');
              setNoCampus(true);
            } else {
              onClose();
              navigate('/dashboard');
            }
          } else {
            if (campusListResponse.total === 0) {
              console.log('正式接口：没有校区');
              setNoCampus(true);
            } else {
              onClose();
              navigate('/dashboard');
            }
          }
        } catch (error) {
          console.error('获取校区列表失败:', error);
          setSuccess(false);
          setError('登录失败，请重试');
          setLoading(false);
        }
      } else if (resultAction.type.endsWith('/rejected')) {
        const errorMessage = resultAction.payload || '登录失败，请检查手机号或密码';

        if (errorMessage.includes('超时')) {
          setError(`服务器响应超时，请检查网络连接或稍后再试`);
        } else if (errorMessage.includes('网络') || errorMessage.includes('连接')) {
          setError(`网络连接问题，请检查您的网络设置`);
        } else {
          setError('');
        }
      }
    } catch (err: any) {
      console.error('登录过程中出现错误:', err);
      const errMsg = err.message || '登录失败，请检查网络连接';
      if (errMsg.includes('网络') || errMsg.includes('连接') || errMsg.includes('超时')) {
        setError(errMsg);
      }
    } finally {
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

  // 处理校区模态框关闭
  const handleCampusModalClose = () => {
    dispatch(setCampusModalVisible(false));
    campusForm.resetFields();
  };

  // 处理校区创建成功
  const handleCampusCreated = () => {
    // 校区创建成功后，显示登录成功信息
    setSuccess(true);
    setError('');

    // 显示成功信息2秒后关闭
    setTimeout(() => {
      onClose(); // 登录成功，关闭模态框
    }, 2000);
  };

  // 处理确认模态框的确认按钮
  const handleConfirmModalOk = () => {
    setShowConfirmModal(false);
    dispatch(setCampusModalVisible(true));
  };

  // 处理确认模态框的取消按钮
  const handleConfirmModalCancel = () => {
    setShowConfirmModal(false);
    onClose();
  };

  // 处理创建校区按钮点击
  const handleCreateCampus = () => {
    dispatch(setCampusModalVisible(true));
  };

  // 处理取消按钮点击
  const handleCancel = () => {
    onClose();
  };

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
                {noCampus ? (
                  <>
                    <p>机构未创建校区，请先创建校区</p>
                    <div className="button-group" style={{ marginTop: '20px' }}>
                      <button className="cancel-btn" onClick={handleCancel}>
                        取消
                      </button>
                      <button className="submit-btn" onClick={handleCreateCampus}>
                        确认
                      </button>
                    </div>
                  </>
                ) : (
                  <p>登录成功！正在进入系统...</p>
                )}
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

      {/* 添加确认模态框 */}
      <Modal
        title="提示"
        open={showConfirmModal}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
        okText="确认"
        cancelText="取消"
      >
        <p>机构未创建校区，请先创建校区</p>
      </Modal>

      {/* 校区创建模态框 */}
      <CampusAddAfterLogin
        visible={showCampusModal}
        loading={campusFormLoading}
        form={campusForm}
        onCancel={handleCampusModalClose}
        onSuccess={handleCampusCreated}
      />
    </>
  );
};

export default LoginModal;