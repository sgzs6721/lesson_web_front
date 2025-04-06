import React from 'react';

const AboutSection: React.FC = () => {
  // 使用从 index.html 提取的结构和内联样式
  return (
    <section className="about" id="about" style={{ padding: '80px 5%', background: 'linear-gradient(to bottom, rgba(38, 208, 206, 0.15) 0%, rgba(26, 41, 128, 0.08) 50%, rgba(242, 245, 248, 0.9) 100%)', color: 'var(--home-dark)' }}>
      <div className="section-title">
        <h3>关于我们</h3>
        <p>专业的培训管理解决方案提供商</p>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ lineHeight: 1.8, marginBottom: '30px', color: 'var(--home-secondary)' }}>
          我们是一家专注于教育培训行业管理系统的科技公司，拥有10年行业经验，服务超过1000家培训机构。
          我们的团队由教育专家和技术精英组成，致力于为培训机构提供最专业的管理工具。
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          <div 
            style={{ flex: 1, minWidth: '200px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', transform: 'translateY(0)', transition: 'transform 0.3s' }} 
            onMouseOver={e => { (e.target as HTMLDivElement).style.transform = 'translateY(-10px)'; }}
            onMouseOut={e => { (e.target as HTMLDivElement).style.transform = 'translateY(0)'; }}
          >
            <h4 style={{ color: 'var(--home-accent)', fontSize: '36px', marginBottom: '10px' }}>10年+</h4>
            <p style={{ color: 'var(--home-secondary)' }}>行业经验</p>
          </div>
          <div 
            style={{ flex: 1, minWidth: '200px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', transform: 'translateY(0)', transition: 'transform 0.3s' }} 
            onMouseOver={e => { (e.target as HTMLDivElement).style.transform = 'translateY(-10px)'; }}
            onMouseOut={e => { (e.target as HTMLDivElement).style.transform = 'translateY(0)'; }}
          >
            <h4 style={{ color: 'var(--home-accent)', fontSize: '36px', marginBottom: '10px' }}>1000+</h4>
            <p style={{ color: 'var(--home-secondary)' }}>合作机构</p>
          </div>
          <div 
            style={{ flex: 1, minWidth: '200px', background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)', transform: 'translateY(0)', transition: 'transform 0.3s' }} 
            onMouseOver={e => { (e.target as HTMLDivElement).style.transform = 'translateY(-10px)'; }}
            onMouseOut={e => { (e.target as HTMLDivElement).style.transform = 'translateY(0)'; }}
          >
            <h4 style={{ color: 'var(--home-accent)', fontSize: '36px', marginBottom: '10px' }}>24/7</h4>
            <p style={{ color: 'var(--home-secondary)' }}>技术支持</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 