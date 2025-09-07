import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Form, InputNumber, Button, Space, Typography, Input } from 'antd';
import { employeeStorage, payDetailsStorage } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const PayDetails = () => {
  const { user } = useAuth();
  const employees = employeeStorage.getEmployees();
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(null);

  const keyOf = (emp) => emp.email || emp.name;

  const load = () => {
    const rows = employees.map(emp => ({
      ...emp,
      employeeKey: keyOf(emp),
      pay: payDetailsStorage.getByEmployeeKey(keyOf(emp))
    }));
    setData(rows);
  };

  useEffect(() => { load(); }, []);

  const openEdit = (row) => {
    setCurrent(row);
    const currentPay = row.pay || { base: 0, allowances: 0, deductions: 0 };
    form.setFieldsValue(currentPay);
  };

  const save = async () => {
    const vals = await form.validateFields();
    payDetailsStorage.upsert(keyOf(current), vals);
    load();
  };

  const columns = [
    { title: 'Employee', dataIndex: 'name', key: 'name' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Base', key: 'base', render: (_, r) => r.pay ? `₹${r.pay.base}` : '-' },
    { title: 'Allowances', key: 'allowances', render: (_, r) => r.pay ? `₹${r.pay.allowances}` : '-' },
    { title: 'Deductions', key: 'deductions', render: (_, r) => r.pay ? `₹${r.pay.deductions}` : '-' },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Button size="small" onClick={() => openEdit(r)}>Edit</Button>
    ) }
  ];

  return (
    <Card style={{ margin: '-20px' }}>
      <Title level={3} style={{ marginBottom: 4 }}>Pay Details</Title>
      <Text type="secondary">Manage base salary, allowances and deductions</Text>
      <Card style={{ marginTop: 16 }}>
        <Table rowKey={(r) => r.id} columns={columns} dataSource={data} pagination={{ pageSize: 10, size: 'small' }} />
      </Card>
      {current && (
        <Card title={`Edit Pay - ${current.name}`} style={{ marginTop: 16 }}>
          <Form layout="vertical" form={form}>
            <Form.Item name="base" label="Base" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="allowances" label="Allowances" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="deductions" label="Deductions" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={save}>Save</Button>
              <Button onClick={() => setCurrent(null)}>Cancel</Button>
            </Space>
          </Form>
        </Card>
      )}
    </Card>
  );
};

export default PayDetails;
