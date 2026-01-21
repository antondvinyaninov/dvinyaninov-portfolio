const fetch = require('node-fetch');

/**
 * Модуль для работы с API Яндекс.Вебмастера
 * Документация: https://yandex.ru/dev/webmaster/doc/dg/concepts/about.html
 */

class YandexWebmaster {
  constructor(oauthToken, userId) {
    this.oauthToken = oauthToken;
    this.userId = userId;
    this.baseUrl = 'https://api.webmaster.yandex.net/v4';
  }

  /**
   * Базовый метод для выполнения запросов к API
   */
  async request(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': `OAuth ${this.oauthToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_message || 'Ошибка API Яндекс.Вебмастера');
      }

      return data;
    } catch (error) {
      console.error('Yandex Webmaster API Error:', error);
      throw error;
    }
  }

  /**
   * Получить список всех сайтов пользователя
   */
  async getSites() {
    return await this.request(`/user/${this.userId}/hosts`);
  }

  /**
   * Добавить новый сайт
   */
  async addSite(hostUrl) {
    return await this.request(`/user/${this.userId}/hosts`, 'POST', {
      host_url: hostUrl
    });
  }

  /**
   * Получить информацию о сайте
   */
  async getSiteInfo(hostId) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}`);
  }

  /**
   * Удалить сайт
   */
  async deleteSite(hostId) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}`, 'DELETE');
  }

  /**
   * Получить список sitemap'ов
   */
  async getSitemaps(hostId) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}/sitemaps`);
  }

  /**
   * Добавить sitemap
   */
  async addSitemap(hostId, sitemapUrl) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}/sitemaps`, 'POST', {
      url: sitemapUrl
    });
  }

  /**
   * Удалить sitemap
   */
  async deleteSitemap(hostId, sitemapId) {
    return await this.request(
      `/user/${this.userId}/hosts/${hostId}/sitemaps/${sitemapId}`,
      'DELETE'
    );
  }

  /**
   * Получить статистику индексации
   */
  async getIndexingStats(hostId) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}/summary`);
  }

  /**
   * Получить список проблем сайта
   */
  async getSiteProblems(hostId) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}/diagnostics`);
  }

  /**
   * Получить список URL для переобхода
   */
  async getRecrawlQueue(hostId) {
    return await this.request(`/user/${this.userId}/hosts/${hostId}/recrawl/queue`);
  }

  /**
   * Добавить URL в очередь на переобход
   */
  async addToRecrawl(hostId, url) {
    return await this.request(
      `/user/${this.userId}/hosts/${hostId}/recrawl/queue`,
      'POST',
      { url }
    );
  }

  /**
   * Получить статистику поисковых запросов
   */
  async getSearchQueries(hostId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/user/${this.userId}/hosts/${hostId}/search-queries/popular${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint);
  }

  /**
   * Получить внешние ссылки на сайт
   */
  async getExternalLinks(hostId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/user/${this.userId}/hosts/${hostId}/links/external/samples${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint);
  }

  /**
   * Получить список исключенных страниц
   */
  async getExcludedPages(hostId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/user/${this.userId}/hosts/${hostId}/excluded-urls/samples${queryParams ? '?' + queryParams : ''}`;
    return await this.request(endpoint);
  }
}

module.exports = YandexWebmaster;
