#!/usr/bin/env node

/**
 * Скрипт автоматизации SEO задач
 * Запуск: node src/api/seo-automation.js
 */

require('dotenv').config();
const YandexWebmaster = require('./yandex-webmaster');
const SEOTelegramNotifier = require('./seo-telegram-notifier');
const fs = require('fs');
const path = require('path');

// Конфигурация
const SITE_URL = 'https://dvinyaninov.ru';
const SITEMAP_PATH = path.join(__dirname, '../../public/sitemap.xml');

// Инициализация клиентов
const client = new YandexWebmaster(
  process.env.YANDEX_WEBMASTER_TOKEN,
  process.env.YANDEX_USER_ID
);

const notifier = process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
  ? new SEOTelegramNotifier(process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHAT_ID)
  : null;

/**
 * Получить или создать сайт в Вебмастере
 */
async function ensureSiteExists() {
  try {
    console.log('🔍 Проверка наличия сайта в Яндекс.Вебмастере...');
    
    const sites = await client.getSites();
    
    // Ищем сайт по разным вариантам URL
    const existingSite = sites.hosts?.find(host => {
      const hostUrl = host.unicode_host_url || host.ascii_host_url || '';
      return hostUrl.includes('dvinyaninov.ru');
    });

    if (existingSite) {
      console.log('✅ Сайт найден:', existingSite.host_id);
      return existingSite.host_id;
    }

    console.log('➕ Добавление сайта в Вебмастер...');
    try {
      const result = await client.addSite(SITE_URL);
      console.log('✅ Сайт добавлен:', result.host_id);
      
      // Отправляем уведомление в Telegram
      if (notifier) {
        await notifier.notifySiteAdded(SITE_URL, result.host_id);
      }
      
      return result.host_id;
    } catch (addError) {
      // Если сайт уже добавлен, извлекаем host_id из ошибки
      if (addError.message.includes('already added')) {
        const match = addError.message.match(/"([^"]+)"/);
        if (match) {
          const hostId = match[1];
          console.log('✅ Сайт уже существует:', hostId);
          return hostId;
        }
      }
      throw addError;
    }
  } catch (error) {
    console.error('❌ Ошибка при работе с сайтом:', error.message);
    throw error;
  }
}

/**
 * Обновить sitemap
 */
