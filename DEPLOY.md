# Инструкция по деплою сайта

## Что готово к деплою

✅ Все файлы оптимизированы  
✅ Применены государственные стандарты дизайна  
✅ Цветовая схема: синий акцент (#0D4CD3)  
✅ Lazy load для быстрой загрузки  
✅ Отложенная загрузка метрики и чата  
✅ SEO оптимизация  

## Файлы для загрузки на сервер

Загрузи все файлы и папки на сервер:

```
/
├── index.html
├── seo-dashboard.html
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── logo.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── site.webmanifest
├── src/
│   ├── api/
│   ├── assets/
│   ├── css/
│   ├── fonts/
│   └── js/
├── projects/
│   ├── index.html
│   ├── logocrm/
│   ├── zooplatforma/
│   ├── stranicy-pamyati/
│   └── karty-pomoshchi/
└── docs/
```

## Проверка перед деплоем

1. **Проверь robots.txt** - убедись что пути правильные
2. **Проверь sitemap.xml** - обнови даты если нужно
3. **Проверь Yandex.Metrika ID** - сейчас стоит `70314580`
4. **Проверь JivoSite ID** - сейчас стоит `TFV7onkuoN`

## После деплоя

1. Открой сайт в браузере - все должно работать без ошибок
2. Проверь Google PageSpeed Insights
3. Проверь мобильную версию
4. Отправь sitemap в Yandex.Webmaster и Google Search Console

## Оптимизация на сервере (опционально)

### Nginx конфигурация для кеширования

```nginx
# Кеширование статики
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Gzip сжатие
gzip on;
gzip_types text/css application/javascript image/svg+xml;
gzip_min_length 1000;
```

### Apache .htaccess для кеширования

```apache
# Кеширование статики
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Gzip сжатие
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/css application/javascript image/svg+xml
</IfModule>
```

## Проблемы и решения

### Ошибки CORS с шрифтами
Если видишь ошибки CORS - это нормально при открытии через `file://`. На сервере их не будет.

### Медленная загрузка
- Проверь что включено gzip сжатие
- Проверь что работает кеширование
- Используй CDN для статики (опционально)

## Контакты

Если что-то не работает - пиши!
