import { mkdir, writeFile } from "node:fs/promises";
import * as nodePath from "node:path";
import { locales, defaultLocale } from "../../src/data/locales.js";
import { routes } from "../../src/data/routes.js";
import { site } from "../../src/data/site.js";

const toSegments = (value = "") => value.split("/").filter(Boolean);

const getAbsolutePageUrl = (segments) => {
  const baseUrl = site.url.replace(/\/$/, "");
  const path = segments.join("/");

  return path ? `${baseUrl}/${path}/` : `${baseUrl}/`;
};

const getRouteSegments = (locale, route) => [
  ...toSegments(locale.basePath),
  ...toSegments(route.outputPath),
];

const escapeXml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const getAlternateLinks = (route) => {
  const defaultLocaleConfig = locales.find((locale) => locale.code === defaultLocale);

  return [
    ...locales.map((locale) => ({
      hreflang: locale.htmlLang,
      href: getAbsolutePageUrl(getRouteSegments(locale, route)),
    })),
    {
      hreflang: "x-default",
      href: getAbsolutePageUrl(getRouteSegments(defaultLocaleConfig, route)),
    },
  ];
};

const getSitemap = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = routes.flatMap((route) =>
    locales.map((locale) => {
      const loc = getAbsolutePageUrl(getRouteSegments(locale, route));
      const alternates = getAlternateLinks(route)
        .map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`,
        )
        .join("\n");

      return `  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
${alternates}
  </url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
};

const getRobots = () => {
  const baseUrl = site.url.replace(/\/$/, "");

  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
};

export const seo = async () => {
  const outputDir = app.path.dist.html;

  await mkdir(outputDir, { recursive: true });
  await Promise.all([
    writeFile(nodePath.join(outputDir, "sitemap.xml"), getSitemap()),
    writeFile(nodePath.join(outputDir, "robots.txt"), getRobots()),
  ]);
};
