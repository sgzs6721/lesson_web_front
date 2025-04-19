import React, { useState, useEffect, useRef } from 'react';
import { Campus } from '@/api/campus/types';

// 创建模块级别的缓存和工具函数
let campusListCache: Campus[] | null = null;
let isFetchingCampusList = false;
let campusListCallbacks: ((campusList: Campus[]) => void)[] = [];

// 导出清除缓存的函数
export const clearCampusListCache = (reason?: string) => {
  console.log(`清除校区选择器缓存${reason ? '，原因: ' + reason : ''}`);
  campusListCache = null;
};

// 存储所有校区选择器组件的刷新函数
const refreshCallbacks: (() => void)[] = [];

// 注册刷新回调函数
export const registerCampusSelectorRefresh = (callback: () => void) => {
  refreshCallbacks.push(callback);
  return () => {
    const index = refreshCallbacks.indexOf(callback);
    if (index !== -1) {
      refreshCallbacks.splice(index, 1);
    }
  };
};

// 触发所有校区选择器组件刷新
export const refreshAllCampusSelectors = () => {
  console.log('触发所有校区选择器组件刷新');
  clearCampusListCache();
  refreshCallbacks.forEach(callback => callback());
};

// 导出获取校区列表的工具函数，可以在其他组件中使用
export const getCampusList = async (callerInfo?: string): Promise<Campus[]> => {
  // 如果已经有缓存数据，直接返回
  if (campusListCache !== null) {
    console.log(`[getCampusList] 使用缓存的校区列表数据${callerInfo ? '，调用来源: ' + callerInfo : ''}`);
    return campusListCache;
  }

  // 如果已经有请求在进行，等待该请求完成
  if (isFetchingCampusList) {
    console.log(`[getCampusList] 等待现有的校区列表请求完成${callerInfo ? '，调用来源: ' + callerInfo : ''}`);
    return new Promise((resolve) => {
      campusListCallbacks.push((campusList) => {
        resolve(campusList);
      });
    });
  }

  // 发起新的请求
  isFetchingCampusList = true;
  console.log(`[getCampusList] 发起新的campus/list API请求${callerInfo ? '，调用来源: ' + callerInfo : ''}`);

  try {
    // 直接使用fetch调用API，并添加必要的跨域和认证头
    const tokenFromCookie = document.cookie.split(';').find(c => c.trim().startsWith('token='))?.trim().substring('token='.length);

    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // 添加Authorization头
    if (tokenFromCookie) {
      headers['Authorization'] = tokenFromCookie;
    }

    const response = await fetch(`/lesson/api/campus/list`, {
      method: 'GET',
      headers,
      mode: 'cors',
      credentials: 'include'
    });

    const responseData = await response.json();
    console.log('[getCampusList] 原始 API 响应:', responseData);

    // 根据实际响应结构提取校区列表
    // 响应结构为: { code: 200, message: "操作成功", data: { list: [...], total: 1, ... } }
    let campusList = responseData?.code === 200 ? (responseData?.data?.list || []) : [];

    // 对校区列表进行排序，按照ID升序排列，这样最近添加的校区（ID较大）就会显示在列表的最下面
    campusList = campusList.sort((a: Campus, b: Campus) => {
      // 将ID转换为数字进行比较
      const idA = typeof a.id === 'string' ? parseInt(a.id, 10) : Number(a.id);
      const idB = typeof b.id === 'string' ? parseInt(b.id, 10) : Number(b.id);
      return idA - idB; // 升序排列
    });

    console.log('排序后的校区列表:', campusList);

    // 更新缓存
    campusListCache = campusList;

    // 通知所有等待的回调
    campusListCallbacks.forEach(callback => callback(campusList));
    campusListCallbacks = [];

    return campusList;
  } catch (err) {
    console.error('获取校区列表失败:', err);
    campusListCache = null; // 清空缓存以便下次重试
    throw err;
  } finally {
    isFetchingCampusList = false;
  }
};

interface CampusSelectorProps {
  isDarkTheme?: boolean;
  onCampusChange?: (campus: Campus) => void;
}

