# SEO разметка в проектах

## Что добавлено

✅ **Open Graph** - для соцсетей (Facebook, VK, LinkedIn)  
✅ **Twitter Cards** - для Twitter/X  
✅ **Schema.org** - для поисковиков  
✅ **Meta keywords** - ключевые слова  
✅ **Canonical URL** - канонический адрес  

## Как использовать

### В MD файле проекта

Добавь секцию `seo` в frontmatter:

```yaml
---
title: "Название проекта"
description: "Описание проекта"
# ... другие поля

seo:
  ogImage: "/logo.svg"                    # Картинка для соцсетей
  ogType: "article"                       # Тип контента (article/website)
  twitterCard: "summary_large_image"      # Тип Twitter карточки
  keywords:                               # Ключевые слова
    - "ключевое слово 1"
    - "ключевое слово 2"
    - "ключевое слово 3"
  author: "Антон Двинянинов"              # Автор
  canonical: "https://site.ru/project/"   # Канонический URL
---
```

### Все поля опциональные

Если не указать `seo` блок, будут использованы значения по умолчанию:

- `ogImage`: `/logo.svg`
- `ogType`: `article` (для проектов) или `website` (для главной)
- `twitterCard`: `summary_large_image`
- `keywords`: `[]` (пустой массив)
- `author`: `Антон Двинянинов`
- `canonical`: текущий URL страницы

## Что генерируется в HTML

### Open Graph теги
```html
<meta property="og:type" content="article">
<meta property="og:title" content="LogoCRM">
<meta property="og:description" content="...">
<meta property="og:url" content="https://...">
<meta property="og:image" content="/logo.svg">
<meta property="og:site_name" content="Антон Двинянинов">
<meta property="og:locale" content="ru_RU">
```

### Twitter Card теги
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="LogoCRM">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="/logo.svg">
```

### Schema.org JSON-LD
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "LogoCRM",
  "description": "...",
  "url": "https://...",
  "author": {
    "@type": "Person",
    "name": "Антон Двинянинов"
  }
}
</script>
```

### Meta теги
```html
<meta name="keywords" content="LogoCRM, CRM для логопедов, ...">
<meta name="author" content="Антон Двинянинов">
<link rel="canonical" href="https://...">
```

## Примеры

### Минимальный вариант
```yaml
seo:
  keywords:
    - "React"
    - "Node.js"
```

### Полный вариант
```yaml
seo:
  ogImage: "/projects/logocrm-preview.jpg"
  ogType: "article"
  twitterCard: "summary_large_image"
  keywords:
    - "LogoCRM"
    - "CRM для логопедов"
    - "управление логопедическим центром"
    - "SaaS для образования"
    - "автоматизация логопедии"
    - "Laravel"
    - "PostgreSQL"
  author: "Антон Двинянинов"
  canonical: "https://dvinyaninov.ru/projects/logocrm/"
```

### Без SEO блока
```yaml
# Просто не указывай seo блок
# Будут использованы значения по умолчанию
```

## Рекомендации

### Ключевые слова
- 5-10 ключевых слов
- Название проекта
- Технологии
- Тип проекта
- Целевая аудитория

### OG Image
- Размер: 1200x630px (оптимально)
- Формат: JPG или PNG
- Вес: до 1MB
- Положи в `/public/projects/`

### Canonical URL
- Полный URL с https://
- Без параметров и якорей
- Указывай только если есть дубли страницы

## Проверка SEO

### Инструменты
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

### Проверь в коде
```bash
# Собери проект
npm run build

# Открой HTML файл
cat dist/projects/logocrm/index.html | grep "og:"
cat dist/projects/logocrm/index.html | grep "twitter:"
cat dist/projects/logocrm/index.html | grep "application/ld+json"
```

## Преимущества

✅ **Лучше в поиске** - Schema.org помогает Google понять контент  
✅ **Красивые превью** - Open Graph для соцсетей  
✅ **Больше кликов** - привлекательные карточки в Twitter  
✅ **SEO оптимизация** - keywords и canonical URL  
✅ **Легко управлять** - все в MD файле  

---

**Теперь каждый проект имеет полную SEO разметку!** 🚀
