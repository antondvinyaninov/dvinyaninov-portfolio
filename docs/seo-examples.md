# Примеры использования SEO API

## 1. Автоматическая отправка sitemap при деплое

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy and Update SEO

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        run: |
          # Ваш деплой скрипт
          
      - name: Update Yandex Webmaster
        run: |
          curl -X POST ${{ secrets.API_URL }}/api/seo/sites/${{ secrets.HOST_ID }}/sitemaps \
            -H "Content-Type: application/json" \
            -d '{"sitemapUrl": "https://dvinyaninov.ru/sitemap.xml"}'
          
          curl -X POST ${{ secrets.API_URL }}/api/seo/sites/${{ secrets.HOST_ID }}/recrawl \
            -H "Content-Type: application/json" \
            -d '{"url": "https://dvinyaninov.ru/"}'
```

## 2. Мониторинг SEO метрик в админке

### React компонент
```jsx
import React, { useState, useEffect } from 'react';

function SEOStats({ apiUrl, hostId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/seo/sites/${hostId}/stats`);
        const data = await response.json();
        setStats(data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // Обновление каждую минуту

    return () => clearInterval(interval);
  }, [apiUrl, hostId]);

  if (loading) return <div>Загрузка...</div>;
  if (!stats) return <div>Нет данных</div>;

  return (
    <div className="seo-stats">
      <h3>SEO Статистика</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{stats.indexed_urls_count || 0}</span>
          <span className="stat-label">Проиндексировано</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.waiting_urls_count || 0}</span>
          <span className="stat-label">В очереди</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.excluded_urls_count || 0}</span>
          <span className="stat-label">Исключено</span>
        </div>
      </div>
    </div>
  );
}

export default SEOStats;
```

## 3. Автоматический переобход при публикации

### Node.js скрипт
```javascript
// scripts/publish-page.js
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function publishPage(pageUrl) {
  const API_URL = process.env.API_URL || 'http://localhost:3001';
  const HOST_ID = process.env.HOST_ID;

  console.log(`📝 Публикация страницы: ${pageUrl}`);

  // 1. Обновляем sitemap
  const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  
  // Добавляем новую страницу если её нет
  if (!sitemap.includes(pageUrl)) {
    const today = new Date().toISOString().split('T')[0];
    const newUrl = `
    <url>
        <loc>${pageUrl}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`;
    
    sitemap = sitemap.replace('</urlset>', `${newUrl}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('✅ Sitemap обновлен');
  }

  // 2. Отправляем sitemap в Яндекс
  try {
    await fetch(`${API_URL}/api/seo/sites/${HOST_ID}/sitemaps`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sitemapUrl: 'https://dvinyaninov.ru/sitemap.xml'
      })
    });
    console.log('✅ Sitemap отправлен в Яндекс');
  } catch (error) {
    console.log('ℹ️  Sitemap уже существует');
  }

  // 3. Запрашиваем переобход
  try {
    const response = await fetch(`${API_URL}/api/seo/sites/${HOST_ID}/recrawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: pageUrl })
    });
    
    if (response.ok) {
      console.log('✅ Переобход запрошен');
    }
  } catch (error) {
    console.error('❌ Ошибка запроса переобхода:', error.message);
  }

  console.log('🎉 Публикация завершена!');
}

// Использование
const pageUrl = process.argv[2];
if (!pageUrl) {
  console.error('Укажите URL страницы: node publish-page.js https://example.com/page');
  process.exit(1);
}

publishPage(pageUrl);
```

Использование:
```bash
node scripts/publish-page.js https://dvinyaninov.ru/projects/new-project/
```

## 4. Еженедельный отчет по email

### Node.js скрипт с nodemailer
```javascript
// scripts/weekly-seo-report.js
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');

async function sendWeeklyReport() {
  const API_URL = process.env.API_URL;
  const HOST_ID = process.env.HOST_ID;
  
  // Получаем данные
  const [stats, problems, queries] = await Promise.all([
    fetch(`${API_URL}/api/seo/sites/${HOST_ID}/stats`).then(r => r.json()),
    fetch(`${API_URL}/api/seo/sites/${HOST_ID}/problems`).then(r => r.json()),
    fetch(`${API_URL}/api/seo/sites/${HOST_ID}/queries?limit=10`).then(r => r.json())
  ]);

  // Формируем отчет
  const report = `
    <h2>📊 Еженедельный SEO отчет</h2>
    <h3>Статистика индексации</h3>
    <ul>
      <li>Проиндексировано: ${stats.data.indexed_urls_count || 0}</li>
      <li>В очереди: ${stats.data.waiting_urls_count || 0}</li>
      <li>Исключено: ${stats.data.excluded_urls_count || 0}</li>
    </ul>
    
    <h3>Проблемы</h3>
    ${problems.data.problems?.length > 0 
      ? `<p>⚠️ Найдено проблем: ${problems.data.problems.length}</p>`
      : '<p>✅ Проблем не обнаружено</p>'
    }
    
    <h3>Топ-5 запросов</h3>
    <ol>
      ${queries.data.queries?.slice(0, 5).map(q => 
        `<li>"${q.query_text}" - ${q.shows} показов, ${q.clicks} кликов</li>`
      ).join('') || '<li>Нет данных</li>'}
    </ol>
  `;

  // Отправляем email
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    subject: `SEO отчет за неделю - ${new Date().toLocaleDateString('ru-RU')}`,
    html: report
  });

  console.log('✅ Отчет отправлен');
}

sendWeeklyReport();
```

Cron (каждый понедельник в 9:00):
```bash
0 9 * * 1 cd /path/to/project && node scripts/weekly-seo-report.js
```

## 5. Webhook для уведомлений о проблемах

### Express endpoint
```javascript
// src/api/webhooks.js
const express = require('express');
const router = express.Router();
const YandexWebmaster = require('./yandex-webmaster');

router.post('/check-seo-health', async (req, res) => {
  try {
    const client = new YandexWebmaster(
      process.env.YANDEX_WEBMASTER_TOKEN,
      process.env.YANDEX_USER_ID
    );

    const hostId = req.body.hostId;
    const problems = await client.getSiteProblems(hostId);

    // Фильтруем критические проблемы
    const critical = problems.problems?.filter(p => 
      p.severity === 'CRITICAL' || p.severity === 'ERROR'
    );

    if (critical && critical.length > 0) {
      // Отправляем уведомление (Slack, Discord, etc.)
      await sendNotification({
        title: '🚨 Критические SEO проблемы',
        text: `Найдено ${critical.length} критических проблем`,
        problems: critical
      });
    }

    res.json({ 
      success: true, 
      critical: critical?.length || 0 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

## 6. Интеграция с CMS

### WordPress плагин (пример)
```php
<?php
// wp-content/plugins/yandex-webmaster-integration/yandex-webmaster.php

function publish_to_yandex_webmaster($post_id) {
    if (wp_is_post_revision($post_id)) {
        return;
    }

    $post_url = get_permalink($post_id);
    $api_url = get_option('yandex_api_url');
    $host_id = get_option('yandex_host_id');

    // Запрашиваем переобход
    $response = wp_remote_post(
        "$api_url/api/seo/sites/$host_id/recrawl",
        array(
            'headers' => array('Content-Type' => 'application/json'),
            'body' => json_encode(array('url' => $post_url))
        )
    );

    if (!is_wp_error($response)) {
        add_post_meta($post_id, '_yandex_recrawl_requested', time());
    }
}

add_action('publish_post', 'publish_to_yandex_webmaster');
add_action('publish_page', 'publish_to_yandex_webmaster');
?>
```

## 7. Мониторинг конкурентов

### Сравнение позиций
```javascript
// scripts/competitor-analysis.js
async function compareWithCompetitors() {
  const myQueries = await fetch(
    `${API_URL}/api/seo/sites/${MY_HOST_ID}/queries?limit=50`
  ).then(r => r.json());

  const competitorQueries = await fetch(
    `${API_URL}/api/seo/sites/${COMPETITOR_HOST_ID}/queries?limit=50`
  ).then(r => r.json());

  // Находим общие запросы
  const myQueriesMap = new Map(
    myQueries.data.queries.map(q => [q.query_text, q])
  );

  const comparison = competitorQueries.data.queries
    .filter(q => myQueriesMap.has(q.query_text))
    .map(q => ({
      query: q.query_text,
      myPosition: myQueriesMap.get(q.query_text).avg_show_position,
      competitorPosition: q.avg_show_position,
      difference: myQueriesMap.get(q.query_text).avg_show_position - q.avg_show_position
    }))
    .sort((a, b) => b.difference - a.difference);

  console.log('Запросы где мы проигрываем:');
  comparison
    .filter(c => c.difference > 0)
    .slice(0, 10)
    .forEach(c => {
      console.log(`"${c.query}": мы ${c.myPosition}, конкурент ${c.competitorPosition}`);
    });
}
```

## 8. A/B тестирование заголовков

### Отслеживание изменений CTR
```javascript
// scripts/ab-test-titles.js
const fs = require('fs');

async function trackTitleChanges(pageUrl, newTitle) {
  // Сохраняем текущие метрики
  const beforeMetrics = await fetch(
    `${API_URL}/api/seo/sites/${HOST_ID}/queries?query_indicator=URL_EQUALS&query_text=${pageUrl}`
  ).then(r => r.json());

  // Меняем title
  console.log(`Меняем title на: ${newTitle}`);
  // ... код изменения title ...

  // Запрашиваем переобход
  await fetch(`${API_URL}/api/seo/sites/${HOST_ID}/recrawl`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: pageUrl })
  });

  // Сохраняем данные теста
  const testData = {
    url: pageUrl,
    oldTitle: beforeMetrics.data.queries[0]?.title,
    newTitle: newTitle,
    startDate: new Date().toISOString(),
    beforeCTR: beforeMetrics.data.queries[0]?.ctr || 0
  };

  fs.writeFileSync(
    `ab-tests/${Date.now()}.json`,
    JSON.stringify(testData, null, 2)
  );

  console.log('✅ A/B тест начат. Проверьте результаты через 2 недели');
}
```

## 9. Автоматическое создание контента

### Генерация страниц под запросы
```javascript
// scripts/generate-content-ideas.js
async function getContentIdeas() {
  const queries = await fetch(
    `${API_URL}/api/seo/sites/${HOST_ID}/queries?limit=100&order_by=TOTAL_SHOWS`
  ).then(r => r.json());

  // Находим запросы с низким CTR
  const lowCTR = queries.data.queries
    .filter(q => q.ctr < 0.02 && q.shows > 100)
    .sort((a, b) => b.shows - a.shows);

  console.log('💡 Идеи для нового контента (высокие показы, низкий CTR):');
  lowCTR.slice(0, 10).forEach((q, i) => {
    console.log(`${i + 1}. "${q.query_text}"`);
    console.log(`   Показы: ${q.shows}, CTR: ${(q.ctr * 100).toFixed(2)}%`);
    console.log(`   Рекомендация: Создать страницу или улучшить существующую\n`);
  });
}
```

## 10. Dashboard с графиками

### Chart.js интеграция
```javascript
// Отслеживание динамики индексации
async function renderIndexingChart() {
  // Получаем исторические данные (нужно сохранять в БД)
  const history = await fetch('/api/seo/history').then(r => r.json());

  const ctx = document.getElementById('indexingChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.map(h => h.date),
      datasets: [{
        label: 'Проиндексировано',
        data: history.map(h => h.indexed),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }, {
        label: 'В очереди',
        data: history.map(h => h.waiting),
        borderColor: 'rgb(255, 159, 64)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Динамика индексации'
        }
      }
    }
  });
}
```

---

Все примеры можно адаптировать под ваши нужды. Главное - регулярно мониторить метрики и быстро реагировать на проблемы!
