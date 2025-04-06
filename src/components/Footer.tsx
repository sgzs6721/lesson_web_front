import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-links">
        <a href="#features">功能</a>
        <a href="#pricing">价格</a>
        <a href="#about">关于</a>
        <a href="#contact">联系</a>
        <Link to="/login">登录</Link>
        <Link to="/register">注册</Link>
      </div>
      <p className="copyright">© 2025 培训机构管理系统. 保留所有权利.</p>
    </footer>
  );
};

export default Footer; 