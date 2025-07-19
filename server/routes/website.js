const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 网站文件存储路径
const websiteDir = path.join(__dirname, '..', 'uploads', 'websites');
if (!fs.existsSync(websiteDir)) {
  fs.mkdirSync(websiteDir, { recursive: true });
}

// 网站模板
const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <title>{{title}}</title>
  <!-- Tailwind CSS -->
  <link href="https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet">
  <!-- Font Awesome -->
  <link href="https://lf6-cdn-tos.bytecdntp.com/cdn/expire-100-M/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <!-- 中文字体 -->
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
  <!-- Alpine.js -->
  <script defer src="https://unpkg.com/alpinejs@3.10.5/dist/cdn.min.js"></script>
  <style>
    body {
      font-family: 'Noto Serif SC', 'Noto Sans SC', serif, sans-serif;
      {{styleContent}}
    }
  </style>
</head>
<body class="{{bodyClass}}">
  <div x-data="attractionApp()" class="min-h-screen">
    <!-- 头部 -->
    <header class="{{headerClass}}">
      <h1 class="{{titleClass}}">{{title}}</h1>
      <p class="{{subtitleClass}}">{{subtitle}}</p>
    </header>

    <!-- 主内容 -->
    <main class="{{mainClass}}">
      {{attractionsList}}
    </main>

    <!-- 底部 -->
    <footer class="{{footerClass}}">
      <p class="text-center text-gray-600">© 2025 智能旅游助手 | 让旅行更美好</p>
    </footer>
  </div>

  <script>
    function attractionApp() {
      return {
        currentAudio: null,
        playAudio(audioUrl, attractionName) {
          if (this.currentAudio) {
            this.currentAudio.pause();
          }
          
          this.currentAudio = new Audio(audioUrl);
          this.currentAudio.play().catch(e => {
            console.error('音频播放失败:', e);
            alert('音频播放失败，请稍后重试');
          });
          
          this.currentAudio.addEventListener('ended', () => {
            this.currentAudio = null;
          });
        },
        
        pauseAudio() {
          if (this.currentAudio) {
            this.currentAudio.pause();
          }
        },
        
        toggleDetails(event) {
          const content = event.target.nextElementSibling;
          const icon = event.target.querySelector('i');
          
          if (content.style.display === 'none' || content.style.display === '') {
            content.style.display = 'block';
            icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
          } else {
            content.style.display = 'none';
            icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
          }
        }
      }
    }
  </script>
