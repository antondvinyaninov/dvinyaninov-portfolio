# 🚀 Руководство по оптимизации производительности

Этот документ содержит проверенные принципы оптимизации, которые позволили достичь **98-100 баллов PageSpeed** на всех страницах сайта.

---

## 📸 ИЗОБРАЖЕНИЯ

### Формат
- ✅ **Только WebP** для всех изображений на сайте
- ❌ Никогда PNG/JPG для веба
- **Качество:** 85 для скриншотов, 80-85 для фотографий
- **Конвертация:** `cwebp -q 85 input.png -o output.webp`

### Обязательные атрибуты
```html
<img 
    src="/path/to/image.webp"
    alt="Описание изображения"
    width="800"
    height="600"
    loading="lazy"
    decoding="async"
/>
```

### Lazy Loading стратегия
- **Первое изображение (above-the-fold):**
  ```html
  <img 
      src="/images/hero.webp"
      loading="eager"
      fetchpriority="high"
      width="800"
      height="600"
  />
  ```

- **Остальные изображения:**
  ```html
  <img 
      src="/images/content.webp"
      loading="lazy"
      decoding="async"
      width="800"
      height="600"
  />
  ```

### Размеры (width/height)
- ⚠️ **КРИТИЧНО:** Всегда указывать `width` и `height`
- Предотвращает CLS (Cumulative Layout Shift)
- Браузер резервирует место до загрузки изображения

---

## 🎨 CSS

### Критичные стили
```html
<head>
    <!-- Inline критичные шрифты -->
    <style>
        @font-face {
            font-family: 'Space Grotesk';
            src: url('/fonts/space-grotesk-600.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'Space Grotesk';
            src: url('/fonts/space-grotesk-700.woff2') format('woff2');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
        }
        @font-face {
            font-family: 'Space Grotesk';
            src: url('/fonts/space-grotesk-400.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
        }
    </style>
</head>
```

### Загрузка CSS
- **global.css:** Синхронная загрузка (стабильность, предотвращает FOUC)
  ```html
  <link rel="stylesheet" href="/styles/global.css">
  ```

- **Дополнительные стили:** Через named slot в BaseLayout
  ```html
  <link rel="preload" href="/styles/project-page.css" as="style" slot="head">
  <link rel="stylesheet" href="/styles/project-page.css" slot="head">
  ```

- **Некритичные стили:** Async загрузка
  ```html
  <link rel="preload" href="/fonts/fonts.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/fonts/fonts.css"></noscript>
  ```

### ❌ Чего избегать
- Async загрузка критичного CSS (вызывает FOUC - Flash of Unstyled Content)
- Блокирующие запросы для некритичных стилей

---

## ⚡ JAVASCRIPT

### Оптимизация навигации
✅ **Используй IntersectionObserver:**
```javascript
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));
```

❌ **Не используй scroll events с getBoundingClientRect():**
```javascript
// ❌ ПЛОХО - вызывает forced reflow
window.addEventListener('scroll', () => {
    sections.forEach(section => {
        const rect = section.getBoundingClientRect(); // forced reflow!
        // ...
    });
});
```

### Отложенная загрузка скриптов
```javascript
function loadGTM() {
    if (window.gtmLoaded) return;
    window.gtmLoaded = true;
    
    // Загрузка GTM
    (function(w,d,s,l,i){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;
        j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-NTP4Z73');
}

// Загружаем при первом взаимодействии
['mousedown', 'touchstart', 'keydown', 'scroll'].forEach(function(event) {
    window.addEventListener(event, loadGTM, { once: true, passive: true });
});

// Или через 3 секунды если нет взаимодействия
setTimeout(loadGTM, 3000);
```

### Defer для скриптов
```html
<script src="/scripts/main.js" is:inline defer></script>
<script src="/scripts/telegram-forms.js" is:inline defer></script>
```

---

## 🔤 ШРИФТЫ

### Полная структура
```html
<head>
    <!-- Preload критичных шрифтов -->
    <link rel="preload" href="/fonts/space-grotesk-700.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/space-grotesk-600.woff2" as="font" type="font/woff2" crossorigin>
    
    <!-- Inline критичные веса (400, 600, 700) -->
    <style>
        @font-face {
            font-family: 'Space Grotesk';
            src: url('/fonts/space-grotesk-600.woff2') format('woff2');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
        }
        /* ... остальные веса ... */
    </style>
    
    <!-- Async загрузка остальных весов -->
    <link rel="preload" href="/fonts/fonts.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="/fonts/fonts.css"></noscript>
</head>
```

