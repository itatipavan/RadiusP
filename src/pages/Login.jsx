import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Space } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { useMessage } from "../contexts/MessageContext";
import { useNavigate } from "react-router-dom";
import SplitText from "../components/SplitText";

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { login } = useAuth();
  const messageApi = useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        messageApi.success("Login successful! Welcome to OverSeas CRM");
        navigate("/dashboard");
      } else {
        messageApi.error(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      messageApi.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { email: "admin@os.in", password: "admin123" },
      counselor: { email: "neha.verma@os.in", password: "counselor123" },
      employee: { email: "amit.kumar@os.in", password: "employee123" },
    };
    form.setFieldsValue(credentials[role]);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          gap: "40px",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Left side text (hidden on mobile) */}
        {!isMobile && (
          <div style={{ flex: 1, color: "white" }}>
            <div style={{ marginBottom: "40px" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "rgba(255, 255, 255, 0.2)",
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "32px",
                  marginBottom: "24px",
                  backdropFilter: "blur(10px)",
                }}
              >
                OS
              </div>
              {/* <Title
                level={1}
                style={{
                  color: "white",
                  marginBottom: "16px",
                  fontSize: "48px",
                }}
              >
                OverSeas CRM
              </Title> */}
              <SplitText
                text="OverSeas CRM"
                style={{
                  color: "white",
                  marginBottom: "16px",
                  fontSize: "48px",
                }}
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
              <Paragraph
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: "18px",
                  lineHeight: "1.6",
                }}
              >
                Streamline your consultancy operations with our comprehensive
                CRM solution. Manage students, track applications, and grow your
                study abroad business efficiently.
              </Paragraph>
            </div>
          </div>
        )}

        {/* Right side card (full width on mobile) */}
        <div
          style={{
            flex: 1,
            maxWidth: isMobile ? "100%" : "480px",
            width: "100%",
          }}
        >
          <Card
            style={{
              borderRadius: "16px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
              border: "none",
              width: "100%",
            }}
            styles={{ body: { padding: "40px" } }}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <Title
                level={2}
                style={{ marginBottom: "8px", color: "#1976d2" }}
              >
                Welcome Back
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Sign in to your OverSeas CRM account
              </Text>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Please enter a valid email!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email address"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{
                    width: "100%",
                    height: "48px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            {/* Demo Credentials */}
            <div
              style={{
                marginTop: "-12px -10px",
                padding: "-12px -10px",
                background: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#666",
                }}
              >
                Demo Credentials:
              </Text>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => fillDemoCredentials("admin")}
                  style={{ padding: 0, height: "auto", textAlign: "left" }}
                >
                  <Text style={{ fontSize: "13px" }}>
                    <strong>Admin:</strong> admin@os.in / admin123
                  </Text>
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => fillDemoCredentials("counselor")}
                  style={{ padding: 0, height: "auto", textAlign: "left" }}
                >
                  <Text style={{ fontSize: "13px" }}>
                    <strong>Counselor:</strong> neha.verma@os.in / counselor123
                  </Text>
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => fillDemoCredentials("employee")}
                  style={{ padding: 0, height: "auto", textAlign: "left" }}
                >
                  <Text style={{ fontSize: "13px" }}>
                    <strong>Employee:</strong> amit.kumar@os.in / employee123
                  </Text>
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
