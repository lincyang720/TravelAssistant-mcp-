# 智能旅游助手应用程序

## 项目简介

这是一个基于AI技术的智能旅游助手应用程序，可以根据用户输入的需求自动生成景点介绍、语音解说和展示网站。

## 功能特性

### 🎯 核心功能
- **智能景点生成**：根据城市和景点名称，AI自动生成详细的景点介绍
- **语音解说**：将景点介绍转换为专业的语音解说，支持多种音色和情感
- **网站生成**：一键生成精美的景点展示网站，支持多种主题和风格
- **历史管理**：管理所有生成的内容，支持预览、下载和删除

### 🛠️ 技术栈
- **前端**：React + Ant Design + Tailwind CSS
- **后端**：Node.js + Express
- **AI服务**：集成MiniMax MCP服务
- **地图服务**：高德地图API
- **数据库**：内存存储（可扩展为MySQL/MongoDB）

## 目录结构

```
TravelAssistant(mcp)/
├── client/                 # React前端应用
│   ├── src/
│   │   ├── pages/         # 页面组件
│   │   │   ├── HomePage.jsx
│   │   │   ├── GenerateAttraction.jsx
│   │   │   ├── AudioManager.jsx
│   │   │   ├── WebsiteGenerator.jsx
│   │   │   └── History.jsx
│   │   ├── App.jsx        # 主应用组件
│   │   └── index.js       # 入口文件
│   ├── public/
│   └── package.json
├── server/                # Node.js后端应用
│   ├── routes/           # API路由
│   │   ├── attractions.js
│   │   ├── audio.js
│   │   └── website.js
│   ├── services/         # 服务层
│   │   └── mcpService.js
│   ├── uploads/          # 文件上传目录
│   └── index.js          # 服务器入口
├── .env                  # 环境变量配置
├── package.json          # 项目配置
└── README.md            # 项目说明
```

## 快速开始

### 1. 环境要求
- Node.js 16.0+
- npm 8.0+

### 2. 安装依赖
```bash
# 方式1：使用启动脚本（Windows）
start.bat

# 方式2：手动安装
npm install
cd client
npm install
cd ..
```

### 3. 环境配置
复制 `.env` 文件并配置相关服务：
```env
# 服务器配置
PORT=5000
NODE_ENV=development

# MCP服务配置
MCP_BASE_URL=http://localhost:3001
MCP_API_KEY=your_api_key_here

# MiniMax配置
MINIMAX_API_KEY=your_minimax_api_key
MINIMAX_GROUP_ID=your_group_id

# 高德地图配置
AMAP_API_KEY=your_amap_api_key
```

### 4. 启动服务
```bash
# 开发模式（同时启动前后端）
npm run dev

# 或者分别启动
npm run server  # 启动后端服务
npm run client  # 启动前端应用
```

### 5. 访问应用
- 前端界面：http://localhost:3000
- 后端API：http://localhost:5000

## API接口文档

### 景点相关接口
- `GET /api/attractions/city/:cityName` - 获取城市景点列表
- `GET /api/attractions/detail/:id` - 获取景点详情
- `POST /api/attractions/generate` - 生成景点介绍
- `GET /api/attractions/search` - 搜索景点

### 音频相关接口
- `GET /api/audio` - 获取音频列表
- `POST /api/audio/generate` - 生成音频
- `GET /api/audio/:audioId` - 获取音频信息
- `DELETE /api/audio/:audioId` - 删除音频

### 网站相关接口
- `GET /api/website` - 获取网站列表
- `POST /api/website/generate` - 生成网站
- `GET /api/website/:websiteId` - 获取网站信息
- `DELETE /api/website/:websiteId` - 删除网站

## 使用流程

### 1. 生成景点介绍
1. 访问"生成景点介绍"页面
2. 输入城市名称和景点名称
3. 选择生成风格（现代简约、文化复古等）
4. 填写特殊要求（可选）
5. 点击"生成景点介绍"
6. 查看生成结果

### 2. 生成语音解说
1. 在景点介绍页面点击"生成语音"
2. 或在"音频管理"页面手动输入文本
3. 选择语音角色和参数
4. 点击"生成音频"
5. 播放和下载音频文件

### 3. 生成展示网站
1. 访问"网站生成器"页面
2. 设置网站标题和副标题
3. 选择要展示的景点
4. 选择网站风格和主题
5. 点击"生成网站"
6. 预览和分享网站

## 集成服务配置

### MiniMax MCP服务
本项目集成了MiniMax的多项AI服务：
- 文本转语音（TTS）
- 图片生成
- 语音克隆

### 高德地图服务
集成高德地图API获取真实景点信息：
- 关键词搜索
- 周边搜索
- 景点详情查询

## 部署说明

### 1. 生产环境构建
```bash
# 构建前端
cd client
npm run build

# 启动生产服务
cd ..
npm start
```

### 2. Docker部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 3. 环境变量
生产环境需要设置以下环境变量：
- `NODE_ENV=production`
- `PORT=5000`
- `MCP_BASE_URL`
- `MCP_API_KEY`
- `MINIMAX_API_KEY`
- `AMAP_API_KEY`

## 扩展功能

### 1. 数据库集成
可以将内存存储替换为真实数据库：
- MySQL
- PostgreSQL
- MongoDB

### 2. 用户系统
- 用户注册登录
- 个人作品管理
- 权限控制

### 3. 更多AI服务
- GPT对话
- 图片识别
- 视频生成

## 常见问题

### Q: 音频生成失败怎么办？
A: 检查MiniMax API配置，确保API密钥正确且有足够的配额。

### Q: 景点信息不准确怎么办？
A: 检查高德地图API配置，或者在生成时添加更详细的特殊要求。

### Q: 网站生成后无法访问？
A: 检查uploads目录权限，确保服务器可以写入文件。

## 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系开发团队。
