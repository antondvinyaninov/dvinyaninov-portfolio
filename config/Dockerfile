# Build Node.js API and serve static files with nginx
FROM node:18-alpine

# Установка nginx и supervisor
RUN apk add --no-cache nginx supervisor

# Копируем и устанавливаем зависимости API
WORKDIR /app/api
COPY src/api/api-package.json package.json
RUN npm install --production
COPY src/api/api.js index.js

# Копируем статические файлы
WORKDIR /usr/share/nginx/html
COPY index.html ./
COPY logo.svg ./
COPY favicon.ico ./
COPY yandex_150fb61c0511a5cb.html ./
COPY src/css/styles.css ./src/css/
COPY src/js/script.js ./src/js/
COPY src/assets/photo.jpg ./src/assets/

# Настройка nginx
COPY config/nginx.conf /etc/nginx/http.d/default.conf

# Создаем директорию для логов nginx
RUN mkdir -p /run/nginx

# Настройка supervisor для запуска nginx и Node.js
COPY config/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
