import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const Navigation: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2U2N2UyMiIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEyOCIgcj0iODAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTQiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTI4IDQ4djYwTTEyOCAxNjh2NjBNNDggMTI4aDYwTTE2OCAxMjhoNjAiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjx0ZXh0IHg9IjEyOCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7mjqXlj5blj6PkvpnkuLo8L3RleHQ+PC9zdmc+" alt="培训机构Logo" />
        <h1>培训机构管理系统</h1>
      </div>
      <div className="nav-links">
        <a href="#features">功能特色</a>
        <a href="#pricing">价格方案</a>
        <a href="#about">关于我们</a>
        <a href="#contact">联系我们</a>
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn btn-primary">进入系统</Link>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">登录</Link>
            <Link to="/register" className="btn btn-primary">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 