import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import './Modal.css';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';

const Navigation: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');

  const openLoginModal = (phone?: string) => {
    if (phone) {
      setLoginPhone(phone);
    }
    setIsLoginModalOpen(true);
  };
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setLoginPhone('');
  };

  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => setIsRegisterModalOpen(false);

  const handleRegisterSuccess = (phone: string) => {
    console.log('注册成功，准备打开登录模态框，手机号:', phone);
    closeRegisterModal();
    openLoginModal(phone);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ height: '40px', marginRight: '10px' }}>
            {/* 简化日历/课表元素 */}
            <rect x="50" y="50" width="100" height="100" rx="10" ry="10" fill="#ffffff" stroke="#4285f4" strokeWidth="5"/>
            
            {/* 日历顶部条 */}
            <rect x="50" y="50" width="100" height="20" rx="10" ry="10" fill="#4285f4"/>
            
            {/* 简化日历线条 */}
            <line x1="50" y1="90" x2="150" y2="90" stroke="#4285f4" strokeWidth="2.5"/>
            <line x1="50" y1="130" x2="150" y2="130" stroke="#4285f4" strokeWidth="2.5"/>
            <line x1="83" y1="70" x2="83" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
            <line x1="117" y1="70" x2="117" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
            
            {/* 钟表指针，代表时间/课时 */}
            <circle cx="100" cy="110" r="25" fill="#ffffff" stroke="#4285f4" strokeWidth="4"/>
            <line x1="100" y1="110" x2="100" y2="93" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
            <line x1="100" y1="110" x2="114" y2="110" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="100" cy="110" r="4" fill="#4285f4"/>
          </svg>
          <h1>培训机构管理系统</h1>
        </div>
        <div className="nav-links">
          <a href="#features">功能特色</a>
          <a href="#about">关于我们</a>
          <a href="#contact">联系我们</a>
        </div>
        <div className="auth-buttons" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="btn btn-primary"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '8px 15px',
                  whiteSpace: 'nowrap'
                }}
              >
                <LoginOutlined style={{ fontSize: '16px' }} />
                进入
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline"
                style={{ 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '8px 15px',
                  whiteSpace: 'nowrap'
                }}
              >
                <LogoutOutlined style={{ fontSize: '16px' }} />
                登出
              </button>
            </>
          ) : (
            <>
              <button onClick={() => openLoginModal()} className="btn btn-outline" style={{ cursor: 'pointer', minWidth: '80px', whiteSpace: 'nowrap' }}>登录</button>
              <button onClick={openRegisterModal} className="btn btn-primary" style={{ cursor: 'pointer', minWidth: '80px', whiteSpace: 'nowrap' }}>注册</button>
            </>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} initialPhone={loginPhone} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={closeRegisterModal} onRegisterSuccess={handleRegisterSuccess} />
    </>
  );
};

export default Navigation; 