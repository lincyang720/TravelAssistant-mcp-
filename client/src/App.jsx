import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined, HomeOutlined, PlusOutlined, SoundOutlined, GlobalOutlined, HistoryOutlined } from '@ant-design/icons';
import HomePage from './pages/HomePage';
import GenerateAttraction from './pages/GenerateAttraction';
import AudioManager from './pages/AudioManager';
import WebsiteGenerator from './pages/WebsiteGenerator';
import History from './pages/History';
import './styles.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/generate',
      icon: <PlusOutlined />,
      label: '生成景点介绍',
    },
    {
      key: '/audio',
      icon: <SoundOutlined />,
      label: '音频管理',
    },
    {
      key: '/website',
      icon: <GlobalOutlined />,
      label: '网站生成器',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: '历史记录',
    },
  ];

  const navigate = (path) => {
    window.location.href = path;
    setDrawerVisible(false);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-md px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800 mr-8">智能旅游助手</h1>
          <Menu
            mode="horizontal"
            className="hidden md:flex border-0 bg-transparent"
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </div>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setDrawerVisible(true)}
          className="md:hidden"
        />
      </Header>

      <Drawer
        title="菜单"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="md:hidden"
      >
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Drawer>

      <Content className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<GenerateAttraction />} />
          <Route path="/audio" element={<AudioManager />} />
          <Route path="/website" element={<WebsiteGenerator />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Content>

      <Footer className="text-center bg-gray-800 text-white">
        <p>© 2025 智能旅游助手 | 让旅行更美好</p>
      </Footer>
    </Layout>
  );
}

export default App;
