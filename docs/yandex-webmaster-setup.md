# Интеграция с Яндекс.Вебмастером

## Настройка

### 1. Получение OAuth токена

1. Перейдите на [OAuth Яндекса](https://oauth.yandex.ru/)
2. Нажмите "Зарегистрировать новое приложение"
3. Заполните форму:
   - Название: "Мой сайт - SEO"
   - Платформы: Веб-сервисы
   - Redirect URI: `https://oauth.yandex.ru/verification_code`
4. В разделе "Доступы" выберите:
   - `webmaster:read` - чтение данных
   - `webmaster:write` - изменение данных
5. Сохраните приложение и скопируйте **Client ID**
6. Получите токен по ссылке:
   ```
   https://oauth.yandex.ru/authorize?response_type=token&client_id=ВАШ_CLIENT_ID
   ```
7. Скопируйте токен из адресной строки после авторизации

### 2. Получение User ID

1. Откройте [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
2. Откройте консоль разработчика (F12)
3. Выполните в консоли:
   ```javascript
   fetch('https://api.webmaster.yandex.net/v4/user', {
     headers: { 'Authorization': 'OAuth ВАШ_ТОКЕН' }
   }).then(r => r.json()).then(console.log)
   ```
4. Скопируйте значение `user_id` из ответа

### 3. Настройка переменных окружения

Добавьте в `.env` файл:

```env
# Яндекс.Вебмастер
YANDEX_WEBMASTER_TOKEN=ваш_oauth_токен
YANDEX_USER_ID=ваш_user_id
```

## API Endpoints

### Управление сайтами

#### Получить список сайтов
```bash
GET /api/seo/sites
```

#### Добавить сайт
```bash
POST /api/seo/sites
Content-Type: application/json

{
  "hostUrl": "https://dvinyaninov.ru"
}
```

#### Получить информацию о сайте
```bash
GET /api/seo/sites/:hostId
```

### Работа с Sitemap

#### Получить список sitemap'ов
```bash
GET /api/seo/sites/:hostId/sitemaps
```

#### Добавить sitemap
```bash
POST /api/seo/sites/:hostId/sitemaps
Content-Type: application/json

{
  "sitemapUrl": "https://dvinyaninov.ru/sitemap.xml"
}
```

### Статистика и аналитика

#### Получить статистику индексации
```bash
GET /api/seo/sites/:hostId/stats
```

Возвращает:
- Количество проиндексированных страниц
- Количество страниц в очереди
- Количество исключенных страниц
- Дата последнего обхода

#### Получить проблемы сайта
```bash
GET /api/seo/sites/:hostId/problems
```

Возвращает список проблем:
- Ошибки сканирования
- Проблемы с robots.txt
- Дубли страниц
- Битые ссылки

#### Получить популярные запросы
```bash
GET /api/seo/sites/:hostId/queries?order_by=TOTAL_SHOWS&limit=100
```

Параметры:
- `order_by`: TOTAL_SHOWS, TOTAL_CLICKS, AVG_SHOW_POSITION, AVG_CLICK_POSITION
- `limit`: количество запросов (макс. 500)

#### Получить внешние ссылки
```bash
GET /api/seo/sites/:hostId/links?limit=100
```

### Переобход страниц

#### Добавить URL в очередь на переобход
```bash
POST /api/seo/sites/:hostId/recrawl
Content-Type: application/json

{
  "url": "https://dvinyaninov.ru/projects/"
}
```

Используйте для:
- Обновления контента страницы
- Исправления ошибок
- Добавления новых страниц

## Примеры использования

### Автоматическая отправка sitemap при обновлении

```javascript
// После обновления sitemap.xml
const response = await fetch('/api/seo/sites/YOUR_HOST_ID/sitemaps', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sitemapUrl: 'https://dvinyaninov.ru/sitemap.xml'
  })
});
```

### Мониторинг индексации

```javascript
// Проверка статистики
const stats = await fetch('/api/seo/sites/YOUR_HOST_ID/stats')
  .then(r => r.json());

console.log(`Проиндексировано: ${stats.data.indexed_urls_count}`);
console.log(`В очереди: ${stats.data.waiting_urls_count}`);
```

### Запрос переобхода после публикации

```javascript
// После публикации нового проекта
const newProjectUrl = 'https://dvinyaninov.ru/projects/new-project/';

await fetch('/api/seo/sites/YOUR_HOST_ID/recrawl', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ url: newProjectUrl })
});
```

## Рекомендации по SEO

### 1. Регулярная отправка sitemap
- Обновляйте sitemap при добавлении новых страниц
- Отправляйте в Яндекс.Вебмастер автоматически

### 2. Мониторинг проблем
- Проверяйте `/api/seo/sites/:hostId/problems` раз в неделю
- Исправляйте критические ошибки в первую очередь

### 3. Анализ запросов
- Изучайте популярные запросы
- Оптимизируйте контент под них

### 4. Переобход важных страниц
- После обновления контента запрашивайте переобход
- Лимит: 20 URL в день

### 5. Внешние ссылки
- Отслеживайте новые ссылки на сайт
- Анализируйте качество ссылающихся доменов

## Автоматизация

Создайте скрипт для регулярных задач:

```javascript
// scripts/seo-automation.js
const YandexWebmaster = require('../src/api/yandex-webmaster');

const client = new YandexWebmaster(
  process.env.YANDEX_WEBMASTER_TOKEN,
  process.env.YANDEX_USER_ID
);

async function dailySEOTasks(hostId) {
  // 1. Проверка статистики
  const stats = await client.getIndexingStats(hostId);
  console.log('Статистика индексации:', stats);

  // 2. Проверка проблем
  const problems = await client.getSiteProblems(hostId);
  if (problems.problems && problems.problems.length > 0) {
    console.warn('Найдены проблемы:', problems.problems);
  }

  // 3. Обновление sitemap
  const sitemaps = await client.getSitemaps(hostId);
  console.log('Sitemap статус:', sitemaps);
}

// Запускать через cron раз в день
dailySEOTasks('YOUR_HOST_ID');
```

## Ограничения API

- Максимум 10 запросов в секунду
- Максимум 10 000 запросов в день
- Переобход: 20 URL в день на сайт
- Sitemap: до 50 000 URL в одном файле

## Полезные ссылки

- [Документация API](https://yandex.ru/dev/webmaster/doc/dg/concepts/about.html)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
- [OAuth Яндекса](https://oauth.yandex.ru/)
- [Справка по Вебмастеру](https://yandex.ru/support/webmaster/)
