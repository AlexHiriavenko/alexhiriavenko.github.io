const getPerson = (site, page) => ({
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: "Alex Hiriavenko",
  givenName: "Alex",
  familyName: "Hiriavenko",
  alternateName: [
    "Oleksii Hiriavenko",
    "Oleksiy Hiriavenko",
    "Alexey Hiriavenko",
    "Alex Giryavenko",
    "Alexey Giryavenko",
    "Oleksii Giryavenko",
    "Oleksiy Giryavenko",
    "Алексей Гирявенко",
    "Олексій Гірявенко",
    "Алексій Гірявенко",
  ],
  description:
    "Fullstack Developer specializing in Vue 3, Node.js, NestJS, Laravel, TypeScript, PHP, PostgreSQL, MySQL, CRM systems, API development, and performance optimization.",
  jobTitle: "Fullstack Developer",
  hasOccupation: {
    "@type": "Occupation",
    name: "Fullstack Developer",
    occupationalCategory: "Software Developer",
    skills: [
      "Fullstack Development",
      "Frontend Development",
      "Backend Development",
      "Laravel Development",
      "API Development",
      "Database Optimization",
      "Performance Optimization",
      "CRM Systems",
    ],
  },
  skills: [
    "JavaScript",
    "TypeScript",
    "Vue.js",
    "Node.js",
    "NestJS",
    "Laravel",
    "PostgreSQL",
    "TypeORM",
    "REST API Development",
    "CRM Systems",
    "Performance Optimization",
    "Database Optimization",
    "Clean Architecture",
    "Docker",
    "AWS S3",
  ],
  knowsAbout: [
    "Fullstack Development",
    "Frontend Development",
    "Backend Development",
    "Laravel Development",
    "Healthcare CRM",
    "Patient-facing digital platforms",
    "API Design",
    "Database Query Optimization",
    "Real-time Features",
    "Reusable UI Components",
    "AI-assisted Development",
  ],
  knowsLanguage: ["uk", "en", "ru"],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Donetsk National University of Economics and Trade",
  },
  worksFor: {
    "@type": "Organization",
    name: "Palmo",
  },
  image: `${site.url}/img/profile-photo.png`,
  email: "mailto:martmarchmartmarch@gmail.com",
  telephone: "+380504716006",
  url: `${site.url}/`,
  mainEntityOfPage: {
    "@id": `${page.profilePageUrl}#profile-page`,
  },
  sameAs: [
    "https://www.linkedin.com/in/alex-hiriavenko/",
    "https://github.com/AlexHiriavenko",
    "https://gitlab.com/ma_rch",
    "https://t.me/AlexHiriavenko",
    "https://www.facebook.com/alexey.giryavenko",
  ],
});

const getWebSite = (site) => ({
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: "Alex Hiriavenko CV",
  url: `${site.url}/`,
  inLanguage: ["en", "ru", "uk"],
  publisher: {
    "@id": `${site.url}/#person`,
  },
});

const getProfilePage = (site, page) => ({
  "@type": "ProfilePage",
  "@id": `${page.profilePageUrl}#profile-page`,
  name: site.profilePageName,
  url: page.profilePageUrl,
  inLanguage: page.locale.htmlLang,
  isPartOf: {
    "@id": `${site.url}/#website`,
  },
  mainEntity: {
    "@id": `${site.url}/#person`,
  },
});

const getBreadcrumbList = (breadcrumb) => ({
  "@type": "BreadcrumbList",
  "@id": `${breadcrumb.currentUrl}#breadcrumb`,
  itemListElement: breadcrumb.items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@id": item.url,
      name: item.name,
    },
  })),
});

export const getJsonLd = (site, options = {}) => {
  const graph = [getPerson(site, options.page), getWebSite(site), getProfilePage(site, options.page)];

  if (options.breadcrumb) {
    graph.push(getBreadcrumbList(options.breadcrumb));
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
};
