import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { en } from "../src/i18n/en.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const buildDir = path.join(rootDir, "build", "cv-pdf");
const htmlPath = path.join(buildDir, "Alex_Hiriavenko_CV.html");
const pdfPath = path.join(rootDir, "src", "Alex_Hiriavenko_CV.pdf");
const profilePhotoPath = path.join(rootDir, "src", "img", "profile-photo.png");

const chromeCandidates = [
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

const urls = {
  site: "https://alexhiriavenko.github.io/",
  certificates: "https://alexhiriavenko.github.io/certificates/",
  linkedin: "https://www.linkedin.com/in/alex-hiriavenko/",
  github: "https://github.com/AlexHiriavenko",
  telegram: "https://t.me/AlexHiriavenko",
  gitlab: "https://gitlab.com/ma_rch",
};

const contacts = [
  { label: "Phone", value: "+380504716006", href: "tel:+380504716006" },
  { label: "Phone", value: "+380984625714", href: "tel:+380984625714" },
  { label: "Email", value: "martmarchmartmarch@gmail.com", href: "mailto:martmarchmartmarch@gmail.com" },
  { label: "LinkedIn", value: "/in/alex-hiriavenko", href: urls.linkedin },
  { label: "GitHub", value: "github.com/AlexHiriavenko", href: urls.github },
  { label: "Telegram", value: "t.me/AlexHiriavenko", href: urls.telegram },
];

const skillGroups = [
  ["Programming Languages", ["JavaScript", "TypeScript", "PHP"]],
  ["Frontend", ["Vue 3", "Composition API", "React", "Next.js", "Tailwind CSS", "Element Plus", "PrimeVue", "Vuetify", "MUI", "Vite", "Webpack", "Gulp"]],
  ["Backend", ["Node.js", "Express", "NestJS", "Laravel", "REST API", "WebSocket"]],
  ["Databases & ORM", ["PostgreSQL", "MySQL", "Redis", "MongoDB", "TypeORM Data Mapper", "Eloquent Laravel"]],
  ["State & Data Fetching", ["Pinia", "Redux Toolkit", "RTK Query"]],
  ["Messaging & Real-time", ["RabbitMQ", "WebSocket"]],
  ["DevOps & Cloud", ["Docker", "Nginx", "AWS S3", "GitLab CI/CD"]],
  ["Monitoring", ["Lens", "Grafana", "Sentry"]],
  [
    "AI-assisted Development",
    [
      "OpenAI Codex",
      "Claude Code",
      en.skills.aiItems.ideAgents,
      en.skills.aiItems.agentsWorkflows,
      en.skills.aiItems.codeAnalysis,
      en.skills.aiItems.testGeneration,
    ],
  ],
  ["Architecture & Practices", [en.skills.architectureItems.cleanArchitecture, "SOLID", en.skills.architectureItems.performance]],
];

const courses = ["RS School: Node.js", "Palmo: Vue, Laravel", "DAN.IT: React", "RS School: JavaScript", "EPAM: Frontend self-paced program"];

const languages = ["Ukrainian - native", "English - intermediate (B1)", "Russian - fluent"];

const stripTags = (value) => value.replace(/<[^>]*>/g, "");

const normalizeText = (value) =>
  value
    .replace(/вЂ”/g, "-")
    .replace(/в‰€/g, "approximately ")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/≈/g, "approximately ");

const escapeHtml = (value) =>
  normalizeText(String(value))
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const cleanHtml = (value) => normalizeText(value);

const escapePdfString = (value) =>
  normalizeText(String(value)).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\r?\n/g, " ");

const getPdfDate = () => {
  const date = new Date();
  const pad = (number) => String(number).padStart(2, "0");

  return `D:${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(
    date.getMinutes(),
  )}${pad(date.getSeconds())}+00'00'`;
};