const CampusSelector: React.FC<CampusSelectorProps> = ({
  isDarkTheme = false,
  onCampusChange
}) => {
  const [showCampusList, setShowCampusList] = useState(false);
  const [campusList, setCampusList] = useState<Campus[]>([]);
  const [currentCampus, setCurrentCampus] = useState<Campus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onCampusChangeRef = useRef(onCampusChange);

  // 更新引用，但不触发重新渲染
  useEffect(() => {
    onCampusChangeRef.current = onCampusChange;
  }, [onCampusChange]);

  // 定义加载校区列表的函数
  const loadCampusList = async () => {
    setLoading(true);
    setError(null);

    try {
      // 使用共享的获取函数
      const campusList = await getCampusList('CampusSelector组件');
      console.log('校区选择器组件获取到的校区列表:', campusList);

      // 更新组件状态
      setCampusList(campusList);

      // 只有当有校区时才选择第一个校区
      if (campusList.length > 0 && !currentCampus) {
        // 有校区且当前没有选中校区，默认选择第一个
        const firstCampus = campusList[0];
        console.log('选择第一个校区:', firstCampus);
        setCurrentCampus(firstCampus);
        // 将校区ID和名称存储到localStorage中，供其他组件使用
        localStorage.setItem('currentCampusId', String(firstCampus.id));
        localStorage.setItem('currentCampusName', firstCampus.name);
        if (onCampusChangeRef.current) {
          onCampusChangeRef.current(firstCampus);
        }
      }
    } catch (err) {
      console.error('获取校区列表失败:', err);
      setError('获取校区列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 异步加载校区列表，使用共享的getCampusList函数
  useEffect(() => {
    // 开始加载数据，但不阻塞渲染
    loadCampusList();
  }, []); // 空依赖数组确保只在挂载时执行一次

  // 注册刷新回调函数
  useEffect(() => {
    // 注册刷新回调函数，并在组件卸载时取消注册
    const unregister = registerCampusSelectorRefresh(loadCampusList);
    return () => {
      unregister();
    };
  }, []);

  // 添加点击空白区域关闭下拉菜单的功能
  useEffect(() => {
    // 定义处理点击事件的函数
    const handleClickOutside = (event: MouseEvent) => {
      // 如果下拉菜单已经显示，并且点击事件不是发生在组件内部
      if (showCampusList) {
        const target = event.target as Node;
        const selectorElement = document.querySelector('.campus-selector-container');
        if (selectorElement && !selectorElement.contains(target)) {
          setShowCampusList(false);
        }
      }
    };

    // 添加全局点击事件监听器
    document.addEventListener('click', handleClickOutside);

    // 在组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showCampusList]);

  // 切换校区列表显示状态
  const toggleCampusList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCampusList(!showCampusList);
  };

  // 选择校区
  const selectCampus = (campus: Campus) => {
    setCurrentCampus(campus);
    setShowCampusList(false);
    // 将校区ID和名称存储到localStorage中，供其他组件使用
    localStorage.setItem('currentCampusId', String(campus.id));
    localStorage.setItem('currentCampusName', campus.name);
    if (onCampusChangeRef.current) {
      onCampusChangeRef.current(campus);
    }
  };

  return (
    <div
      className="campus-selector-container"
      style={{
        position: 'relative',
        marginRight: '15px',
        height: 'auto',
        minWidth: '140px'
      }}>
      <button
        onClick={toggleCampusList}
        style={{
          padding: '4px 12px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          cursor: 'pointer',
          color: 'white',
          fontSize: '13px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          height: '32px',
          width: '100%',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '6px' }}>
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z"/>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {loading ? '加载中...' : (currentCampus ? currentCampus.name : '校区选择')}
          </div>
        </div>
        <span style={{
          fontSize: '10px',
          transform: showCampusList ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s ease'
        }}>▼</span>
      </button>

      {showCampusList && (
        <div
          className={`campus-dropdown ${isDarkTheme ? 'campus-dropdown-dark' : ''}`}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            backgroundColor: isDarkTheme ? 'rgba(31, 40, 51, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
            padding: '6px',
            marginTop: '8px',
            zIndex: 1000,
            minWidth: '180px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            animation: 'dropdownFade 0.2s ease'
          }}
        >
          {loading ? (
            <div style={{ padding: '10px', textAlign: 'center', color: isDarkTheme ? '#f0f0f0' : '#333' }}>
              加载中...
            </div>
          ) : error ? (
            <div style={{ padding: '10px', textAlign: 'center', color: '#ff4d4f' }}>
              {error}
            </div>
          ) : campusList.length === 0 ? (
            <div
              className="campus-item"
              style={{
                padding: '8px 12px',
                margin: '2px',
                color: isDarkTheme ? '#f0f0f0' : '#333',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                minHeight: '36px',
                justifyContent: 'center'
              }}
            >
              <div style={{ marginLeft: '22px' }}>暂无校区信息</div>
            </div>
          ) : (
            // 校区列表渲染前打印日志
            (() => { console.log('渲染校区列表:', campusList); return true; })() &&
            campusList.map(campus => (
              <div
                key={campus.id}
                className="campus-item"
                style={{
                  padding: '8px 12px',
                  margin: '2px',
                  cursor: 'pointer',
                  color: isDarkTheme ? '#f0f0f0' : '#333',
                  borderRadius: '8px',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  backgroundColor: currentCampus?.id === campus.id ?
                    (isDarkTheme ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 152, 219, 0.1)') :
                    'transparent',
                  minHeight: '36px'
                }}
                onMouseEnter={(e) => {
                  if (currentCampus?.id !== campus.id) {
                    e.currentTarget.style.backgroundColor = isDarkTheme ?
                      'rgba(255, 255, 255, 0.05)' :
                      'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentCampus?.id !== campus.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
                onClick={(e) => { e.stopPropagation(); selectCampus(campus); }}
              >
                {currentCampus?.id === campus.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                )}
                <div style={{ marginLeft: currentCampus?.id === campus.id ? '0' : '22px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div>{campus.name}</div>
                    <div style={{
                      fontSize: '9px',
                      opacity: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '8px'
                    }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: campus.status === 'OPERATING' ? '#52c41a' : '#ff4d4f',
                          marginRight: '3px'
                        }}
                      />
                      {campus.status === 'OPERATING' ? '营业中' : '已关闭'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CampusSelector;