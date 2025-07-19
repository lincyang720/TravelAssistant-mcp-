const mcpService = require('./services/mcpService');

// 演示如何使用MCP服务生成景点介绍和音频
async function demonstrateFeatures() {
  console.log('=== 智能旅游助手功能演示 ===\n');

  // 1. 生成景点介绍
  console.log('1. 生成景点介绍...');
  const attractionResult = await mcpService.generateAttractionDescription(
    '北京',
    '故宫',
    'cultural',
    '重点介绍历史文化背景和建筑特色'
  );

  if (attractionResult.success) {
    console.log('✅ 景点介绍生成成功:');
    console.log(`景点名称: ${attractionResult.attraction.name}`);
    console.log(`地址: ${attractionResult.attraction.address}`);
    console.log(`简介: ${attractionResult.attraction.description}`);
    console.log(`详细介绍: ${attractionResult.attraction.detailedInfo.substring(0, 200)}...\n`);
  } else {
    console.log('❌ 景点介绍生成失败:', attractionResult.error);
  }

  // 2. 生成语音解说
  console.log('2. 生成语音解说...');
  const audioResult = await mcpService.callMinimaxTextToAudio(
    attractionResult.attraction.detailedInfo,
    'female-shaonv',
    1.0,
    'neutral',
    './server/uploads/audio'
  );

  if (audioResult.success) {
    console.log('✅ 语音解说生成成功:');
    console.log(`音频文件: ${audioResult.fileName}`);
    console.log(`时长: ${audioResult.duration}秒\n`);
  } else {
    console.log('❌ 语音解说生成失败:', audioResult.error);
  }

  // 3. 搜索真实景点信息
  console.log('3. 搜索真实景点信息...');
  const searchResult = await mcpService.callAmapTextSearch('天安门', '北京');

  if (searchResult.success) {
    console.log('✅ 景点搜索成功:');
    console.log(`找到 ${searchResult.results.length} 个结果`);
    if (searchResult.results.length > 0) {
      const poi = searchResult.results[0];
      console.log(`景点名称: ${poi.name}`);
      console.log(`地址: ${poi.address}`);
      console.log(`类型: ${poi.type}\n`);
    }
  } else {
    console.log('❌ 景点搜索失败:', searchResult.error);
  }

  // 4. 生成景点图片
  console.log('4. 生成景点图片...');
  const imageResult = await mcpService.callMinimaxTextToImage(
    '北京故宫，古典建筑，红墙金瓦，庄严肃穆',
    '16:9',
    './server/uploads/images'
  );

  if (imageResult.success) {
    console.log('✅ 景点图片生成成功:');
    console.log(`图片文件: ${imageResult.fileName}\n`);
  } else {
    console.log('❌ 景点图片生成失败:', imageResult.error);
  }

  console.log('=== 演示完成 ===');
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  demonstrateFeatures().catch(console.error);
}

module.exports = { demonstrateFeatures };
