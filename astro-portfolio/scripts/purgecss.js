import { PurgeCSS } from 'purgecss';
import fs from 'fs';
import path from 'path';

const purgeCSSResults = await new PurgeCSS().purge({
  content: [
    'dist/client/**/*.html',
    'src/**/*.{astro,html,js,jsx,ts,tsx}',
  ],
  css: [
    'dist/client/styles/global.css',
    'dist/client/styles/project-page.css',
  ],
  safelist: {
    standard: [
      /^project-/,
      /^hero-/,
      /^nav-/,
      /^mobile-/,
      /^section-/,
      /^service-/,
      /^feature-/,
      /^screenshot-/,
      /^lightbox-/,
      /^breadcrumbs-/,
      /^audience-/,
      /^roadmap-/,
      /^beta-/,
      /^related-/,
      /^back-/,
      /^work-/,
      /^marquee-/,
      /^footer-/,
      /^error-/,
      /^suggestions-/,
      /^cta-/,
      /^photo-/,
      /^scroll-/,
      /^noise/,
      /^cursor/,
      /^header/,
      /^logo/,
      /^form-/,
      /^tech-/,
      /active/,
      /hover/,
      /focus/,
      /disabled/,
      /animate/,
      /fade/,
      /slide/,
      /hidden/,
      /visible/,
      /overflow/,
      /flipped/, // Для 3D flip эффекта карточек
    ],
    deep: [
      /project__/,
      /hero__/,
      /nav__/,
      /section__/,
      /service__/,
      /feature__/,
      /screenshot__/,
      /breadcrumbs__/,
      /audience__/,
      /roadmap__/,
      /related__/,
      /work__/,
      /marquee__/,
      /footer__/,
      /error__/,
      /form__/,
    ],
    greedy: [/--/],
  },
});

// Сохраняем очищенные CSS файлы
for (const result of purgeCSSResults) {
  const filePath = result.file;
  if (filePath) {
    fs.writeFileSync(filePath, result.css);
    const stats = fs.statSync(filePath);
    console.log(`✓ Purged ${path.basename(filePath)}: ${(stats.size / 1024).toFixed(2)} KB`);
  }
}

console.log('✓ PurgeCSS completed!');