### Правила
- **Inline:** Только критичные веса (400, 600, 700)
- **Preload:** Только для inline шрифтов
- **font-display: swap** - всегда
- **Async:** Остальные веса через fonts.css

---

## 🎯 ЦЕЛЕВЫЕ МЕТРИКИ

### Обязательные показатели

| Метрика | Мобильный | Десктопный |
|---------|-----------|------------|
| **FCP** (First Contentful Paint) | < 1.8s | < 0.6s |
| **LCP** (Largest Contentful Paint) | < 2.5s | < 1.2s |
| **TBT** (Total Blocking Time) | < 200ms | < 150ms |
| **CLS** (Cumulative Layout Shift) | 0 | 0 |
| **Speed Index** | < 3.5s | < 1.8s |

### PageSpeed Score
- 🎯 **Цель:** 95+ на всех страницах
- 🏆 **Достигнуто:** 98-100 на всех страницах

---

## 📋 ЧЕК-ЛИСТ ДЛЯ НОВОЙ СТРАНИЦЫ

Перед деплоем новой страницы проверь:

- [ ] Все изображения конвертированы в WebP
- [ ] У всех изображений указаны width и height
- [ ] Первое изображение: loading="eager" + fetchpriority="high"
- [ ] Остальные изображения: loading="lazy"
- [ ] Inline шрифты (400, 600, 700) в head
- [ ] Preload для критичных шрифтов
- [ ] IntersectionObserver для навигации (если есть)
- [ ] Отложенная загрузка GTM/аналитики
- [ ] Defer для всех скриптов
- [ ] Preload для критичных ресурсов
- [ ] CLS = 0 (проверить в DevTools)
- [ ] PageSpeed тест: 95+ (мобильный и десктоп)

---

## 🚫 ЧЕГО ИЗБЕГАТЬ

### Изображения
- ❌ PNG/JPG для веба (только WebP)
- ❌ Изображения без width/height (вызывает CLS)
- ❌ Все изображения с loading="eager"
- ❌ Забывать про fetchpriority="high" для LCP элемента

### JavaScript
- ❌ `getBoundingClientRect()` в scroll handlers
- ❌ Синхронная загрузка тяжелых скриптов (GTM, аналитика)
- ❌ Scroll events вместо IntersectionObserver
- ❌ Блокирующие скрипты без defer

### CSS
- ❌ Async загрузка критичного CSS (вызывает FOUC)
- ❌ Блокирующие запросы для некритичных стилей
- ❌ Забывать про font-display: swap

---

## 📊 РЕЗУЛЬТАТЫ ОПТИМИЗАЦИИ

### До оптимизации
- Главная (мобильный): 91
- Главная (десктопный): 72
- Проекты (мобильный): 62
- Проекты (десктопный): 64

### После оптимизации
- Главная (мобильный): **98** (+7)
- Главная (десктопный): **98** (+26)
- Проекты (мобильный): **99** (+37)
- Проекты (десктопный): **100** (+36)

### Ключевые улучшения
1. ✅ PNG → WebP: 15.8 MB → 1.4 MB (91% экономия)
2. ✅ Inline шрифты: устранены блокирующие запросы
3. ✅ IntersectionObserver: TBT 290ms → 0ms
4. ✅ Отложенная загрузка GTM: TBT 550ms → 0ms
5. ✅ Width/height для изображений: CLS 1.062 → 0

---

## 🔧 ИНСТРУМЕНТЫ

### Конвертация изображений
```bash
# Одно изображение
cwebp -q 85 input.png -o output.webp

# Массовая конвертация
for file in *.png; do cwebp -q 85 "$file" -o "${file%.png}.webp"; done
```

### Проверка производительности
- [PageSpeed Insights](https://pagespeed.web.dev/)
- Chrome DevTools → Lighthouse
- Chrome DevTools → Performance (для CLS)

### Мониторинг
- Google Search Console (Core Web Vitals)
- GTM + GA4 (Web Vitals events)

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

- [Web.dev - Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Image Optimization](https://web.dev/fast/#optimize-your-images)
- [JavaScript Performance](https://web.dev/fast/#optimize-your-javascript)

---

**Последнее обновление:** 26 января 2025  
**Статус:** Все страницы оптимизированы ✅  
**PageSpeed Score:** 98-100 на всех страницах 🏆
