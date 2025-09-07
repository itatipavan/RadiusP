import React, { useState, useEffect } from "react";
import {
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Badge,
  Button,
  Tag,
  Drawer,
} from "antd";
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
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useMessage } from "../contexts/MessageContext";

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const MainLayout = () => {
  const { user, logout, getRoleDisplayName, canAccessRoute } = useAuth();
  const messageApi = useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileDrawerVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      messageApi.success("Logged out successfully");
      navigate("/login");
    } else {
      messageApi.error("Failed to logout");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile Settings",
      onClick: () => messageApi.info("Profile settings feature coming soon!"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Account Settings",
      onClick: () => messageApi.info("Account settings feature coming soon!"),
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  const getMenuItems = () => {
    const items = [];
    if (canAccessRoute("dashboard"))
      items.push({
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
      });
    if (canAccessRoute("students"))
      items.push({
        key: "/students",
        icon: <UserOutlined />,
        label: "Students",
      });
    if (canAccessRoute("applications"))
      items.push({
        key: "/applications",
        icon: <FileTextOutlined />,
        label: "Applications",
      });
    if (canAccessRoute("universities"))
      items.push({
        key: "/universities",
        icon: <BankOutlined />,
        label: "Universities",
      });
    if (canAccessRoute("employees"))
      items.push({
        key: "/employees",
        icon: <TeamOutlined />,
        label: "Employees",
      });
    if (canAccessRoute("reports"))
      items.push({
        key: "/reports",
        icon: <BarChartOutlined />,
        label: "Reports",
      });
    if (canAccessRoute("walkin"))
      items.push({ key: "/walkin", icon: <MenuOutlined />, label: "Walk-in" });
    if (canAccessRoute("assignments"))
      items.push({ key: "/assignments", icon: <TeamOutlined />, label: "Assignments" });
    if (canAccessRoute("instructor"))
      items.push({ key: "/instructor", icon: <UserOutlined />, label: "Instructor" });
    if (canAccessRoute("finance"))
      items.push({ key: "/finance", icon: <FileTextOutlined />, label: "Finance" });
    if (canAccessRoute("pay_details"))
      items.push({ key: "/pay-details", icon: <SettingOutlined />, label: "Pay Details" });
    if (canAccessRoute("paysheets"))
      items.push({ key: "/paysheets", icon: <FileTextOutlined />, label: "Paysheets" });

    return items;
  };

  const SidebarContent = () => (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={getMenuItems()}
      onClick={({ key }) => {
        navigate(key);
        setMobileDrawerVisible(false);
      }}
      style={{
        border: "none",
        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    />
  );

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="lg"
          collapsedWidth="80"
          width={250}
          style={{
            overflow: "hidden",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: collapsed ? "16px" : "18px",
              fontWeight: "bold",
              borderBottom: "1px solid #434343",
            }}
          >
            {collapsed ? "OS" : "OverSeas"}
          </div>
          <SidebarContent />
        </Sider>
      )}

      {/* Mobile Drawer Sidebar */}
      {isMobile && (
        <Drawer
          title="OverSeas"
          placement="left"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          styles={{
            body: { padding: 0, backgroundColor: "#001529" },
            header: {
              backgroundColor: "#001529",
              color: "white",
              borderBottom: "1px solid #434343",
            },
          }}
          width={250}
          className="mobile-drawer"
        >
          <SidebarContent />
        </Drawer>
      )}

      <AntLayout style={{ marginLeft: !isMobile ? (collapsed ? 80 : 250) : 0 }}>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                if (isMobile) {
                  setMobileDrawerVisible(true);
                } else {
                  setCollapsed(!collapsed);
                }
              }}
              style={{ marginRight: 16 }}
            />
            <Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
              OverSeas
            </Text>
          </div>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            trigger={["click"]}
            overlayStyle={{ minWidth: 200 }}
          >
            <Space style={{ cursor: "pointer", alignItems: "center" }}>
              <Avatar
                style={{ backgroundColor: "#1976d2" }}
                icon={<UserOutlined />}
              />
              {!isMobile && (
                <div
                  className="header-user-meta"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1,
                  }}
                >
                  <Text strong style={{ fontSize: "14px" }}>
                    {user?.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {getRoleDisplayName(user?.role)}
                  </Text>
                </div>
              )}
              <Button
                type="text"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                danger
              >
                {!isMobile ? "Logout" : ""}
              </Button>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: isMobile ? "12px" : "16px",
            padding: isMobile ? "12px" : "16px",
            background: "#f0f2f5",
            minHeight: "calc(100vh - 96px)",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default MainLayout;
