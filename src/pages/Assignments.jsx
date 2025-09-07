import React, { useMemo, useState, useEffect } from 'react';
import { Card, Table, Select, Button, Space, Typography, Tag } from 'antd';
import { studentStorage, userStorage, auditStorage } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';
import { useMessage } from '../contexts/MessageContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Assignments = () => {
  const { user } = useAuth();
  const messageApi = useMessage();
  const [students, setStudents] = useState([]);

  const supportAgents = useMemo(() => userStorage.getUsers().filter(u => u.role === 'customer_support'), []);

  const load = () => {
    setStudents(studentStorage.getStudents());
  };

  useEffect(() => { load(); }, []);

  const assign = (student, supportId) => {
    const ok = studentStorage.updateStudent(student.id, { supportAssigneeId: supportId, lastActivity: new Date().toISOString().split('T')[0] });
    if (ok) {
      const agent = supportAgents.find(s => s.id === supportId);
      auditStorage.add({ actorId: user.id, actorName: user.name, action: 'assign_support', details: { studentId: student.id, supportAssigneeId: supportId } });
      messageApi.success(`Assigned to ${agent?.name || 'Unassigned'}`);
      load();
    } else {
      messageApi.error('Failed to assign');
    }
  };

  const columns = [
    { title: 'Student', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s) => <Tag>{s}</Tag> },
    {
      title: 'Customer Support', key: 'support', render: (_, record) => (
        <Space>
          <Select
            style={{ minWidth: 200 }}
            allowClear
            value={record.supportAssigneeId || undefined}
            placeholder="Select Support"
            onChange={(val) => assign(record, val || null)}
          >
            {supportAgents.map(s => (
              <Option key={s.id} value={s.id}>{s.name}</Option>
            ))}
          </Select>
          <Button onClick={() => assign(record, null)}>Clear</Button>
        </Space>
      )
    }
  ];

  return (
    <Card style={{ margin: '-20px' }}>
      <Title level={3} style={{ marginBottom: 4 }}>Customer Support Assignments</Title>
      <Text type="secondary">Assign students to Customer Support team members</Text>
      <Card style={{ marginTop: 16 }}>
        <Table rowKey="id" columns={columns} dataSource={students} pagination={{ pageSize: 10, size: 'small' }} />
      </Card>
    </Card>
  );
};

export default Assignments;
