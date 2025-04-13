import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('/dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCampusList, setShowCampusList] = useState(false);
  const [currentCampus, setCurrentCampus] = useState('总部校区');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // Get user info from redux store
  const auth = useAppSelector((state) => state.auth);
  const username = auth && (auth as any).user?.username || '管理员';

  useEffect(() => {
    const pathKey = location.pathname;
    setActiveMenu(pathKey);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/home');
  };

  // 切换主题
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);

    // On mobile, we need different behavior
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // For mobile, collapsed actually means visible/expanded
      document.body.style.overflow = !sidebarCollapsed ? 'hidden' : '';
    }
  };

  // Close sidebar when clicking on menu item on mobile
  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);

    const isMobile = window.innerWidth <= 768;
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
      document.body.style.overflow = '';
    }
  };

  // Check window size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true); // Start collapsed on mobile (which means hidden)
      } else {
        setSidebarCollapsed(false); // Start expanded on desktop
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.user-info')) {
        setShowDropdown(false);
      }
      if (!(e.target as HTMLElement).closest('.campus-selector')) {
        setShowCampusList(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Toggle campus list visibility
  const toggleCampusList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCampusList(!showCampusList);
  };

  const selectCampus = (campus: string) => {
    setCurrentCampus(campus);
    setShowCampusList(false);
  };

  return (
    <div className="container">
      {/* 侧边栏 */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed ? (
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ height: '60px', marginBottom: '10px' }}>
                {/* 简化日历/课表元素 */}
                <rect x="50" y="50" width="100" height="100" rx="10" ry="10" fill="#ffffff" stroke="#4285f4" strokeWidth="5"/>

                {/* 日历顶部条 */}
                <rect x="50" y="50" width="100" height="20" rx="10" ry="10" fill="#4285f4"/>

                {/* 简化日历线条 */}
                <line x1="50" y1="90" x2="150" y2="90" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="50" y1="130" x2="150" y2="130" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="83" y1="70" x2="83" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="117" y1="70" x2="117" y2="150" stroke="#4285f4" strokeWidth="2.5"/>

                {/* 钟表指针，代表时间/课时 */}
                <circle cx="100" cy="110" r="25" fill="#ffffff" stroke="#4285f4" strokeWidth="4"/>
                <line x1="100" y1="110" x2="100" y2="93" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <line x1="100" y1="110" x2="114" y2="110" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="100" cy="110" r="4" fill="#4285f4"/>
              </svg>
              <h1 style={{ fontSize: '20px', textAlign: 'center' }}>培训机构管理系统</h1>
              <p style={{ opacity: 0.7, marginTop: '5px', fontSize: '12px', textAlign: 'center' }}>核心业务管理平台</p>
            </Link>
          ) : (
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '10px 0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ height: '45px' }}>
                {/* 简化日历/课表元素 */}
                <rect x="50" y="50" width="100" height="100" rx="10" ry="10" fill="#ffffff" stroke="#4285f4" strokeWidth="5"/>

                {/* 日历顶部条 */}
                <rect x="50" y="50" width="100" height="20" rx="10" ry="10" fill="#4285f4"/>

                {/* 简化日历线条 */}
                <line x1="50" y1="90" x2="150" y2="90" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="50" y1="130" x2="150" y2="130" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="83" y1="70" x2="83" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="117" y1="70" x2="117" y2="150" stroke="#4285f4" strokeWidth="2.5"/>

                {/* 钟表指针，代表时间/课时 */}
                <circle cx="100" cy="110" r="25" fill="#ffffff" stroke="#4285f4" strokeWidth="4"/>
                <line x1="100" y1="110" x2="100" y2="93" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <line x1="100" y1="110" x2="114" y2="110" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="100" cy="110" r="4" fill="#4285f4"/>
              </svg>
            </Link>
          )}
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "展开菜单" : "收起菜单"}
            style={{
              top: sidebarCollapsed ? '45px' : 'auto',
              bottom: sidebarCollapsed ? 'auto' : '10px',
              right: sidebarCollapsed ? '50%' : '10px',
              marginRight: sidebarCollapsed ? '-12px' : '0',
              position: 'absolute',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: 'white',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              zIndex: 101
            }}
          >
            {sidebarCollapsed ? '❯' : '❮'}
          </button>
        </div>

        <ul className="sidebar-menu">
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/dashboard')} className={activeMenu === '/dashboard' ? 'active' : ''}><i>🏠</i> {!sidebarCollapsed && <span>首页</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/campuses')} className={activeMenu === '/campuses' ? 'active' : ''}><i>🏢</i> {!sidebarCollapsed && <span>校区管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/users')} className={activeMenu === '/users' ? 'active' : ''}><i>👤</i> {!sidebarCollapsed && <span>用户管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/coaches')} className={activeMenu === '/coaches' ? 'active' : ''}><i>🏋️</i> {!sidebarCollapsed && <span>教练管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/courses')} className={activeMenu === '/courses' ? 'active' : ''}><i>📚</i> {!sidebarCollapsed && <span>课程管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/students')} className={activeMenu === '/students' ? 'active' : ''}><i>👨‍🎓</i> {!sidebarCollapsed && <span>学员管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/schedules')} className={activeMenu === '/schedules' ? 'active' : ''}><i>📅</i> {!sidebarCollapsed && <span>课表管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/attendance')} className={activeMenu === '/attendance' ? 'active' : ''}><i>✅</i> {!sidebarCollapsed && <span>打卡消课</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/payments')} className={activeMenu === '/payments' ? 'active' : ''}><i>💰</i> {!sidebarCollapsed && <span>缴费记录</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/expenses')} className={activeMenu === '/expenses' ? 'active' : ''}><i>💸</i> {!sidebarCollapsed && <span>收支管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/statistics')} className={activeMenu === '/statistics' ? 'active' : ''}><i>📈</i> {!sidebarCollapsed && <span>数据统计</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/analysis')} className={activeMenu === '/analysis' ? 'active' : ''}><i>🏢</i> {!sidebarCollapsed && <span>校区分析</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/settings')} className={activeMenu === '/settings' ? 'active' : ''}><i>⚙️</i> {!sidebarCollapsed && <span>系统设置</span>}</a></li>
        </ul>
      </div>

      {/* 主内容区 */}
      <div className="main-content">
        {/* Show campus info on all pages */}
        <div className={`campus-info ${isDarkTheme ? 'dark-theme' : ''}`} style={{
          margin: '0',
          position: 'fixed',
          top: '0',
          left: sidebarCollapsed ? '70px' : '240px',
          right: '0',
          zIndex: '999',
          width: 'auto',
          backgroundColor: isDarkTheme ? '#1f2833' : '#374263',
          padding: '10px 20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div className="campus-info-content" style={{ width: '100%' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '15px'
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginRight: '10px'
                  }}>
                    {currentCampus}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    padding: '2px 6px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    borderRadius: '3px',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    正常运营中
                  </div>
                </div>

                {/* 负责人信息 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginRight: '15px',
                  height: '30px'
                }}>
                  <i style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                  </i>
                  <span style={{ color: 'white', fontSize: '13px', whiteSpace: 'nowrap' }}>负责人：张明</span>
                </div>

                {/* 联系电话信息 */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  height: '30px'
                }}>
                  <i style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px'
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                  </i>
                  <span style={{ color: 'white', fontSize: '13px', whiteSpace: 'nowrap' }}>联系电话：13800138001</span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                {/* 校区选择器 */}
                <div style={{
                  position: 'relative',
                  marginRight: '15px',
                  height: '32px',
                  minWidth: '120px'
                }}>
                  <button
                    onClick={toggleCampusList}
                    style={{
                      padding: '0 12px',
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
                      校区选择
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
                        minWidth: '160px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        animation: 'dropdownFade 0.2s ease'
                      }}
                    >
                      {['总部校区', '东城校区', '西城校区', '南城校区', '北城校区', '天骄校区'].map(campus => (
                        <div
                          key={campus}
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
                            backgroundColor: currentCampus === campus ?
                              (isDarkTheme ? 'rgba(52, 152, 219, 0.2)' : 'rgba(52, 152, 219, 0.1)') :
                              'transparent'
                          }}
                          onMouseEnter={(e) => {
                            if (currentCampus !== campus) {
                              e.currentTarget.style.backgroundColor = isDarkTheme ? 
                                'rgba(255, 255, 255, 0.05)' : 
                                'rgba(0, 0, 0, 0.05)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentCampus !== campus) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                          onClick={(e) => { e.stopPropagation(); selectCampus(campus); }}
                        >
                          {currentCampus === campus && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                              <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                            </svg>
                          )}
                          <span style={{ marginLeft: currentCampus === campus ? '0' : '22px' }}>{campus}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="user-info" onClick={toggleDropdown} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  height: '42px',
                  padding: '0',
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: '21px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #4285f4, #34a853)',
                    height: '40px',
                    width: '40px',
                    borderRadius: '20px',
                    justifyContent: 'center',
                    marginLeft: '1px'
                  }}>
                    <div className="user-avatar" style={{
                      height: '32px',
                      width: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '15px',
                      fontWeight: '600',
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#4285f4',
                      borderRadius: '50%',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                    }}>{username.charAt(0).toUpperCase()}</div>
                  </div>
                  <div style={{
                    color: 'white',
                    marginLeft: '0px',
                    marginRight: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '0 4px'
                  }}>
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: '13px', 
                      marginBottom: '2px',
                      letterSpacing: '0.3px'
                    }}>{username}</div>
                    <div style={{ 
                      fontSize: '11px', 
                      opacity: '0.85',
                      letterSpacing: '0.2px'
                    }}>超级管理员</div>
                  </div>
                  <div style={{
                    width: '28px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '2px'
                  }}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      fill="currentColor" 
                      viewBox="0 0 16 16" 
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        transform: showDropdown ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                    </svg>
                  </div>
                </div>

                {showDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '8px',
                    backgroundColor: isDarkTheme ? 'rgba(31, 40, 51, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                    borderRadius: '12px',
                    padding: '6px',
                    zIndex: 1000,
                    minWidth: '180px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    animation: 'dropdownFade 0.2s ease'
                  }}>
                    <div style={{
                      padding: '8px 12px',
                      margin: '2px',
                      cursor: 'pointer',
                      color: isDarkTheme ? '#f0f0f0' : '#333',
                      borderRadius: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkTheme ? 
                        'rgba(255, 255, 255, 0.05)' : 
                        'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => navigate('/profile')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"/>
                      </svg>
                      个人信息
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      margin: '2px',
                      cursor: 'pointer',
                      color: isDarkTheme ? '#f0f0f0' : '#333',
                      borderRadius: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkTheme ? 
                        'rgba(255, 255, 255, 0.05)' : 
                        'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={() => navigate('/settings')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                        <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                      </svg>
                      系统设置
                    </div>

                    <div style={{
                      padding: '8px 12px',
                      margin: '2px',
                      cursor: 'pointer',
                      color: isDarkTheme ? '#f0f0f0' : '#333',
                      borderRadius: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkTheme ? 
                        'rgba(255, 255, 255, 0.05)' : 
                        'rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={toggleTheme}
                    >
                      {isDarkTheme ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                          <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                          <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278"/>
                        </svg>
                      )}
                      {isDarkTheme ? '浅色模式' : '深色模式'}
                    </div>

                    <div style={{
                      margin: '4px 8px',
                      height: '1px',
                      background: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }} />

                    <div style={{
                      padding: '8px 12px',
                      margin: '2px',
                      cursor: 'pointer',
                      color: '#dc3545',
                      borderRadius: '8px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = isDarkTheme ? 
                        'rgba(220, 53, 69, 0.1)' : 
                        'rgba(220, 53, 69, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={handleLogout}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
                        <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                        <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                      </svg>
                      退出登录
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="content-panel" style={{ marginTop: '57px' }}>
          <div className="header" style={{ display: 'none' }}>
            <h1 className="page-title">
              {activeMenu.startsWith('/dashboard') ? '数据概览' :
               activeMenu.startsWith('/campuses') ? '校区管理' :
               activeMenu.startsWith('/users') ? '用户管理' :
               activeMenu.startsWith('/coaches') ? '教练管理' :
               activeMenu.startsWith('/courses') ? '课程管理' :
               activeMenu.startsWith('/students') ? '学员管理' :
               activeMenu.startsWith('/payments') ? '缴费记录' :
               activeMenu.startsWith('/expenses') ? '收支管理' :
               activeMenu.startsWith('/schedules') ? '课表管理' :
               activeMenu.startsWith('/attendance') ? '打卡与消课' :
               activeMenu.startsWith('/statistics') ? '数据统计' :
               activeMenu.startsWith('/analysis') ? '校区分析' :
               activeMenu.startsWith('/settings') ? '系统设置' : '未知页面'}
            </h1>
          </div>

          {/* 主要内容，使用Outlet渲染嵌套路由内容 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;