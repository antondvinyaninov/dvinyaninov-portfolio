# Telegram API для портфолио

API для отправки сообщений с сайта в Telegram.

## Деплой на Easypanel

1. Открой Easypanel: http://88.218.121.213:3000
2. Создай новый App → "From GitHub"
3. Выбери репозиторий `dvinyaninov-portfolio`
4. Укажи путь к Dockerfile: `telegram-api/Dockerfile`
5. Добавь переменные окружения:
   - `TELEGRAM_BOT_TOKEN` = `8206442500:AAFWYIMDy-i7-PC7cQwPmK_dRoATVU9YLEs`
   - `TELEGRAM_CHAT_ID` = `273773467`
   - `PORT` = `3001`
6. Настрой домен (например: `telegram-api.crv1ic.easypanel.host`)
7. Deploy!

## Использование

После деплоя обнови `script.js` на сайте:

```javascript
// Замени URL на твой домен API
const response = await fetch('https://telegram-api.crv1ic.easypanel.host/send-message', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, name, email })
});
```

## Endpoints

- `POST /send-message` - отправить сообщение
- `GET /health` - проверка работоспособности
