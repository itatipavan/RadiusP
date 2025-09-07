import React, { useMemo } from "react";
import { Card, Form, Input, Select, Button, Row, Col, Typography } from "antd";
import { useAuth } from "../contexts/AuthContext";
import { useMessage } from "../contexts/MessageContext";
import { studentStorage, userStorage, auditStorage } from "../utils/localStorage";

const { Title, Text } = Typography;
const { Option } = Select;

const WalkIn = () => {
  const { user } = useAuth();
  const messageApi = useMessage();
  const [form] = Form.useForm();

  const supportAgents = useMemo(() => userStorage.getUsers().filter(u => u.role === 'customer_support'), []);

  const onFinish = async (values) => {
    const support = supportAgents.find(s => s.id === values.supportAssigneeId);
    const data = {
      firstName: values.firstName,
      lastName: values.lastName,
      fullName: `${values.firstName} ${values.lastName}`,
      email: values.email,
      phone: values.phone,
      destination: values.destination,
      preferredProgram: values.preferredProgram,
      preferredUniversity: values.preferredUniversity || '',
      status: 'Inquiry',
      priority: 'Medium',
      assignedCounselor: support ? support.name : '',
      counselorId: null,
      supportAssigneeId: values.supportAssigneeId || null,
      joinDate: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString().split('T')[0],
      remarkHistory: []
    };
    const ok = studentStorage.addStudent(data);
    if (ok) {
      auditStorage.add({ actorId: user.id, actorName: user.name, action: 'walk_in_add', details: { student: data.fullName, supportAssigneeId: data.supportAssigneeId } });
      messageApi.success('Walk-in student added and assigned');
      form.resetFields();
    } else {
      messageApi.error('Failed to add student');
    }
  };

  return (
    <Card style={{ margin: "-20px" }}>
      <Title level={3} style={{ marginBottom: 4 }}>Walk-in Student Entry</Title>
      <Text type="secondary">Capture walk-in inquiries and assign to Customer Support</Text>
      <Card style={{ marginTop: 16 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input placeholder="Last Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                <Input placeholder="student@email.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
                <Input placeholder="+91 9876543210" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="destination" label="Preferred Country" rules={[{ required: true }]}>
                <Select placeholder="Select Country">
                  {['Canada','USA','UK','Australia','Germany','Ireland','New Zealand'].map(c => (
                    <Option key={c} value={c}>{c}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="preferredProgram" label="Preferred Program" rules={[{ required: true }]}>
                <Input placeholder="e.g., Computer Science" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="preferredUniversity" label="Preferred University">
                <Input placeholder="Optional" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="supportAssigneeId" label="Assign Customer Support" rules={[{ required: true }] }>
                <Select placeholder="Select Support Agent">
                  {supportAgents.map(s => (
                    <Option key={s.id} value={s.id}>{s.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" htmlType="submit">Add Walk-in</Button>
        </Form>
      </Card>
    </Card>
  );
};

export default WalkIn;
