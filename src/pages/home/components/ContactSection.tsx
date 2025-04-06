import React from 'react';

const ContactSection: React.FC = () => {
  // 使用从 index.html 提取的结构和内联样式
  return (
    <section className="contact" id="contact" style={{ padding: '80px 5%', background: 'linear-gradient(to bottom, rgba(26, 41, 128, 0.1) 0%, rgba(26, 41, 128, 0.2) 30%, rgba(26, 41, 128, 0.35) 70%, rgba(26, 41, 128, 0.45) 100%)', color: 'var(--home-dark)' }}>
      <div className="section-title">
        <h3>联系我们</h3>
        <p>随时为您提供专业咨询</p>
      </div>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderBottom: '4px solid var(--home-accent)' }}>
        <form style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', color: 'var(--home-dark)', fontWeight: 600 }}>您的姓名</label>
            <input type="text" id="name" name="name" style={{ width: '100%', padding: '12px', background: '#f5f9fd', border: '1px solid var(--home-border)', borderRadius: '8px', color: 'var(--home-dark)' }} placeholder="请输入姓名" required />
          </div>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', color: 'var(--home-dark)', fontWeight: 600 }}>电子邮箱</label>
            <input type="email" id="email" name="email" style={{ width: '100%', padding: '12px', background: '#f5f9fd', border: '1px solid var(--home-border)', borderRadius: '8px', color: 'var(--home-dark)' }} placeholder="请输入邮箱" required />
          </div>
          <div>
            <label htmlFor="message" style={{ display: 'block', marginBottom: '8px', color: 'var(--home-dark)', fontWeight: 600 }}>留言内容</label>
            <textarea id="message" name="message" rows={5} style={{ width: '100%', padding: '12px', background: '#f5f9fd', border: '1px solid var(--home-border)', borderRadius: '8px', minHeight: '120px', color: 'var(--home-dark)' }} placeholder="请输入您的留言" required></textarea>
          </div>
          <button 
            type="submit" 
            style={{ background: 'var(--home-accent)', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s', boxShadow: '0 5px 15px rgba(255, 120, 70, 0.3)' }} 
            onMouseOver={e => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(-3px)';
              target.style.boxShadow = '0 8px 20px rgba(255, 120, 70, 0.4)';
            }}
            onMouseOut={e => {
              const target = e.target as HTMLButtonElement;
              target.style.transform = 'translateY(0)';
              target.style.boxShadow = '0 5px 15px rgba(255, 120, 70, 0.3)';
            }}
          >
            提交咨询
          </button>
        </form>
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ color: 'var(--home-secondary)', marginBottom: '15px' }}>或通过以下方式联系我们：</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <a 
              href="tel:400-123-4567" 
              style={{ color: 'var(--home-accent)', textDecoration: 'none', padding: '10px 15px', background: '#f5f9fd', borderRadius: '30px', transition: 'all 0.3s' }} 
              onMouseOver={e => {
                const target = e.target as HTMLAnchorElement;
                target.style.background = '#ecf0f1';
                target.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={e => {
                const target = e.target as HTMLAnchorElement;
                target.style.background = '#f5f9fd';
                target.style.transform = 'translateY(0)';
              }}
            >
              📞 400-123-4567
            </a>
            <a 
              href="mailto:contact@training.com" 
              style={{ color: 'var(--home-accent)', textDecoration: 'none', padding: '10px 15px', background: '#f5f9fd', borderRadius: '30px', transition: 'all 0.3s' }} 
              onMouseOver={e => {
                const target = e.target as HTMLAnchorElement;
                target.style.background = '#ecf0f1';
                target.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={e => {
                const target = e.target as HTMLAnchorElement;
                target.style.background = '#f5f9fd';
                target.style.transform = 'translateY(0)';
              }}
            >
              ✉️ contact@training.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 