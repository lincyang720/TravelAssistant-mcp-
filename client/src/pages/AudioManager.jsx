import React, { useState, useEffect } from 'react';
import { Card, List, Button, Typography, message, Upload, Form, Input, Select, Modal, Spin } from 'antd';
import { SoundOutlined, PlayCircleOutlined, PauseCircleOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const AudioManager = () => {
  const [audioList, setAudioList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [generateModalVisible, setGenerateModalVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAudioList();
  }, []);

  const fetchAudioList = async () => {
    try {
      const response = await axios.get('/api/audio');
      setAudioList(response.data.audios || []);
    } catch (error) {
      console.error('获取音频列表失败:', error);
      message.error('获取音频列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (audio) => {
    if (currentAudio) {
      currentAudio.pause();
    }

    if (playingId === audio.id) {
      setPlayingId(null);
      setCurrentAudio(null);
      return;
    }

    const audioElement = new Audio(audio.url);
    audioElement.play().catch(e => {
      console.error('音频播放失败:', e);
      message.error('音频播放失败');
    });

    audioElement.addEventListener('ended', () => {
      setPlayingId(null);
      setCurrentAudio(null);
    });

    setCurrentAudio(audioElement);
    setPlayingId(audio.id);
  };

  const handleDelete = async (audioId) => {
    try {
      await axios.delete(`/api/audio/${audioId}`);
      message.success('音频删除成功');
      fetchAudioList();
    } catch (error) {
      console.error('删除音频失败:', error);
      message.error('删除音频失败');
    }
  };

  const handleGenerateAudio = async (values) => {
    setGenerating(true);
    try {
      const response = await axios.post('/api/audio/generate', {
        text: values.text,
        voice: values.voice || 'female-shaonv',
        speed: values.speed || 1.0,
        emotion: values.emotion || 'neutral'
      });

      if (response.data.success) {
        message.success('音频生成成功！');
        setGenerateModalVisible(false);
        form.resetFields();
        fetchAudioList();
      } else {
        message.error('音频生成失败');
      }
    } catch (error) {
      console.error('音频生成失败:', error);
      message.error('音频生成失败，请重试');
    } finally {
      setGenerating(false);
    }
  };

  const voiceOptions = [
    { value: 'female-shaonv', label: '女声-少女' },
    { value: 'male-qn-qingse', label: '男声-青涩' },
    { value: 'audiobook_female_1', label: '女声-有声书' },
    { value: 'cute_boy', label: '男声-可爱' },
    { value: 'Charming_Lady', label: '女声-魅力' }
  ];

  const emotionOptions = [
    { value: 'neutral', label: '中性' },
    { value: 'happy', label: '开心' },
    { value: 'sad', label: '悲伤' },
    { value: 'angry', label: '愤怒' },
    { value: 'surprised', label: '惊讶' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Title level={2}>音频管理中心</Title>
          <Paragraph className="text-gray-600">
            管理和生成景点介绍的语音解说
          </Paragraph>
        </div>

        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={3} className="mb-0">
              <SoundOutlined className="mr-2" />
              音频列表
            </Title>
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => setGenerateModalVisible(true)}
            >
              生成新音频
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Spin size="large" />
              <Paragraph className="mt-4 text-gray-600">
                加载音频列表中...
              </Paragraph>
            </div>
          ) : (
            <List
              dataSource={audioList}
              renderItem={(audio) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={playingId === audio.id ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      onClick={() => handlePlay(audio)}
                    >
                      {playingId === audio.id ? '暂停' : '播放'}
                    </Button>,
                    <Button
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(audio.id)}
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
              locale={{ emptyText: '暂无音频文件' }}
            />
          )}
        </Card>

        <Modal
          title="生成新音频"
          open={generateModalVisible}
          onCancel={() => setGenerateModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerateAudio}
            initialValues={{
              voice: 'female-shaonv',
              speed: 1.0,
              emotion: 'neutral'
            }}
          >
            <Form.Item
              name="text"
              label="文本内容"
              rules={[{ required: true, message: '请输入要转换的文本' }]}
            >
              <TextArea
                rows={6}
                placeholder="请输入要转换为语音的文本内容..."
              />
            </Form.Item>

            <Form.Item
              name="voice"
              label="语音角色"
            >
              <Select options={voiceOptions} />
            </Form.Item>

            <Form.Item
              name="speed"
              label="语速"
            >
              <Select>
                <Select.Option value={0.5}>0.5x (慢)</Select.Option>
                <Select.Option value={0.8}>0.8x (较慢)</Select.Option>
                <Select.Option value={1.0}>1.0x (正常)</Select.Option>
                <Select.Option value={1.2}>1.2x (较快)</Select.Option>
                <Select.Option value={1.5}>1.5x (快)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="emotion"
              label="情感色彩"
            >
              <Select options={emotionOptions} />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-2">
                <Button onClick={() => setGenerateModalVisible(false)}>
                  取消
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={generating}
                >
                  {generating ? '生成中...' : '生成音频'}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AudioManager;
