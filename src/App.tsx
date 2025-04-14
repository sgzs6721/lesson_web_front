import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import AppRouter from '@/router';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { checkAuth } from '@/redux/slices/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 检查用户是否已登录
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;