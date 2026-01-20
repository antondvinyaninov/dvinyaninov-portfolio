# Stage 1: Build Node.js API
FROM node:18-alpine AS api-builder

WORKDIR /api
COPY telegram-api/package*.json ./
RUN npm install --production
COPY telegram-api/ ./

# Stage 2: Final image with nginx and Node.js
FROM node:18-alpine

# Установка nginx и supervisor
RUN apk add --no-cache nginx supervisor

# Копируем API
WORKDIR /app/api
COPY --from=api-builder /api ./

# Копируем статические файлы
WORKDIR /usr/share/nginx/html
COPY index.html styles.css script.js photo.jpg ./

# Настройка nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Создаем директорию для логов nginx
RUN mkdir -p /run/nginx

# Настройка supervisor для запуска nginx и Node.js
RUN mkdir -p /etc/supervisor.d
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
