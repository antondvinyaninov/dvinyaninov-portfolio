# Быстрый старт: Яндекс.Вебмастер API

## Шаг 1: Установка зависимостей

```bash
cd src/api
npm install dotenv
```

## Шаг 2: Получение OAuth токена

### 1. Создайте приложение

1. Откройте https://oauth.yandex.ru/
2. Нажмите "Создать приложение"
3. Выберите: **"Для доступа к API или отладки"**
4. Заполните:
   - Название: `Webmaster API`
   - Redirect URI: `https://oauth.yandex.ru/verification_code`
5. Сохраните и скопируйте **Client ID**

### 2. Получите токен

Откройте в браузере (замените YOUR_CLIENT_ID):
```
https://oauth.yandex.ru/authorize?response_type=token&client_id=YOUR_CLIENT_ID
```

После авторизации скопируйте токен из URL (между `access_token=` и `&token_type`)

### 3. Получите User ID

```bash
curl -H "Authorization: OAuth ВАШ_ТОКЕН" \
  https://api.webmaster.yandex.net/v4/user
```

Скопируйте `user_id` из ответа.

## Шаг 3: Настройка .env

Создайте файл `src/api/.env`:

```env
TELEGRAM_BOT_TOKEN=ваш_telegram_token
TELEGRAM_CHAT_ID=ваш_chat_id
YANDEX_WEBMASTER_TOKEN=ваш_yandex_token
YANDEX_USER_ID=ваш_user_id
PORT=3001
```

## Шаг 4: Запуск

### Запуск API сервера
```bash
cd src/api
npm start
```

### Запуск SEO автоматизации
```bash
cd src/api
npm run seo
```

## Что делает автоматизация?

✅ Добавляет сайт в Яндекс.Вебмастер (если еще не добавлен)
✅ Отправляет sitemap.xml
✅ Обновляет дату в sitemap
✅ Показывает статистику индексации
✅ Проверяет проблемы сайта
✅ Выводит топ-10 поисковых запросов

## Доступные API endpoints

После запуска сервера доступны:

- `GET /api/seo/sites` - список сайтов
- `GET /api/seo/sites/:hostId/stats` - статистика
- `GET /api/seo/sites/:hostId/problems` - проблемы
- `GET /api/seo/sites/:hostId/queries` - поисковые запросы
- `POST /api/seo/sites/:hostId/recrawl` - запрос переобхода

## Автоматический запуск (cron)

Добавьте в crontab для ежедневного запуска в 9:00:

```bash
0 9 * * * cd /path/to/project/src/api && npm run seo >> /var/log/seo-automation.log 2>&1
```

## Полезные команды

### Проверить статус индексации
```bash
curl http://localhost:3001/api/seo/sites/YOUR_HOST_ID/stats
```

### Запросить переобход страницы
```bash
curl -X POST http://localhost:3001/api/seo/sites/YOUR_HOST_ID/recrawl \
  -H "Content-Type: application/json" \
  -d '{"url": "https://dvinyaninov.ru/"}'
```

### Получить топ запросов
```bash
curl "http://localhost:3001/api/seo/sites/YOUR_HOST_ID/queries?limit=20"
```

## Следующие шаги

1. Настройте автоматический запуск через cron
2. Интегрируйте проверки в CI/CD
3. Добавьте уведомления о проблемах в Telegram
4. Создайте дашборд для мониторинга SEO метрик

Подробная документация: [yandex-webmaster-setup.md](./yandex-webmaster-setup.md)
