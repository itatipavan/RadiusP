import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
} from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const messageApi = useMessage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result.success) {
        messageApi.success('Login successful! Welcome to RadiusF CRM');
        navigate('/dashboard');
      } else {
        messageApi.error(result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      messageApi.error('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role) => {
    const credentials = {
      admin: { email: 'admin@radiusf.com', password: 'admin123' },
      counselor: { email: 'sarah.johnson@radiusf.com', password: 'counselor123' },
      employee: { email: 'lisa.wang@radiusf.com', password: 'employee123' },
    };

    const form = document.querySelector('form');
    form.querySelector('input[name="email"]').value = credentials[role].email;
    form.querySelector('input[name="password"]').value = credentials[role].password;

    // Trigger form validation
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');

    emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
        }}
      >
        {/* Left side - Branding */}
        <div
          style={{
            flex: 1,
            color: 'white',
            display: window.innerWidth >= 768 ? 'block' : 'none',
          }}
        >
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '32px',
                marginBottom: '24px',
                backdropFilter: 'blur(10px)',
              }}
            >
              RF
            </div>
            <Title
              level={1}
              style={{ color: 'white', marginBottom: '16px', fontSize: '48px' }}
            >
              RadiusF CRM
            </Title>
            <Paragraph
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '18px',
                lineHeight: '1.6',
              }}
            >
              Streamline your consultancy operations with our comprehensive CRM
              solution. Manage students, track applications, and grow your study
              abroad business efficiently.
            </Paragraph>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                }}
              />
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Complete student lifecycle management
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                }}
              />
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                Role-based access control
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                }}
              />
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                University and application tracking
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '50%',
                }}
              />
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                LocalStorage-based data management
              </Text>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div style={{ flex: 1, maxWidth: '480px' }}>
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              border: 'none',
            }}
            styles={{ body: { padding: '40px' } }}
          >
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Title
                level={2}
                style={{ marginBottom: '8px', color: '#1976d2' }}
              >
                Welcome Back
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Sign in to your RadiusF CRM account
              </Text>
            </div>

            <Form
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
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter your email address"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<LoginOutlined />}
                  style={{
                    width: '100%',
                    height: '48px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            {/* Demo Credentials */}
            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                background: '#f8f9fa',
                borderRadius: '8px',
              }}
            >
              <Text
                strong
                style={{
                  display: 'block',
                  marginBottom: '12px',
                  color: '#666',
                }}
              >
                Demo Credentials:
              </Text>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="link"
                  size="small"
                  onClick={() => fillDemoCredentials('admin')}
                  style={{ padding: 0, height: 'auto', textAlign: 'left' }}
                >
                  <Text style={{ fontSize: '13px' }}>
                    <strong>Admin:</strong> admin@radiusf.com / admin123
                  </Text>
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => fillDemoCredentials('counselor')}
                  style={{ padding: 0, height: 'auto', textAlign: 'left' }}
                >
                  <Text style={{ fontSize: '13px' }}>
                    <strong>Counselor:</strong> sarah.johnson@radiusf.com / counselor123
                  </Text>
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => fillDemoCredentials('employee')}
                  style={{ padding: 0, height: 'auto', textAlign: 'left' }}
                >
                  <Text style={{ fontSize: '13px' }}>
                    <strong>Employee:</strong> lisa.wang@radiusf.com / employee123
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
