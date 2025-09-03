import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Typography,
  Avatar,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  DatePicker,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ExportOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';
import { studentStorage, userStorage } from '../utils/localStorage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

const Students = () => {
  const { user, hasPermission } = useAuth();
  const messageApi = useMessage();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadStudents();
  }, [user]);

  useEffect(() => {
    filterStudents();
  }, [searchText, statusFilter, students]);

  const loadStudents = () => {
    setLoading(true);
    try {
      let allStudents = studentStorage.getStudents();
      
      // Filter based on user role
      if (user.role === 'counselor') {
        allStudents = allStudents.filter(student => student.counselorId === user.id);
      } else if (user.role === 'employee') {
        allStudents = allStudents.filter(student => student.counselorId === user.id);
      }

      setStudents(allStudents);
      setFilteredStudents(allStudents);
    } catch (error) {
      messageApi.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchText) {
      filtered = filtered.filter(student =>
        student.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        student.email.toLowerCase().includes(searchText.toLowerCase()) ||
        student.destination.toLowerCase().includes(searchText.toLowerCase()) ||
        student.preferredProgram.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleAddStudent = async (values) => {
    try {
      const counselors = userStorage.getUsers().filter(u => u.role === 'counselor');
      const assignedCounselor = counselors.find(c => c.name === values.assignedCounselor);

      const studentData = {
        ...values,
        fullName: `${values.firstName} ${values.lastName}`,
        counselorId: assignedCounselor?.id || user.id,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        graduationYear: values.graduationYear?.format('YYYY'),
        joinDate: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString().split('T')[0],
        priority: 'Medium',
        status: 'Inquiry',
      };

      const success = studentStorage.addStudent(studentData);
      
      if (success) {
        messageApi.success('Student added successfully!');
        form.resetFields();
        setIsAddModalVisible(false);
        loadStudents();
      } else {
        messageApi.error('Failed to add student');
      }
    } catch (error) {
      messageApi.error('An error occurred while adding student');
    }
  };

  const handleEditStudent = async (values) => {
    try {
      const counselors = userStorage.getUsers().filter(u => u.role === 'counselor');
      const assignedCounselor = counselors.find(c => c.name === values.assignedCounselor);

      const updatedData = {
        ...values,
        fullName: `${values.firstName} ${values.lastName}`,
        counselorId: assignedCounselor?.id || editingStudent.counselorId,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        graduationYear: values.graduationYear?.format('YYYY'),
      };

      const success = studentStorage.updateStudent(editingStudent.id, updatedData);
      
      if (success) {
        messageApi.success('Student updated successfully!');
        form.resetFields();
        setIsEditModalVisible(false);
        setEditingStudent(null);
        loadStudents();
      } else {
        messageApi.error('Failed to update student');
      }
    } catch (error) {
      messageApi.error('An error occurred while updating student');
    }
  };

  const handleDeleteStudent = (studentId) => {
    Modal.confirm({
      title: 'Delete Student',
      content: 'Are you sure you want to delete this student? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        const success = studentStorage.deleteStudent(studentId);
        if (success) {
          messageApi.success('Student deleted successfully');
          loadStudents();
        } else {
          messageApi.error('Failed to delete student');
        }
      },
    });
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
      graduationYear: student.graduationYear ? dayjs(student.graduationYear, 'YYYY') : null,
    });
    setIsEditModalVisible(true);
  };

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

  const columns = [
    {
      title: 'Student',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1976d2' }}>
            {text.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{text}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <MailOutlined /> {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => (
        <Space>
          <PhoneOutlined style={{ color: '#1976d2' }} />
          <Text>{phone}</Text>
        </Space>
      ),
    },
    {
      title: 'Destination',
      dataIndex: 'destination',
      key: 'destination',
      render: (destination, record) => (
        <div>
          <Text strong>{destination}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.preferredProgram}
          </Text>
        </div>
      ),
    },
    {
      title: 'University',
      dataIndex: 'preferredUniversity',
      key: 'preferredUniversity',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Counselor',
      dataIndex: 'assignedCounselor',
      key: 'assignedCounselor',
      render: (counselor) => (
        <Space>
          <Avatar size="small" style={{ backgroundColor: '#52c41a' }}>
            {counselor?.charAt(0)}
          </Avatar>
          <Text>{counselor}</Text>
        </Space>
      ),
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => messageApi.info('View details feature coming soon!')}
          >
            View
          </Button>
          {hasPermission('edit_students') && (
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => openEditModal(record)}
            >
              Edit
            </Button>
          )}
          {hasPermission('delete_students') && (
            <Button 
              type="link" 
              icon={<DeleteOutlined />} 
              size="small"
              danger
              onClick={() => handleDeleteStudent(record.id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const statusCounts = {
    total: filteredStudents.length,
    inquiry: filteredStudents.filter(s => s.status === 'Inquiry').length,
    applied: filteredStudents.filter(s => s.status === 'Applied').length,
    approved: filteredStudents.filter(s => s.status === 'Visa Approved').length,
    enrolled: filteredStudents.filter(s => s.status === 'Enrolled').length,
  };

  const getCounselors = () => {
    return userStorage.getUsers().filter(u => u.role === 'counselor');
  };

  const StudentForm = ({ onFinish, initialValues = {} }) => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: 'Please enter first name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please enter last name' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="student@email.com" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="+91 9876543210" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
            rules={[{ required: true, message: 'Please select date of birth' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="Select DOB" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select gender' }]}
          >
            <Select placeholder="Select Gender">
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="address"
        label="Current Address"
        rules={[{ required: true, message: 'Please enter address' }]}
      >
        <TextArea rows={2} placeholder="Enter complete address" />
      </Form.Item>

      <Divider>Academic Information</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="currentEducation"
            label="Current Education Level"
            rules={[{ required: true, message: 'Please select education level' }]}
          >
            <Select placeholder="Select Education Level">
              <Option value="12th">12th Grade</Option>
              <Option value="diploma">Diploma</Option>
              <Option value="bachelor">Bachelor's Degree</Option>
              <Option value="master">Master's Degree</Option>
              <Option value="phd">PhD</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="fieldOfStudy"
            label="Field of Study"
            rules={[{ required: true, message: 'Please enter field of study' }]}
          >
            <Input placeholder="e.g., Computer Science, Engineering" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="institution"
            label="Current Institution"
            rules={[{ required: true, message: 'Please enter institution name' }]}
          >
            <Input placeholder="School/College/University Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="gpa"
            label="GPA/Percentage"
            rules={[{ required: true, message: 'Please enter GPA/Percentage' }]}
          >
            <Input placeholder="e.g., 8.5 CGPA or 85%" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="graduationYear"
            label="Expected Graduation"
            rules={[{ required: true, message: 'Please select graduation year' }]}
          >
            <DatePicker picker="year" style={{ width: '100%' }} placeholder="Select Year" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="englishTest" label="English Test">
            <Select placeholder="Select English Test">
              <Option value="ielts">IELTS</Option>
              <Option value="toefl">TOEFL</Option>
              <Option value="pte">PTE</Option>
              <Option value="duolingo">Duolingo</Option>
              <Option value="none">Not Taken Yet</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="testScore" label="Test Score (if applicable)">
        <Input placeholder="e.g., IELTS: 7.5, TOEFL: 95" />
      </Form.Item>

      <Divider>Study Abroad Plans</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="destination"
            label="Preferred Country"
            rules={[{ required: true, message: 'Please select preferred country' }]}
          >
            <Select placeholder="Select Country">
              <Option value="Canada">Canada</Option>
              <Option value="USA">United States</Option>
              <Option value="UK">United Kingdom</Option>
              <Option value="Australia">Australia</Option>
              <Option value="Germany">Germany</Option>
              <Option value="Ireland">Ireland</Option>
              <Option value="New Zealand">New Zealand</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="preferredProgram"
            label="Preferred Field of Study"
            rules={[{ required: true, message: 'Please enter preferred field' }]}
          >
            <Input placeholder="e.g., Computer Science, Business" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="preferredUniversity" label="Preferred University">
            <Input placeholder="e.g., University of Toronto" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="assignedCounselor"
            label="Assign Counselor"
            rules={[{ required: true, message: 'Please assign a counselor' }]}
          >
            <Select placeholder="Select Counselor">
              {getCounselors().map(counselor => (
                <Option key={counselor.id} value={counselor.name}>
                  {counselor.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="notes" label="Additional Notes">
        <TextArea
          rows={3}
          placeholder="Any specific requirements, concerns, or additional information..."
        />
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Student Management
          </Title>
          <Text type="secondary">
            Manage student profiles, track applications, and monitor progress
          </Text>
        </div>
        {hasPermission('edit_students') && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setIsAddModalVisible(true)}
          >
            Add New Student
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={statusCounts.total}
              prefix={<UserOutlined style={{ color: '#1976d2' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="New Inquiries"
              value={statusCounts.inquiry}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Applications"
              value={statusCounts.applied}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card>
            <Statistic
              title="Enrolled"
              value={statusCounts.enrolled}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search students..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={setStatusFilter}
              prefix={<FilterOutlined />}
            >
              <Option value="all">All Status</Option>
              <Option value="Inquiry">Inquiry</Option>
              <Option value="Document Review">Document Review</Option>
              <Option value="Applied">Applied</Option>
              <Option value="Visa Approved">Visa Approved</Option>
              <Option value="Enrolled">Enrolled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10}>
            <Space style={{ float: 'right' }}>
              <Button icon={<ExportOutlined />}>Export</Button>
              <Button icon={<FilterOutlined />}>More Filters</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Students Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          loading={loading}
          rowKey="id"
          pagination={{
            total: filteredStudents.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} students`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Add Student Modal */}
      <Modal
        title="Add New Student"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsAddModalVisible(false);
            form.resetFields();
          }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Add Student
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        <StudentForm onFinish={handleAddStudent} />
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        title="Edit Student"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsEditModalVisible(false);
            setEditingStudent(null);
            form.resetFields();
          }}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Update Student
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        <StudentForm onFinish={handleEditStudent} />
      </Modal>
    </div>
  );
};

export default Students;
