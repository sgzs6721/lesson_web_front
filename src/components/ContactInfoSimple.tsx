import React from 'react';
import './ContactInfoSimple.css';

interface ContactInfoSimpleProps {
  managerName?: string;
  managerPhone?: string;
}

const ContactInfoSimple: React.FC<ContactInfoSimpleProps> = ({
  managerName = '',
  managerPhone = ''
}) => {
  return (
    <div className="contact-info-simple-container">
      <div className="contact-info-simple-content">
        {/* 负责人项目 */}
        <div className="contact-info-simple-item">
          <div className="contact-info-simple-icon contact-info-simple-icon-manager">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#3498db">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div className="contact-info-simple-value">{managerName || '未设置'}</div>
        </div>

        {/* 联系电话项目 */}
        <div className="contact-info-simple-item">
          <div className="contact-info-simple-icon contact-info-simple-icon-phone">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="#2ecc71">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
            </svg>
          </div>
          <div className="contact-info-simple-value">{managerPhone || '未设置'}</div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSimple;
