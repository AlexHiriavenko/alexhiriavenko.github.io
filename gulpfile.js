// основной модуль, general module
import gulp from "gulp";
import { path } from "./gulp/config/path.js";
import { plugins } from "./gulp/config/plugins.js";
// передача значений в глобальную переменную
global.app = {
  isProduct: process.argv.includes("--product"),
  isDev: !process.argv.includes("--product"),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// import { copy } from "./gulp/tasks/copy.js";
import { clear } from "./gulp/tasks/clear.js";
import { server } from "./gulp/tasks/server.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { images } from "./gulp/tasks/images.js";
import { manifest } from "./gulp/tasks/manifest.js";
import { htmlI18n } from "./gulp/tasks/html-i18n.js";
// import { otfToTtf, ttfToWoff, fontsStyle } from "./gulp/tasks/fonts.js";

// функция наблюдатель - выполнить функцию при изменении исходников.
function watcher() {
  // gulp.watch(path.watch.files, copy);
  gulp.watch([path.watch.templates, path.watch.data], htmlI18n);
  gulp.watch(path.watch.scss, scss);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
}

//Послідовна обробка шрифтів
// const fonts = gulp.series(otfToTtf, ttfToWoff, fontsStyle); // вариант со шрифтами

// перечень тасков - выполняем параллельно (одновременно, асинхронно)
const tasks = gulp.parallel(/* copy,*/ htmlI18n, scss, js, images, manifest);
// const tasks = gulp.series(fonts, gulp.parallel(/* copy,*/ html, scss, js, images)); // вариант со шрифтами

// основной сценарий - выполняем последовательно очистить dist, запустить таски, и асинхронно наблюдатель + лайвсервер.
const dev = gulp.series(clear, tasks, gulp.parallel(watcher, server));
const product = gulp.series(clear, tasks);
const delDist = gulp.series(clear);

export { dev };
export { product };
export { delDist };
export { htmlI18n };

// присваиваем dev - как задачу по умолчанию
gulp.task("default", dev);
