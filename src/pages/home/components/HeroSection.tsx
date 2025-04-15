import React from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  isAuthenticated: boolean;
  onRegisterClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated, onRegisterClick }) => {
  return (
    <section className="hero">
      <h2>智能培训管理系统<br/>提升您的机构运营效率</h2>
      <p>一站式管理学员、课程、教师和财务，提升培训机构运营效率，让您专注于教学质量</p>
      <div className="hero-buttons">
        {isAuthenticated ? (
          <Link
            to="/dashboard"
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              maxWidth: '120px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            进入系统
          </Link>
        ) : (
          <>
            <button
              onClick={onRegisterClick}
              className="btn btn-primary"
              style={{
                padding: '10px 20px',
                maxWidth: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              免费注册
            </button>
            <a
              href="#features"
              className="btn btn-outline"
              style={{
                marginLeft: '20px',
                padding: '10px 20px',
                maxWidth: '120px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              了解更多
            </a>
          </>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
