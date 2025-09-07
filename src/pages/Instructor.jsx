import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Modal, Form, Input, Typography, message } from 'antd';
import { studentStorage, auditStorage } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Instructor = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [remarkForm] = Form.useForm();
  const [current, setCurrent] = useState(null);

  const load = () => setStudents(studentStorage.getStudents());
  useEffect(() => { load(); }, []);

  const updateStatus = async (student, status) => {
    setCurrent(student);
    remarkForm.setFieldsValue({ remark: '' });
    Modal.confirm({
      title: `Mark ${student.fullName} as ${status}`,
      content: (
        <Form form={remarkForm} layout="vertical">
          <Form.Item name="remark" label="Remark" rules={[{ required: true }] }>
            <Input.TextArea rows={3} placeholder="Reason or note" />
          </Form.Item>
        </Form>
      ),
      okText: 'Update',
      onOk: async () => {
        const { remark } = await remarkForm.validateFields();
        const history = Array.isArray(student.remarkHistory) ? student.remarkHistory : [];
        history.push({ userId: user.id, userName: user.name, remark: `[Instructor: ${status}] ${remark}`, date: new Date().toISOString() });
        const ok = studentStorage.updateStudent(student.id, { instructorStatus: status, remarkHistory: history, lastActivity: new Date().toISOString().split('T')[0] });
        if (ok) {
          auditStorage.add({ actorId: user.id, actorName: user.name, action: 'instructor_status', details: { studentId: student.id, status } });
          message.success('Status updated');
          load();
        } else {
          message.error('Failed to update');
        }
      }
    });
  };

  const columns = [
    { title: 'Student', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Program', dataIndex: 'preferredProgram', key: 'preferredProgram' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Instructor Status', dataIndex: 'instructorStatus', key: 'instructorStatus', render: (s) => s ? <Tag color={s === 'sent' ? 'green' : 'red'}>{s}</Tag> : <Tag>NA</Tag> },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <Space>
        <Button size="small" type="link" onClick={() => updateStatus(record, 'sent')}>Mark Sent</Button>
        <Button size="small" type="link" danger onClick={() => updateStatus(record, 'cancelled')}>Mark Cancelled</Button>
      </Space>
    )}
  ];

  return (
    <Card style={{ margin: '-20px' }}>
      <Title level={3} style={{ marginBottom: 4 }}>Instructor Panel</Title>
      <Text type="secondary">Update delivery status and maintain status notes</Text>
      <Card style={{ marginTop: 16 }}>
        <Table rowKey="id" columns={columns} dataSource={students} pagination={{ pageSize: 10, size: 'small' }} />
      </Card>
    </Card>
  );
};

export default Instructor;
