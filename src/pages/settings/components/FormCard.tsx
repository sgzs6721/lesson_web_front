import React from 'react';
import { Card, Typography } from 'antd';
import { IFormCardProps } from '../types';

const { Title } = Typography;

const FormCard: React.FC<IFormCardProps> = ({ title, children }) => {
  return (
    <Card className="settings-form-card">
      {title && <Title level={5} className="form-card-title">{title}</Title>}
      {children}
    </Card>
  );
};

export default FormCard; 