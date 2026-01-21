const fetch = require('node-fetch');

/**
 * Модуль для отправки SEO уведомлений в Telegram
 */
class SEOTelegramNotifier {
  constructor(botToken, chatId) {
    this.botToken = botToken;
    this.chatId = chatId;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
  }

  /**
   * Отправить сообщение в Telegram
   */
  async sendMessage(text, parseMode = 'HTML') {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: text,
          parse_mode: parseMode
        })
      });

      const result = await response.json();
      return result.ok;
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
      return false;
    }
  }

  /**
   * Уведомление о статистике индексации
   */
  async notifyIndexingStats(stats, siteUrl) {
    const message = `
📊 <b>Статистика индексации</b>
🌐 Сайт: ${siteUrl}

✅ Проиндексировано: ${stats.indexed_urls_count || 0} страниц
⏳ В очереди: ${stats.waiting_urls_count || 0} страниц
❌ Исключено: ${stats.excluded_urls_count || 0} страниц

${stats.last_access ? `🕐 Последний обход: ${new Date(stats.last_access).toLocaleDateString('ru-RU')}` : ''}
    `.trim();

    return await this.sendMessage(message);
  }

  /**
   * Уведомление о проблемах сайта
   */
  async notifyProblems(problems, siteUrl) {
    if (!problems || problems.length === 0) {
      return await this.sendMessage(`
✅ <b>Проверка завершена</b>
🌐 Сайт: ${siteUrl}

Критических проблем не обнаружено!
      `.trim());
    }

    const problemsList = problems.slice(0, 5)
      .map((p, i) => `${i + 1}. ${p.title || p.type}${p.count ? ` (${p.count} стр.)` : ''}`)
      .join('\n');

    const message = `
⚠️ <b>Обнаружены проблемы</b>
🌐 Сайт: ${siteUrl}

Найдено проблем: ${problems.length}

${problemsList}
${problems.length > 5 ? `\n... и еще ${problems.length - 5} проблем` : ''}

🔧 Рекомендуется проверить и исправить
    `.trim();

    return await this.sendMessage(message);
  }

  /**
   * Уведомление о топ запросах
   */
  async notifyTopQueries(queries, siteUrl) {
    if (!queries || queries.length === 0) {
      return true; // Не отправляем уведомление если нет данных
    }

    const queriesList = queries.slice(0, 5)
      .map((q, i) => `${i + 1}. "${q.query_text}" - ${q.shows || 0} показов, ${q.clicks || 0} кликов`)
      .join('\n');

    const message = `
🔎 <b>Топ поисковых запросов</b>
🌐 Сайт: ${siteUrl}

${queriesList}

💡 Используйте эти запросы для оптимизации контента
    `.trim();

    return await this.sendMessage(message);
  }

  /**
   * Уведомление о добавлении сайта
   */
  async notifySiteAdded(siteUrl, hostId) {
    const message = `
🎉 <b>Сайт добавлен в Яндекс.Вебмастер</b>

🌐 URL: ${siteUrl}
🆔 Host ID: ${hostId}

✅ Sitemap будет добавлен автоматически
⏳ Индексация начнется в ближайшее время
    `.trim();

    return await this.sendMessage(message);
  }

  /**
   * Уведомление о критических проблемах
   */
  async notifyCriticalIssue(issue, siteUrl) {
    const message = `
🚨 <b>КРИТИЧЕСКАЯ ПРОБЛЕМА</b>
🌐 Сайт: ${siteUrl}

⚠️ ${issue}

🔧 Требуется немедленное исправление!
    `.trim();

    return await this.sendMessage(message);
  }

  /**
   * Ежедневный отчет
   */
  async sendDailyReport(data) {
    const { siteUrl, stats, problems, queries } = data;

    const problemsText = problems && problems.length > 0
      ? `⚠️ Проблем: ${problems.length}`
      : '✅ Проблем нет';

    const queriesText = queries && queries.length > 0
      ? `\n\n🔎 Топ-3 запроса:\n${queries.slice(0, 3).map((q, i) => 
          `${i + 1}. "${q.query_text}" (${q.shows || 0} показов)`
        ).join('\n')}`
      : '';

    const message = `
📈 <b>Ежедневный SEO отчет</b>
🌐 ${siteUrl}
📅 ${new Date().toLocaleDateString('ru-RU')}

📊 Индексация:
• Проиндексировано: ${stats.indexed_urls_count || 0}
• В очереди: ${stats.waiting_urls_count || 0}
• Исключено: ${stats.excluded_urls_count || 0}

${problemsText}${queriesText}

🔗 <a href="https://webmaster.yandex.ru/">Открыть Вебмастер</a>
    `.trim();

    return await this.sendMessage(message);
  }
}

module.exports = SEOTelegramNotifier;
