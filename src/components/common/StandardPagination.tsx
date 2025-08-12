import React from 'react';
import { Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import './StandardPagination.css';

interface StandardPaginationProps extends Omit<PaginationProps, 'showTotal'> {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showTotal?: (total: number, range: [number, number]) => React.ReactNode;
  showSizeChanger?: boolean;
  pageSizeOptions?: string[];
  totalText?: string;
}

const StandardPagination: React.FC<StandardPaginationProps> = ({
  current,
  pageSize,
  total,
  onChange,
  showTotal,
  showSizeChanger = true,
  pageSizeOptions = ['10', '20', '50', '100'],
  totalText = '条记录',
  ...props
}) => {
  return (
    <div className="standard-pagination-container">
      <div className="pagination-left"></div>
      <div className="pagination-right">
        <span className="pagination-total">共 {total} {totalText}</span>
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showSizeChanger={showSizeChanger}
          pageSizeOptions={pageSizeOptions}
          showQuickJumper={false}
          onChange={(page, size) => onChange(page, size || pageSize)}
          onShowSizeChange={(page, size) => onChange(1, size)}
          locale={{
            items_per_page: '条/页',
            jump_to: '跳至',
            jump_to_confirm: '确定',
            page: '页',
            prev_page: '上一页',
            next_page: '下一页',
            prev_5: '向前 5 页',
            next_5: '向后 5 页',
            prev_3: '向前 3 页',
            next_3: '向后 3 页'
          }}
          {...props}
        />
      </div>
    </div>
  );
};

export default StandardPagination; 