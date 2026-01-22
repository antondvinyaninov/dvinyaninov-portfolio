# Шаблон страницы проекта

Этот шаблон использует компонентный подход для создания страниц проектов.

## Быстрый старт

1. Скопируйте папку `_template` и переименуйте её в название вашего проекта (например: `my-project`)
2. Откройте `index.html` и настройте атрибуты компонента `<project-layout>`
3. Добавьте контент проекта внутри тега `<project-layout>`

## Атрибуты компонента project-layout

### Обязательные атрибуты:

- `project-name` - Название проекта (например: "LogoCRM")
- `project-label` - Категория проекта (например: "SaaS / Образование")
- `project-desc` - Краткое описание для hero блока

### Информационный блок:

- `project-type` - Тип проекта (например: "SaaS платформа")
- `project-client` - Заказчик (например: "Личный проект")
- `project-status` - Статус (например: "Beta-тестирование")
- `project-site` - Сайт или статус (например: "В разработке")
- `project-year` - Год (например: "2025")

### Технологии (tech-stack):

JSON массив с технологиями. Каждая технология содержит:
- `name` - Название технологии
- `icon` - URL иконки (рекомендуется использовать devicons CDN)

Пример:
```json
[
    {"name": "Laravel", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg"},
    {"name": "PostgreSQL", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"},
    {"name": "Alpine.js", "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/alpinejs/alpinejs-original.svg"}
]
```

### Навигация (navigation):

JSON массив с пунктами навигации. Каждый пункт содержит:
- `id` - ID секции (должен совпадать с id секции в HTML)
- `label` - Текст ссылки

Пример:
```json
[
    {"id": "about", "label": "О проекте"},
    {"id": "features", "label": "Возможности"},
    {"id": "screenshots", "label": "Интерфейс"},
    {"id": "roadmap", "label": "В планах"}
]
```

## Структура контента

Внутри тега `<project-layout>` добавляйте секции с контентом:

### 1. О проекте (About)
```html
<section id="about" style="margin-top: 40px;">
    <div class="section__header">
        <span class="section__number">01</span>
        <h2 class="section__title">О проекте</h2>
    </div>
    
    <div class="project-about-card">
        <p><strong>Название</strong> — описание</p>
    </div>
</section>
```

### 2. Возможности (Features)
```html
<section id="features" style="margin-top: 120px;">
    <div class="section__header">
        <span class="section__number">02</span>
        <h2 class="section__title">Возможности</h2>
    </div>
    
    <div class="features-grid">
        <div class="feature-card">
            <h3 class="feature-card__title">Название</h3>
            <ul class="feature-card__list">
                <li>Функция 1</li>
            </ul>
        </div>
    </div>
</section>
```

### 3. Интерфейс (Screenshots)
```html
<section id="screenshots" style="margin-top: 120px;">
    <div class="section__header">
        <span class="section__number">03</span>
        <h2 class="section__title">Интерфейс</h2>
    </div>
    
    <div class="screenshots-grid">
        <!-- Карточки скриншотов -->
    </div>
</section>
```

### 4. Целевая аудитория
```html
<div class="audience-grid">
    <div class="audience-card">
        <div class="audience-card__number">01</div>
        <h4 class="audience-card__title">Название</h4>
        <p class="audience-card__desc">Описание</p>
    </div>
</div>
```

### 5. Roadmap / В планах
```html
<section id="roadmap" style="margin-top: 120px;">
    <div class="section__header">
        <span class="section__number">04</span>
        <h2 class="section__title">В планах</h2>
    </div>
    
    <div class="roadmap-grid">
        <div class="roadmap-card roadmap-card--progress">
            <h3 class="roadmap-title">🚧 В разработке</h3>
            <ul class="roadmap-list">
                <li>• Функция 1</li>
            </ul>
        </div>
    </div>
</section>
```

### 6. Форма заявки
```html
<section id="beta" style="margin-top: 120px;">
    <div class="section__header">
        <span class="section__number">05</span>
        <h2 class="section__title">Заявка на тестирование</h2>
    </div>
    
    <div class="beta-form-container">
        <p class="beta-form-intro">Текст приглашения</p>
        
        <form id="betaForm" class="beta-form">
            <!-- Поля формы -->
        </form>
    </div>
</section>
```

## Доступные CSS классы

### Карточки:
- `.project-about-card` - Карточка с текстом
- `.audience-card` - Карточка целевой аудитории
- `.feature-card` - Карточка возможности
- `.screenshot-card` - Карточка скриншота
- `.roadmap-card` - Карточка roadmap

### Модификаторы:
- `.screenshot-card--large` - Большая карточка (2x2)
- `.screenshot-card--wide` - Широкая карточка (2x1)
- `.roadmap-card--progress` - В разработке (желтая полоска)
- `.roadmap-card--planned` - Планируется (синяя полоска)

### Градиенты для скриншотов:
- `.screenshot-gradient--purple`
- `.screenshot-gradient--blue`
- `.screenshot-gradient--green`
- `.screenshot-gradient--orange`
- `.screenshot-gradient--yellow`
- `.screenshot-gradient--indigo`

## Пример использования

Смотрите `projects/logocrm/index.html` для полного примера реализации.

## SEO

Не забудьте обновить:
- `<title>` - Название проекта
- `<meta name="description">` - Описание для поисковиков
- Хлебные крошки автоматически генерируются компонентом

## Адаптивность

Все компоненты адаптивны и корректно отображаются на мобильных устройствах.