async function updateSitemap(hostId) {
  try {
    console.log('\n📄 Обновление sitemap...');
    
    // Проверяем существующие sitemap'ы
    try {
      const sitemaps = await client.getSitemaps(hostId);
      const sitemapUrl = `${SITE_URL}/sitemap.xml`;
      
      const existingSitemap = sitemaps.sitemaps?.find(s => s.url === sitemapUrl);

      if (!existingSitemap) {
        console.log('➕ Добавление sitemap...');
        await client.addSitemap(hostId, sitemapUrl);
        console.log('✅ Sitemap добавлен');
      } else {
        console.log('✅ Sitemap уже существует');
      }
    } catch (sitemapError) {
      if (sitemapError.message.includes('NOT_LOADED') || sitemapError.message.includes('not loaded')) {
        console.log('⏳ Функция sitemap пока недоступна (данные загружаются)');
      } else if (sitemapError.message.includes('Method not allowed')) {
        console.log('ℹ️  Управление sitemap пока недоступно');
        console.log('💡 Добавьте sitemap вручную через интерфейс Вебмастера:');
        console.log(`   https://webmaster.yandex.ru/site/${hostId}/indexing/sitemap/`);
      } else {
        throw sitemapError;
      }
    }

    // Обновляем lastmod в sitemap.xml
    if (fs.existsSync(SITEMAP_PATH)) {
      let content = fs.readFileSync(SITEMAP_PATH, 'utf8');
      const today = new Date().toISOString().split('T')[0];
      
      // Обновляем дату главной страницы
      content = content.replace(
        /(<loc>https:\/\/dvinyaninov\.ru\/<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/,
        `$1${today}$2`
      );
      
      fs.writeFileSync(SITEMAP_PATH, content);
      console.log('✅ Дата в sitemap.xml обновлена');
    }
  } catch (error) {
    console.error('❌ Ошибка при обновлении sitemap:', error.message);
  }
}

/**
 * Проверить статистику индексации
 */
async function checkIndexingStats(hostId) {
  try {
    console.log('\n📊 Статистика индексации:');
    
    const stats = await client.getIndexingStats(hostId);
    
    console.log(`   Проиндексировано: ${stats.searchable_pages_count || 0} страниц`);
    console.log(`   Исключено: ${stats.excluded_pages_count || 0} страниц`);
    console.log(`   Индекс качества сайта (SQI): ${stats.sqi || 'н/д'}`);
    
    if (stats.site_problems) {
      const totalProblems = Object.values(stats.site_problems).reduce((a, b) => a + b, 0);
      console.log(`   Проблем найдено: ${totalProblems}`);
    }
    
    return stats;
  } catch (error) {
    if (error.message.includes('NOT_LOADED') || error.message.includes('not loaded')) {
      console.log('   ⏳ Данные ещё загружаются в Яндекс.Вебмастер');
      console.log('   💡 Это нормально для недавно добавленного сайта');
      console.log('   ⏰ Проверьте снова через несколько часов');
      return null;
    }
    console.error('❌ Ошибка при получении статистики:', error.message);
    return null;
  }
}

/**
 * Проверить проблемы сайта
 */
async function checkProblems(hostId) {
  try {
    console.log('\n🔍 Проверка проблем сайта:');
    
    const diagnostics = await client.getSiteProblems(hostId);
    
    if (!diagnostics || !diagnostics.problems || !Array.isArray(diagnostics.problems) || diagnostics.problems.length === 0) {
      console.log('   ✅ Критических проблем не найдено');
      return [];
    }

    console.log(`   ⚠️  Найдено проблем: ${diagnostics.problems.length}`);
    
    diagnostics.problems.slice(0, 5).forEach((problem, index) => {
      console.log(`   ${index + 1}. ${problem.title || problem.type}`);
      if (problem.count) {
        console.log(`      Затронуто страниц: ${problem.count}`);
      }
    });

    if (diagnostics.problems.length > 5) {
      console.log(`   ... и еще ${diagnostics.problems.length - 5} проблем`);
    }
    
    return diagnostics.problems;
  } catch (error) {
    if (error.message.includes('NOT_LOADED') || error.message.includes('not loaded')) {
      console.log('   ⏳ Данные ещё загружаются');
      return [];
    }
    console.error('❌ Ошибка при проверке проблем:', error.message);
    return [];
  }
}

/**
 * Получить популярные запросы
 */
async function getPopularQueries(hostId) {
  try {
    console.log('\n🔎 Топ-10 поисковых запросов:');
    
    const queries = await client.getSearchQueries(hostId, {
      order_by: 'TOTAL_SHOWS',
      limit: 10
    });

    if (!queries.queries || queries.queries.length === 0) {
      console.log('   ⏳ Данных пока нет (требуется время для накопления статистики)');
      return [];
    }

    queries.queries.forEach((query, index) => {
      console.log(`   ${index + 1}. "${query.query_text}"`);
      console.log(`      Показы: ${query.shows || 0}, Клики: ${query.clicks || 0}`);
    });
    
    return queries.queries;
  } catch (error) {
    if (error.message.includes('NOT_LOADED') || error.message.includes('not loaded')) {
      console.log('   ⏳ Данные ещё загружаются');
      return [];
    }
    console.error('❌ Ошибка при получении запросов:', error.message);
    return [];
  }
}

/**
 * Запросить переобход главной страницы
 */
async function recrawlMainPage(hostId) {
  try {
    console.log('\n🔄 Запрос переобхода главной страницы...');
    
    await client.addToRecrawl(hostId, SITE_URL);
    console.log('✅ Главная страница добавлена в очередь на переобход');
  } catch (error) {
    if (error.message.includes('quota')) {
      console.log('⚠️  Достигнут лимит переобходов на сегодня (20 URL/день)');
    } else {
      console.error('❌ Ошибка при запросе переобхода:', error.message);
    }
  }
}

/**
 * Основная функция
 */
async function main() {
  console.log('🚀 Запуск SEO автоматизации для', SITE_URL);
  console.log('=' .repeat(60));

  try {
    // 1. Проверяем/добавляем сайт
    const hostId = await ensureSiteExists();
    
    // Получаем информацию о сайте
    const siteInfo = await client.getSiteInfo(hostId);
    console.log(`\n📋 Статус сайта: ${siteInfo.host_data_status}`);
    console.log(`✅ Верификация: ${siteInfo.verified ? 'Пройдена' : 'Не пройдена'}`);

    // 2. Обновляем sitemap
    await updateSitemap(hostId);

    // 3. Собираем данные для отчета
    const stats = await checkIndexingStats(hostId);
    const problems = await checkProblems(hostId);
    const queries = await getPopularQueries(hostId);

    // 4. Отправляем ежедневный отчет в Telegram
    if (notifier && stats) {
      await notifier.sendDailyReport({
        siteUrl: SITE_URL,
        stats: stats,
        problems: problems || [],
        queries: queries || []
      });
      console.log('\n📱 Отчет отправлен в Telegram');
    }

    // 6. Запрашиваем переобход (опционально, раскомментируйте если нужно)
    // await recrawlMainPage(hostId);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Автоматизация завершена успешно!');
    
    if (siteInfo.host_data_status === 'NOT_LOADED') {
      console.log('\n💡 Рекомендации:');
      console.log('   - Сайт добавлен и верифицирован');
      console.log('   - Яндекс начнёт индексацию в ближайшее время');
      console.log('   - Проверьте статистику через несколько часов');
      console.log('   - Добавьте sitemap вручную через интерфейс Вебмастера');
      console.log(`   - https://webmaster.yandex.ru/site/${hostId}/indexing/sitemap/`);
    } else {
      console.log('\n💡 Рекомендации:');
      console.log('   - Запускайте этот скрипт раз в день через cron');
      console.log('   - Следите за проблемами и исправляйте их');
      console.log('   - Анализируйте популярные запросы для оптимизации контента');
    }
    
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    
    // Отправляем уведомление об ошибке в Telegram
    if (notifier) {
      await notifier.notifyCriticalIssue(error.message, SITE_URL);
    }
    
    process.exit(1);
  }
}

// Запуск
if (require.main === module) {
  main();
}

module.exports = { main };