const applyPdfMetadata = (filePath) => {
  const pdf = readFileSync(filePath);
  const content = pdf.toString("latin1");
  const startXrefMatch = content.match(/startxref\s+(\d+)\s+%%EOF\s*$/);

  if (!startXrefMatch) {
    throw new Error("Could not locate PDF startxref while applying metadata.");
  }

  const previousXrefOffset = startXrefMatch[1];
  const rootMatch = content.match(/\/Root\s+(\d+\s+\d+\s+R)/);
  const sizeMatches = [...content.matchAll(/\/Size\s+(\d+)/g)];
  const rootRef = rootMatch?.[1];
  const size = sizeMatches.at(-1)?.[1];

  if (!rootRef || !size) {
    throw new Error("Could not locate PDF trailer root/size while applying metadata.");
  }

  const objectOffset = pdf.length;
  const metadataObject = `\n1 0 obj\n<</Title (${escapePdfString(pdfMetadata.title)})\n/Author (${escapePdfString(
    pdfMetadata.author,
  )})\n/Subject (${escapePdfString(pdfMetadata.subject)})\n/Keywords (${escapePdfString(
    pdfMetadata.keywords,
  )})\n/Creator (Alex Hiriavenko CV PDF generator)\n/Producer (Skia/PDF via Chromium; metadata patched by Node.js)\n/ModDate (${getPdfDate()})>>\nendobj\n`;
  const xrefOffset = objectOffset + Buffer.byteLength(metadataObject, "latin1");
  const incrementalUpdate = `${metadataObject}xref\n1 1\n${String(objectOffset).padStart(
    10,
    "0",
  )} 00000 n \ntrailer\n<</Size ${size}\n/Root ${rootRef}\n/Info 1 0 R\n/Prev ${previousXrefOffset}>>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  writeFileSync(filePath, Buffer.concat([pdf, Buffer.from(incrementalUpdate, "latin1")]));
};

const imageDataUri = (filePath) => {
  if (!existsSync(filePath)) {
    return "";
  }

  const image = readFileSync(filePath).toString("base64");
  return `data:image/png;base64,${image}`;
};

const listItems = (items, className = "") =>
  items.map((item) => `<li${className ? ` class="${className}"` : ""}>${cleanHtml(item)}</li>`).join("\n");

const plainKeywords = [
  "Fullstack Developer",
  "Full-Stack Developer",
  "Vue.js",
  "Vue 3",
  "Node.js",
  "NestJS",
  "Laravel",
  "TypeScript",
  "JavaScript",
  "PHP",
  "PostgreSQL",
  "TypeORM",
  "REST API",
  "CRM",
  "Healthcare CRM",
  "Performance Optimization",
  "Database Optimization",
  "Docker",
  "AWS S3",
  "AI-assisted Development",
];

const pdfMetadata = {
  title: "Alex Hiriavenko CV - Fullstack Developer",
  author: "Alex Hiriavenko",
  subject: "Fullstack Developer CV",
  keywords:
    "Fullstack Developer, Vue 3, Node.js, NestJS, Laravel, TypeScript, PostgreSQL, MySQL, Healthcare CRM, REST API, Docker, AWS S3",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://alexhiriavenko.github.io/#person",
  name: "Alex Hiriavenko",
  givenName: "Alex",
  familyName: "Hiriavenko",
  alternateName: ["Oleksii Hiriavenko", "Oleksiy Hiriavenko", "Alexey Hiriavenko", "Alex Giryavenko"],
  jobTitle: "Fullstack Developer",
  description: stripTags(en.summary.paragraphs.join(" ")),
  email: "mailto:martmarchmartmarch@gmail.com",
  telephone: "+380504716006",
  url: urls.site,
  sameAs: [urls.linkedin, urls.github, urls.gitlab, urls.telegram],
  worksFor: { "@type": "Organization", name: "Palmo" },
  alumniOf: { "@type": "EducationalOrganization", name: "Donetsk National University of Economics and Trade" },
  knowsLanguage: ["uk", "en", "ru"],
  knowsAbout: plainKeywords,
  skills: plainKeywords,
};

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Alex Hiriavenko CV - Fullstack Developer</title>
    <meta name="author" content="Alex Hiriavenko" />
    <meta name="description" content="Fullstack Developer CV: Vue 3, Node.js, NestJS, Laravel, TypeScript, PHP, PostgreSQL, healthcare CRM, API development, and performance optimization." />
    <meta name="keywords" content="${escapeHtml(plainKeywords.join(", "))}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${urls.site}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
    <style>
      @page {
        size: A4;
        margin: 11mm 10mm 12mm;
      }

      * {
        box-sizing: border-box;
      }

      html {
        color: #172033;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 10.7px;
        line-height: 1.34;
      }

      body {
        margin: 0;
        background: #ffffff;
      }

      a {
        color: #155e75;
        text-decoration: none;
      }

      h1,
      h2,
      h3,
      h4,
      p,
      ul {
        margin: 0;
      }

      ul {
        padding-left: 14px;
      }

      li {
        margin: 0 0 3.5px;
      }

      .document {
        max-width: 190mm;
        margin: 0 auto;
      }

      .header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 14px;
        align-items: center;
        padding-bottom: 9px;
        border-bottom: 2px solid #87a53a;
      }

      .photo {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid #d7e5b3;
      }

      .name {
        color: #111827;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 29px;
        font-weight: 700;
        letter-spacing: 0;
      }

      .role {
        margin-top: 2px;
        color: #3f4b5f;
        font-size: 16px;
        font-weight: 700;
      }

      .headline {
        margin-top: 6px;
        max-width: 145mm;
        color: #344154;
        font-size: 10.5px;
      }

      .contact-list {
        display: grid;
        gap: 3px;
        padding: 0;
        list-style: none;
        color: #243044;
      }

      .contact-list li {
        margin: 0;
        overflow-wrap: anywhere;
      }

      .label {
        color: #5f6b7c;
        font-weight: 700;
      }

      .layout {
        display: grid;
        grid-template-columns: 55mm 1fr;
        gap: 10mm;
        padding-top: 9px;
      }

      .sidebar {
        border-right: 1px solid #d7dde7;
        padding-right: 7mm;
      }

      section {
        break-inside: avoid;
        margin-bottom: 9px;
      }

      .main section {
        margin-bottom: 10px;
      }

      h2 {
        margin-bottom: 5px;
        padding-bottom: 2px;
        border-bottom: 1px solid #9aa5b1;
        color: #5f8f16;
        font-family: Georgia, "Times New Roman", serif;
        font-size: 17px;
        line-height: 1.1;
      }

      h3 {
        margin-bottom: 3px;
        color: #152033;
        font-size: 11.2px;
        font-weight: 700;
      }

      .sidebar h2 {
        font-size: 14px;
      }

      .skill-group {
        margin-bottom: 5px;
        break-inside: avoid;
      }

      .skill-group p,
      .compact-list {
        color: #27364a;
      }

      .compact-list {
        padding-left: 12px;
      }

      .summary p {
        margin-bottom: 5px;
        text-align: left;
      }

      .achievement-list li::marker,
      .experience-list li::marker {
        color: #5f8f16;
      }

      .job {
        margin-bottom: 8px;
        break-inside: avoid;
      }

      .job-header {
        display: flex;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 3px;
      }

      .job-title {
        font-size: 12px;
        font-weight: 700;
      }

      .period {
        color: #5f6b7c;
        font-weight: 700;
        white-space: nowrap;
      }

      .company {
        color: #344154;
        font-weight: 700;
      }

      .keywords {
        color: #27364a;
      }

      .footer {
        margin-top: 8px;
        padding-top: 5px;
        border-top: 1px solid #d7dde7;
        color: #5f6b7c;
        font-size: 9.5px;
      }
    </style>
  </head>
  <body>
    <article class="document" itemscope itemtype="https://schema.org/Person">
      <header class="header">
        <img class="photo" src="${imageDataUri(profilePhotoPath)}" alt="Portrait of Alex Hiriavenko" />
        <div>
          <h1 class="name" itemprop="name">Alex Hiriavenko</h1>
          <p class="role" itemprop="jobTitle">Fullstack Developer</p>
          <p class="headline" itemprop="description">${escapeHtml(stripTags(en.summary.paragraphs[0]))}</p>
        </div>
      </header>

      <div class="layout">
        <aside class="sidebar" aria-label="Resume sidebar">
          <section aria-labelledby="contacts-title">
            <h2 id="contacts-title">Contacts</h2>
            <ul class="contact-list" aria-label="Contact information">
              ${contacts
                .map(
                  (item) =>
                    `<li><span class="label">${escapeHtml(item.label)}:</span> <a href="${item.href}">${escapeHtml(item.value)}</a></li>`,
                )
                .join("\n")}
            </ul>
          </section>

          <section aria-labelledby="skills-title">
            <h2 id="skills-title">Core Skills</h2>
            ${skillGroups
              .map(
                ([title, items]) => `<div class="skill-group">
                  <h3>${escapeHtml(title)}</h3>
                  <p>${items.map(escapeHtml).join(", ")}</p>
                </div>`,
              )
              .join("\n")}
          </section>

          <section aria-labelledby="languages-title">
            <h2 id="languages-title">Languages</h2>
            <ul class="compact-list">${listItems(languages.map(escapeHtml))}</ul>
          </section>

          <section aria-labelledby="courses-title">
            <h2 id="courses-title">Courses</h2>
            <ul class="compact-list">${listItems(courses.map(escapeHtml))}</ul>
          </section>

          <section aria-labelledby="certificates-title">
            <h2 id="certificates-title">Certificates</h2>
            <p><a href="${urls.certificates}">Certificate portfolio</a></p>
          </section>
        </aside>

        <main class="main">
          <section class="summary" aria-labelledby="summary-title">
            <h2 id="summary-title">${escapeHtml(en.summary.title)}</h2>
            ${en.summary.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
          </section>

          <section aria-labelledby="achievements-title">
            <h2 id="achievements-title">${escapeHtml(en.achievements.title)}</h2>
            <ul class="achievement-list">${listItems(en.achievements.items.map(cleanHtml))}</ul>
          </section>

          <section aria-labelledby="experience-title">
            <h2 id="experience-title">${escapeHtml(en.experience.title)}</h2>
            ${en.experience.items
              .map(
                (job) => `<article class="job">
                  <div class="job-header">
                    <div>
                      <h3 class="job-title">${escapeHtml(job.position)}</h3>
                      <p class="company">${escapeHtml(job.company)}</p>
                    </div>
                    <time class="period" datetime="${escapeHtml(job.datetime)}">${escapeHtml(job.period)}</time>
                  </div>
                  <ul class="experience-list">${listItems(job.details.map(escapeHtml))}</ul>
                </article>`,
              )
              .join("\n")}
          </section>

          <section aria-labelledby="additional-experience-title">
            <h2 id="additional-experience-title">${escapeHtml(en.additionalExperience.title)}</h2>
            ${en.additionalExperience.items
              .map(
                (job) => `<article class="job">
                  <h3 class="job-title">${escapeHtml(job.title)}</h3>
                  <p>${escapeHtml(job.text)}</p>
                </article>`,
              )
              .join("\n")}
          </section>

          <section aria-labelledby="education-title">
            <h2 id="education-title">${escapeHtml(en.education.title)}</h2>
            ${en.education.items
              .map(
                (item) => `<article class="job" itemprop="alumniOf" itemscope itemtype="https://schema.org/EducationalOrganization">
                  <h3 class="job-title">${escapeHtml(item.title)}</h3>
                  <p itemprop="name">${escapeHtml(item.institution)}</p>
                  <p>${escapeHtml(item.degree)}</p>
                </article>`,
              )
              .join("\n")}
          </section>

          <section aria-labelledby="keywords-title">
            <h2 id="keywords-title">Role Keywords</h2>
            <p class="keywords">${plainKeywords.map(escapeHtml).join(", ")}</p>
          </section>
        </main>
      </div>

      <footer class="footer">
        <p>Alex Hiriavenko CV. Web profile: <a href="${urls.site}">${urls.site}</a>. Certificates: <a href="${urls.certificates}">${urls.certificates}</a>.</p>
      </footer>
    </article>
  </body>
</html>
`;

mkdirSync(buildDir, { recursive: true });
writeFileSync(htmlPath, html, "utf8");

const browserPath = chromeCandidates.find(existsSync);

if (!browserPath) {
  throw new Error("Chrome or Edge was not found. Install one of them or update chromeCandidates in scripts/generate-cv-pdf.js.");
}

execFileSync(browserPath, [
  "--headless",
  "--disable-gpu",
  "--disable-gpu-compositing",
  "--disable-software-rasterizer",
  "--disable-dev-shm-usage",
  "--no-sandbox",
  "--no-pdf-header-footer",
  "--export-tagged-pdf",
  "--generate-pdf-document-outline",
  `--print-to-pdf=${pdfPath}`,
  `file:///${htmlPath.replaceAll("\\", "/")}`,
]);

applyPdfMetadata(pdfPath);

console.log(`Created ${pdfPath}`);
