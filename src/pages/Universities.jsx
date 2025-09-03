import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Tag, Input, Select, Typography, Row, Col, Statistic } from 'antd';
import { SearchOutlined, BankOutlined, GlobalOutlined, PlusOutlined } from '@ant-design/icons';
import { universityStorage } from '../utils/localStorage';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Universities = () => {
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [searchText, countryFilter, universities]);

  const loadUniversities = () => {
    setLoading(true);
    try {
      const allUniversities = universityStorage.getUniversities();
      setUniversities(allUniversities);
      setFilteredUniversities(allUniversities);
    } catch (error) {
      console.error('Error loading universities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUniversities = () => {
    let filtered = universities;

    if (searchText) {
      filtered = filtered.filter(uni =>
        uni.name.toLowerCase().includes(searchText.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchText.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (countryFilter !== 'all') {
      filtered = filtered.filter(uni => uni.country === countryFilter);
    }

    setFilteredUniversities(filtered);
  };

  const columns = [
    {
      title: 'University',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.city}, {record.country}
          </Text>
        </div>
      ),
    },
    {
      title: 'Ranking',
      dataIndex: 'ranking',
      key: 'ranking',
      render: (ranking) => (
        <Tag color="blue">#{ranking}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'Public' ? 'green' : 'orange'}>{type}</Tag>
      ),
    },
    {
      title: 'Tuition Fee',
      dataIndex: 'tuitionFee',
      key: 'tuitionFee',
    },
    {
      title: 'Partnership',
      dataIndex: 'isPartner',
      key: 'isPartner',
      render: (isPartner) => (
        <Tag color={isPartner ? 'success' : 'default'}>
          {isPartner ? 'Partner' : 'Standard'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Button type="link" size="small">View Details</Button>
      ),
    },
  ];

  const countries = [...new Set(universities.map(uni => uni.country))];
  const partnerUniversities = universities.filter(uni => uni.isPartner).length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Universities</Title>
          <Text type="secondary">Explore partner universities and programs</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>Add University</Button>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Universities"
              value={universities.length}
              prefix={<BankOutlined style={{ color: '#1976d2' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Partner Universities"
              value={partnerUniversities}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Countries"
              value={countries.length}
              prefix={<GlobalOutlined style={{ color: '#722ed1' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Search universities..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select style={{ width: '100%' }} value={countryFilter} onChange={setCountryFilter}>
              <Option value="all">All Countries</Option>
              {countries.map(country => (
                <Option key={country} value={country}>{country}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredUniversities}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />
      </Card>
    </div>
  );
};

export default Universities;
