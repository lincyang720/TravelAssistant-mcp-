const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// 音频文件存储路径
const audioDir = path.join(__dirname, '..', 'uploads', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// 生成音频（集成MiniMax TTS服务）
router.post('/generate', async (req, res) => {
  try {
    const { text, voice = 'female-shaonv', speed = 1.0, emotion = 'neutral' } = req.body;

    if (!text) {
      return res.status(400).json({ error: '文本内容不能为空' });
    }

    // 生成音频ID和文件名
    const audioId = uuidv4();
    const audioFileName = `${audioId}.mp3`;
    const audioPath = path.join(audioDir, audioFileName);
    
    try {
      // 调用MiniMax TTS服务生成音频
      // 这里需要根据实际的MCP服务调用方式进行调整
      const audioResponse = await generateAudioWithMiniMax(text, voice, speed, emotion);
      
      if (audioResponse.success) {
        // 保存音频文件
        fs.writeFileSync(audioPath, audioResponse.audioData);
        
        // 返回音频信息
        const audioInfo = {
          id: audioId,
          fileName: audioFileName,
          url: `/uploads/audio/${audioFileName}`,
          text: text,
          voice: voice,
          speed: speed,
          emotion: emotion,
          duration: audioResponse.duration || Math.floor(text.length / 10),
          createdAt: new Date().toISOString()
        };

        res.json({
          success: true,
          audio: audioInfo,
          message: '音频生成成功'
        });
      } else {
        throw new Error('MiniMax TTS服务调用失败');
      }
    } catch (ttsError) {
      console.error('TTS服务调用失败:', ttsError);
      
      // 如果TTS服务失败，创建一个占位符文件
      const placeholderContent = `模拟音频内容 - 文本长度: ${text.length}`;
      fs.writeFileSync(audioPath, placeholderContent);
      
      const audioInfo = {
        id: audioId,
        fileName: audioFileName,
        url: `/uploads/audio/${audioFileName}`,
        text: text,
        voice: voice,
        speed: speed,
        emotion: emotion,
        duration: Math.floor(text.length / 10),
        createdAt: new Date().toISOString(),
        isMock: true // 标记为模拟音频
      };

      res.json({
        success: true,
        audio: audioInfo,
        message: '音频生成成功（模拟模式）'
      });
    }

  } catch (error) {
    console.error('音频生成失败:', error);
    res.status(500).json({ error: '音频生成失败' });
  }
});

// MiniMax TTS服务调用函数
async function generateAudioWithMiniMax(text, voice, speed, emotion) {
  // 这里应该调用真实的MiniMax MCP服务
  // 例如：
  // const mcpResponse = await callMcpService('mcp_minimax-mcp_text_to_audio', {
  //   text: text,
  //   voice_id: voice,
  //   speed: speed,
  //   emotion: emotion,
  //   output_directory: audioDir
  // });
  
  // 目前返回模拟响应
  return {
    success: false, // 设置为false以使用模拟模式
    audioData: null,
    duration: Math.floor(text.length / 10)
  };
}

// 获取音频文件信息
router.get('/:audioId', (req, res) => {
  const { audioId } = req.params;
  const audioPath = path.join(audioDir, `${audioId}.mp3`);

  if (!fs.existsSync(audioPath)) {
    return res.status(404).json({ error: '音频文件未找到' });
  }

  const stats = fs.statSync(audioPath);
  
  res.json({
    id: audioId,
    fileName: `${audioId}.mp3`,
    url: `/uploads/audio/${audioId}.mp3`,
    size: stats.size,
    createdAt: stats.birthtime
  });
});

// 删除音频文件
router.delete('/:audioId', (req, res) => {
  const { audioId } = req.params;
  const audioPath = path.join(audioDir, `${audioId}.mp3`);

  if (!fs.existsSync(audioPath)) {
    return res.status(404).json({ error: '音频文件未找到' });
  }

  try {
    fs.unlinkSync(audioPath);
    res.json({ success: true, message: '音频文件删除成功' });
  } catch (error) {
    console.error('删除音频文件失败:', error);
    res.status(500).json({ error: '删除音频文件失败' });
  }
});

// 获取所有音频列表
router.get('/', (req, res) => {
  try {
    const files = fs.readdirSync(audioDir);
    const audioList = files
      .filter(file => file.endsWith('.mp3'))
      .map(file => {
        const audioId = file.replace('.mp3', '');
        const stats = fs.statSync(path.join(audioDir, file));
        return {
          id: audioId,
          fileName: file,
          url: `/uploads/audio/${file}`,
          size: stats.size,
          createdAt: stats.birthtime
        };
      });

    res.json({
      audios: audioList,
      total: audioList.length
    });
  } catch (error) {
    console.error('获取音频列表失败:', error);
    res.status(500).json({ error: '获取音频列表失败' });
  }
});

module.exports = router;
