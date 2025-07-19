import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Tag, message, Spin, Typography, Badge, List, Rate } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, CrownOutlined, DollarOutlined, HeartOutlined } from '@ant-design/icons';
import api from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const GenerateAttraction = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);

  const attractionTypes = [
    { value: 'historical', label: '历史文化', color: 'gold' },
    { value: 'natural', label: '自然风光', color: 'green' },
    { value: 'cultural', label: '文化艺术', color: 'blue' },
    { value: 'entertainment', label: '娱乐休闲', color: 'red' },
    { value: 'food', label: '美食体验', color: 'orange' },
    { value: 'shopping', label: '购物消费', color: 'purple' },
    { value: 'religious', label: '宗教文化', color: 'cyan' },
    { value: 'modern', label: '现代都市', color: 'geekblue' }
  ];

  const preferences = [
    { value: 'family', label: '适合家庭' },
    { value: 'couple', label: '情侣约会' },
    { value: 'solo', label: '独自旅行' },
    { value: 'friends', label: '朋友聚会' },
    { value: 'photography', label: '摄影爱好' },
    { value: 'budget', label: '经济实惠' }
  ];

  const handleRecommendation = async (values) => {
    setLoading(true);
    try {
      const response = await api.post('/api/attractions/recommend', values);
      setRecommendationResult(response.data);
      message.success('推荐成功！');
    } catch (error) {
      console.error('推荐失败:', error);
      message.error('推荐失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const typeConfig = attractionTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.color : 'default';
  };

  const getTypeLabel = (type) => {
    const typeConfig = attractionTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={2} className="text-center mb-8">
        <CrownOutlined className="mr-2" />
        智能景点推荐
      </Title>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 推荐表单 */}
        <div className="lg:col-span-1">
          <Card title="推荐设置" className="mb-6">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRecommendation}
              initialValues={{
                duration: 'half-day',
                attractionTypes: [],
                preferences: []
              }}
            >
              <Form.Item
                label="目的地"
                name="location"
                rules={[{ required: true, message: '请输入目的地' }]}
              >
                <Input 
                  placeholder="例如：西安、北京、上海" 
                  prefix={<EnvironmentOutlined />}
                />
              </Form.Item>

              <Form.Item
                label="游玩时长"
                name="duration"
                rules={[{ required: true, message: '请选择游玩时长' }]}
              >
                <Select placeholder="选择游玩时长">
                  <Option value="few-hours">几小时</Option>
                  <Option value="half-day">半天</Option>
                  <Option value="full-day">全天</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="景点类型"
                name="attractionTypes"
              >
                <Select
                  mode="multiple"
                  placeholder="选择感兴趣的景点类型"
                  allowClear
                >
                  {attractionTypes.map(type => (
                    <Option key={type.value} value={type.value}>
                      <Tag color={type.color}>{type.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="个人偏好"
                name="preferences"
              >
                <Select
                  mode="multiple"
                  placeholder="选择个人偏好"
                  allowClear
                >
                  {preferences.map(pref => (
                    <Option key={pref.value} value={pref.value}>
                      {pref.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className="w-full"
                  size="large"
                >
                  获取推荐
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>

        {/* 推荐结果 */}
        <div className="lg:col-span-2">
          <Card title="推荐结果" className="min-h-96">
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" />
                <span className="ml-3">正在为您推荐景点...</span>
              </div>
            )}

            {recommendationResult && !loading && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <Badge 
                    count={recommendationResult.recommendations.length} 
                    showZero 
                    color="#1890ff"
                  >
                    <Title level={4}>推荐景点</Title>
                  </Badge>
                  <Tag color={recommendationResult.source === 'real_data' ? 'green' : 'orange'}>
                    {recommendationResult.source === 'real_data' ? '真实数据' : 'AI生成'}
                  </Tag>
                </div>

                <List
                  grid={{ gutter: 16, column: 1 }}
                  dataSource={recommendationResult.recommendations}
                  renderItem={(attraction) => (
                    <List.Item>
                      <Card 
                        size="small" 
                        hoverable
                        className="mb-4"
                        actions={[
                          <Button type="link" size="small">
                            查看详情
                          </Button>,
                          <Button type="link" size="small" icon={<HeartOutlined />}>
                            收藏
                          </Button>
                        ]}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Title level={5} className="mb-0">{attraction.name}</Title>
                          <Tag color={getTypeColor(attraction.type)}>
                            {getTypeLabel(attraction.type)}
                          </Tag>
                        </div>
                        
                        <div className="mb-2">
                          <Rate disabled defaultValue={attraction.rating} allowHalf />
                          <span className="ml-2 text-gray-500">
                            {attraction.rating.toFixed(1)}
                          </span>
                        </div>

                        <Paragraph 
                          ellipsis={{ rows: 2, expandable: true }} 
                          className="text-gray-600 mb-3"
                        >
                          {attraction.description}
                        </Paragraph>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                          <div>
                            <EnvironmentOutlined className="mr-1" />
                            {attraction.address}
                          </div>
                          <div>
                            <ClockCircleOutlined className="mr-1" />
                            {attraction.visitDuration}
                          </div>
                          <div>
                            <DollarOutlined className="mr-1" />
                            {attraction.ticketPrice}
                          </div>
                          <div>
                            最佳时间：{attraction.bestTime}
                          </div>
                        </div>

                        <div className="mt-3">
                          <Text strong>亮点：</Text>
                          {attraction.highlights.map((highlight, index) => (
                            <Tag key={index} size="small" className="ml-1">
                              {highlight}
                            </Tag>
                          ))}
                        </div>

                        <div className="mt-2">
                          <Text type="secondary" italic>
                            {attraction.recommendation}
                          </Text>
                        </div>
                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            )}

            {!recommendationResult && !loading && (
              <div className="text-center py-20 text-gray-500">
                <CrownOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <p>填写推荐设置，获取个性化景点推荐</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GenerateAttraction;
