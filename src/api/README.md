# API Сервер

Сервер для работы с Telegram Bot API и Яндекс.Вебмастером.

## Структура файлов

```
src/api/
├── api.js                      # Основной сервер Express
├── yandex-webmaster.js         # Клиент для API Яндекс.Вебмастера
├── seo-routes.js               # REST API endpoints для SEO
├── seo-automation.js           # Скрипт автоматизации SEO задач
├── seo-telegram-notifier.js    # Уведомления в Telegram
├── api-package.json            # Зависимости проекта
├── .env.example                # Пример конфигурации
└── README.md                   # Эта документация
```

## Возможности

### Telegram Bot
- ✅ Отправка сообщений из контактной формы
- ✅ Двусторонний чат с клиентами
- ✅ Уведомления о новых заявках

### Яндекс.Вебмастер
- ✅ Автоматическое добавление сайта
- ✅ Управление sitemap.xml
- ✅ Статистика индексации
- ✅ Мониторинг проблем сайта
- ✅ Анализ поисковых запросов
- ✅ Запрос переобхода страниц
- ✅ Ежедневные отчеты в Telegram

## Быстрый старт

### 1. Установка

```bash
cd src/api
npm install
```

### 2. Настройка

Скопируйте `.env.example` в `.env` и заполните:

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# Яндекс.Вебмастер
YANDEX_WEBMASTER_TOKEN=your_oauth_token
YANDEX_USER_ID=your_user_id

# Server
PORT=3001
```

Инструкции по получению токенов: [docs/seo-quickstart.md](../../docs/seo-quickstart.md)

### 3. Запуск

```bash
# Запуск API сервера
npm start

# Запуск SEO автоматизации
npm run seo
```

## API Endpoints

### Telegram

```bash
# Отправить сообщение
POST /send-message
POST /api/contact

# Получить новые сообщения
GET /get-messages?userId=123
```

### SEO (Яндекс.Вебмастер)

```bash
# Сайты
GET  /api/seo/sites              # Список сайтов
POST /api/seo/sites              # Добавить сайт
GET  /api/seo/sites/:hostId      # Информация о сайте

# Статистика
GET  /api/seo/sites/:hostId/stats     # Статистика индексации
GET  /api/seo/sites/:hostId/problems  # Проблемы сайта
GET  /api/seo/sites/:hostId/queries   # Поисковые запросы
GET  /api/seo/sites/:hostId/links     # Внешние ссылки

# Sitemap
GET  /api/seo/sites/:hostId/sitemaps  # Список sitemap
POST /api/seo/sites/:hostId/sitemaps  # Добавить sitemap

# Переобход
POST /api/seo/sites/:hostId/recrawl   # Запросить переобход
```

## Автоматизация

### Ежедневный запуск через cron

```bash
# Редактировать crontab
crontab -e

# Добавить строку (запуск каждый день в 9:00)
0 9 * * * cd /path/to/project/src/api && npm run seo >> /var/log/seo.log 2>&1
```

### Что делает автоматизация?

1. ✅ Проверяет наличие сайта в Вебмастере
2. ✅ Добавляет/обновляет sitemap.xml
3. ✅ Обновляет дату в sitemap файле
4. ✅ Собирает статистику индексации
5. ✅ Проверяет проблемы сайта
6. ✅ Анализирует топ поисковых запросов
7. ✅ Отправляет ежедневный отчет в Telegram

## Примеры использования

### Проверить статистику

```bash
curl http://localhost:3001/api/seo/sites/YOUR_HOST_ID/stats
```

### Добавить sitemap

```bash
curl -X POST http://localhost:3001/api/seo/sites/YOUR_HOST_ID/sitemaps \
  -H "Content-Type: application/json" \
  -d '{"sitemapUrl": "https://dvinyaninov.ru/sitemap.xml"}'
```

### Запросить переобход

```bash
curl -X POST http://localhost:3001/api/seo/sites/YOUR_HOST_ID/recrawl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://dvinyaninov.ru/projects/"}'
```

### Получить топ запросов

```bash
curl "http://localhost:3001/api/seo/sites/YOUR_HOST_ID/queries?limit=20&order_by=TOTAL_SHOWS"
```

## Интеграция с фронтендом

### Отправка формы

```javascript
const response = await fetch('http://localhost:3001/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Иван',
    contact: 'ivan@example.com',
    message: 'Хочу заказать сайт'
  })
});

const result = await response.json();
console.log(result.success); // true
```

### Получение SEO статистики

```javascript
const stats = await fetch('http://localhost:3001/api/seo/sites/YOUR_HOST_ID/stats')
  .then(r => r.json());

console.log(`Проиндексировано: ${stats.data.indexed_urls_count} страниц`);
```

## Мониторинг

### Проверка работы сервера

```bash
curl http://localhost:3001/health
# Ответ: {"status":"ok"}
```

### Логи

```bash
# Просмотр логов автоматизации
tail -f /var/log/seo.log

# Просмотр логов сервера
pm2 logs api
```

## Рекомендации

### SEO оптимизация

1. **Запускайте автоматизацию ежедневно** - для актуальной статистики
2. **Следите за проблемами** - исправляйте критические ошибки сразу
3. **Анализируйте запросы** - оптимизируйте контент под популярные запросы
4. **Обновляйте sitemap** - при добавлении новых страниц
5. **Запрашивайте переобход** - после важных изменений (лимит 20 URL/день)

### Безопасность

- ⚠️ Не коммитьте `.env` файл в git
- ⚠️ Используйте HTTPS для production
- ⚠️ Ограничьте доступ к API endpoints
- ⚠️ Регулярно обновляйте зависимости

## Troubleshooting

### Ошибка "Не настроены переменные окружения"

Проверьте наличие `.env` файла и правильность токенов.

### Ошибка "quota exceeded"

Достигнут лимит переобходов (20 URL/день). Попробуйте завтра.

### Нет данных по запросам

Данные появляются через несколько дней после добавления сайта.

### Сайт не индексируется

1. Проверьте robots.txt
2. Убедитесь что sitemap добавлен
3. Проверьте проблемы через `/api/seo/sites/:hostId/problems`

## Полезные ссылки

- [Документация API Яндекс.Вебмастера](https://yandex.ru/dev/webmaster/doc/dg/concepts/about.html)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Быстрый старт](../../docs/seo-quickstart.md)
- [Подробная документация](../../docs/yandex-webmaster-setup.md)

## Поддержка

При возникновении проблем:
1. Проверьте логи
2. Убедитесь в правильности токенов
3. Проверьте лимиты API
4. Изучите документацию Яндекс.Вебмастера
