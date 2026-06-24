export const routes = [
  {
    id: "home",
    template: "index.njk",
    outputPath: "",
    seo: {
      en: {
        title: "Alex Hiriavenko | Fullstack Developer CV",
        description: "Fullstack Developer CV: Vue.js, Node.js, NestJS, Laravel, PostgreSQL, CRM systems, API development, and performance optimization.",
      },
      ru: {
        title: "Alex Hiriavenko | Fullstack Developer резюме",
        description: "Резюме Fullstack Developer: Vue.js, Node.js, NestJS, Laravel, PostgreSQL, CRM-системы, разработка API и оптимизация производительности.",
      },
      uk: {
        title: "Alex Hiriavenko | Fullstack Developer резюме",
        description: "Резюме Fullstack Developer: Vue.js, Node.js, NestJS, Laravel, PostgreSQL, CRM-системи, розробка API та оптимізація продуктивності.",
      },
    },
  },
  {
    id: "certificates",
    template: "certificates.njk",
    outputPath: "certificates",
    seo: {
      en: {
        title: "Certificates | Alex Hiriavenko",
        description: "Professional certificates and completed courses by Alex Hiriavenko.",
      },
      ru: {
        title: "Сертификаты | Alex Hiriavenko",
        description: "Профессиональные сертификаты и пройденные курсы Alex Hiriavenko.",
      },
      uk: {
        title: "Сертифікати | Alex Hiriavenko",
        description: "Професійні сертифікати та пройдені курси Alex Hiriavenko.",
      },
    },
  },
];
