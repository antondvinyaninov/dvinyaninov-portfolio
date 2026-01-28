module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
        './public/**/*.html',
      ],
      safelist: {
        standard: [
          // Динамические классы
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
          // Состояния
          /active/,
          /hover/,
          /focus/,
          /disabled/,
          // Анимации
          /animate/,
          /fade/,
          /slide/,
          // Утилиты
          /hidden/,
          /visible/,
          /overflow/,
        ],
        deep: [
          // Вложенные селекторы
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
        greedy: [
          // Паттерны с модификаторами
          /--/,
        ],
      },
      // Не удалять CSS из этих файлов
      rejected: false,
      // Включить только в production
      ...(process.env.NODE_ENV === 'production' ? {} : { content: [] }),
    }),
  ],
};
