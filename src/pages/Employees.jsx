import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Input, Typography, Avatar, Row, Col, Statistic } from 'antd';
import { SearchOutlined, TeamOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import { employeeStorage } from '../utils/localStorage';

const { Title, Text } = Typography;
const { Search } = Input;

const Employees = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [searchText, employees]);

  const loadEmployees = () => {
    setLoading(true);
    try {
      const allEmployees = employeeStorage.getEmployees();
      setEmployees(allEmployees);
      setFilteredEmployees(allEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;
    if (searchText) {
      filtered = filtered.filter(emp =>
        emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchText.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    setFilteredEmployees(filtered);
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1976d2' }}>{text.charAt(0)}</Avatar>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      render: (rate) => rate !== 'N/A' ? <Tag color="success">{rate}</Tag> : <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag>,
    },
  ];

  const activeCounselors = employees.filter(emp => emp.role.includes('Counselor') && emp.status === 'Active').length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Employee Management</Title>
          <Text type="secondary">Manage team members and their performance</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>Add Employee</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Employees"
              value={employees.length}
              prefix={<TeamOutlined style={{ color: '#1976d2' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Counselors"
              value={activeCounselors}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Departments"
              value={[...new Set(employees.map(emp => emp.department))].length}
              prefix={<UserOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '16px' }}>
        <Search
          placeholder="Search employees..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredEmployees}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default Employees;
