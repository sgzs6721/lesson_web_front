import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Campus } from '@/api/campus/types';
import CampusSelector from './CampusSelector';

interface HeaderProps {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  currentCampus: Campus | null;
  handleCampusChange: (campus: Campus) => void;
  username: string;
  userRole: string;
  handleLogout: () => void;
  setShowProfileModal: (show: boolean) => void;
  sidebarCollapsed: boolean;
  showDropdown: boolean;
  toggleDropdown: (e: React.MouseEvent) => void;
}

const Header: React.FC<HeaderProps> = ({
  isDarkTheme,
  toggleTheme,
  currentCampus,
  handleCampusChange,
  username,
  userRole,
  handleLogout,
  setShowProfileModal,
  sidebarCollapsed,
  showDropdown,
  toggleDropdown,
}) => {
  const navigate = useNavigate();

  const DropdownItem: React.FC<{
    onClick: (e: React.MouseEvent) => void;
    icon: React.ReactNode;
    text: string;
  }> = ({ onClick, icon, text }) => (
    <div
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
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDarkTheme
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      onClick={onClick}
    >
      {icon}
      {text}
    </div>
  );

  return (
    <div className={`campus-info ${isDarkTheme ? 'dark-theme' : ''}`} style={{
      margin: '0',
      position: 'fixed',
      top: '0',
      left: sidebarCollapsed ? '70px' : '240px',
      right: '0',
      zIndex: '999',
      width: 'auto',
      backgroundColor: isDarkTheme ? '#1f2833' : '#374263',
      padding: '10px 44px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <div className="campus-info-content" style={{ width: '100%' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {currentCampus ? (
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
                  {currentCampus.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  padding: '2px 6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  borderRadius: '3px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {currentCampus.status === 'OPERATING' ? '正常运营中' : '已关闭'}
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
                <span style={{ color: 'white', fontSize: '13px', whiteSpace: 'nowrap' }}>负责人：{currentCampus.managerName || '未设置'}</span>
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
                <span style={{ color: 'white', fontSize: '13px', whiteSpace: 'nowrap' }}>联系电话：{currentCampus.managerPhone || '未设置'}</span>
              </div>
            </div>
          ) : (
            <div style={{ color: 'white', fontSize: '16px' }}>暂无校区信息</div>
          )}

          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            {/* 使用CampusSelector组件 */}
            <CampusSelector
              isDarkTheme={isDarkTheme}
              onCampusChange={handleCampusChange}
            />

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
                padding: '0 4px',
                minWidth: '80px',
                textAlign: 'center'
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
                }}>{userRole}</div>
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
                  <DropdownItem
                    onClick={(e) => { e.stopPropagation(); setShowProfileModal(true); toggleDropdown(e); }}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>}
                    text="个人信息"
                  />
                  <DropdownItem
                    onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>{isDarkTheme ? <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/> : <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>}</svg>}
                    text={isDarkTheme ? '切换到浅色模式' : '切换到深色模式'}
                  />
                  <DropdownItem
                    onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.159.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/></svg>}
                    text="系统设置"
                  />
                  <DropdownItem
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}><path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg>}
                    text="退出登录"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 