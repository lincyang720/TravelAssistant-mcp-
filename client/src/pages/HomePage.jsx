import React from 'react';
import { Card, Row, Col, Button, Typography, Divider } from 'antd';
import { PlusOutlined, SoundOutlined, GlobalOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  const features = [
    {
      title: '智能景点生成',
      description: '输入城市名称和需求，AI自动生成详细的景点介绍',
      icon: <PlusOutlined className="text-4xl text-blue-500" />,
      path: '/generate'
    },
    {
      title: '语音解说',
      description: '为每个景点生成专业的语音解说，支持多种音色',
      icon: <SoundOutlined className="text-4xl text-green-500" />,
      path: '/audio'
    },
    {
      title: '网站生成',
      description: '一键生成精美的景点展示网站，支持多种主题',
      icon: <GlobalOutlined className="text-4xl text-purple-500" />,
      path: '/website'
    }
  ];

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="gradient-bg text-white py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <RocketOutlined className="text-6xl mb-6" />
          <Title level={1} className="text-white mb-6">
            智能旅游助手
          </Title>
          <Paragraph className="text-xl text-blue-100 mb-8">
            基于AI技术的旅游内容生成平台，帮您快速创建专业的景点介绍、语音解说和展示网站
          </Paragraph>
          <Button 
            type="primary" 
            size="large" 
            className="bg-white text-blue-600 border-0 hover:bg-blue-50"
            onClick={() => handleNavigate('/generate')}
          >
            开始创建 →
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <Title level={2} className="text-center mb-12">
            核心功能
          </Title>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card 
                  className="h-full text-center hover-scale card-shadow border-0"
                  bodyStyle={{ padding: '2rem' }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <Title level={3} className="mb-4">
                    {feature.title}
                  </Title>
                  <Paragraph className="text-gray-600 mb-6">
                    {feature.description}
                  </Paragraph>
                  <Button 
                    type="primary" 
                    onClick={() => handleNavigate(feature.path)}
                    className="w-full"
                  >
                    立即体验
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* How it works Section */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <Title level={2} className="text-center mb-12">
            使用流程
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <Title level={4}>输入需求</Title>
                <Paragraph className="text-gray-600">
                  输入城市名称和具体需求，描述您想要的景点类型
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <Title level={4}>AI生成内容</Title>
                <Paragraph className="text-gray-600">
                  AI自动生成详细的景点介绍、语音解说和展示网站
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <Title level={4}>预览使用</Title>
                <Paragraph className="text-gray-600">
                  预览生成的内容，下载使用或在线分享
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Stats Section */}
      <div className="gradient-bg text-white py-16 px-8">
        <div className="max-w-4xl mx-auto">
          <Row gutter={[32, 32]} className="text-center">
            <Col xs={24} md={8}>
              <Title level={2} className="text-white mb-2">1000+</Title>
              <Paragraph className="text-blue-100">景点已生成</Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={2} className="text-white mb-2">500+</Title>
              <Paragraph className="text-blue-100">语音解说</Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={2} className="text-white mb-2">200+</Title>
              <Paragraph className="text-blue-100">网站创建</Paragraph>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
