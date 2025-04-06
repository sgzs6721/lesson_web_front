import React from 'react';
import { Link } from 'react-router-dom';

const PricingSection: React.FC = () => {
  return (
    <section className="pricing" id="pricing">
      <div className="section-title">
        <h3>价格方案</h3>
        <p>选择适合您培训机构规模的解决方案</p>
      </div>
      <div className="pricing-container">
        <div className="pricing-grid">
          {/* 入门版 */}
          <div className="pricing-card">
            <div className="pricing-header" style={{ background: 'linear-gradient(45deg, #26d0ce, #1a2980)' }}>
              <h4>入门版</h4>
              <div className="pricing-amount">
                ¥299<span className="pricing-period">/月</span>
              </div>
              <p className="pricing-subtitle">适合小型培训机构</p>
            </div>
            <div className="pricing-details">
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 最多管理100名学员
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 基础版学员管理
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 基础版排课系统
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 教师管理
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-cross">×</span> <span className="feature-unavailable">小程序支持</span>
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-cross">×</span> <span className="feature-unavailable">高级数据分析</span>
                </li>
              </ul>
              <Link to="/register" className="pricing-btn" style={{ background: 'var(--primary)' }}>开始使用</Link>
            </div>
          </div>

          {/* 标准版 */}
          <div className="pricing-card highlighted">
            <div style={{ position: 'absolute', top: '20px', right: '-35px', background: 'var(--accent)', color: 'white', transform: 'rotate(45deg)', padding: '5px 40px', fontSize: '14px', fontWeight: 600 }}>推荐</div>
            <div className="pricing-header" style={{ background: 'linear-gradient(45deg, #ff7846, #ff4757)' }}>
              <h4>标准版</h4>
              <div className="pricing-amount">
                ¥699<span className="pricing-period">/月</span>
              </div>
              <p className="pricing-subtitle">适合中型培训机构</p>
            </div>
            <div className="pricing-details">
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 最多管理500名学员
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 高级版学员管理
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 高级版排课系统
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 教师管理
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 小程序支持
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-cross">×</span> <span className="feature-unavailable">高级数据分析</span>
                </li>
              </ul>
              <Link to="/register" className="pricing-btn" style={{ background: 'var(--accent)', boxShadow: '0 5px 15px rgba(255, 120, 70, 0.3)' }}>开始使用</Link>
            </div>
          </div>

          {/* 企业版 */}
          <div className="pricing-card">
            <div className="pricing-header" style={{ background: 'linear-gradient(45deg, #4a69bd, #1e3799)' }}>
              <h4>企业版</h4>
              <div className="pricing-amount">
                ¥1599<span className="pricing-period">/月</span>
              </div>
              <p className="pricing-subtitle">适合大型培训机构</p>
            </div>
            <div className="pricing-details">
              <ul className="pricing-features">
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 学员人数无限制
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 高级版学员管理
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 高级版排课系统
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 教师管理
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 小程序支持
                </li>
                <li className="pricing-feature">
                  <span className="feature-icon-check">✓</span> 高级数据分析
                </li>
              </ul>
              <Link to="/register" className="pricing-btn" style={{ background: 'var(--dark)' }}>开始使用</Link>
            </div>
          </div>
        </div>
        
        {/* 定制版 */}
        <div className="pricing-custom">
          <h4>需要定制解决方案？</h4>
          <p>
            针对特殊需求，我们提供完全定制化的解决方案，满足您的独特需求
          </p>
          <a href="#contact" className="custom-btn">联系我们获取报价</a>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 