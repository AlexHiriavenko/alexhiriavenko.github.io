import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const distFolder = "dist";
const srcFolder = "src";
const versionJson = "gulp/version.json";

// объект со всеми путями
export const path = {
  dist: {
    images: `${distFolder}/img/`,
    files: `${distFolder}/files/`,
    js: `${distFolder}/js/`,
    fonts: `${distFolder}/fonts/`,
    css: `${distFolder}/css/`,
    html: `${distFolder}/`,
    manifest: `${distFolder}/`,
  },
  src: {
    // основной вход
    html: `${srcFolder}/*.html`,
    pages: [`${srcFolder}/pages/certificates/*.html`, `${srcFolder}/pages/about/*.html`],
    scss: `${srcFolder}/scss/styles.scss`,
    js: `${srcFolder}/js/app.js`,

    // ассеты
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,ico}`,
    svg: `${srcFolder}/img/**/*.svg`,
    files: `${srcFolder}/files/**/*.*`,
    manifest: `${srcFolder}/manifest.webmanifest`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    pages: `${srcFolder}/pages/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
    files: `${srcFolder}/files/**/*.*`,
    svg: `${srcFolder}/img/**/*.svg`,
    manifest: `${srcFolder}/manifest.webmanifest`,
  },
  distFolder,
  srcFolder,
  rootFolder,
  versionJson,
};
