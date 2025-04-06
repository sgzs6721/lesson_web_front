import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/slices/authSlice';

interface LoginFormValues {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<LoginFormValues>({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // @ts-ignore (for redux-thunk dispatch typing)
      await dispatch(login({
        username: formValues.username,
        password: formValues.password,
      }));
      navigate('/dashboard');
    } catch (err) {
      setError('登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* 公司Logo */}
        <div className="logo">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzRhNmNmNyIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEyOCIgcj0iODAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTI4IDQ4djYwTTEyOCAxNjh2NjBNNDggMTI4aDYwTTE2OCAxMjhoNjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7mjqXlj5blj6PkvpnkuLo8L3RleHQ+PC9zdmc+" alt="培训机构Logo" />
        </div>
        
        {/* 登录标题 */}
        <div className="login-header">
          <h1>培训机构管理系统</h1>
          <p>请输入您的账号和密码登录系统</p>
        </div>
        
        {/* 错误提示 */}
        {error && (
          <div className="error-message" style={{
            padding: '10px',
            marginBottom: '15px',
            color: '#721c24',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            textAlign: 'left',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {/* 登录表单 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="请输入用户名"
              required
              value={formValues.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="请输入密码"
              required
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </form>
        
        {/* 首次登录提示 */}
        <div className="first-login-note">
          <strong>注意：</strong> 首次登录的管理员 (admin) 必须先修改默认密码才能进入系统。
        </div>
        
        {/* 注册链接 */}
        <div className="register-link">
          <span>没有账户？</span>
          <Link to="/register">立即注册</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 