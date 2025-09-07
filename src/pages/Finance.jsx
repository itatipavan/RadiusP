import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Button, Space, Typography, Tag, Modal, Form, InputNumber, DatePicker, Input, message } from 'antd';
import { studentStorage, paymentStorage, auditStorage } from '../utils/localStorage';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Finance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    setStudents(studentStorage.getStudents());
  }, []);

  const getPayments = (id) => paymentStorage.getByStudentId(id);

  const openAdd = (student) => {
    setCurrent(student);
    form.resetFields();
    setModalOpen(true);
  };

  const addPayment = async () => {
    const vals = await form.validateFields();
    const payload = { amount: vals.amount, dueDate: vals.dueDate.format('YYYY-MM-DD'), note: vals.note || '' };
    const ok = paymentStorage.addPayment(current.id, payload);
    if (ok) {
      auditStorage.add({ actorId: user.id, actorName: user.name, action: 'finance_add_due', details: { studentId: current.id, amount: payload.amount } });
      message.success('Payment due added');
      setModalOpen(false);
    } else { message.error('Failed to add'); }
  };

  const markPaid = (studentId, paymentId) => {
    const ok = paymentStorage.updatePayment(studentId, paymentId, { status: 'paid', paidAt: new Date().toISOString() });
    if (ok) {
      auditStorage.add({ actorId: user.id, actorName: user.name, action: 'finance_mark_paid', details: { studentId, paymentId } });
      message.success('Marked as paid');
    } else { message.error('Failed to update'); }
  };

  const columns = [
    { title: 'Student', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Program', dataIndex: 'preferredProgram', key: 'preferredProgram' },
    { title: 'Destination', dataIndex: 'destination', key: 'destination' },
    { title: 'Payments', key: 'payments', render: (_, record) => {
      const list = getPayments(record.id);
      if (!list.length) return <Text type="secondary">No records</Text>;
      return (
        <Space direction="vertical">
          {list.map(p => (
            <Space key={p.id}>
              <Tag color={p.status === 'paid' ? 'green' : 'orange'}>{p.status.toUpperCase()}</Tag>
              <Text>₹{p.amount} due {p.dueDate}</Text>
              {p.status !== 'paid' && (
                <Button size="small" type="link" onClick={() => markPaid(record.id, p.id)}>Mark Paid</Button>
              )}
            </Space>
          ))}
        </Space>
      );
    } },
    { title: 'Actions', key: 'actions', render: (_, record) => (
      <Button size="small" onClick={() => openAdd(record)}>Add Due</Button>
    ) }
  ];

  return (
    <Card style={{ margin: '-20px' }}>
      <Title level={3} style={{ marginBottom: 4 }}>Finance</Title>
      <Text type="secondary">Manage student fee payment statuses</Text>
      <Card style={{ marginTop: 16 }}>
        <Table rowKey="id" columns={columns} dataSource={students} pagination={{ pageSize: 10, size: 'small' }} />
      </Card>
      <Modal title={`Add Payment Due - ${current?.fullName || ''}`} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={addPayment} okText="Add Due">
        <Form layout="vertical" form={form}>
          <Form.Item name="amount" label="Amount (₹)" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="dueDate" label="Due Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} disabledDate={(d) => d && d < dayjs().startOf('day')} />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} placeholder="Optional" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default Finance;
