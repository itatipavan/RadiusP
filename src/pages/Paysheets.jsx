import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Button, Space, Typography, DatePicker, message } from 'antd';
import { employeeStorage, payDetailsStorage, paySheetStorage } from '../utils/localStorage';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const Paysheets = () => {
  const employees = employeeStorage.getEmployees();
  const [sheets, setSheets] = useState([]);
  const [month, setMonth] = useState(dayjs());

  const load = () => setSheets(paySheetStorage.getAll());
  useEffect(() => { load(); }, []);

  const generate = () => {
    const items = employees.map(emp => {
      const key = emp.email || emp.name;
      const pay = payDetailsStorage.getByEmployeeKey(key) || { base: 0, allowances: 0, deductions: 0 };
      const gross = (Number(pay.base) || 0) + (Number(pay.allowances) || 0);
      const net = gross - (Number(pay.deductions) || 0);
      return { employee: emp.name, employeeKey: key, base: pay.base || 0, allowances: pay.allowances || 0, deductions: pay.deductions || 0, net };
    });
    const ok = paySheetStorage.add({ month: month.format('YYYY-MM'), items });
    if (ok) { message.success('Paysheet generated'); load(); }
    else { message.error('Failed to generate'); }
  };

  const columns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button size="small" onClick={() => paySheetStorage.update(r.id, { status: 'approved' }) && load()}>Approve</Button>
        <Button size="small" onClick={() => paySheetStorage.update(r.id, { status: 'draft' }) && load()}>Revert</Button>
      </Space>
    ) }
  ];

  return (
    <Card style={{ margin: '-20px' }}>
      <Title level={3} style={{ marginBottom: 4 }}>Paysheets</Title>
      <Text type="secondary">Generate and manage monthly paysheets</Text>
      <Space style={{ marginTop: 12 }}>
        <DatePicker picker="month" value={month} onChange={setMonth} />
        <Button type="primary" onClick={generate}>Generate Paysheet</Button>
      </Space>
      <Card style={{ marginTop: 16 }}>
        <Table rowKey="id" columns={columns} dataSource={sheets} pagination={{ pageSize: 10, size: 'small' }} />
      </Card>
    </Card>
  );
};

export default Paysheets;
