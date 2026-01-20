# Портфолио Антона Двинянинова

Современное портфолио с интерактивными элементами и интеграцией с Telegram.

## 🚀 Технологии

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **Deployment:** Easypanel (Docker)
- **Интеграции:** Telegram Bot API

## 📁 Структура проекта

```
.
├── config/               # Конфигурационные файлы
│   ├── Dockerfile        # Docker конфигурация
│   ├── .dockerignore     # Исключения для Docker
│   ├── nginx.conf        # Nginx конфигурация
│   └── supervisord.conf  # Supervisor конфигурация
├── src/
│   ├── api/              # Backend API
│   │   ├── api.js        # Express сервер
│   │   └── api-package.json
│   ├── assets/           # Изображения и медиа
│   │   └── photo.jpg
│   ├── css/              # Стили
│   │   └── styles.css
│   └── js/               # JavaScript
│       └── script.js
├── docs/                 # Документация (не в Git)
├── index.html            # Главная страница
└── README.md             # Документация
```

## 🛠 Локальная разработка

1. Открой `index.html` в браузере
2. Для тестирования API запусти:
   ```bash
   cd src/api
   npm install
   TELEGRAM_BOT_TOKEN=your_token TELEGRAM_CHAT_ID=your_id node api.js
   ```

## 🌐 Деплой

Проект автоматически деплоится на Easypanel при push в `main` ветку.

**URL:** https://dvinyaninov.ru

## 📝 Переменные окружения

- `TELEGRAM_BOT_TOKEN` - токен Telegram бота
- `TELEGRAM_CHAT_ID` - ID чата для получения сообщений

## 📧 Контакты

- Email: anton@dvinyaninov.ru
- Telegram: @dvinyaninov
- GitHub: github.com/antondvinyaninov
