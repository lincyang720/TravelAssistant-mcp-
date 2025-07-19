const express = require('express');
const router = express.Router();
const mcpService = require('../services/mcpService');

// Get city weather
router.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const weather = await mcpService.getWeather(city);
    res.json(weather);
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ error: 'Failed to get weather information' });
  }
});

// Get attraction recommendations
router.post('/recommend', async (req, res) => {
  try {
    const { city, keywords } = req.body;
    const attractions = await mcpService.recommendAttractions(city, keywords);
    res.json(attractions);
  } catch (error) {
    console.error('Error recommending attractions:', error);
    res.status(500).json({ error: 'Failed to recommend attractions' });
  }
});

// Search attractions
router.get('/search', async (req, res) => {
  try {
    const { keywords, city } = req.query;
    const searchResults = await mcpService.searchKeywords(keywords, city);
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching attractions:', error);
    res.status(500).json({ error: 'Failed to search attractions' });
  }
});

// Get attraction details
router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const details = await mcpService.getAttractionDetails(id);
    res.json(details);
  } catch (error) {
    console.error('Error getting attraction details:', error);
    res.status(500).json({ error: 'Failed to get attraction details' });
  }
});

module.exports = router;

// 获取城市天气
router.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const weather = await mcpService.getWeather(city);
    res.json(weather);
  } catch (error) {
    console.error('Error getting weather:', error);
    res.status(500).json({ error: 'Failed to get weather information' });
  }
});

// 获取景点推荐
router.post('/recommend', async (req, res) => {
  try {
    const { city, keywords } = req.body;
    const attractions = await mcpService.recommendAttractions(city, keywords);
    res.json(attractions);
  } catch (error) {
    console.error('Error recommending attractions:', error);
    res.status(500).json({ error: 'Failed to recommend attractions' });
  }
});

// 获取景点搜索
router.get('/search', async (req, res) => {
  try {
    const { keywords, city } = req.query;
    const searchResults = await mcpService.searchKeywords(keywords, city);
    res.json(searchResults);
  } catch (error) {
    console.error('Error searching attractions:', error);
    res.status(500).json({ error: 'Failed to search attractions' });
  }
});

// Get attraction details
router.get('/details/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const details = await mcpService.getAttractionDetails(id);
    res.json(details);
  } catch (error) {
    console.error('Error getting attraction details:', error);
    res.status(500).json({ error: 'Failed to get attraction details' });
  }
});

module.exports = router;
