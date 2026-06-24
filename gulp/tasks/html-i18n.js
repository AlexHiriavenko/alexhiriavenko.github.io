import nunjucks from "nunjucks";
import { mkdir, writeFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { locales, defaultLocale } from "../../src/data/locales.js";
import { routes } from "../../src/data/routes.js";
import { site } from "../../src/data/site.js";
import { getJsonLd } from "../../src/data/JSON-LD.js";
import { translations } from "../../src/i18n/index.js";

const toSegments = (value) => value.split("/").filter(Boolean);

const getRelativePath = (depth) => {
  if (depth === 0) return "./";
  return "../".repeat(depth);
};

const getPageUrl = (segments) => {
  const url = segments.join("/");
  return url ? `${url}/` : "";
};

const getAbsolutePageUrl = (segments) => {
  const baseUrl = site.url.replace(/\/$/, "");
  const pageUrl = getPageUrl(segments);

  return pageUrl ? `${baseUrl}/${pageUrl}` : `${baseUrl}/`;
};

const getRelativePageUrl = (fromSegments, toSegments) => {
  const fromPath = getPageUrl(fromSegments);
  const toPath = getPageUrl(toSegments);
  const relativePath = nodePath.posix.relative(fromPath, toPath);

  if (!relativePath) return "./";
  return `${relativePath}/`;
};

const getLanguageLinks = (currentOutputSegments, route) => {
  return locales.map((locale) => {
    const targetSegments = [...toSegments(locale.basePath), ...toSegments(route.outputPath)];

    return {
      ...locale,
      url: getRelativePageUrl(currentOutputSegments, targetSegments),
    };
  });
};

const getAlternateLinks = (route) => {
  return locales.map((locale) => {
    const targetSegments = [...toSegments(locale.basePath), ...toSegments(route.outputPath)];

    return {
      hreflang: locale.htmlLang,
      url: getAbsolutePageUrl(targetSegments),
    };
  });
};

const getRoutePageData = (route, locale, outputSegments) => {
  const seo = route.seo?.[locale.code] ?? route.seo?.[defaultLocale] ?? {};
  const defaultLocaleConfig = locales.find((item) => item.code === defaultLocale);
  const defaultSegments = [
    ...toSegments(defaultLocaleConfig?.basePath ?? ""),
    ...toSegments(route.outputPath),
  ];

  return {
    id: route.id,
    outputPath: route.outputPath,
    seo,
    canonicalUrl: getAbsolutePageUrl(outputSegments),
    alternateLinks: getAlternateLinks(route),
    xDefaultUrl: getAbsolutePageUrl(defaultSegments),
  };
};

const getTranslations = (locale) => {
  return translations[locale.code] ?? translations[defaultLocale];
};

const getBreadcrumb = (route, locale, outputSegments, t) => {
  if (!route.outputPath) return null;

  const homeSegments = toSegments(locale.basePath);

  return {
    currentUrl: getAbsolutePageUrl(outputSegments),
    items: [
      {
        name: t.breadcrumbs.home,
        url: getAbsolutePageUrl(homeSegments),
      },
      {
        name: route.id === "certificates" ? t.header.nav.certificates : route.seo?.[locale.code]?.title,
        url: getAbsolutePageUrl(outputSegments),
      },
    ],
  };
};

export const htmlI18n = async () => {
  const templatesDir = nodePath.join(app.path.srcFolder, "templates");
  const env = nunjucks.configure(templatesDir, {
    autoescape: false,
    noCache: app.isDev,
  });

  env.addFilter("json", (value) => JSON.stringify(value, null, 2));

  for (const locale of locales) {
    for (const route of routes) {
      const outputSegments = [...toSegments(locale.basePath), ...toSegments(route.outputPath)];
      const routeDepth = toSegments(route.outputPath).length;
      const outputDir = nodePath.join(app.path.dist.html, ...outputSegments);
      const outputFile = nodePath.join(outputDir, "index.html");
      const t = getTranslations(locale);
      const page = getRoutePageData(route, locale, outputSegments);
      const breadcrumb = getBreadcrumb(route, locale, outputSegments, t);

      const html = env.render(`pages/${route.template}`, {
        locale,
        locales,
        route,
        routes,
        t,
        page,
        languageLinks: getLanguageLinks(outputSegments, route),
        structuredData: {
          graph: getJsonLd(site, { breadcrumb }),
        },
        site,
        assetPath: getRelativePath(outputSegments.length),
        localePath: getRelativePath(routeDepth),
      });

      await mkdir(outputDir, { recursive: true });
      await writeFile(outputFile, html);
    }
  }
};
