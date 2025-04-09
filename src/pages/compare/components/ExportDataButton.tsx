import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';

interface ExportDataButtonProps {
  onExport: (type: string) => void;
}

const ExportDataButton: React.FC<ExportDataButtonProps> = ({ onExport }) => {
  const menu = (
    <Menu 
      onClick={({ key }) => onExport(key as string)}
      items={[
        {
          key: 'excel',
          label: '导出为Excel',
        },
        {
          key: 'csv',
          label: '导出为CSV',
        },
        {
          key: 'pdf',
          label: '导出为PDF',
        }
      ]}
    />
  );
  
  return (
    <Dropdown overlay={menu}>
      <Button>
        <DownloadOutlined /> 导出数据 <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default ExportDataButton; 