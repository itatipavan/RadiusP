import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, Typography, Avatar, Row, Col, Statistic } from 'antd';
import { SearchOutlined, FilterOutlined, FileTextOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { applicationStorage } from '../utils/localStorage';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Applications = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, [user]);

  useEffect(() => {
    filterApplications();
  }, [searchText, statusFilter, applications]);

  const loadApplications = () => {
    setLoading(true);
    try {
      let allApplications = applicationStorage.getApplications();
      
      if (user.role === 'counselor') {
        allApplications = allApplications.filter(app => app.counselorId === user.id);
      } else if (user.role === 'employee') {
        allApplications = allApplications.filter(app => app.counselorId === user.id);
      }

      setApplications(allApplications);
      setFilteredApplications(allApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchText) {
      filtered = filtered.filter(app =>
        app.studentName.toLowerCase().includes(searchText.toLowerCase()) ||
        app.university.toLowerCase().includes(searchText.toLowerCase()) ||
        app.program.toLowerCase().includes(searchText.toLowerCase()) ||
        app.id.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Inquiry Received': 'default',
      'Document Review': 'orange',
      'Application Submitted': 'blue',
      'University Review': 'purple',
      'Decision Received': 'cyan',
      'Visa Processing': 'gold',
      'Visa Approved': 'green',
      'Enrolled': 'success',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      title: 'Application ID',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => (
        <div>
          <Text strong style={{ color: '#1976d2' }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {record.applicationDate}
          </Text>
        </div>
      ),
    },
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'student',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1976d2' }}>{text.charAt(0)}</Avatar>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.counselor}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'University & Program',
      key: 'program',
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: '13px' }}>{record.university}</Text>
          <br />
          <Text style={{ fontSize: '12px' }}>{record.program}</Text>
          <br />
          <Space>
            <Tag color="blue" style={{ fontSize: '10px' }}>{record.level}</Tag>
            <Tag color="green" style={{ fontSize: '10px' }}>{record.country}</Tag>
          </Space>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space direction="vertical" size="small">
          <Button type="link" icon={<EyeOutlined />} size="small">View Details</Button>
        </Space>
      ),
    },
  ];

  const statusCounts = {
    total: filteredApplications.length,
    inProgress: filteredApplications.filter(app => !['Enrolled', 'Rejected'].includes(app.status)).length,
    completed: filteredApplications.filter(app => app.status === 'Enrolled').length,
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Application Tracking</Title>
          <Text type="secondary">Monitor student applications and track progress</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>New Application</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Applications"
              value={statusCounts.total}
              prefix={<FileTextOutlined style={{ color: '#1976d2' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="In Progress"
              value={statusCounts.inProgress}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Completed"
              value={statusCounts.completed}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search applications..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select style={{ width: '100%' }} value={statusFilter} onChange={setStatusFilter}>
              <Option value="all">All Status</Option>
              <Option value="Document Review">Document Review</Option>
              <Option value="Application Submitted">Application Submitted</Option>
              <Option value="University Review">University Review</Option>
              <Option value="Enrolled">Enrolled</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredApplications}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Applications;
