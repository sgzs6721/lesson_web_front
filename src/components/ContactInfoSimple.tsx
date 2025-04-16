import React from 'react';
import { Form } from 'antd';
import './ContactInfoSimple.css';

interface ContactInfoSimpleProps {
  managerName?: string;
  managerPhone?: string;
}

const ContactInfoSimple: React.FC<ContactInfoSimpleProps> = ({
  managerName = '',
  managerPhone = ''
}) => {
  // 使用 Form.useFormInstance 获取当前表单实例，如果在表单中使用
  // 如果不在表单中，不会报错
  const formInstance = Form.useFormInstance();

  // 如果有表单实例，则设置表单字段值
  React.useEffect(() => {
    if (formInstance) {
      // 如果这个组件在表单中使用，则设置表单字段值
      formInstance.setFieldsValue({
        managerName: managerName,
        managerPhone: managerPhone
      });
    }
  }, [formInstance, managerName, managerPhone]);

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
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </div>
          <div className="contact-info-simple-value">{managerPhone || '未设置'}</div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSimple;
