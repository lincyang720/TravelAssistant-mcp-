import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Attractions from './pages/Attractions';
import Generate from './pages/Generate';
import Website from './pages/Website';
import Audio from './pages/Audio';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white shadow-sm">
        <Navbar />
      </Header>
      <Content className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/website" element={<Website />} />
          <Route path="/audio" element={<Audio />} />
        </Routes>
      </Content>
      <Footer className="text-center bg-gray-50">
        <p>© 2025 智能旅游助手 | 让旅行更美好</p>
      </Footer>
    </Layout>
  );
}

export default App;
