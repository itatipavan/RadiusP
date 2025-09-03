import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Progress,
  Table,
  Tag,
  Space,
  Avatar,
  List,
  Badge,
  Divider,
  Button,
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  TeamOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { 
  studentStorage, 
  applicationStorage, 
  universityStorage, 
  employeeStorage 
} from '../utils/localStorage';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user, getRoleDisplayName } = useAuth();
  const [stats, setStats] = useState({});
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        const students = studentStorage.getStudents();
        const applications = applicationStorage.getApplications();
        const universities = universityStorage.getUniversities();
        const employees = employeeStorage.getEmployees();

        // Filter data based on user role
        let filteredStudents = students;
        let filteredApplications = applications;

        if (user.role === 'counselor') {
          filteredStudents = students.filter(student => student.counselorId === user.id);
          filteredApplications = applications.filter(app => app.counselorId === user.id);
        } else if (user.role === 'employee') {
          // Employees can see limited data
          filteredStudents = students.filter(student => student.counselorId === user.id);
          filteredApplications = applications.filter(app => app.counselorId === user.id);
        }

        // Calculate statistics
        const totalStudents = filteredStudents.length;
        const totalApplications = filteredApplications.length;
        const totalUniversities = universities.length;
        const totalEmployees = employees.length;

        // Status-based stats
        const newInquiries = filteredStudents.filter(s => s.status === 'Inquiry').length;
        const activeApplications = filteredApplications.filter(a => 
          !['Enrolled', 'Rejected', 'Withdrawn'].includes(a.status)
        ).length;
        const enrolledStudents = filteredStudents.filter(s => s.status === 'Enrolled').length;
        const visaApproved = filteredStudents.filter(s => s.status === 'Visa Approved').length;

        // Recent data
        const recentApps = filteredApplications
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);

        const recentStds = filteredStudents
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5);

        setStats({
          totalStudents,
          totalApplications,
          totalUniversities,
          totalEmployees,
          newInquiries,
          activeApplications,
          enrolledStudents,
          visaApproved,
        });

        setRecentApplications(recentApps);
        setRecentStudents(recentStds);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      'Inquiry': 'default',
      'Document Review': 'orange',
      'Applied': 'blue',
      'Application Submitted': 'blue',
      'University Review': 'purple',
      'Decision Received': 'cyan',
      'Visa Processing': 'gold',
      'Visa Approved': 'green',
      'Enrolled': 'success',
    };
    return colors[status] || 'default';
  };

  const calculateSuccessRate = () => {
    if (stats.totalApplications === 0) return 0;
    return Math.round((stats.enrolledStudents / stats.totalApplications) * 100);
  };

  const applicationColumns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1976d2' }}>
            {text.charAt(0)}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'University',
      dataIndex: 'university',
      key: 'university',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <Progress
          percent={(record.currentStep / record.totalSteps) * 100}
          size="small"
          showInfo={false}
          strokeColor="#1976d2"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Button type="link" icon={<EyeOutlined />} size="small">
          View
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: '32px' }}>
        <Title level={2} style={{ margin: 0 }}>
          Welcome back, {user?.name}! 👋
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Here's what's happening with your {getRoleDisplayName(user?.role).toLowerCase()} dashboard today.
        </Text>
      </div>

      {/* Key Statistics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: '#1976d2' }} />}
              valueStyle={{ color: '#1976d2' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <RiseOutlined /> +{stats.newInquiries} new inquiries
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Applications"
              value={stats.activeApplications}
              prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ClockCircleOutlined /> In progress
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={calculateSuccessRate()}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <CheckCircleOutlined /> {stats.enrolledStudents} enrolled
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Partner Universities"
              value={stats.totalUniversities}
              prefix={<BankOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <GlobalOutlined /> Worldwide reach
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Progress Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={12}>
          <Card title="Student Status Overview" extra={<Button type="link">View All</Button>}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>New Inquiries</Text>
                  <Text strong>{stats.newInquiries}</Text>
                </div>
                <Progress 
                  percent={stats.totalStudents ? (stats.newInquiries / stats.totalStudents) * 100 : 0} 
                  strokeColor="#faad14" 
                  showInfo={false}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Visa Approved</Text>
                  <Text strong>{stats.visaApproved}</Text>
                </div>
                <Progress 
                  percent={stats.totalStudents ? (stats.visaApproved / stats.totalStudents) * 100 : 0} 
                  strokeColor="#52c41a" 
                  showInfo={false}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Enrolled</Text>
                  <Text strong>{stats.enrolledStudents}</Text>
                </div>
                <Progress 
                  percent={stats.totalStudents ? (stats.enrolledStudents / stats.totalStudents) * 100 : 0} 
                  strokeColor="#1976d2" 
                  showInfo={false}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" extra={<Button type="link">More</Button>}>
            <List
              size="small"
              dataSource={[
                { title: 'Add New Student', icon: <UserOutlined />, color: '#1976d2' },
                { title: 'Create Application', icon: <FileTextOutlined />, color: '#52c41a' },
                { title: 'View Universities', icon: <BankOutlined />, color: '#722ed1' },
                { title: 'Generate Report', icon: <TrophyOutlined />, color: '#faad14' },
              ]}
              renderItem={item => (
                <List.Item style={{ cursor: 'pointer', padding: '12px 0' }}>
                  <Space>
                    <Avatar 
                      size="small" 
                      style={{ backgroundColor: item.color }}
                      icon={item.icon}
                    />
                    <Text>{item.title}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Applications" 
            extra={<Button type="link">View All Applications</Button>}
          >
            <Table
              dataSource={recentApplications}
              columns={applicationColumns}
              pagination={false}
              size="small"
              loading={loading}
              locale={{ emptyText: 'No recent applications' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title="Recent Students" 
            extra={<Button type="link">View All Students</Button>}
          >
            <List
              dataSource={recentStudents}
              loading={loading}
              locale={{ emptyText: 'No recent students' }}
              renderItem={student => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: '#1976d2' }}>
                        {student.firstName?.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{student.fullName}</Text>
                        <Tag color={getStatusColor(student.status)} size="small">
                          {student.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {student.preferredProgram} • {student.destination}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Last activity: {new Date(student.lastActivity).toLocaleDateString()}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
