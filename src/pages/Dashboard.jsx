import React, { useState, useEffect } from "react";
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
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
  TrophyOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import {
  studentStorage,
  applicationStorage,
  universityStorage,
  employeeStorage,
} from "../utils/localStorage";

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
        let filteredStudents = students;
        let filteredApplications = applications;
        if (user.role === "counselor" || user.role === "employee") {
          filteredStudents = students.filter(
            (student) => student.counselorId === user.id
          );
          filteredApplications = applications.filter(
            (app) => app.counselorId === user.id
          );
        }
        const totalStudents = filteredStudents.length;
        const totalApplications = filteredApplications.length;
        const totalUniversities = universities.length;
        const totalEmployees = employees.length;
        const newInquiries = filteredStudents.filter(
          (s) => s.status === "Inquiry"
        ).length;
        const activeApplications = filteredApplications.filter(
          (a) => !["Enrolled", "Rejected", "Withdrawn"].includes(a.status)
        ).length;
        const enrolledStudents = filteredStudents.filter(
          (s) => s.status === "Enrolled"
        ).length;
        const visaApproved = filteredStudents.filter(
          (s) => s.status === "Visa Approved"
        ).length;
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
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [user]);

  const getStatusColor = (status) =>
    ({
      Inquiry: "default",
      "Document Review": "orange",
      Applied: "blue",
      "Application Submitted": "blue",
      "University Review": "purple",
      "Decision Received": "cyan",
      "Visa Processing": "gold",
      "Visa Approved": "green",
      Enrolled: "success",
    }[status] || "default");
  const calculateSuccessRate = () => {
    if (stats.totalApplications === 0) return 0;
    return Math.round((stats.enrolledStudents / stats.totalApplications) * 100);
  };

  const applicationColumns = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      render: (text) => (
        <Space>
          <Avatar style={{ backgroundColor: "#1976d2" }}>
            {text.charAt(0)}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    { title: "University", dataIndex: "university", key: "university" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => (
        <Progress
          percent={(record.currentStep / record.totalSteps) * 100}
          size="small"
          strokeColor="#1976d2"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Button type="link" icon={<EyeOutlined />} size="small"/>
      ),
    },
  ];

  return (
    <Card style={{ margin: "-20px" }}>
      <div style={{ marginBottom: "12px" }}>
        <Title level={3} style={{ margin: 0 }}>
          Welcome back, {user?.name}! 👋
        </Title>
        <Text type="secondary" style={{ fontSize: "16px" }}>
          Here's what's happening with your{" "}
          {getRoleDisplayName(user?.role).toLowerCase()} dashboard today.
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<UserOutlined style={{ color: "#1976d2" }} />}
              valueStyle={{ color: "#1976d2" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <RiseOutlined /> +{stats.newInquiries} new inquiries
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Active Applications"
              value={stats.activeApplications}
              prefix={<FileTextOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <ClockCircleOutlined /> In progress
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Success Rate"
              value={calculateSuccessRate()}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#faad14" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <CheckCircleOutlined /> {stats.enrolledStudents} enrolled
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card size="small">
            <Statistic
              title="Partner Universities"
              value={stats.totalUniversities}
              prefix={<BankOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
            <div style={{ marginTop: "8px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <GlobalOutlined /> Worldwide reach
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="Student Status Overview"
            extra={<Button type="link">View All</Button>}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Text>New Inquiries</Text>
                  <Text strong>{stats.newInquiries}</Text>
                </div>
                <Progress
                  percent={
                    stats.totalStudents
                      ? ((stats.newInquiries / stats.totalStudents) * 100).toFixed(1)
                      : 0
                  }
                  strokeColor="#faad14"
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Text>Visa Approved</Text>
                  <Text strong>{stats.visaApproved}</Text>
                </div>
                <Progress
                  percent={
                    stats.totalStudents
                      ? ((stats.visaApproved / stats.totalStudents) * 100).toFixed(1)
                      : 0
                  }
                  strokeColor="#52c41a"
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <Text>Enrolled</Text>
                  <Text strong>{stats.enrolledStudents}</Text>
                </div>
                <Progress
                  percent={
                    stats.totalStudents
                      ? ((stats.enrolledStudents / stats.totalStudents) * 100).toFixed(1)
                      : 0
                  }
                  strokeColor="#1976d2"
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="Quick Actions"
            extra={<Button type="link">More</Button>}
          >
            <List
              size="small"
              dataSource={[
                {
                  title: "Add New Student",
                  icon: <UserOutlined />,
                  color: "#1976d2",
                },
                {
                  title: "Create Application",
                  icon: <FileTextOutlined />,
                  color: "#52c41a",
                },
                {
                  title: "View Universities",
                  icon: <BankOutlined />,
                  color: "#722ed1",
                },
                {
                  title: "Generate Report",
                  icon: <TrophyOutlined />,
                  color: "#faad14",
                },
              ]}
              renderItem={(item) => (
                <List.Item style={{ cursor: "pointer", padding: "12px 0" }}>
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

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="Recent Applications"
            extra={<Button type="link">View All Applications</Button>}
          >
            <Table
              dataSource={recentApplications}
              columns={applicationColumns}
              pagination={false}
              size="small"
              loading={loading}
              scroll={{ x: 'max-content' }}
              locale={{ emptyText: "No recent applications" }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            size="small"
            title="Recent Students"
            extra={<Button type="link">View All Students</Button>}
          >
            <List
              dataSource={recentStudents}
              loading={loading}
              locale={{ emptyText: "No recent students" }}
              size="small"
              renderItem={(student) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: "#1976d2" }}>
                        {student.firstName?.charAt(0)}
                      </Avatar>
                    }
                    title={
                      <Space>
                        <Text strong>{student.fullName}</Text>
                        <Tag
                          color={getStatusColor(student.status)}
                          size="small"
                        >
                          {student.status}
                        </Tag>
                      </Space>
                    }
                    description={
                      <Row justify={"space-between"}>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {student.preferredProgram} • {student.destination}
                        </Text>
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          Last activity:{" "}
                          {new Date(student.lastActivity).toLocaleDateString()}
                        </Text>
                      </Row>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default Dashboard;
