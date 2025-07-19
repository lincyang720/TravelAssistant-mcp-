import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, Typography, message, List, Modal, Row, Col, Divider } from 'antd';
import { GlobalOutlined, EyeOutlined, DeleteOutlined, PlusOutlined, LinkOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const WebsiteGenerator = () => {
  const [form] = Form.useForm();
  const [generating, setGenerating] = useState(false);
  const [websiteList, setWebsiteList] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [attractionsList, setAttractionsList] = useState([]);

  useEffect(() => {
    fetchWebsiteList();
    fetchAttractionsList();
  }, []);

  const fetchWebsiteList = async () => {
    try {
      const response = await axios.get('/api/website');
      setWebsiteList(response.data.websites || []);
    } catch (error) {
      console.error('获取网站列表失败:', error);
      message.error('获取网站列表失败');
    } finally {
      setListLoading(false);
    }
  };

  const fetchAttractionsList = async () => {
    try {
      const response = await axios.get('/api/attractions/city/西安');
      setAttractionsList(response.data.attractions || []);
    } catch (error) {
      console.error('获取景点列表失败:', error);
    }
  };

  const handleGenerate = async (values) => {
    setGenerating(true);
    try {
      const response = await axios.post('/api/website/generate', {
        title: values.title,
        subtitle: values.subtitle,
        attractions: attractionsList.filter(attr => 
          values.selectedAttractions?.includes(attr.id)
        ),
        style: values.style,
        theme: values.theme
      });

      if (response.data.success) {
        message.success('网站生成成功！');
        form.resetFields();
        fetchWebsiteList();
        
        // 自动打开预览
        window.open(response.data.website.url, '_blank');
      } else {
        message.error('网站生成失败');
      }
    } catch (error) {
      console.error('网站生成失败:', error);
      message.error('网站生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };

  const handlePreview = (url) => {
    setPreviewUrl(url);
    setPreviewVisible(true);
  };

  const handleDelete = async (websiteId) => {
    try {
      await axios.delete(`/api/website/${websiteId}`);
      message.success('网站删除成功');
      fetchWebsiteList();
    } catch (error) {
      console.error('删除网站失败:', error);
      message.error('删除网站失败');
    }
  };

  const handleCopyUrl = (url) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    message.success('链接已复制到剪贴板！');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <Title level={2}>网站生成器</Title>
          <Paragraph className="text-gray-600">
            快速生成专业的景点展示网站
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* 生成表单 */}
          <Col xs={24} lg={12}>
            <Card>
              <Title level={3} className="mb-6">
                <PlusOutlined className="mr-2" />
                创建新网站
              </Title>
              
              <Form
                form={form}
                layout="vertical"
                onFinish={handleGenerate}
                initialValues={{
                  style: 'modern',
                  theme: 'light'
                }}
              >
                <Form.Item
                  name="title"
                  label="网站标题"
                  rules={[{ required: true, message: '请输入网站标题' }]}
                >
                  <Input placeholder="例如：西安旅游景点导览" />
                </Form.Item>

                <Form.Item
                  name="subtitle"
                  label="副标题"
                >
                  <Input placeholder="例如：穿越古今的奇妙之旅" />
                </Form.Item>

                <Form.Item
                  name="selectedAttractions"
                  label="选择景点"
                  rules={[{ required: true, message: '请选择至少一个景点' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="选择要展示的景点"
                    style={{ width: '100%' }}
                  >
                    {attractionsList.map(attraction => (
                      <Select.Option key={attraction.id} value={attraction.id}>
                        {attraction.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="style"
                  label="网站风格"
                >
                  <Select>
                    <Select.Option value="modern">现代简约</Select.Option>
                    <Select.Option value="cultural">文化复古</Select.Option>
                    <Select.Option value="elegant">典雅风格</Select.Option>
                    <Select.Option value="vibrant">活力时尚</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="theme"
                  label="主题色彩"
                >
                  <Select>
                    <Select.Option value="light">明亮主题</Select.Option>
                    <Select.Option value="dark">暗色主题</Select.Option>
                    <Select.Option value="blue">蓝色主题</Select.Option>
                    <Select.Option value="green">绿色主题</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={generating}
                    size="large"
                    className="w-full"
                  >
                    {generating ? '生成中...' : '生成网站'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 网站列表 */}
          <Col xs={24} lg={12}>
            <Card>
              <Title level={3} className="mb-6">
                <GlobalOutlined className="mr-2" />
                已生成的网站
              </Title>
              
              <List
                loading={listLoading}
                dataSource={websiteList}
                renderItem={(website) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        icon={<LinkOutlined />}
                        onClick={() => handleCopyUrl(website.url)}
                      >
                        复制链接
                      </Button>,
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => window.open(website.url, '_blank')}
                      >
                        预览
                      </Button>,
                      <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(website.id)}
                      >
                        删除
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={website.title || website.fileName}
                      description={
                        <div>
                          <Text type="secondary">
                            文件大小: {(website.size / 1024).toFixed(2)} KB
                          </Text>
                          <br />
                          <Text type="secondary">
                            创建时间: {new Date(website.createdAt).toLocaleString()}
                          </Text>
                        </div>
                      }
                    />
                  </List.Item>
                )}
                locale={{ emptyText: '暂无生成的网站' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 使用指南 */}
        <Card className="mt-8">
          <Title level={3}>使用指南</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <Title level={4}>设置基本信息</Title>
                <Paragraph className="text-gray-600">
                  输入网站标题、副标题和选择要展示的景点
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-green-600">2</span>
                </div>
                <Title level={4}>选择风格主题</Title>
                <Paragraph className="text-gray-600">
                  选择适合的网站风格和主题色彩
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-purple-600">3</span>
                </div>
                <Title level={4}>生成和分享</Title>
                <Paragraph className="text-gray-600">
                  点击生成按钮，预览网站并分享给他人
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

        <Modal
          title="网站预览"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width="90%"
          style={{ top: 20 }}
        >
          <iframe
            src={previewUrl}
            style={{ width: '100%', height: '70vh', border: 'none' }}
            title="网站预览"
          />
        </Modal>
      </div>
    </div>
  );
};

export default WebsiteGenerator;
