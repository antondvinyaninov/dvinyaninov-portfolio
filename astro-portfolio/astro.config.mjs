// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dvinyaninov.ru',
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [
    sitemap({
      filter: (page) => 
        !page.includes('/api/') && 
        !page.includes('/#'),
      serialize(item) {
        // Настраиваем приоритеты и частоту обновлений для разных страниц
        if (item.url === 'https://dvinyaninov.ru/') {
          item.priority = 1.0;
          item.changefreq = 'weekly'; // Главная обновляется часто
          item.lastmod = new Date();
        } else if (item.url === 'https://dvinyaninov.ru/projects/') {
          item.priority = 0.9;
          item.changefreq = 'weekly'; // Список проектов обновляется часто
          item.lastmod = new Date();
        } else if (item.url.includes('/projects/')) {
          item.priority = 0.8;
          item.changefreq = 'monthly'; // Страницы проектов обновляются редко
        } else {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      },
      // Генерируем один файл sitemap.xml вместо sitemap-index.xml
      entryLimit: 50000,
    })
  ],
});