</body>
</html>`;

// 生成网站
router.post('/generate', async (req, res) => {
  try {
    const { 
      title, 
      subtitle, 
      attractions, 
      style = 'modern',
      theme = 'light' 
    } = req.body;

    if (!title || !attractions || !Array.isArray(attractions)) {
      return res.status(400).json({ error: '标题和景点列表是必填项' });
    }

    // 生成网站ID
    const websiteId = uuidv4();
    const websiteFileName = `${websiteId}.html`;
    const websitePath = path.join(websiteDir, websiteFileName);

    // 根据样式生成CSS和HTML类
    const styleConfig = getStyleConfig(style, theme);
    
    // 生成景点列表HTML
    const attractionsList = generateAttractionsHTML(attractions, styleConfig);

    // 替换模板变量
    let htmlContent = htmlTemplate
      .replace(/{{title}}/g, title)
      .replace(/{{subtitle}}/g, subtitle || '')
      .replace(/{{styleContent}}/g, styleConfig.css)
      .replace(/{{bodyClass}}/g, styleConfig.bodyClass)
      .replace(/{{headerClass}}/g, styleConfig.headerClass)
      .replace(/{{titleClass}}/g, styleConfig.titleClass)
      .replace(/{{subtitleClass}}/g, styleConfig.subtitleClass)
      .replace(/{{mainClass}}/g, styleConfig.mainClass)
      .replace(/{{footerClass}}/g, styleConfig.footerClass)
      .replace(/{{attractionsList}}/g, attractionsList);

    // 写入文件
    fs.writeFileSync(websitePath, htmlContent, 'utf8');

    // 返回网站信息
    const websiteInfo = {
      id: websiteId,
      title: title,
      subtitle: subtitle,
      fileName: websiteFileName,
      url: `/uploads/websites/${websiteFileName}`,
      style: style,
      theme: theme,
      attractionsCount: attractions.length,
      createdAt: new Date().toISOString()
    };

    res.json({
      success: true,
      website: websiteInfo,
      message: '网站生成成功'
    });

  } catch (error) {
    console.error('网站生成失败:', error);
    res.status(500).json({ error: '网站生成失败' });
  }
});

// 获取网站信息
router.get('/:websiteId', (req, res) => {
  const { websiteId } = req.params;
  const websitePath = path.join(websiteDir, `${websiteId}.html`);

  if (!fs.existsSync(websitePath)) {
    return res.status(404).json({ error: '网站文件未找到' });
  }

  const stats = fs.statSync(websitePath);
  
  res.json({
    id: websiteId,
    fileName: `${websiteId}.html`,
    url: `/uploads/websites/${websiteId}.html`,
    size: stats.size,
    createdAt: stats.birthtime
  });
});

// 获取所有网站列表
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(websiteDir);
    const websiteList = files
      .filter(file => file.endsWith('.html'))
      .map(file => {
        const websiteId = file.replace('.html', '');
        const stats = fs.statSync(path.join(websiteDir, file));
        return {
          id: websiteId,
          fileName: file,
          url: `/uploads/websites/${file}`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      });

    res.json({
      websites: websiteList,
      total: websiteList.length
    });
  } catch (error) {
    console.error('获取网站列表失败:', error);
    res.status(500).json({ error: '获取网站列表失败' });
  }
});

// 删除网站
router.delete('/:websiteId', (req, res) => {
  const { websiteId } = req.params;
  const websitePath = path.join(websiteDir, `${websiteId}.html`);

  if (!fs.existsSync(websitePath)) {
    return res.status(404).json({ error: '网站文件未找到' });
  }

  try {
    fs.unlinkSync(websitePath);
    res.json({ success: true, message: '网站删除成功' });
  } catch (error) {
    console.error('删除网站失败:', error);
    res.status(500).json({ error: '删除网站失败' });
  }
});

// 样式配置函数
function getStyleConfig(style, theme) {
  const configs = {
    modern: {
      css: `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
      `,
      bodyClass: 'bg-gradient-to-br from-blue-50 to-purple-50',
      headerClass: 'bg-white shadow-lg px-6 py-8 mb-8',
      titleClass: 'text-4xl font-bold text-gray-800 mb-2',
      subtitleClass: 'text-lg text-gray-600',
      mainClass: 'container mx-auto px-4 pb-8',
      footerClass: 'bg-gray-800 text-white py-6 mt-12'
    },
    cultural: {
      css: `
        background: #f9f6f2 url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50" font-size="80" fill="%23f0f0f0">文</text></svg>') repeat;
        background-size: 200px 200px;
        min-height: 100vh;
      `,
      bodyClass: 'bg-yellow-50',
      headerClass: 'bg-gradient-to-r from-yellow-600 to-red-600 text-white px-6 py-8 mb-8',
      titleClass: 'text-4xl font-bold mb-2 font-serif',
      subtitleClass: 'text-lg opacity-90',
      mainClass: 'container mx-auto px-4 pb-8',
      footerClass: 'bg-red-900 text-white py-6 mt-12'
    }
  };

  return configs[style] || configs.modern;
}

// 生成景点列表HTML
function generateAttractionsHTML(attractions, styleConfig) {
  return attractions.map(attraction => `
    <div class="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">${attraction.name}</h3>
          <button 
            onclick="playAudio('${attraction.audioUrl || ''}', '${attraction.name}')"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors duration-200 flex items-center gap-2"
            ${!attraction.audioUrl ? 'disabled' : ''}
          >
            <i class="fas fa-play"></i>
            播放介绍
          </button>
        </div>
        
        <p class="text-gray-600 mb-2">
          <i class="fas fa-map-marker-alt text-red-500 mr-2"></i>
          ${attraction.address}
        </p>
        
        <p class="text-gray-700 mb-4">${attraction.description}</p>
        
        <button 
          onclick="toggleDetails(event)"
          class="text-blue-500 hover:text-blue-600 transition-colors duration-200 flex items-center gap-2"
        >
          <i class="fas fa-chevron-down"></i>
          查看详情
        </button>
        
        <div class="mt-4 text-gray-600 leading-relaxed" style="display: none;">
          ${attraction.detailedInfo}
        </div>
      </div>
    </div>
  `).join('');
}

module.exports = router;
