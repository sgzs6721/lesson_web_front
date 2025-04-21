import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/reduxHooks';
import { getCampusList, clearCampusListCache } from '@/components/CampusSelector';
import NoCampusModal from '@/components/NoCampusModal';

// 定义Context类型
interface CampusCheckContextType {
  hasCampus: boolean;
  checkingCampus: boolean;
  noCampusModalVisible: boolean;
  showNoCampusModal: () => void;
  hideNoCampusModal: () => void;
  refreshCampusCheck: () => Promise<void>;
  checkCampusBeforeNavigate: (targetPath: string) => Promise<boolean>;
}

// 创建Context
const CampusCheckContext = createContext<CampusCheckContextType | undefined>(undefined);

// 提供一个钩子来使用Context
export const useCampusCheck = (): CampusCheckContextType => {
  const context = useContext(CampusCheckContext);
  if (context === undefined) {
    throw new Error('useCampusCheck must be used within a CampusCheckProvider');
  }
  return context;
};

interface CampusCheckProviderProps {
  children: ReactNode;
}

// 创建Provider组件
export const CampusCheckProvider: React.FC<CampusCheckProviderProps> = ({ children }) => {
  const [hasCampus, setHasCampus] = useState<boolean>(true); // 默认为true避免闪烁，实际会通过检查更新
  const [checkingCampus, setCheckingCampus] = useState<boolean>(true);
  const [noCampusModalVisible, setNoCampusModalVisible] = useState<boolean>(false);

  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = auth.isAuthenticated;

  // 不需要检查校区的路径列表
  const exemptPaths = ['/campuses', '/login', '/register', '/home', '/unauthorized'];

  // 检查是否有校区的函数
  const checkCampus = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      console.log('用户未登录，无需检查校区');
      return true;
    }

    try {
      console.log('正在检查是否有校区...');
      const campusList = await getCampusList();
      console.log('获取到校区列表:', campusList);
      const hasAnyCampus = Array.isArray(campusList) && campusList.length > 0;
      console.log('是否有校区:', hasAnyCampus);
      return hasAnyCampus;
    } catch (error) {
      console.error('检查校区出错:', error);
      return false;
    }
  };

  // 刷新校区检查
  const refreshCampusCheck = async (): Promise<void> => {
    setCheckingCampus(true);

    // 如果用户已登录，确保清除缓存以获取最新数据
    if (isAuthenticated) {
      // 清除校区列表缓存
      clearCampusListCache();
      console.log('刷新校区检查前先清除校区列表缓存');
    }

    const result = await checkCampus();
    setHasCampus(result);
    setCheckingCampus(false);
  };

  // 显示无校区模态框
  const showNoCampusModal = () => {
    setNoCampusModalVisible(true);
  };

  // 隐藏无校区模态框
  const hideNoCampusModal = () => {
    setNoCampusModalVisible(false);
  };

  // 导航前检查校区
  const checkCampusBeforeNavigate = async (targetPath: string): Promise<boolean> => {
    // 如果用户未登录，不需要校区检查
    if (!isAuthenticated) {
      return true;
    }

    // 如果目标路径不需要校区检查，直接允许导航
    if (exemptPaths.some(path => targetPath.startsWith(path))) {
      return true;
    }

    // 如果已知有校区，允许导航
    if (hasCampus && !checkingCampus) {
      return true;
    }

    // 如果正在检查校区，直接等待当前检查完成
    if (checkingCampus) {
      console.log('正在检查校区，等待当前检查完成');
      // 等待当前正在进行的检查完成
      await refreshCampusCheck();

      // 检查完成后，如果有校区，允许导航
      if (hasCampus) {
        return true;
      }
    }

    // 如果确定没有校区，显示模态框并阻止导航
    if (!hasCampus) {
      console.log('没有校区，显示模态框并阻止导航');
      showNoCampusModal();
      return false;
    }

    // 如果不确定是否有校区，先清除缓存再进行检查
    if (isAuthenticated) {
      clearCampusListCache();
      console.log('导航检查校区前先清除校区列表缓存');
    }

    const hasAnyCampus = await checkCampus();
    setHasCampus(hasAnyCampus);
    setCheckingCampus(false);

    // 如果没有校区，显示模态框并阻止导航
    if (!hasAnyCampus) {
      console.log('检查结果: 没有校区，显示模态框并阻止导航');
      showNoCampusModal();
      return false;
    }

    // 其他情况允许导航
    return true;
  };

  // 初始检查
  useEffect(() => {
    if (isAuthenticated) {
      console.log('用户已登录，初始检查校区');
      refreshCampusCheck();
    } else {
      console.log('用户未登录，跳过初始检查校区');
      setHasCampus(true);
      setCheckingCampus(false);
    }
  }, [isAuthenticated]);

  // 提供Context值
  const value: CampusCheckContextType = {
    hasCampus,
    checkingCampus,
    noCampusModalVisible,
    showNoCampusModal,
    hideNoCampusModal,
    refreshCampusCheck,
    checkCampusBeforeNavigate
  };

  return (
    <CampusCheckContext.Provider value={value}>
      {children}
      <NoCampusModal
        visible={noCampusModalVisible}
        onClose={hideNoCampusModal}
      />
      {isAuthenticated && <CampusCheckRouteHandler />}
    </CampusCheckContext.Provider>
  );
};

// 内部组件，用于处理路由相关逻辑
// 这个组件现在主要用于初始路由加载时检查校区
const CampusCheckRouteHandler: React.FC = () => {
  const location = useLocation();
  const { hasCampus, checkingCampus, showNoCampusModal, refreshCampusCheck, checkCampusBeforeNavigate } = useCampusCheck();

  // 不需要检查校区的路径列表
  const exemptPaths = ['/campuses', '/login', '/register', '/home', '/unauthorized'];

  // 当路由变化时检查校区情况
  // 这仅用于在页面刷新或直接输入URL访问时检查
  useEffect(() => {
    const currentPath = location.pathname;

    // 只在初始加载和用户导航到需要校区的页面时检查
    if (!exemptPaths.some(path => currentPath.startsWith(path))) {
      checkCampusBeforeNavigate(currentPath);
    }
  }, [location.pathname]);

  return null; // 这个组件不渲染任何内容
};

export default CampusCheckProvider;