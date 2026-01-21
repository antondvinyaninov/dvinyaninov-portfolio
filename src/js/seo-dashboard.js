/**
 * SEO Dashboard - мониторинг статистики Яндекс.Вебмастера
 */

class SEODashboard {
  constructor(apiUrl, hostId) {
    this.apiUrl = apiUrl;
    this.hostId = hostId;
    this.updateInterval = 60000; // 1 минута
  }

  /**
   * Получить статистику индексации
   */
  async getStats() {
    try {
      const response = await fetch(`${this.apiUrl}/api/seo/sites/${this.hostId}/stats`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Ошибка получения статистики:', error);
      return null;
    }
  }

  /**
   * Получить проблемы сайта
   */
  async getProblems() {
    try {
      const response = await fetch(`${this.apiUrl}/api/seo/sites/${this.hostId}/problems`);
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Ошибка получения проблем:', error);
      return null;
    }
  }

  /**
   * Получить топ запросов
   */
  async getTopQueries(limit = 10) {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/seo/sites/${this.hostId}/queries?limit=${limit}&order_by=TOTAL_SHOWS`
      );
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (error) {
      console.error('Ошибка получения запросов:', error);
      return null;
    }
  }

  /**
   * Запросить переобход страницы
   */
  async requestRecrawl(url) {
    try {
      const response = await fetch(`${this.apiUrl}/api/seo/sites/${this.hostId}/recrawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Ошибка запроса переобхода:', error);
      return false;
    }
  }

  /**
   * Отобразить статистику
   */
  renderStats(stats, container) {
    if (!stats) {
      container.innerHTML = '<p>Не удалось загрузить статистику</p>';
      return;
    }

    const lastAccess = stats.last_access 
      ? new Date(stats.last_access).toLocaleDateString('ru-RU')
      : 'Нет данных';

    container.innerHTML = `
      <div class="seo-stats">
        <div class="stat-item">
          <div class="stat-value">${stats.indexed_urls_count || 0}</div>
          <div class="stat-label">Проиндексировано</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.waiting_urls_count || 0}</div>
          <div class="stat-label">В очереди</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${stats.excluded_urls_count || 0}</div>
          <div class="stat-label">Исключено</div>
        </div>
        <div class="stat-item full-width">
          <div class="stat-label">Последний обход: ${lastAccess}</div>
        </div>
      </div>
    `;
  }

  /**
   * Отобразить проблемы
   */
  renderProblems(problems, container) {
    if (!problems || !problems.problems || problems.problems.length === 0) {
      container.innerHTML = '<p class="success">✅ Критических проблем не обнаружено</p>';
      return;
    }

    const problemsList = problems.problems.slice(0, 5)
      .map(p => `
        <li>
          <strong>${p.title || p.type}</strong>
          ${p.count ? `<span class="problem-count">(${p.count} стр.)</span>` : ''}
        </li>
      `)
      .join('');

    container.innerHTML = `
      <div class="seo-problems">
        <p class="warning">⚠️ Найдено проблем: ${problems.problems.length}</p>
        <ul>${problemsList}</ul>
        ${problems.problems.length > 5 ? `<p>... и еще ${problems.problems.length - 5} проблем</p>` : ''}
      </div>
    `;
  }

  /**
   * Отобразить топ запросов
   */
  renderQueries(queries, container) {
    if (!queries || !queries.queries || queries.queries.length === 0) {
      container.innerHTML = '<p>Данных пока нет (требуется время для накопления статистики)</p>';
      return;
    }

    const queriesList = queries.queries.slice(0, 10)
      .map((q, i) => `
        <tr>
          <td>${i + 1}</td>
          <td><strong>"${q.query_text}"</strong></td>
          <td>${q.shows || 0}</td>
          <td>${q.clicks || 0}</td>
          <td>${q.ctr ? (q.ctr * 100).toFixed(2) + '%' : '-'}</td>
        </tr>
      `)
      .join('');

    container.innerHTML = `
      <table class="seo-queries-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Запрос</th>
            <th>Показы</th>
            <th>Клики</th>
            <th>CTR</th>
          </tr>
        </thead>
        <tbody>
          ${queriesList}
        </tbody>
      </table>
    `;
  }

  /**
   * Инициализация дашборда
   */
  async init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Контейнер не найден:', containerId);
      return;
    }

    // Создаем структуру дашборда
    container.innerHTML = `
      <div class="seo-dashboard">
        <h2>SEO Мониторинг</h2>
        
        <section class="dashboard-section">
          <h3>Статистика индексации</h3>
          <div id="seo-stats-content"></div>
        </section>

        <section class="dashboard-section">
          <h3>Проблемы сайта</h3>
          <div id="seo-problems-content"></div>
        </section>

        <section class="dashboard-section">
          <h3>Топ поисковых запросов</h3>
          <div id="seo-queries-content"></div>
        </section>

        <div class="dashboard-footer">
          <small>Обновлено: <span id="last-update">-</span></small>
          <button id="refresh-seo" class="btn-refresh">Обновить</button>
        </div>
      </div>
    `;

    // Загружаем данные
    await this.update();

    // Автообновление
    setInterval(() => this.update(), this.updateInterval);

    // Кнопка обновления
    document.getElementById('refresh-seo')?.addEventListener('click', () => {
      this.update();
    });
  }

  /**
   * Обновить все данные
   */
  async update() {
    const statsContainer = document.getElementById('seo-stats-content');
    const problemsContainer = document.getElementById('seo-problems-content');
    const queriesContainer = document.getElementById('seo-queries-content');
    const lastUpdateEl = document.getElementById('last-update');

    if (!statsContainer || !problemsContainer || !queriesContainer) return;

    // Показываем загрузку
    statsContainer.innerHTML = '<p>Загрузка...</p>';
    problemsContainer.innerHTML = '<p>Загрузка...</p>';
    queriesContainer.innerHTML = '<p>Загрузка...</p>';

    // Загружаем данные параллельно
    const [stats, problems, queries] = await Promise.all([
      this.getStats(),
      this.getProblems(),
      this.getTopQueries()
    ]);

    // Отображаем данные
    this.renderStats(stats, statsContainer);
    this.renderProblems(problems, problemsContainer);
    this.renderQueries(queries, queriesContainer);

    // Обновляем время
    if (lastUpdateEl) {
      lastUpdateEl.textContent = new Date().toLocaleTimeString('ru-RU');
    }
  }
}

// Экспорт для использования
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SEODashboard;
}
