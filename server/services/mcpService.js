const axios = require('axios');
const path = require('path');
const fs = require('fs');

// MCP服务基础配置
const MCP_BASE_URL = process.env.MCP_BASE_URL || 'http://localhost:3001';
const MCP_API_KEY = process.env.MCP_API_KEY || '';

/**
 * 调用MiniMax文本转语音服务
 * @param {string} text - 要转换的文本
 * @param {string} voiceId - 语音ID
 * @param {number} speed - 语速
 * @param {string} emotion - 情感
 * @param {string} outputDir - 输出目录
 * @returns {Promise<Object>} 生成结果
 */
async function callMinimaxTextToAudio(text, voiceId = 'female-shaonv', speed = 1.0, emotion = 'neutral', outputDir) {
  try {
    // 调用MCP MiniMax文本转语音服务
    const response = await axios.post(`${MCP_BASE_URL}/mcp/minimax/text-to-audio`, {
      text: text,
      voice_id: voiceId,
      speed: speed,
      emotion: emotion,
      output_directory: outputDir
    }, {
      headers: {
        'Authorization': `Bearer ${MCP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      audioPath: response.data.audio_path,
      fileName: response.data.file_name,
      duration: response.data.duration
    };
  } catch (error) {
    console.error('MiniMax TTS服务调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 调用MiniMax图片生成服务
 * @param {string} prompt - 提示词
 * @param {string} aspectRatio - 长宽比
 * @param {string} outputDir - 输出目录
 * @returns {Promise<Object>} 生成结果
 */
async function callMinimaxTextToImage(prompt, aspectRatio = '1:1', outputDir) {
  try {
    const response = await axios.post(`${MCP_BASE_URL}/mcp/minimax/text-to-image`, {
      prompt: prompt,
      aspect_ratio: aspectRatio,
      output_directory: outputDir
    }, {
      headers: {
        'Authorization': `Bearer ${MCP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      imagePath: response.data.image_path,
      fileName: response.data.file_name
    };
  } catch (error) {
    console.error('MiniMax图片生成服务调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 调用高德地图服务获取景点信息
 * @param {string} keywords - 搜索关键词
 * @param {string} city - 城市
 * @returns {Promise<Object>} 搜索结果
 */
async function callAmapTextSearch(keywords, city) {
  try {
    const response = await axios.post(`${MCP_BASE_URL}/mcp/amap/text-search`, {
      keywords: keywords,
      city: city
    }, {
      headers: {
        'Authorization': `Bearer ${MCP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      results: response.data.results
    };
  } catch (error) {
    console.error('高德地图服务调用失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 调用高德地图服务获取景点周边信息
 * @param {string} keywords - 搜索关键词
 * @param {string} location - 中心位置坐标
 * @param {string} radius - 搜索半径
 * @returns {Promise<Object>} 搜索结果
 */
async function callAmapAroundSearch(keywords, location, radius = '5000') {
  try {
    const response = await axios.post(`${MCP_BASE_URL}/mcp/amap/around-search`, {
      keywords: keywords,
      location: location,
      radius: radius
    }, {
      headers: {
        'Authorization': `Bearer ${MCP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      results: response.data.results
    };
  } catch (error) {
    console.error('高德地图周边搜索失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 获取景点详细信息
 * @param {string} poiId - 景点ID
 * @returns {Promise<Object>} 景点详情
 */
async function callAmapSearchDetail(poiId) {
  try {
    const response = await axios.post(`${MCP_BASE_URL}/mcp/amap/search-detail`, {
      id: poiId
    }, {
      headers: {
        'Authorization': `Bearer ${MCP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      detail: response.data.detail
    };
  } catch (error) {
    console.error('获取景点详情失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 智能生成景点介绍
 * @param {string} city - 城市名称
 * @param {string} attractionName - 景点名称
 * @param {string} style - 风格
 * @param {string} requirements - 特殊要求
 * @returns {Promise<Object>} 生成结果
 */
async function generateAttractionDescription(city, attractionName, style = 'modern', requirements = '') {
  try {
    // 首先通过高德地图获取真实的景点信息
    const searchResult = await callAmapTextSearch(attractionName, city);
    
    let realAttractionInfo = null;
    if (searchResult.success && searchResult.results.length > 0) {
      const poi = searchResult.results[0];
      const detailResult = await callAmapSearchDetail(poi.id);
      if (detailResult.success) {
        realAttractionInfo = detailResult.detail;
      }
    }

    // 构建AI生成提示词
    const prompt = buildAttractionPrompt(city, attractionName, style, requirements, realAttractionInfo);
    
    // 这里可以调用AI服务（如OpenAI、百度千帆等）生成内容
    // 目前先返回基于模板的内容
    return {
      success: true,
      attraction: {
        name: attractionName,
        address: realAttractionInfo?.address || `${city}市内`,
        description: generateDescription(attractionName, city, style, realAttractionInfo),
        detailedInfo: generateDetailedInfo(attractionName, city, style, requirements, realAttractionInfo),
        coordinates: realAttractionInfo?.location || null,
        phone: realAttractionInfo?.tel || null,
        businessHours: realAttractionInfo?.business_area || null
      }
    };
  } catch (error) {
    console.error('生成景点介绍失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 构建景点介绍生成提示词
 */
function buildAttractionPrompt(city, attractionName, style, requirements, realInfo) {
  let prompt = `请生成${city}${attractionName}的景点介绍，风格要求：${style}`;
  
  if (realInfo) {
    prompt += `\n真实信息参考：
地址：${realInfo.address}
电话：${realInfo.tel || '暂无'}
营业时间：${realInfo.business_area || '暂无'}`;
  }
  
  if (requirements) {
    prompt += `\n特殊要求：${requirements}`;
  }
  
  return prompt;
}

/**
 * 生成景点简介
 */
function generateDescription(name, city, style, realInfo) {
  const templates = {
    modern: `${name}是${city}的现代化景点，融合了传统文化与现代设计，为游客带来独特的体验。`,
    cultural: `${name}承载着${city}深厚的历史文化底蕴，是了解当地传统文化的重要窗口。`,
    casual: `${name}是${city}一个轻松愉快的好去处，适合各年龄段的游客休闲游览。`,
    professional: `${name}作为${city}的重要景点，具有显著的文化价值和旅游意义。`
  };
  
  let description = templates[style] || templates.modern;
  
  if (realInfo && realInfo.address) {
    description = description.replace('是', `位于${realInfo.address}，是`);
  }
  
  return description;
}

/**
 * 生成详细介绍
 */
function generateDetailedInfo(name, city, style, requirements, realInfo) {
  let info = `${name}位于${city}`;
  
  if (realInfo && realInfo.address) {
    info += `的${realInfo.address}`;
  }
  
  info += `，是一个充满魅力的景点。`;
  
  if (style === 'cultural') {
    info += `这里历史悠久，文化底蕴深厚，承载着${city}的历史记忆。景点内古建筑保存完好，展现了传统建筑的精湛工艺。`;
  } else if (style === 'modern') {
    info += `这里将现代设计与传统元素完美结合，展现了${city}的现代化发展成就。景点设施现代化，为游客提供便捷的参观体验。`;
  } else if (style === 'casual') {
    info += `这里环境优美，氛围轻松，是市民和游客休闲娱乐的好去处。景点内绿化良好，设施完善，适合全家出游。`;
  } else {
    info += `这里集文化、历史、艺术于一体，是${city}重要的文化地标。景点展示了丰富的文化内涵和历史价值。`;
  }
  
  info += `\n\n游客可以在这里感受${city}的独特魅力，了解当地的文化传统。`;
  
  if (realInfo) {
    if (realInfo.tel) {
      info += `\n\n联系电话：${realInfo.tel}`;
    }
    if (realInfo.business_area) {
      info += `\n营业时间：${realInfo.business_area}`;
    }
  }
  
  info += `\n\n景点交通便利，周边设施完善，为游客提供了良好的参观条件。`;
  
  if (requirements) {
    info += `\n\n特别说明：${requirements}`;
  }
  
  return info;
}

/**
 * 根据地点推荐景点
 * @param {string} location - 地点名称
 * @param {Array} preferences - 用户偏好
 * @param {Array} attractionTypes - 景点类型
 * @param {string} duration - 游玩时长
 * @returns {Promise<Object>} 推荐结果
 */
async function recommendAttractions(location, preferences = [], attractionTypes = [], duration = 'half-day') {
  try {
    const recommendations = [];
    
    // 根据景点类型搜索
    const searchKeywords = getSearchKeywords(attractionTypes);
    
    for (const keyword of searchKeywords) {
      const searchResult = await callAmapTextSearch(keyword, location);
      if (searchResult.success && searchResult.results.length > 0) {
        const processedResults = await processSearchResults(searchResult.results, preferences);
        recommendations.push(...processedResults);
      }
    }

    // 如果没有找到真实景点，生成智能推荐
    if (recommendations.length === 0) {
      return generateIntelligentRecommendations(location, preferences, attractionTypes, duration);
    }

    const finalRecommendations = filterAndRankRecommendations(recommendations, preferences, duration);

    return {
      success: true,
      recommendations: finalRecommendations,
      source: 'real_data'
    };

  } catch (error) {
    console.error('景点推荐失败:', error);
    
    const fallbackRecommendations = generateIntelligentRecommendations(location, preferences, attractionTypes, duration);
    
    return {
      success: true,
      recommendations: fallbackRecommendations,
      source: 'ai_generated'
    };
  }
}

/**
 * 根据景点类型获取搜索关键词
 */
function getSearchKeywords(attractionTypes) {
  const keywordMap = {
    'historical': ['博物馆', '古迹', '历史遗址', '文物', '古建筑'],
    'natural': ['公园', '山', '湖', '森林', '自然保护区', '风景区'],
    'cultural': ['博物馆', '艺术馆', '文化中心', '剧院', '图书馆'],
    'entertainment': ['游乐园', '主题公园', '娱乐中心', 'KTV', '酒吧'],
    'food': ['美食街', '小吃', '特色餐厅', '夜市', '茶楼'],
    'shopping': ['购物中心', '商业街', '市场', '步行街', '奥特莱斯'],
    'religious': ['寺庙', '教堂', '清真寺', '道观', '佛寺'],
    'modern': ['CBD', '摩天大楼', '现代建筑', '科技馆', '展览馆']
  };

  if (attractionTypes.length === 0) {
    return ['景点', '旅游', '名胜', '公园', '博物馆'];
  }

  return attractionTypes.flatMap(type => keywordMap[type] || [type]);
}

/**
 * 处理搜索结果
 */
async function processSearchResults(results, preferences) {
  const processedResults = [];
  
  for (const result of results.slice(0, 10)) {
    try {
      const detailResult = await callAmapSearchDetail(result.id);
      
      const processedResult = {
        id: result.id,
        name: result.name,
        address: result.address,
        type: categorizeAttraction(result.type),
        description: generateAttractionDescription(result.name, result.address, result.type),
        rating: Math.random() * 2 + 3,
        visitDuration: estimateVisitDuration(result.type),
        highlights: generateHighlights(result.name, result.type),
        bestTime: getBestVisitTime(result.type),
        ticketPrice: estimateTicketPrice(result.type),
        recommendation: generateRecommendation(result.name, result.type),
        coordinates: result.location,
        phone: detailResult.success ? detailResult.detail.tel : null,
        realData: true
      };
      
      processedResults.push(processedResult);
    } catch (error) {
      console.error('处理搜索结果失败:', error);
    }
  }
  
  return processedResults;
}

/**
 * 生成智能推荐
 */
function generateIntelligentRecommendations(location, preferences, attractionTypes, duration) {
  const templates = {
    historical: [
      { name: '历史文化街区', desc: '探索历史文化底蕴' },
      { name: '古城墙遗址', desc: '感受古代城市防御工事' },
      { name: '传统建筑群', desc: '欣赏传统建筑艺术' },
      { name: '文化博物馆', desc: '了解当地历史文化' },
      { name: '古寺庙群', desc: '体验宗教文化氛围' }
    ],
    natural: [
      { name: '城市公园', desc: '享受自然绿意' },
      { name: '山水风景区', desc: '欣赏自然风光' },
      { name: '湖滨公园', desc: '水景休闲体验' },
      { name: '森林公园', desc: '森林浴和徒步' },
      { name: '观景台', desc: '俯瞰城市全景' }
    ],
    cultural: [
      { name: '艺术馆', desc: '欣赏当代艺术作品' },
      { name: '文化中心', desc: '体验文化活动' },
      { name: '图书馆', desc: '学习和阅读空间' },
      { name: '剧院', desc: '观看精彩演出' },
      { name: '音乐厅', desc: '享受音乐盛宴' }
    ],
    entertainment: [
      { name: '主题公园', desc: '刺激的娱乐体验' },
      { name: '游乐园', desc: '适合全家的娱乐' },
      { name: '水族馆', desc: '海洋生物观赏' },
      { name: '科技馆', desc: '科技互动体验' },
      { name: '电影院', desc: '观看最新电影' }
    ],
    food: [
      { name: '美食街', desc: '品尝地道美食' },
      { name: '夜市', desc: '夜间小吃体验' },
      { name: '特色餐厅区', desc: '地方特色菜肴' },
      { name: '茶楼', desc: '品茶休闲时光' },
      { name: '小吃街', desc: '传统小吃聚集地' }
    ],
    shopping: [
      { name: '购物中心', desc: '现代购物体验' },
      { name: '商业步行街', desc: '购物和休闲' },
      { name: '特色市场', desc: '当地特产购买' },
      { name: '古玩街', desc: '古董和手工艺品' },
      { name: '时尚街区', desc: '时尚购物天堂' }
    ]
  };

  const recommendations = [];
  const maxCount = duration === 'full-day' ? 8 : duration === 'half-day' ? 5 : 3;
  const typesToUse = attractionTypes.length > 0 ? attractionTypes : ['historical', 'natural', 'cultural'];
  
  typesToUse.forEach(type => {
    const typeTemplates = templates[type] || templates.historical;
    const selectedTemplates = typeTemplates.slice(0, Math.ceil(maxCount / typesToUse.length));
    
    selectedTemplates.forEach((template, index) => {
      recommendations.push({
        id: `ai_rec_${Date.now()}_${type}_${index}`,
        name: `${location}${template.name}`,
        address: `${location}市内`,
        type: type,
        description: `${template.desc}，感受${location}的独特魅力。`,
        rating: Math.random() * 1.5 + 3.5,
        visitDuration: estimateVisitDuration(type),
        highlights: generateHighlights(template.name, type),
        bestTime: getBestVisitTime(type),
        ticketPrice: estimateTicketPrice(type),
        recommendation: generateRecommendation(template.name, type),
        aiGenerated: true
      });
    });
  });

  return recommendations.slice(0, maxCount);
}

/**
 * 辅助函数：景点分类
 */
function categorizeAttraction(type) {
  const categoryMap = {
    '风景名胜': 'natural',
    '文物古迹': 'historical',
    '博物馆': 'cultural',
    '公园广场': 'natural',
    '购物服务': 'shopping',
    '餐饮服务': 'food',
    '生活服务': 'entertainment'
  };
  return categoryMap[type] || 'general';
}

/**
 * 辅助函数：估算游玩时长
 */
function estimateVisitDuration(type) {
  const durationMap = {
    'historical': '2-3小时',
    'natural': '1-2小时',
    'cultural': '2-4小时',
    'entertainment': '3-5小时',
    'food': '1-2小时',
    'shopping': '2-4小时',
    'religious': '1-2小时'
  };
  return durationMap[type] || '1-2小时';
}

/**
 * 辅助函数：生成亮点
 */
function generateHighlights(name, type) {
  const highlightMap = {
    'historical': ['历史文化', '古建筑', '文物展示'],
    'natural': ['自然风光', '休闲放松', '拍照打卡'],
    'cultural': ['艺术欣赏', '文化体验', '教育意义'],
    'entertainment': ['娱乐体验', '亲子活动', '刺激项目'],
    'food': ['地方美食', '特色小吃', '文化体验'],
    'shopping': ['购物体验', '特色商品', '休闲娱乐']
  };
  return highlightMap[type] || ['特色体验', '文化探索', '休闲娱乐'];
}

/**
 * 辅助函数：最佳游玩时间
 */
function getBestVisitTime(type) {
  const timeMap = {
    'historical': '全天',
    'natural': '早晨或傍晚',
    'cultural': '全天',
    'entertainment': '全天',
    'food': '傍晚至夜间',
    'shopping': '全天'
  };
  return timeMap[type] || '全天';
}

/**
 * 辅助函数：估算票价
 */
function estimateTicketPrice(type) {
  const priceMap = {
    'historical': '20-50元',
    'natural': '免费或10-30元',
    'cultural': '20-40元',
    'entertainment': '50-200元',
    'food': '人均30-100元',
    'shopping': '免费'
  };
  return priceMap[type] || '价格待查';
}

/**
 * 辅助函数：生成推荐理由
 */
function generateRecommendation(name, type) {
  const reasonMap = {
    'historical': '历史文化爱好者必去',
    'natural': '适合休闲和拍照',
    'cultural': '提升文化素养',
    'entertainment': '适合全家娱乐',
    'food': '美食爱好者推荐',
    'shopping': '购物和休闲好去处'
  };
  return reasonMap[type] || '值得一去的好地方';
}

/**
 * 过滤和排序推荐结果
 */
function filterAndRankRecommendations(recommendations, preferences, duration) {
  const uniqueRecommendations = recommendations.filter((item, index, self) => 
    index === self.findIndex(t => t.name === item.name)
  );

  uniqueRecommendations.sort((a, b) => b.rating - a.rating);
  
  const maxCount = duration === 'full-day' ? 8 : duration === 'half-day' ? 5 : 3;
  
  return uniqueRecommendations.slice(0, maxCount);
}

module.exports = {
  callMinimaxTextToAudio,
  callMinimaxTextToImage,
  callAmapTextSearch,
  callAmapAroundSearch,
  callAmapSearchDetail,
  generateAttractionDescription,
  recommendAttractions
};
