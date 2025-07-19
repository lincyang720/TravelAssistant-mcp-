import React, { useState, useEffect } from 'react';
import { Card, List, Button, Typography, Tabs, Tag, Row, Col, Statistic, message } from 'antd';
import { HistoryOutlined, EyeOutlined, SoundOutlined, GlobalOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const History = () => {
  const [attractions, setAttractions] = useState([]);
  const [audios, setAudios] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAttractions: 0,
    totalAudios: 0,
    totalWebsites: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [attractionsRes, audiosRes, websitesRes] = await Promise.all([
        axios.get('/api/attractions/city/西安'),
        axios.get('/api/audio'),
        axios.get('/api/website')
      ]);

      const attractionsData = attractionsRes.data.attractions || [];
      const audiosData = audiosRes.data.audios || [];
      const websitesData = websitesRes.data.websites || [];

      setAttractions(attractionsData);
      setAudios(audiosData);
      setWebsites(websitesData);

      setStats({
        totalAttractions: attractionsData.length,
        totalAudios: audiosData.length,
        totalWebsites: websitesData.length
      });
    } catch (error) {
      console.error('获取数据失败:', error);
      message.error('获取历史记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(e => {
      console.error('音频播放失败:', e);
      message.error('音频播放失败');
    });
  };

  const handleDeleteAudio = async (audioId) => {
    try {
      await axios.delete(`/api/audio/${audioId}`);
      message.success('音频删除成功');
      fetchAllData();
    } catch (error) {
      console.error('删除音频失败:', error);
      message.error('删除音频失败');
    }
  };

  const handleDeleteWebsite = async (websiteId) => {
    try {
      await axios.delete(`/api/website/${websiteId}`);
      message.success('网站删除成功');
      fetchAllData();
    } catch (error) {
      console.error('删除网站失败:', error);
      message.error('删除网站失败');
    }
  };

  const renderAttractionsList = () => (
    <List
      loading={loading}
      dataSource={attractions}
      renderItem={(attraction) => (
        <List.Item
          actions={[
            attraction.audioUrl && (
              <Button
                type="link"
                icon={<SoundOutlined />}
                onClick={() => handlePlayAudio(attraction.audioUrl)}
              >
                播放音频
              </Button>
            ),
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                // 这里可以添加查看详情的逻辑
                console.log('查看详情:', attraction);
              }}
            >
              查看详情
            </Button>
          ].filter(Boolean)}
        >
          <List.Item.Meta
            title={
              <div className="flex items-center gap-2">
                <span>{attraction.name}</span>
                {attraction.generated && (
                  <Tag color="green">AI生成</Tag>
                )}
              </div>
            }
            description={
              <div>
                <Text type="secondary">📍 {attraction.address}</Text>
                <br />
                <Text type="secondary">{attraction.description}</Text>
                {attraction.createdAt && (
                  <>
                    <br />
                    <Text type="secondary">
                      创建时间: {new Date(attraction.createdAt).toLocaleString()}
                    </Text>
                  </>
                )}
              </div>
            }
          />
        </List.Item>
      )}
      locale={{ emptyText: '暂无景点记录' }}
    />
  );

  const renderAudiosList = () => (
    <List
      loading={loading}
      dataSource={audios}
      renderItem={(audio) => (
        <List.Item
          actions={[
            <Button
              type="link"
              icon={<SoundOutlined />}
              onClick={() => handlePlayAudio(audio.url)}
            >
              播放
            </Button>,
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAudio(audio.id)}
            >
              删除
            </Button>
          ]}
        >
          <List.Item.Meta
            title={audio.fileName}
            description={
              <div>
                <Text type="secondary">
                  文件大小: {(audio.size / 1024).toFixed(2)} KB
                </Text>
                <br />
                <Text type="secondary">
                  创建时间: {new Date(audio.createdAt).toLocaleString()}
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
      locale={{ emptyText: '暂无音频记录' }}
    />
  );

  const renderWebsitesList = () => (
    <List
      loading={loading}
      dataSource={websites}
      renderItem={(website) => (
        <List.Item
          actions={[
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
              onClick={() => handleDeleteWebsite(website.id)}
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
      locale={{ emptyText: '暂无网站记录' }}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <Title level={2}>历史记录</Title>
          <Paragraph className="text-gray-600">
            查看和管理您的所有创作内容
          </Paragraph>
        </div>

        {/* 统计信息 */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="景点介绍"
                value={stats.totalAttractions}
                prefix={<HistoryOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="音频文件"
                value={stats.totalAudios}
                prefix={<SoundOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card>
              <Statistic
                title="生成网站"
                value={stats.totalWebsites}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 内容标签页 */}
        <Card>
          <Tabs defaultActiveKey="attractions" size="large">
            <TabPane 
              tab={
                <span>
                  <HistoryOutlined />
                  景点介绍 ({stats.totalAttractions})
                </span>
              } 
              key="attractions"
            >
              {renderAttractionsList()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <SoundOutlined />
                  音频文件 ({stats.totalAudios})
                </span>
              } 
              key="audios"
            >
              {renderAudiosList()}
            </TabPane>
            
            <TabPane 
              tab={
                <span>
                  <GlobalOutlined />
                  生成网站 ({stats.totalWebsites})
                </span>
              } 
              key="websites"
            >
              {renderWebsitesList()}
            </TabPane>
          </Tabs>
        </Card>

        {/* 操作提示 */}
        <Card className="mt-8">
          <Title level={4}>操作提示</Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <HistoryOutlined className="text-3xl text-blue-500 mb-2" />
                <Title level={5}>景点介绍</Title>
                <Paragraph className="text-gray-600">
                  查看已生成的景点介绍，支持播放音频解说
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <SoundOutlined className="text-3xl text-green-500 mb-2" />
                <Title level={5}>音频管理</Title>
                <Paragraph className="text-gray-600">
                  管理所有音频文件，支持在线播放和删除
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <GlobalOutlined className="text-3xl text-purple-500 mb-2" />
                <Title level={5}>网站预览</Title>
                <Paragraph className="text-gray-600">
                  预览和管理生成的网站，支持在线查看
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default History;
