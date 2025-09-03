import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, List, Tag, Space, Button } from 'antd';
import { BarChartOutlined, TrophyOutlined, GlobalOutlined, TeamOutlined, DownloadOutlined } from '@ant-design/icons';
import { studentStorage, applicationStorage, universityStorage } from '../utils/localStorage';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;

const Reports = () => {
  const { user } = useAuth();
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReportData();
  }, [user]);

  const generateReportData = () => {
    setLoading(true);
    try {
      const students = studentStorage.getStudents();
      const applications = applicationStorage.getApplications();
      const universities = universityStorage.getUniversities();

      // Filter data based on user role
      let filteredStudents = students;
      let filteredApplications = applications;

      if (user.role === 'counselor') {
        filteredStudents = students.filter(student => student.counselorId === user.id);
        filteredApplications = applications.filter(app => app.counselorId === user.id);
      }

      // Calculate metrics
      const totalStudents = filteredStudents.length;
      const totalApplications = filteredApplications.length;
      const enrolledStudents = filteredStudents.filter(s => s.status === 'Enrolled').length;
      const visaApprovedStudents = filteredStudents.filter(s => s.status === 'Visa Approved').length;

      // Country distribution
      const countryStats = {};
      filteredStudents.forEach(student => {
        countryStats[student.destination] = (countryStats[student.destination] || 0) + 1;
      });

      // Program distribution
      const programStats = {};
      filteredStudents.forEach(student => {
        programStats[student.preferredProgram] = (programStats[student.preferredProgram] || 0) + 1;
      });

      // Status distribution
      const statusStats = {};
      filteredStudents.forEach(student => {
        statusStats[student.status] = (statusStats[student.status] || 0) + 1;
      });

      // Success rate calculation
      const successRate = totalApplications > 0 ? Math.round((enrolledStudents / totalApplications) * 100) : 0;

      // Monthly trends (simplified)
      const monthlyData = {
        'Jan': Math.floor(Math.random() * 20) + 10,
        'Feb': Math.floor(Math.random() * 20) + 15,
        'Mar': Math.floor(Math.random() * 20) + 12,
        'Apr': Math.floor(Math.random() * 20) + 18,
        'May': Math.floor(Math.random() * 20) + 16,
        'Jun': Math.floor(Math.random() * 20) + 14,
      };

      setReportData({
        totalStudents,
        totalApplications,
        enrolledStudents,
        visaApprovedStudents,
        successRate,
        countryStats,
        programStats,
        statusStats,
        monthlyData,
        partnerUniversities: universities.filter(u => u.isPartner).length,
      });
    } catch (error) {
      console.error('Error generating report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopCountries = () => {
    return Object.entries(reportData.countryStats || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));
  };

  const getTopPrograms = () => {
    return Object.entries(reportData.programStats || {})
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([program, count]) => ({ program, count }));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Reports & Analytics</Title>
          <Text type="secondary">Comprehensive insights into your CRM performance</Text>
        </div>
        <Button type="primary" icon={<DownloadOutlined />}>Export Report</Button>
      </div>

      {/* Key Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={reportData.totalStudents}
              prefix={<TeamOutlined style={{ color: '#1976d2' }} />}
              valueStyle={{ color: '#1976d2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={reportData.successRate}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Enrolled Students"
              value={reportData.enrolledStudents}
              prefix={<BarChartOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Partner Universities"
              value={reportData.partnerUniversities}
              prefix={<GlobalOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Metrics */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        <Col xs={24} lg={12}>
          <Card title="Conversion Funnel" loading={loading}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Total Inquiries</Text>
                  <Text strong>{reportData.totalStudents}</Text>
                </div>
                <Progress percent={100} strokeColor="#1976d2" showInfo={false} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Applications Submitted</Text>
                  <Text strong>{reportData.totalApplications}</Text>
                </div>
                <Progress 
                  percent={reportData.totalStudents ? (reportData.totalApplications / reportData.totalStudents) * 100 : 0} 
                  strokeColor="#52c41a" 
                  showInfo={false}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Visa Approved</Text>
                  <Text strong>{reportData.visaApprovedStudents}</Text>
                </div>
                <Progress 
                  percent={reportData.totalStudents ? (reportData.visaApprovedStudents / reportData.totalStudents) * 100 : 0} 
                  strokeColor="#faad14" 
                  showInfo={false}
                />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Text>Enrolled</Text>
                  <Text strong>{reportData.enrolledStudents}</Text>
                </div>
                <Progress 
                  percent={reportData.totalStudents ? (reportData.enrolledStudents / reportData.totalStudents) * 100 : 0} 
                  strokeColor="#722ed1" 
                  showInfo={false}
                />
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Monthly Trends" loading={loading}>
            <List
              size="small"
              dataSource={Object.entries(reportData.monthlyData || {})}
              renderItem={([month, count]) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Text>{month} 2024</Text>
                    <Space>
                      <Text strong>{count}</Text>
                      <Progress 
                        percent={(count / 30) * 100} 
                        size="small" 
                        style={{ width: 100 }} 
                        showInfo={false}
                        strokeColor="#1976d2"
                      />
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Detailed Analytics */}
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Top Destinations" loading={loading}>
            <List
              dataSource={getTopCountries()}
              renderItem={item => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{item.country}</Text>
                    <Space>
                      <Tag color="blue">{item.count}</Tag>
                      <Progress 
                        percent={(item.count / reportData.totalStudents) * 100} 
                        size="small" 
                        style={{ width: 80 }} 
                        showInfo={false}
                      />
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Popular Programs" loading={loading}>
            <List
              dataSource={getTopPrograms()}
              renderItem={item => (
                <List.Item>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>{item.program}</Text>
                    <Space>
                      <Tag color="green">{item.count}</Tag>
                      <Progress 
                        percent={(item.count / reportData.totalStudents) * 100} 
                        size="small" 
                        style={{ width: 80 }} 
                        showInfo={false}
                      />
                    </Space>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
