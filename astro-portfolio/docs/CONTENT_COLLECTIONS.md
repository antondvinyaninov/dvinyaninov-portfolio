# Content Collections - Управление проектами

## Что это?

Content Collections — это встроенная в Astro система для управления контентом. Все проекты теперь хранятся в виде Markdown файлов в папке `src/content/projects/`.

## Преимущества

✅ **Легко редактировать** - просто открываете `.md` файл и меняете текст  
✅ **Type-safe** - TypeScript проверяет структуру данных  
✅ **Валидация** - автоматическая проверка обязательных полей  
✅ **Markdown** - удобный формат для текста  
✅ **Централизация** - все данные проекта в одном месте  

## Структура

```
src/content/
├── config.ts              # Схема данных (не трогать)
└── projects/              # Папка с проектами
    ├── README.md          # Инструкция
    ├── logocrm.md         # Проект LogoCRM
    ├── zooplatforma.md    # Проект Зооплатформа
    ├── stranicy-pamyati.md
    └── karty-pomoshchi.md
```

## Как редактировать проект

### 1. Откройте файл проекта

Например, `src/content/projects/logocrm.md`

### 2. Измените метаданные (frontmatter)

```yaml
---
title: "Новое название для SEO"
projectName: "Новое название"
projectYear: "2026"
# и т.д.
---
```

### 3. Измените контент

```markdown
## О проекте

Новое описание проекта...

### Для кого

**Новая аудитория**  
Описание новой аудитории
```

### 4. Сохраните и проверьте

```bash
npm run dev
```

Откройте http://localhost:4321/projects/logocrm/

## Как добавить новый проект

### Шаг 1: Создайте MD файл

Создайте `src/content/projects/my-project.md`:

```markdown
---
title: "Мой проект | Антон Двинянинов"
description: "Описание для SEO"
projectName: "Мой проект"
projectLabel: "Категория"
projectDesc: "Краткое описание проекта"
projectType: "Тип"
projectClient: "Заказчик"
projectStatus: "Статус"
projectSite: "Ссылка"
projectYear: "2025"
order: 5
featured: true
techStack:
  - name: "React"
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
navigation:
  - id: "about"
    label: "О проекте"
  - id: "features"
    label: "Возможности"
---

## О проекте

Описание проекта...

## Возможности

### Функция 1
- Пункт 1
- Пункт 2
```

### Шаг 2: Создайте страницу

Создайте `src/pages/projects/my-project.astro`:

```astro
---
import { getEntry } from 'astro:content';
import ProjectLayout from '../../layouts/ProjectLayout.astro';

const project = await getEntry('projects', 'my-project');
const { Content } = await project.render();
const { title, description, projectName, projectLabel, projectDesc, projectType, projectClient, projectStatus, projectSite, projectYear, techStack, navigation } = project.data;
---

<ProjectLayout
    title={title}
    description={description}
    projectName={projectName}
    projectLabel={projectLabel}
    projectDesc={projectDesc}
    projectType={projectType}
    projectClient={projectClient}
    projectStatus={projectStatus}
    projectSite={projectSite}
    projectYear={projectYear}
    techStack={techStack}
    navigation={navigation}
>
    <!-- Скопируйте структуру секций из logocrm.astro -->
</ProjectLayout>
```

### Шаг 3: Добавьте на главную

Откройте `src/pages/index.astro` и добавьте карточку проекта в секцию `#work`.

## Поля проекта

### Обязательные поля

| Поле | Тип | Описание |
|------|-----|----------|
| `title` | string | Заголовок для SEO |
| `description` | string | Описание для SEO |
| `projectName` | string | Название проекта |
| `projectLabel` | string | Категория (например, "SaaS / Образование") |
| `projectDesc` | string | Краткое описание |
| `projectType` | string | Тип проекта |
| `projectClient` | string | Заказчик |
| `projectStatus` | string | Статус |
| `projectSite` | string | Ссылка на сайт |
| `projectYear` | string | Год |
| `techStack` | array | Технологии |
| `navigation` | array | Навигация |

### Опциональные поля

| Поле | Тип | Описание |
|------|-----|----------|
| `order` | number | Порядок сортировки |
| `featured` | boolean | Показывать на главной |

## Технологии (techStack)

Формат:

```yaml
techStack:
  - name: "Название"
    icon: "URL иконки"
```

Иконки берите с [Devicon](https://devicon.dev/):

```
https://cdn.jsdelivr.net/gh/devicons/devicon/icons/{tech}/{tech}-original.svg
```

Примеры:
- `laravel/laravel-original.svg`
- `react/react-original.svg`
- `nodejs/nodejs-original.svg`
- `postgresql/postgresql-original.svg`
- `docker/docker-original.svg`
- `tailwindcss/tailwindcss-original.svg`

## Навигация (navigation)

Формат:

```yaml
navigation:
  - id: "about"
    label: "О проекте"
  - id: "features"
    label: "Возможности"
```

`id` должен совпадать с `id` секции в HTML.

## Markdown синтаксис

### Заголовки

```markdown
## Заголовок 2 уровня
### Заголовок 3 уровня
```

### Жирный текст

```markdown
**Жирный текст**
```

### Списки

```markdown
- Пункт 1
- Пункт 2
- Пункт 3
```

### Параграфы

Просто пишите текст. Пустая строка = новый параграф.

## Проверка изменений

### Dev режим

```bash
cd astro-portfolio
npm run dev
```

Откройте http://localhost:4321

### Сборка

```bash
npm run build
```

Проверьте `dist/` - готовые HTML файлы.

## Типичные ошибки

### ❌ Забыли закрыть frontmatter

```yaml
---
title: "Проект"
# Забыли закрывающие ---
```

✅ Правильно:

```yaml
---
title: "Проект"
---
```

### ❌ Неправильный формат массива

```yaml
techStack:
- name: "React"  # Нет отступа
```

✅ Правильно:

```yaml
techStack:
  - name: "React"  # Есть отступ (2 пробела)
```

### ❌ Забыли кавычки

```yaml
title: Проект без кавычек
```

✅ Правильно:

```yaml
title: "Проект в кавычках"
```

## Полезные команды

```bash
# Запустить dev сервер
npm run dev

# Собрать проект
npm run build

# Предпросмотр сборки
npm run preview

# Проверить типы
npm run astro check
```

## Дополнительно

- Документация Astro Content Collections: https://docs.astro.build/en/guides/content-collections/
- Markdown Guide: https://www.markdownguide.org/
- Devicon (иконки): https://devicon.dev/

---

**Теперь редактировать проекты стало проще!** 🎉

Просто открываете `.md` файл, меняете текст и сохраняете. Никакого HTML!
