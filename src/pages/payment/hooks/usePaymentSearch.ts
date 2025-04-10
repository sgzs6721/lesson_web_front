import { useState } from 'react';
import dayjs from 'dayjs';
import { PaymentSearchParams } from '../types/payment';

export const usePaymentSearch = (onSearch: (params: PaymentSearchParams) => void) => {
  const [searchText, setSearchText] = useState('');
  const [searchStatus, setSearchStatus] = useState<string>('');
  const [searchPaymentType, setSearchPaymentType] = useState<string>('');
  const [searchPaymentMethod, setSearchPaymentMethod] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);
  
  const handleSearch = () => {
    const params: PaymentSearchParams = {
      searchText,
      searchStatus,
      searchPaymentType,
      searchPaymentMethod,
      dateRange
    };
    onSearch(params);
  };
  
  const handleReset = () => {
    setSearchText('');
    setSearchStatus('');
    setSearchPaymentType('');
    setSearchPaymentMethod('');
    setDateRange(null);
    
    // 重置后自动搜索
    onSearch({
      searchText: '',
      searchStatus: '',
      searchPaymentType: '',
      searchPaymentMethod: '',
      dateRange: null
    });
  };
  
  return {
    searchParams: {
      searchText,
      searchStatus,
      searchPaymentType,
      searchPaymentMethod,
      dateRange
    },
    setSearchText,
    setSearchStatus,
    setSearchPaymentType,
    setSearchPaymentMethod,
    setDateRange,
    handleSearch,
    handleReset
  };
}; 