import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
  Button,
  Divider,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
  TeamOutlined,
  BarChartOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, getRoleDisplayName, canAccessRoute } = useAuth();
  const messageApi = useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      messageApi.success('Logged out successfully');
      navigate('/login');
    } else {
      messageApi.error('Failed to logout');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile Settings',
      onClick: () => {
        messageApi.info('Profile settings feature coming soon!');
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Account Settings',
      onClick: () => {
        messageApi.info('Account settings feature coming soon!');
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const getMenuItems = () => {
    const items = [];

    if (canAccessRoute('dashboard')) {
      items.push({ key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard', onClick: () => navigate('/dashboard') });
    }
    if (canAccessRoute('students')) {
      items.push({ key: '/students', icon: <UserOutlined />, label: 'Students', onClick: () => navigate('/students') });
    }
    if (canAccessRoute('applications')) {
      items.push({ key: '/applications', icon: <FileTextOutlined />, label: 'Applications', onClick: () => navigate('/applications') });
    }
    if (canAccessRoute('universities')) {
      items.push({ key: '/universities', icon: <BankOutlined />, label: 'Universities', onClick: () => navigate('/universities') });
    }
    if (canAccessRoute('employees')) {
      items.push({ key: '/employees', icon: <TeamOutlined />, label: 'Employees', onClick: () => navigate('/employees') });
    }
    if (canAccessRoute('reports')) {
      items.push({ key: '/reports', icon: <BarChartOutlined />, label: 'Reports', onClick: () => navigate('/reports') });
    }

    return items;
  };

  const selectedKey = location.pathname;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        breakpoint="lg"
        collapsedWidth={0}
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '0' : '0 24px',
            color: 'white',
            fontSize: collapsed ? '18px' : '20px',
            fontWeight: 'bold',
            borderBottom: '1px solid #001529',
          }}
        >
          {collapsed ? (
            <div
              style={{
                width: '32px',
                height: '32px',
                background: '#1976d2',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              OS
            </div>
          ) : (
            <Space>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#1976d2',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                OS
              </div>
              <span>OverSeas</span>
            </Space>
          )}
        </div>

        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={getMenuItems()} style={{ borderRight: 0 }} />

        {!collapsed && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              borderTop: '1px solid #001529',
              background: '#000c17',
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space align="center">
                <Avatar style={{ backgroundColor: '#1976d2' }} icon={<UserOutlined />} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <Text strong style={{ color: 'white', fontSize: '14px' }}>{user?.name}</Text>
                  <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>{getRoleDisplayName(user?.role)}</Text>
                </div>
              </Space>
            </Space>
          </div>
        )}
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 0 : 200, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 12px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
          }}
        >
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 40, height: 40 }}
            />
            <Divider type="vertical" />
            <Space className="header-brand">
              <GlobalOutlined style={{ color: '#1976d2' }} />
              <Text strong style={{ color: '#1976d2' }}>OverSeas Study CRM</Text>
            </Space>
          </Space>

          <Space size="large">
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined />} onClick={() => messageApi.info('Notifications feature coming soon!')} style={{ fontSize: '16px' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow={{ pointAtCenter: true }} trigger={["click"]} overlayStyle={{ minWidth: 200 }}>
              <Space style={{ cursor: 'pointer', alignItems: 'center' }}>
                <Avatar style={{ backgroundColor: '#1976d2' }} icon={<UserOutlined />} />
                <div className="header-user-meta" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                  <Text strong style={{ fontSize: '14px' }}>{user?.name}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>{getRoleDisplayName(user?.role)}</Text>
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)', background: '#f5f5f5', overflow: 'initial' }}>
          <div style={{ background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
