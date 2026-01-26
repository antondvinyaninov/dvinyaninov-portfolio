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
      changefreq: 'weekly',
      lastmod: new Date(),
      serialize(item) {
        // Настраиваем приоритеты для разных страниц
        if (item.url === 'https://dvinyaninov.ru/') {
          item.priority = 1.0;
        } else if (item.url === 'https://dvinyaninov.ru/projects/') {
          item.priority = 0.9;
        } else if (item.url.includes('/projects/')) {
          item.priority = 0.8;
        } else {
          item.priority = 0.7;
        }
        return item;
      },
      // Генерируем один файл sitemap.xml вместо sitemap-index.xml
      entryLimit: 50000,
    })
  ],
});
