import React, { useState } from 'react';
import { useNavigate } from '@/router/hooks';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import './home.css';

// 导入组件
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import RegisterModal from '@/components/RegisterModal';
import HeroSection from './components/HeroSection';
import ProjectShowcase from './components/ProjectShowcase';
import FeatureSection from './components/FeatureSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // 如果已登录，可以选择自动跳转到dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      // 如果用户已登录，可以选择直接跳转到仪表盘，也可以注释掉这行让登录后的用户仍能查看主页
      // navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-page">
      <Navigation />

      {/* 英雄区域 */}
      <HeroSection
        isAuthenticated={isAuthenticated}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
      />

      {/* 注册模态框 */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      {/* 校外培训项目展示 */}
      <ProjectShowcase />

      {/* 功能区域 */}
      <FeatureSection />

      {/* 关于我们区域 */}
      <AboutSection />

      {/* 联系我们区域 */}
      <ContactSection />

      <Footer />
    </div>
  );
};

export default HomePage;