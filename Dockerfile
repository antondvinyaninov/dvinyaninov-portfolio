# Build Node.js API and serve static files with nginx
FROM node:18-alpine

# Установка nginx и supervisor
RUN apk add --no-cache nginx supervisor

# Копируем и устанавливаем зависимости API
WORKDIR /app/api
COPY api-package.json package.json
RUN npm install --production
COPY api.js index.js

# Копируем статические файлы
WORKDIR /usr/share/nginx/html
COPY index.html styles.css script.js photo.jpg ./

# Настройка nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Создаем директорию для логов nginx
RUN mkdir -p /run/nginx

# Настройка supervisor для запуска nginx и Node.js
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
