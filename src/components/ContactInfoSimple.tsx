import React from 'react';
import { Form } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import './ContactInfoSimple.css';

interface ContactInfoSimpleProps {
  managerName?: string;
  managerPhone?: string;
}

const ContactInfoSimple: React.FC<ContactInfoSimpleProps> = ({
  managerName = '',
  managerPhone = ''
}) => {
  const formInstance = Form.useFormInstance();

  React.useEffect(() => {
    if (formInstance) {
      formInstance.setFieldsValue({
        managerName: managerName,
        managerPhone: managerPhone
      });
    }
  }, [formInstance, managerName, managerPhone]);

  return (
    <div className="contact-info-simple-container">
      <div className="contact-info-simple-content">
        {/* 负责人 */}
        <div className="contact-info-simple-item">
          <div className="contact-info-simple-icon contact-info-simple-icon-manager">
            <UserOutlined style={{ color: '#3498db', fontSize: 16 }} />
          </div>
          <div className="contact-info-simple-value">{managerName || '未设置'}</div>
        </div>

        {/* 电话 */}
        <div className="contact-info-simple-item">
          <div className="contact-info-simple-icon contact-info-simple-icon-phone">
            <PhoneOutlined style={{ color: '#2ecc71', fontSize: 16 }} />
          </div>
          <div className="contact-info-simple-value">{managerPhone || '未设置'}</div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSimple;
