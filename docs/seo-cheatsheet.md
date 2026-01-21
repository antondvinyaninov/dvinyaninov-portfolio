# SEO Шпаргалка - Быстрые команды

## 🚀 Быстрый старт

```bash
# 1. Установка
cd src/api && npm install dotenv

# 2. Настройка .env
cp .env.example .env
# Заполните YANDEX_WEBMASTER_TOKEN и YANDEX_USER_ID

# 3. Запуск
npm start                # API сервер
npm run seo              # SEO автоматизация
```

## 📊 API Команды

### Получить список сайтов
```bash
curl http://localhost:3001/api/seo/sites
```

### Добавить сайт
```bash
curl -X POST http://localhost:3001/api/seo/sites \
  -H "Content-Type: application/json" \
  -d '{"hostUrl": "https://dvinyaninov.ru"}'
```

### Статистика индексации
```bash
curl http://localhost:3001/api/seo/sites/YOUR_HOST_ID/stats
```

### Проблемы сайта
```bash
curl http://localhost:3001/api/seo/sites/YOUR_HOST_ID/problems
```

### Топ запросов
```bash
curl "http://localhost:3001/api/seo/sites/YOUR_HOST_ID/queries?limit=20"
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
  -d '{"url": "https://dvinyaninov.ru/"}'
```

## 🔧 Получение токенов

### OAuth токен Яндекса
```
1. https://oauth.yandex.ru/
2. Создать приложение
3. Права: webmaster:read, webmaster:write
4. https://oauth.yandex.ru/authorize?response_type=token&client_id=YOUR_CLIENT_ID
```

### User ID
```javascript
// В консоли браузера на webmaster.yandex.ru
fetch('https://api.webmaster.yandex.net/v4/user', {
  headers: { 'Authorization': 'OAuth YOUR_TOKEN' }
}).then(r => r.json()).then(d => console.log(d.user_id))
```

### Host ID
```bash
# После добавления сайта
curl http://localhost:3001/api/seo/sites | grep host_id
```

## ⏰ Автоматизация (cron)

### Ежедневный запуск в 9:00
```bash
crontab -e

# Добавить строку:
0 9 * * * cd /path/to/project/src/api && npm run seo >> /var/log/seo.log 2>&1
```

### Просмотр логов
```bash
tail -f /var/log/seo.log
```

## 🎯 Типичные задачи

### Первая настройка
```bash
# 1. Получить токены (см. выше)
# 2. Настроить .env
# 3. Запустить автоматизацию
cd src/api && npm run seo
```

### После добавления новой страницы
```bash
# 1. Обновить sitemap.xml
# 2. Запросить переобход
curl -X POST http://localhost:3001/api/seo/sites/HOST_ID/recrawl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://dvinyaninov.ru/new-page/"}'
```

### Проверка индексации
```bash
# Быстрая проверка
curl http://localhost:3001/api/seo/sites/HOST_ID/stats | jq

# Полный отчет
cd src/api && npm run seo
```

### Мониторинг проблем
```bash
# Проверить проблемы
curl http://localhost:3001/api/seo/sites/HOST_ID/problems | jq '.data.problems'

# Получить уведомление в Telegram
cd src/api && npm run seo
```

## 📱 Telegram уведомления

### Включить уведомления
```bash
# В .env добавить:
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Типы уведомлений
- ✅ Ежедневный отчет (статистика + проблемы + запросы)
- ⚠️ Критические проблемы
- 🎉 Добавление нового сайта

## 🌐 Дашборд

### Настройка
```javascript
// В seo-dashboard.html изменить:
const HOST_ID = 'YOUR_HOST_ID';
```

### Открыть
```bash
# Запустить API сервер
cd src/api && npm start

# Открыть в браузере
open seo-dashboard.html
```

## 🔍 Отладка

### Проверка API сервера
```bash
curl http://localhost:3001/health
# Ответ: {"status":"ok"}
```

### Проверка токенов
```bash
# Проверить OAuth токен
curl https://api.webmaster.yandex.net/v4/user \
  -H "Authorization: OAuth YOUR_TOKEN"
```

### Логи сервера
```bash
# Запустить с логами
cd src/api && DEBUG=* npm start
```

## 📈 Лимиты API

- **Запросы:** 10 req/sec, 10,000 req/day
- **Переобход:** 20 URL/day на сайт
- **Sitemap:** до 50,000 URL в файле

## 🔗 Полезные ссылки

- [Быстрый старт](./seo-quickstart.md)
- [Подробная документация](./yandex-webmaster-setup.md)
- [API README](../src/api/README.md)
- [Яндекс.Вебмастер](https://webmaster.yandex.ru/)
- [API Документация](https://yandex.ru/dev/webmaster/doc/dg/concepts/about.html)

## 💡 Советы

1. **Запускайте автоматизацию ежедневно** через cron
2. **Следите за проблемами** и исправляйте их сразу
3. **Анализируйте запросы** для оптимизации контента
4. **Обновляйте sitemap** при добавлении страниц
5. **Используйте переобход** после важных изменений (лимит!)
6. **Мониторьте дашборд** для быстрой реакции на проблемы
7. **Настройте Telegram** для получения уведомлений

## ⚠️ Частые ошибки

### "Не настроены переменные окружения"
→ Проверьте `.env` файл

### "quota exceeded"
→ Достигнут лимит переобходов (20/день)

### "Unauthorized"
→ Проверьте OAuth токен

### "Host not found"
→ Проверьте Host ID

### Нет данных по запросам
→ Подождите несколько дней после добавления сайта
