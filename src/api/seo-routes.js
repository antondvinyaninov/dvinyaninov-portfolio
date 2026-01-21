const express = require('express');
const YandexWebmaster = require('./yandex-webmaster');

const router = express.Router();

// Инициализация клиента Яндекс.Вебмастера
const getWebmasterClient = () => {
  const token = process.env.YANDEX_WEBMASTER_TOKEN;
  const userId = process.env.YANDEX_USER_ID;

  if (!token || !userId) {
    throw new Error('Не настроены переменные окружения для Яндекс.Вебмастера');
  }

  return new YandexWebmaster(token, userId);
};

/**
 * Получить список всех сайтов
 */
router.get('/sites', async (req, res) => {
  try {
    const client = getWebmasterClient();
    const sites = await client.getSites();
    res.json({ success: true, data: sites });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Добавить новый сайт
 */
router.post('/sites', async (req, res) => {
  try {
    const { hostUrl } = req.body;
    
    if (!hostUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Не указан URL сайта' 
      });
    }

    const client = getWebmasterClient();
    const result = await client.addSite(hostUrl);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Получить информацию о сайте
 */
router.get('/sites/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;
    const client = getWebmasterClient();
    const info = await client.getSiteInfo(hostId);
    res.json({ success: true, data: info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Получить статистику индексации
 */
router.get('/sites/:hostId/stats', async (req, res) => {
  try {
    const { hostId } = req.params;
    const client = getWebmasterClient();
    const stats = await client.getIndexingStats(hostId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Получить список sitemap'ов
 */
router.get('/sites/:hostId/sitemaps', async (req, res) => {
  try {
    const { hostId } = req.params;
    const client = getWebmasterClient();
    const sitemaps = await client.getSitemaps(hostId);
    res.json({ success: true, data: sitemaps });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Добавить sitemap
 */
router.post('/sites/:hostId/sitemaps', async (req, res) => {
  try {
    const { hostId } = req.params;
    const { sitemapUrl } = req.body;

    if (!sitemapUrl) {
      return res.status(400).json({ 
        success: false, 
        error: 'Не указан URL sitemap' 
      });
    }

    const client = getWebmasterClient();
    const result = await client.addSitemap(hostId, sitemapUrl);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Получить проблемы сайта
 */
router.get('/sites/:hostId/problems', async (req, res) => {
  try {
    const { hostId } = req.params;
    const client = getWebmasterClient();
    const problems = await client.getSiteProblems(hostId);
    res.json({ success: true, data: problems });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Добавить URL в очередь на переобход
 */
router.post('/sites/:hostId/recrawl', async (req, res) => {
  try {
    const { hostId } = req.params;
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ 
        success: false, 
        error: 'Не указан URL для переобхода' 
      });
    }

    const client = getWebmasterClient();
    const result = await client.addToRecrawl(hostId, url);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Получить популярные поисковые запросы
 */
router.get('/sites/:hostId/queries', async (req, res) => {
  try {
    const { hostId } = req.params;
    const client = getWebmasterClient();
    const queries = await client.getSearchQueries(hostId, req.query);
    res.json({ success: true, data: queries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Получить внешние ссылки
 */
router.get('/sites/:hostId/links', async (req, res) => {
  try {
    const { hostId } = req.params;
    const client = getWebmasterClient();
    const links = await client.getExternalLinks(hostId, req.query);
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
